<script>

/**
 * Renders the individual's avatar, name, account and other details
 */
export default {
  name: 'asset-card',
  components: {
    Widget: () => import('~/components/common/widget.vue'),
    ProfilePicture: () => import('../profiles/profile-picture.vue')
  },

  props: {
    asset: Object
  },

  computed: {
    othersText () {
      return `and ${this.asset.assignmentAggregate.count > 3 ? 'others' : 'other'} ${this.asset.assignmentAggregate.count - 3}`
    }
  },

  methods: {
    sendToPage () {
      this.$router.push({ path: `${this.$route.path}/${this.asset.docId}`, params: { docId: this.asset.docId } })
    }

  }
}
</script>

<template lang="pug">
widget.cursor-pointer.item
  .clickable(@click="sendToPage")
    .row
      q-btn(round unelevated :icon="asset.icon.replace('icon:', '')" color="primary" text-color="white" size="xs" :ripple="false" v-if="asset.icon && asset.icon.includes('icon:')").q-pa-xxs
    .row.q-my-xs
      .h-h6.text-weight-bold {{asset.title}}
    .row.q-my-xs
      .h-b2.description {{asset.description}},
    .row.q-mt-lg
      .col
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
    height: 120px
    overflow hidden

  .profile-item
    width 30px
</style>
