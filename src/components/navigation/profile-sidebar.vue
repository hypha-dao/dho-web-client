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
    isMember: Boolean,
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
    .column.justify-between.q-py-xxxl.q-px-xxxl.flex.scrollable-area
      .profile.q-py-md
        .row.justify-between
          profile-picture(:username="profile.username" size="88px")
          .container
            q-btn(color="internal-bg" text-color="primary" rounded unelevated size="sm" padding="12px" icon="fas fa-times" @click="$emit('close')")
        .h-h3.q-mt-md(v-if="profile") {{ profile.name }}
        .h-b3.text-body(v-if="profile") {{ '@' + profile.username }}
      sidebar-news(:username="profile.username" :daoName="daoName" v-if="isMember")
      //- quick-actions //- Commented for MVP
      quick-links.q-py-sm(:username="profile.username" :isMember="isMember")
</template>

<style lang="stylus" scoped>
.scrollable-area
  min-height 100vh
</style>
