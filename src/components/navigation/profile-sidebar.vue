<script>
export default {
  name: 'profile-sidebar',
  components: {
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue'),
    QuickActions: () => import('./quick-actions.vue'),
    QuickLinks: () => import('./quick-links.vue'),
    SidebarNews: () => import('./sidebar-news.vue')
  },

  props: {
    daoName: String,
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
.profile-sidebar.full-width.full-height
  q-scroll-area.full-height
    .column.justify-evenly.q-py-lg
      .profile.q-py-md
        .row.justify-between.q-px-lg
          profile-picture(:username="profile.username" size="88px")
          .container
            q-btn(color="internal-bg" text-color="primary" rounded unelevated size="sm" padding="12px" icon="fas fa-times" @click="$emit('close')")
        .h-h3.q-mt-md.q-px-lg(v-if="profile") {{ profile.name }}
        .h-b3.text-body.q-px-lg(v-if="profile") {{ '@' + profile.username }}
      sidebar-news(:username="profile.username" :daoName="daoName").q-mt-md
      //- quick-actions //- Commented for MVP
      quick-links.q-py-sm(:username="profile.username").q-mt-md
</template>

<style lang="stylus" scoped>
.spacer
  min-height 60px
</style>
