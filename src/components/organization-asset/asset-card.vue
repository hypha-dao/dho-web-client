<script>

/**
 * Renders the individual's avatar, name, account and other details
 */
export default {
  name: 'asset-card',
  components: {
    Widget: () => import('~/components/common/widget.vue'),
    ProfilePicture: () => import('../profiles/profile-picture.vue'),
    IpfsImageViewer: () => import('~/components/ipfs/ipfs-image-viewer.vue')
  },

  props: {
    asset: Object
  },
  data () {
    return {
      iconDetails: undefined
    }
  },
  async mounted () {
    if (this.asset && this.asset.icon) {
      this.iconDetails = await this.loadIconDetails()
    }
  },

  computed: {
    othersText () {
      return `and ${this.asset.assignmentAggregate.count > 3 ? 'others' : 'other'} ${this.asset.assignmentAggregate.count - 3}`
    }
  },

  methods: {
    sendToPage () {
      this.$router.push({ path: `${this.$route.path}/${this.asset.docId}`, params: { docId: this.asset.docId } })
    },
    async loadIconDetails () {
      let type = null
      let name = null
      let cid = null
      if (this.asset.icon) {
        const split = this.asset.icon.split(':')
        type = split[0]
        name = split[2] ? `${split[1]}:${split[2]}` : split[1]
        // console.log('icon', type, name)
        if (type === 'http' || type === 'https') {
          type = 'img'
          name = this.asset.icon
        } else if (type === 'ipfsImage') {
          type = 'ipfs'
          cid = name
        }
      }
      return {
        type,
        name,
        cid
      }
    }

  }
}
</script>

<template lang="pug">
widget.cursor-pointer.item
  .clickable.flex.column.justify-between.full-height(@click="sendToPage")
    .col.top-section
      .row
          q-btn.no-pointer-events(
            round unelevated :icon="iconDetails.name" color="primary" text-color="white" size="14px" :ripple="false"
            v-if="iconDetails && iconDetails.type === 'icon'"
          )
          q-avatar(size="lg" v-else-if="iconDetails && iconDetails.type === 'image'")
              img.icon-img(:src="iconDetails.src")
          ipfs-image-viewer(size="lg", :ipfsCid="iconDetails.cid" v-else-if="iconDetails && iconDetails.type === 'ipfs'")
      .row.q-my-xs
        .h-h6.text-weight-bold {{asset.title}}
      .row.q-my-xs
        .h-b2.description {{asset.description}}
    .row.q-mt-sm
      .row.flex.profile-container
        .profile-item(v-for="user in asset.assignment")
          profile-picture(:username="user.username" size="sm" :key="user.username")
          q-tooltip @{{ user.username }}
      .col.text-right
        q-btn(flat color="primary" no-caps rounded v-if="this.asset.assignmentAggregate.count > 3") {{othersText}}
</template>

<style lang="stylus" scoped>
.item
  min-width: 302.5px
  max-width: 302.5px
  height: 281px

  .description
    height: 95px
    overflow hidden
  .profile-container
    margin-left 15px
  .profile-item
    width 30px
    margin-left -15px
</style>
