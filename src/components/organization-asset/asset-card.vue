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

  }
}
</script>

<template lang="pug">
widget(noPadding).cursor-pointer
  .item.q-pa-lg
    .row.q-mb-xs.q-mt-sm
      q-btn(round unelevated :icon="asset.icon.replace('icon:', '')" color="primary" text-color="white" size="xs" :ripple="false" v-if="asset.icon && asset.icon.includes('icon:')").q-pa-xs
    .row.q-my-xs
      .text-h6.text-weight-bold {{asset.title}}
    .row.q-my-xs.description
      .text-body2.text-body {{asset.description}},
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
    height: 125px
    overflow hidden
    text-overflow: ellipsis
  .profile-item
    width 30px
</style>
