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
      isShowingWelcomeBanner: true,
      news: [
        {
          title: 'Welcome to your new DHO',
          date: new Date().setMinutes(7),
          description: 'A lot of things are new but the purpose of the DHO remains the same. Govern decentralized organisations. So you can still vote for proposals, find other members and claim your pay. Go check it out and let us know if you have any questions (Check our Wiki) or reach out to us via the discord “dho-support” channel.',
          author: 'Alex Prate',
          type: 'normal'
        },
        {
          title: 'Adjust commitment',
          date: '10/2/21',
          description: 'You can now adjust your commitment, whenever you are less available than the organization is used to. Just go to your profile, open the assignment and move the slider to the percentage you want to adjust your commitment to. Once you are back you can move the commitment back up, max. to what it was before. Your compensation will be calculated prorated. ',
          author: 'Nila Phi',
          type: 'announcement'
        },
        {
          title: 'Other short news',
          date: '9/15/21 12:22:05',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          author: 'Alex Prate',
          type: 'new feature'
        }
      ]
    }
  },
  mounted () {
    if (localStorage.getItem('showWelcomeBanner') === 'false') {
      this.isShowingWelcomeBanner = false
    }
  },
  methods: {
    hideWelcomeBanner () {
      localStorage.setItem('showWelcomeBanner', false)
      this.isShowingWelcomeBanner = false
    },
    onLoadMoreNews (index, done) {
      setTimeout(() => {
        this.news.push(
          {
            title: 'Welcome to your new DHO',
            date: new Date().setMinutes(7),
            description: 'A lot of things are new but the purpose of the DHO remains the same. Govern decentralized organisations. So you can still vote for proposals, find other members and claim your pay. Go check it out and let us know if you have any questions (Check our Wiki) or reach out to us via the discord “dho-support” channel.',
            author: 'Alex Prate',
            type: 'normal'
          },
          {
            title: 'Adjust commitment',
            date: '10/2/21',
            description: 'You can now adjust your commitment, whenever you are less available than the organization is used to. Just go to your profile, open the assignment and move the slider to the percentage you want to adjust your commitment to. Once you are back you can move the commitment back up, max. to what it was before. Your compensation will be calculated prorated. ',
            author: 'Nila Phi',
            type: 'announcement'
          },
          {
            title: 'Other short news',
            date: '9/15/21 12:22:05',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            author: 'Alex Prate',
            type: 'new feature'
          }
        )
        done()
      }, 2000)
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
      @click="hideWelcomeBanner"
    )
    welcome-banner
  .row.q-my-md
    .col-3.q-pr-sm
      metric-link(amount="$.$k" link="treasury" title="Total Equity Token")
    .col-3.q-px-sm
      metric-link(amount="##" link="treasury" title="Total Hypha Token")
    .col-3.q-px-sm
      metric-link(amount="##" link="active-proposals" title="New Proposals")
    .col-3.q-pl-sm
      metric-link(amount="#%" link="activity" title="Active Assignments")
  .row.full-width.q-my-md
    .col-3.q-pr-sm
      support-widget
    .col-9.q-pl-sm
      how-it-works
  .row.full-width.q-my-md
    .col-9.q-pr-sm
      news-widget(:news="news" @loadMore="onLoadMoreNews")
    .col-3.q-pl-sm
      new-members
</template>

<style lang="stylus" scoped>
.close-btn
  z-index 1
</style>
