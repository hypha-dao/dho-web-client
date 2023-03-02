<script>
import { mapGetters, mapActions } from 'vuex'
import { date, colors } from 'quasar'
import ipfsy from '~/utils/ipfsy'

const ordersMap = [{ asc: 'createdDate' }, { desc: 'createdDate' }, { asc: 'details_title_s' }]
const { getPaletteColor } = colors

export default {
  name: 'dho-home',
  apollo: {
    upvoteElectionQuery: {
      query: require('~/query/upvote-election-data.gql'),
      update: data => {
        return {
          currentRound: data.getDao.ongoingelct[0]?.currentround[0].details_type_s,
          nextRound: data.getDao.ongoingelct[0]?.currentround[0].nextround,
          upcomingElection: data.getDao.upcomingelct,
          endTime: data.getDao.ongoingelct[0]?.currentround[0].details_endDate_t,
          startTime: data.getDao.upcomingelct[0]?.details_startDate_t
        }
      },
      variables () {
        return {
          daoName: this.selectedDao.name
        }
      },
      subscribeToMore: {
        document: require('~/query/upvote-election-data-subs.gql'),
        variables () {
          return {
            daoName: this.selectedDao.name
          }
        },
        updateQuery: (previousResult, { subscriptionData }) => {
          if (!subscriptionData.data) {
            return previousResult
          }
          if (!previousResult) {
            return undefined
          }
          return {
            ...previousResult,
            ...subscriptionData
          }
        }
      },
      result (data) {
        this.upvoteElectionData = {
          currentRound: data.data.getDao.ongoingelct[0]?.currentround[0].details_type_s,
          nextRound: data.data.getDao.ongoingelct[0]?.currentround[0].nextround,
          upcomingElection: data.data.getDao.upcomingelct,
          endTime: data.data.getDao.ongoingelct[0]?.currentround[0].details_endDate_t,
          startTime: data.data.getDao.upcomingelct[0]?.details_startDate_t
        }
      }
    },
    activeAssignmentsCount: {
      query: require('~/query/assignments/dao-active-assignment-count.gql'),
      update: data => data.aggregateAssignment.count.toString(),
      skip () { return !this.selectedDao || !this.selectedDao.docId },
      variables () {
        return {
          filter: {
            details_dao_i: { eq: this.selectedDao.docId },
            details_state_s: { regexp: '/.*approved.*/i' }
          }
        }
      }
    },

    activeBadgesCount: {
      query: require('~/query/badges/dao-active-badge-count.gql'),
      update: data => data.getDao.badgeAggregate.count.toString(),
      skip () { return !this.selectedDao || !this.selectedDao.docId },
      variables () {
        return {
          daoId: this.selectedDao.docId,
          filter: { details_state_s: { regexp: '/.*approved.*/i' } }
        }
      }
    },

    activeProposalsCount: {
      query: require('~/query/proposals/dao-active-proposal-count.gql'),
      update: data => data.getDao.proposalAggregate.count.toString(),
      skip () { return !this.selectedDao || !this.selectedDao.docId },
      variables () {
        return {
          daoId: this.selectedDao.docId,
          finalDate: date.formatDate(new Date(), 'YYYY-MM-DDTHH:mm:ss.SZ'),
          initDate: date.formatDate(date.subtractFromDate(new Date(), { days: 7 }), 'YYYY-MM-DDTHH:mm:ss.SZ')
        }
      }
    },

    activeMembersCount: {
      query: require('~/query/members/dao-members-active-assignments.gql'),
      update: data => {
        const { badge, role } = data.getDao

        const roleMembers = role.length > 0 ? role.map(r => r.assignment.flat()).flat().map(r => r.creator) : role
        const badgeMembers = badge.length > 0 ? badge.map(b => b.assignment.flat()).flat().map(b => b.creator) : badge
        const members = new Set([...roleMembers, ...badgeMembers])

        return members.size
      },
      skip () { return !this.selectedDao || !this.selectedDao.docId },
      variables () {
        return {
          daoId: this.selectedDao.docId
        }
      }
    },

    daoMembers: {
      query: require('~/query/members/dao-members.gql'),
      update: data => data.getDao,
      skip () { return !this.selectedDao || !this.selectedDao.docId },
      variables () {
        return {
          daoId: this.selectedDao.docId,
          first: 4
        }
      }
    },

    daoBadges: {
      query: require('~/query/badges/dao-badges.gql'),
      update: data => {
        return data.getDao.badge?.map(badge => {
          return {
            title: badge.details_title_s,
            description: badge.details_description_s,
            icon: badge.details_icon_s,
            docId: badge.docId,
            assignmentAggregate: badge.assignmentAggregate,
            assignment: badge.assignment.map((ownedby) => {
              return {
                username: ownedby.details_assignee_n,
                daoName: ownedby.dao[0].details_daoName_n
              }
            })
          }
        })
      },
      variables () {
        return {
          first: this.pagination.first,
          offset: 0,
          daoId: this.selectedDao.docId,
          order: this.order,
          filter: this.textFilter ? { details_title_s: { regexp: `/.*${this.textFilter}.*/i` } } : null
        }
      },
      skip () {
        return !this.selectedDao || !this.selectedDao.docId
      },
      debounce: 500,
      loadingKey: 'loadingQueriesCount',
      result ({ data, loading, networkStatus }) {
        if (this.pagination.offset === 0) {
          this.$refs.scroll?.resume()
        }
      }
    }
  },

  components: {
    BaseBanner: () => import('~/components/common/base-banner.vue'),

    HowItWorks: () => import('~/components/dashboard/how-it-works.vue'),
    MetricLink: () => import('~/components/dashboard/metric-link.vue'),
    NewMembers: () => import('~/components/dashboard/new-members.vue'),
    SupportWidget: () => import('~/components/dashboard/support-widget.vue')
  },

  data () {
    return {
      isPlanBannerVisible: true,
      isWelcomeBannerVisible: true,
      isSignUpElectionBanner: true,
      counterdown: undefined,
      endDate: '2023-03-20',
      pagination: {
        first: 6,
        offset: 0,
        fetchMore: true
      },
      textFilter: null,
      order: ordersMap[0],
      currentUpvoteStep: null,
      upvoteElectionData: {}
    }
  },

  async mounted () {
    if (localStorage.getItem('showPlanBanner') === 'false') { this.isPlanBannerVisible = false }
    if (localStorage.getItem('showWelcomeBanner') === 'false') { this.isWelcomeBannerVisible = false }
    if (localStorage.getItem('showSignUpElectionBanner') === 'false') { this.isSignUpElectionBanner = false }
    this.counterdown = setInterval(() => {
      this.formatTimeLeft()
      this.$forceUpdate()
    }, 1000)
    this.$apollo.queries.upvoteElectionQuery.refetch()
  },

  activated () {
    this.counterdown = setInterval(() => {
      this.formatTimeLeft()
      this.$forceUpdate()
    }, 1000)
    this.$apollo.queries.upvoteElectionQuery.refetch()
  },

  deactivated () {
    clearInterval(this.counterdown)
  },

  computed: {
    ...mapGetters('dao', ['daoSettings', 'selectedDao', 'selectedDaoPlan']),

    banner () {
      return {
        title: this.daoSettings.dashboardTitle,
        description: this.daoSettings.dashboardParagraph,
        background: ipfsy(this.daoSettings.dashboardBackgroundImage),
        color: this.daoSettings.primaryColor,
        pattern: this.daoSettings.pattern,
        patternColor: this.daoSettings.patternColor,
        patternAlpha: this.daoSettings.patternOpacity
      }
    },

    newMembers () {
      if (!this.daoMembers || !this.daoMembers.member) return

      return this.daoMembers.member.map(v => {
        return {
          name: v.details_member_n,
          joinedDate: new Date(v.createdDate).toDateString()
        }
      })
    },

    upvoteElectionBannerTitle () {
      let title = ''
      if (this.currentStepIndex === 0) {
        title = 'Sign up for the election!'
      } else if (this.currentStepIndex < 4 && this.currentStepIndex > 0) {
        title = 'The election is on progress'
      } else {
        title = 'The election in completed!'
      }
      return title
    },

    upvoteElectionBannerHeaderTitle () {
      let title = ''
      if (this.currentStepIndex === 0) {
        title = 'Upvote Election starting in'
      } else if (this.currentStepIndex < 3) {
        title = 'Upvote Election started!'
      } else {
        title = 'Upvote Election'
      }
      return title
    },

    upvoteElectionBannerHeaderRoundName () {
      let roundName = ''
      if (this.currentStepIndex === 1) {
        roundName = 'Round - 1'
      } else if (this.currentStepIndex === 2) {
        roundName = 'Chief Delegate Round'
      } else if (this.currentStepIndex === 3) {
        roundName = 'Head Delegate Round'
      } else if (this.currentStepIndex !== 0) {
        roundName = 'Completed!'
      }
      return roundName
    },

    upvoteElectionBannerDescription () {
      let description = ''
      if (this.currentStepIndex === 0) {
        description = 'Hello Community members! We are soon running our Upvote Election! It will allow everyone in the AwesomeDAO community to actively participate to decision making and building our cool project together! How does it work? In a nutshell: we will run community proposals that can be voted by delegates badge holders. If you feel like being a delegate, apply now for a badge! If want to just vote your favourite delegates, apply for a voter bade!'
      } else if (this.currentStepIndex < 4 && this.currentStepIndex > 0) {
        description = 'Hello Community members! Our Upvote election is up and running! If you signed up for a Voter Badge, click the button below to go express your vote and select the best delegates to represent your ideas in our lorem ipsum dolor sit amet'
      } else {
        description = 'Hurrey! We have our chief delegates and head delegates! go check the results by clicking the link at the bottom!'
      }
      return description
    },
    currentStepIndex () {
      let stepIndex = null
      if (this.upvoteElectionData.upcomingElection?.length) {
        stepIndex = 0
      } else if (!this.upvoteElectionData.nextRound?.length && this.upvoteElectionData?.currentRound !== 'head') {
        stepIndex = 4
      } else {
        switch (this.upvoteElectionData?.currentRound) {
          case ('delegate'):
            stepIndex = 1
            break
          case ('chief'):
            stepIndex = 2
            break
          case ('head'):
            stepIndex = 3
            break
        }
      }
      return stepIndex
    }
  },

  methods: {
    ...mapActions('proposals', ['saveDraft']),
    getPaletteColor,
    hidePlanBanner () {
      localStorage.setItem('showPlanBanner', false)
      this.isPlanBannerVisible = false
    },

    hideWelcomeBanner () {
      localStorage.setItem('showWelcomeBanner', false)
      this.isWelcomeBannerVisible = false
    },

    hideSignUpElectionBanner () {
      localStorage.setItem('showSignUpElectionBanner', false)
      this.isSignUpElectionBanner = false
    },

    votingTimeLeft () {
      const end = this.upvoteElectionData.upcomingElection?.length ? new Date(this.upvoteElectionData.startTime) : new Date(this.upvoteElectionData.endTime)
      const now = Date.now()
      const t = end - now
      if (t < 0) {
        this.$apollo.queries.upvoteElectionQuery.refetch()
      }
      return t
    },
    formatTimeLeft () {
      const MS_PER_DAY = 1000 * 60 * 60 * 24
      const MS_PER_HOUR = 1000 * 60 * 60
      const MS_PER_MIN = 1000 * 60
      const timeRemaining = this.votingTimeLeft()
      if (timeRemaining > 0) {
        const days = Math.floor(timeRemaining / MS_PER_DAY)
        let lesstime = timeRemaining - (days * MS_PER_DAY)
        const hours = Math.floor(lesstime / MS_PER_HOUR)
        lesstime = lesstime - (hours * MS_PER_HOUR)
        const min = Math.floor(lesstime / MS_PER_MIN)
        lesstime = lesstime - (min * MS_PER_MIN)
        return {
          days: days,
          hours: hours,
          mins: min
        }
      }
      return 0
    }
  }
}
</script>

