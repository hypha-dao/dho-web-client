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
      default: 272
    }
  }
}
</script>

<template lang="pug">
.profile-sidebar(:style="{ width: `${width}px` }")
  .column.window-height.justify-between.q-py-xl
    .profile.q-pa-md
      .row.justify-between
        profile-picture(size="100px")
        .buttons
          q-btn.on-left(color="grey-6" flat round size="xs" icon="fas fa-pen")
          q-btn.on-right(color="grey-6" flat round size="xs" icon="fas fa-times" @click="$emit('close')")
      .text-h5.q-mt-lg Name And
      .text-h5 Surname
      .row.q-mt-lg.full-width.justify-between
        .bubble.rounded
        .row
          .circle.rounded.q-mr-md
          .circle.rounded.q-mr-md
          .circle.rounded.q-mr-md
    quick-actions
    quick-links
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
