<script>
export default {
  name: 'profile-sidebar',
  components: {
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue'),
    QuickActions: () => import('./quick-actions.vue'),
    QuickLinks: () => import('./quick-links.vue')
  },

  props: {
    profile: {
      type: Object
    },
    width: {
      type: Number,
      default: 370
    }
  }
}
</script>

<template lang="pug">
.profile-sidebar(:style="{ width: `${width}px` }")
  .column.window-height.justify-between.q-py-lg
    .profile.q-py-md
      .row.justify-between.q-px-lg
        profile-picture(:username="profile.username" size="88px")
        .container
          q-btn(color="grey-4" text-color="primary" rounded unelevated size="sm" padding="12px" icon="fas fa-times" @click="$emit('close')")
      .text-h5.text-bold.q-mt-md.q-px-lg(v-if="profile") {{ profile.name }}
      .text-subtitle1.text-italic.text-grey-6.q-px-lg(v-if="profile") {{ '@' + profile.username }}
      // .row.q-mt-lg.full-width.justify-between
        .bubble.rounded
        .row
          .circle.rounded.q-mr-md
          .circle.rounded.q-mr-md
          .circle.rounded.q-mr-md
    quick-actions
    quick-links.q-py-sm(:username="profile.username")
</template>

<style lang="stylus" scoped>
.rounded
  background-color #CFCFCF
  border-radius 43px

.bubble
  width 100px
  height 20px

.circle
  width 20px
  height 20px
</style>
