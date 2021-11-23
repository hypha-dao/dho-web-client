<script>
export default {
  name: 'dho-home',
  components: {
    HowItWorks: () => import('~/components/dashboard/how-it-works.vue'),
    MetricLink: () => import('~/components/dashboard/metric-link.vue'),
    NewMembers: () => import('~/components/dashboard/new-members.vue'),
    NewsWidget: () => import('~/components/dashboard/news-widget.vue'),
    SupportWidget: () => import('~/components/dashboard/support-widget.vue'),
    WelcomeBanner: () => import('~/components/dashboard/welcome-banner.vue'),
    DemoIpfsInputs: () => import('~/components/ipfs/demo-ipfs-inputs.vue')
  },
  data () {
    return {
      isShowingWelcomeBanner: true,
      news: [
        {
          title: 'Welcome to your new DHO',
          date: new Date().setMinutes(7).toString(),
          description: 'A lot of things are new but the purpose of the DHO remains the same. Govern decentralized organisations. So you can still vote for proposals, find other members and claim your pay. Go check it out and let us know if you have any questions (Check our Wiki) or reach out to us via the discord “dho-support” channel.',
          author: 'Alex Prate',
          tags: []
        },
        {
          title: 'Adjust commitment',
          date: '10-09-21 10:22:40',
          description: 'You can now adjust your commitment, whenever you are less available than the organization is used to. Just go to your profile, open the assignment and move the slider to the percentage you want to adjust your commitment to. Once you are back you can move the commitment back up, max. to what it was before. Your compensation will be calculated prorated. ',
          author: 'Nila Phi',
          tags: [{ label: 'ANNOUNCEMENT', color: 'primary' }]
        },
        {
          title: 'Other short news',
          date: '9-15-21 12:22:05',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          author: 'Luke',
          tags: [{ label: 'NEW FEATURE', color: 'indigo-14' }]
        }
      ],
      members: [
        {
          avatar: 'https://cdn.quasar.dev/img/avatar.png',
          name: 'Khem Poudel',
          joinedDate: '10/18/21 15:23:53',
          profileLink: ''
        },
        {
          avatar: 'https://cdn.quasar.dev/img/avatar2.jpg',
          name: 'Miguel Ulrich',
          joinedDate: '10/17/21 10:18:20',
          profileLink: ''
        },
        {
          avatar: 'https://cdn.quasar.dev/img/avatar3.jpg',
          name: 'Lineke',
          joinedDate: '10/16/21 06:54:05',
          profileLink: ''
        },
        {
          avatar: 'https://cdn.quasar.dev/img/avatar4.jpg',
          name: 'Christina Trout',
          joinedDate: '9/19/21 20:15:32',
          profileLink: ''
        },
        {
          avatar: 'https://cdn.quasar.dev/img/avatar5.jpg',
          name: 'Michael',
          joinedDate: '9/10/21 15:50:09',
          profileLink: ''
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
            author: 'Alex Prate'
          },
          {
            title: 'Adjust commitment',
            date: '10-09-21 10:22:40',
            description: 'You can now adjust your commitment, whenever you are less available than the organization is used to. Just go to your profile, open the assignment and move the slider to the percentage you want to adjust your commitment to. Once you are back you can move the commitment back up, max. to what it was before. Your compensation will be calculated prorated. ',
            author: 'Nila Phi',
            tags: [{ label: 'ANNOUNCEMENT', color: 'primary' }]
          },
          {
            title: 'Other short news',
            date: '9/15/21 12:22:05',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            author: 'Luke',
            tags: [{ label: 'NEW FEATURE', color: 'indigo-14' }]
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
      metric-link(amount="4.6k" link="treasury" title="Total Equity Token" icon="fas fa-coins")
    .col-3.q-px-sm
      metric-link(amount="26" link="treasury" title="Total Hypha Token" icon="fas fa-paper-plane")
    .col-3.q-px-sm
      metric-link(amount="13" link="proposals" title="New Proposals" icon="fas fa-file-alt")
    .col-3.q-pl-sm
      metric-link(amount="74%" link="activity" title="Active Assignments" icon="far fa-user")
  .row.full-width.q-my-md
    .col-9.q-pr-sm
      news-widget(:news="news" @loadMore="onLoadMoreNews")
    .col-3.q-pl-sm
      new-members(:members="members")
  .row.full-width.q-my-md
    .col-3.q-pr-sm
      support-widget
    .col-9.q-pl-sm
      how-it-works
</template>

<style lang="stylus" scoped>
.close-btn
  z-index 1
</style>
