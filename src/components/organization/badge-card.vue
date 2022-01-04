<script>
export default {
  name: 'badge-card',
  components: {
    Widget: () => import('../common/widget.vue'),
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue')
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
    users: Array,
    badgeHoldersNumber: String
  },
  data () {
    return {
    }
  }
}
</script>

<template lang="pug">
  widget.bg-grey-4.q-my-sm.cursor-pointer
    .row.items-center
      .col-3
        .row
          q-btn.q-mr-sm(round unelevated :icon="icon" color="primary" text-color="white" size="sm" :ripple="false")
          .text-h6 {{title}}
      .col
        .text-body2.q-mt-sm.text-weight-thin.text-grey-7  {{description}}
      .col-3
        .row.justify-end
          profile-picture.profile-picture(v-for="user in users" :key="user.name" :username="user.name" size="2rem")
          .text-body2.q-mt-sm.text-weight-bold.text-grey-7  and others {{badgeHoldersNumber}}
</template>

<style lang="stylus" scoped>
.profile-picture
  margin-left: -18px;
</style>
