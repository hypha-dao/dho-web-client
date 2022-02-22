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
    assignments: Array
  },
  data () {
    return {
      membersToShow: undefined,
      badgeHoldersNumber: undefined

    }
  },
  mounted () {
    this.membersToShow = this.assignments.slice(0, 2)
    this.badgeHoldersNumber = this.assignments.length > 3 ? this.assignments.length - 3 : undefined
  }
}
</script>

<template lang="pug">
  widget.bg-grey-4.q-my-sm.cursor-pointer
    .row.items-center
      .col-3
        .row
          q-avatar(size="md").q-mr-sm
            img(:src="icon")
          //- q-btn.q-mr-sm(round unelevated :icon="icon" color="primary" text-color="white" size="sm" :ripple="false")
          .h5 {{title}}
      .col
        .b2.q-mt-sm.text-weight-thin.text-grey-7  {{description}}
      .col-3
        .row.justify-end
          profile-picture.profile-picture(v-for="user in assignments" :key="user.details_assignee_n" :username="user.details_assignee_n" size="2rem")
          .text-body2.q-mt-sm.text-weight-bold.text-grey-7(v-if="badgeHoldersNumber")  and others {{badgeHoldersNumber}}
</template>

<style lang="stylus" scoped>
.profile-picture
  margin-left: -18px;
</style>
