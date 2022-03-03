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
      badgeHoldersNumber: undefined

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
  mounted () {
    this.membersToShow = this.assignments.slice(0, 2)
    this.badgeHoldersNumber = this.assignments.length > 3 ? this.assignments.length - 3 : undefined
  }
}
</script>

<template lang="pug">
  widget.bg-internal-bg.q-my-sm.cursor-pointer(noPadding)
    .row.items-center.content(:style="cssVars")
      .col
        .row.flex.items-center
          q-avatar(size="md" v-if="icon && !icon.includes('icon:')")
            img(:src="icon")
          q-btn.q-pa-xs(v-if="icon && icon.includes('icon:')" round unelevated :icon="icon.replace('icon:', '')" color="primary" text-color="white" size="sm" :ripple="false")
          .h-h5.q-ml-sm(:class="{ 'q-ml-md': !compact, 'h7': compact }") {{title}}
      .col(v-if="!compact")
        .h-b2.text-weight-thin.text-grey-7  {{description.substr(0,150) + (description.length > 150 ? '...' : '')}}
      .col-3(v-if="!compact")
        .row.justify-end.q-pr-xl
          profile-picture.profile-picture(v-for="user in assignments" :key="user.details_assignee_n" :username="user.details_assignee_n" size="2rem")
          .text-body2.text-weight-bold.text-grey-7(v-if="badgeHoldersNumber")  and others {{badgeHoldersNumber}}
</template>

<style lang="stylus" scoped>
.profile-picture
  margin-left: -18px;
.content
  height var(--badge-card-height)
  margin-left var(--badge-card-ml)
  overflow hidden
</style>
