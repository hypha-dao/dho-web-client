<script>
export default {
  name: 'dho-home',
  components: {
    HowItWorks: () => import('~/components/dashboard/how-it-works.vue'),
    MetricLink: () => import('~/components/dashboard/metric-link.vue'),
    NewMembers: () => import('~/components/dashboard/new-members.vue'),
    NewsWidget: () => import('~/components/dashboard/news-widget.vue'),
    SupportWidget: () => import('~/components/dashboard/support-widget.vue'),
    WelcomeBanner: () => import('~/components/dashboard/welcome-banner.vue')
  },
  data () {
    return {
      isShowingWelcomeBanner: true
    }
  }
}
</script>

<template lang="pug">
.dho-home.q-px-xl
  .row.full-width.relative-position.q-mb-md(v-if="isShowingWelcomeBanner")
    q-btn.absolute-top-right.q-mt-lg.q-mr-lg.q-pa-xs.close-btn(
      flat round size="sm"
      icon="fas fa-times"
      color="white"
      @click="isShowingWelcomeBanner = false"
    )
    welcome-banner
  .row.q-my-md
    .col-3.q-pr-sm
      metric-link(amount="$.$k" link="treasury" title="Hypha Distributed")
    .col-3.q-px-sm
      metric-link(amount="XX" link="active-proposals" title="New Proposals")
    .col-3.q-px-sm
      metric-link(amount="##" link="activity" title="New Assignments")
    .col-3.q-pl-sm
      metric-link(amount="%%" link="members" title="Voter Participation")
  .row.full-width.q-my-md
    .col-3.q-pr-sm
      support-widget
    .col-9.q-pl-sm
      how-it-works
  .row.full-width.q-my-md
    .col-9.q-pr-sm
      news-widget
    .col-3.q-pl-sm
      new-members
</template>

<style lang="stylus" scoped>
.close-btn
  z-index 1
</style>
