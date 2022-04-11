<script>

export default {
  name: 'badge-card',
  components: {
    Widget: () => import('../common/widget.vue'),
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue'),
    IpfsImageViewer: () => import('~/components/ipfs/ipfs-image-viewer.vue')
  },
  props: {
    /**
     * Circle Title
     */
    title: String,
    /**
     * Circle Description
     */
    description: String,
    /**
     * Circle Icon
     */
    icon: String,
    /**
     * Users array
     */
    assignments: Array,
    /**
     * Show compact style
     */
    compact: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      membersToShow: undefined,
      badgeHoldersNumber: undefined,
      iconDetails: undefined
    }
  },
  computed: {
    cssVars () {
      return {
        '--badge-card-height': this.compact ? '70px' : '90px',
        '--badge-card-ml': this.compact ? '20px' : '30px'
      }
    }
  },
  async mounted () {
    this.membersToShow = this.assignments.slice(0, 2)
    this.badgeHoldersNumber = this.assignments.length > 3 ? this.assignments.length - 3 : undefined
    if (this.icon) {
      this.iconDetails = await this.loadIconDetails()
    }
  },
  methods: {
    async loadIconDetails () {
      let type = null
      let name = null
      let cid = null
      if (this.icon) {
        const split = this.icon.split(':')
        type = split[0]
        name = split[2] ? `${split[1]}:${split[2]}` : split[1]
        // console.log('icon', type, name)
        if (type === 'http' || type === 'https') {
          type = 'img'
          name = this.icon
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
    // async getImage () {
    //   if (this.icon) {
    //     const split = this.icon.split(':')
    //     const type = split[0]
    //     if (type === 'http' || type === 'https') {
    //       return this.icon
    //     } else if (type === 'ipfsImage') {
    //       const file = await BrowserIpfs.retrieve(`${split[1]}:${split[2]}`)
    //       return URL.createObjectURL(file.payload)
    //     }
    //   }
    // }
  }
}
</script>

<template lang="pug">
  widget.bg-internal-bg.q-my-xxs.cursor-pointer(noPadding)
    .row.items-center.content(:style="cssVars")
      .col
        .row.flex.items-center
          q-btn.no-pointer-events(
            round unelevated :icon="iconDetails.name" color="primary" text-color="white" size="14px" :ripple="false"
            v-if="iconDetails && iconDetails.type === 'icon'"
          )
          q-avatar(size="lg" v-else-if="iconDetails && iconDetails.type === 'image'")
              img.icon-img(:src="iconDetails.src")
          ipfs-image-viewer(size="lg", :ipfsCid="iconDetails.cid" v-else-if="iconDetails && iconDetails.type === 'ipfs'")
          .h-h5.q-ml-xl(:class="{ 'q-ml-md': !compact, 'h-h7': compact }") {{title}}
      .col(v-if="!compact")
        .h-b2.text-weight-thin.text-body  {{description.substr(0,150) + (description.length > 150 ? '...' : '')}}
      .col-3(v-if="!compact")
        .row.justify-end.q-pr-xl
          profile-picture.profile-picture(v-for="user in assignments" :key="user.details_assignee_n" :username="user.details_assignee_n" size="2rem")
          .text-body2.text-weight-bold.text-body(v-if="badgeHoldersNumber")  and others {{badgeHoldersNumber}}
</template>

<style lang="stylus" scoped>
.profile-picture
  margin-left: -18px;
.content
  height var(--badge-card-height)
  margin-left var(--badge-card-ml)
  overflow hidden
</style>