<template lang="pug">
q-page.page-home
  base-banner.q-mb-md(
    :title="upvoteElectionBannerTitle"
    :description="upvoteElectionBannerDescription"
    :gradient="false"
    :color="getPaletteColor('secondary')"
    :contentFullWidth="true"
    @onClose="hideSignUpElectionBanner"
    v-if="isSignUpElectionBanner"
  )
    template(v-slot:header)
      header.full-width.q-mb-xl.row.h-h6.text-white
        .row.items-center
          .flex.items-center.justify-center.q-mr-xs(:style="{ 'background': 'white', 'border-radius': '50%', 'width': '32px', 'height': '32px' }")
            img(src="/svg/check-to-slot-secondary.svg" width="18px" height="14px")
          .q-mr-md {{ upvoteElectionBannerHeaderTitle }}
          .q-mr-md.counter {{ upvoteElectionBannerHeaderRoundName }}
          .counter(v-if="currentStepIndex !== 4" :class="{ 'q-mt-md': $q.screen.lt.xs || $q.screen.xs }")
            .time.row
              .row.items-end
                .days {{ formatTimeLeft().days }}
                .subtext(v-if="formatTimeLeft().days > 1") days
                .subtext(v-else) day
              .row.items-end
                .hours {{ formatTimeLeft().hours }}
                .subtext(v-if="formatTimeLeft().hours > 1") hours
                .subtext(v-else) hour
              .row.items-end
                .mins {{ formatTimeLeft().mins }}
                .subtext(v-if="formatTimeLeft().mins > 1") mins
                .subtext(v-else) min
    template(v-slot:buttons)
      .row.justify-between
        .flex.items-center()
          h-b1.text-white.text-weight-400 More information about UpVote Election
          router-link(:to="{ name: 'plan-manager' }" :class="{ 'h-b1 text-white text-weight-800': true }" :style="{ 'margin-left': '4px', 'text-decoration': 'underline' }") here
        .flex(:class=" { 'q-mt-md': $q.screen.lt.md, 'justify-end': $q.screen.gt.sm }")
          template(v-if="currentStepIndex === 0")
            q-btn.q-px-lg.h-btn1(no-caps rounded unelevated label="Apply for a Voter Badge" color="white" text-color="primary" :to="{ name: 'upvote-election' }")
            q-btn.q-px-lg.h-btn1(:class="{ 'q-ml-md': $q.screen.gt.xs, 'q-mt-sm': $q.screen.lt.xs || $q.screen.xs }" no-caps rounded unelevated label="Apply for a Delegate Badge" color="white" text-color="primary" :to="{ name: 'upvote-election' }")
          q-btn.q-px-lg.h-btn1(v-if="currentStepIndex > 0 && currentStepIndex < 4" :class="{ 'q-ml-md': $q.screen.gt.xs, 'q-mt-sm': $q.screen.lt.xs || $q.screen.xs }" no-caps rounded unelevated label="Go cast your vote!" color="white" text-color="primary" :to="{ name: 'upvote-election' }")
          q-btn.q-px-lg.h-btn1(v-if="currentStepIndex === 4" :class="{ 'q-ml-md': $q.screen.gt.xs, 'q-mt-sm': $q.screen.lt.xs || $q.screen.xs }" no-caps rounded unelevated label="Check results" color="white" text-color="primary" :to="{ name: 'upvote-election' }")
  base-banner.q-mb-md(
    title="Your Plan has expired!"
    description="We are allowing you a grace period of 7 days for you to resolve this issue before we will regrettably have to suspend your DAO account. Once suspended, you will not be able to perform any actions on the DAO until you renew your Plan, or downgrade to the Free Plan. Click the ‘Manage Plan’ button and renew your plan today."
    :gradient="false"
    :color="getPaletteColor('negative')"
    :compact="!$q.screen.gt.sm"
    v-if="selectedDaoPlan.isExpiring"
  )
    template(v-slot:header)
      header.full-width.q-mb-xl.row.h-h4.text-white(:class="{'justify-between h-h5': !$q.screen.gt.sm }")
        div(:class="{'q-pr-md': $q.screen.gt.sm }") {{selectedDaoPlan.name}} plan
          span.text-weight-500.q-pl-xxs expired
        div(:class="{'q-px-sm': $q.screen.gt.sm }")
          div.full-height(:style="{'width': '2px', 'background': 'rgba(255, 255, 255, .2)' }")
        div(:class="{'q-px-md': $q.screen.gt.sm }") {{selectedDaoPlan.daysLeft}}
          span.text-xs.text-weight-500.q-pl-xxs days left
        .q-px-sm(v-if="$q.screen.gt.sm")
          div.full-height(:style="{'width': '2px', 'background': 'rgba(255, 255, 255, .2)' }")
        div.row.items-center.q-gutter-x-sm(v-if="$q.screen.gt.sm" :class="{'q-pl-xl': $q.screen.gt.sm }")
          q-icon(name="fas fa-exclamation-triangle" size='sm')
          span Action Required
    template(v-slot:buttons)
      q-btn.q-px-lg.h-btn1(
        :to="{ name: 'configuration', query: { tab: 'PLAN' } }"
        color="white"
        label="Manage Plan"
        no-caps
        rounded
        text-color="negative"
        unelevated
      )

  base-banner.q-mb-md(
    title="Get all the benefits of a Hypha DAO"
    description="We’ve activated your DAO on a default free plan. This has limited features even though it’s a full fledged DAO. To benefit from the full potential of Hypha DAO modules, such as circles, badges, custom governance, additional users, and much more, click “Manage Plan” and subscribe to one of our pricing plans today."
    :gradient="false"
    :color="getPaletteColor('secondary')"
    :compact="!$q.screen.gt.sm"
    @onClose="hidePlanBanner"
    v-if="selectedDaoPlan.isActivated && isPlanBannerVisible"
  )
    template(v-slot:header)
      header.full-width.q-mb-xl.row.h-h4.text-white(:class="{ 'justify-between h-h5': !$q.screen.gt.sm }")
        .q-pr-sm(:class="{'q-pr-md': $q.screen.gt.sm }") {{selectedDaoPlan.name}} plan
          span.text-weight-500.q-pl-xxs(v-if="$q.screen.gt.sm") active
        div(:class="{'q-px-sm': $q.screen.gt.sm }")
          div.full-height(:style="{'width': '2px', 'background': 'rgba(255, 255, 255, .2)' }")
        .q-pl-sm(:class="{'q-pl-md': $q.screen.gt.sm }")
          router-link.text-white(:to="{ name: 'configuration', query: { tab: 'PLAN' } }") Upgrade plan
    template(v-slot:buttons)
      q-btn.q-px-lg.h-btn1(
        :to="{ name: 'configuration', query: { tab: 'PLAN' } }"
        color="white"
        label="Manage Plan"
        no-caps
        rounded
        text-color="secondary"
        unelevated
      )

  base-banner(
    :compact="!$q.screen.gt.sm"
    @onClose="hideWelcomeBanner"
    :split="$q.screen.gt.md"
    v-bind="banner"
    v-if="isWelcomeBannerVisible"
  )
    template(v-slot:buttons)
      router-link(:to="{ name: 'organization' }")
        q-btn.q-px-lg.h-btn1(
          color="secondary"
          label="Discover More"
          no-caps
          rounded
          unelevated
        )

  .row
    .row.q-col-gutter-md.q-mt-xxs.z-top
      .col-12.col-md-6.col-lg-2
        metric-link(:amount="activeAssignmentsCount" title="Active assignments" icon="fas fa-coins" :link="{ link: 'search', query: { q: '', filter: 'Active', type: '4' } }").full-width
      .col-12.col-md-6.col-lg-2
        metric-link(:amount="activeProposalsCount" link="proposals" title="New Proposals" ).full-height.full-width
      .col-12.col-md-6.col-lg-2
        metric-link(:amount="activeBadgesCount" title="Active badges" icon="fas fa-coins" :link="{ link: 'organization/assets', params: { type: 'badge' } }").full-width
      .col-12.col-md-6.col-lg-2
        metric-link(:amount="activeMembersCount" link="members" title="Active Members").full-height.full-width
      .col-12.col-md-6(v-if="!$q.screen.gt.md")
        new-members(:members="newMembers").full-width
      .flex-break(v-if="$q.screen.gt.md")
      .col-12.col-md-6.col-lg-4
        support-widget(:documentationURL="daoSettings.documentationURL" :socialChat="daoSettings.socialChat" :documentationButtonText="daoSettings.documentationButtonText").full-height.full-width
      .col-12.col-lg-4
        how-it-works.full-height
      .col-3
    .row.absolute.full-width.q-pl-xxxl.q-pt-lg(v-if="$q.screen.gt.md")
      .col-lg-4.offset-8
        new-members(:members="newMembers").full-width

</template>

<style lang="stylus" scoped>
.counter
  display: flex
  font-family: 'Lato', sans-serif
  font-weight: 600
  color: #FFFFFF
  font-size: 18px
  .time
    .subtext
      font-size: 12px
      padding-bottom: 2px
      margin-right: 4px
</style>
