<script>
import clsx from 'clsx'
import { mapGetters } from 'vuex'
import { date } from 'quasar'

import ipfsy from '~/utils/ipfsy'

const ordersMap = [{ asc: 'createdDate' }, { desc: 'createdDate' }, { asc: 'details_title_s' }]

export default {
  name: 'dashboard',
  components: {
    BaseBanner: () => import('~/components/common/base-banner.vue'),
    HowItWorks: () => import('~/components/dashboard/how-it-works.vue'),
    MetricLink: () => import('~/components/dashboard/metric-link.vue'),
    NewMembers: () => import('~/components/dashboard/new-members.vue'),
    SupportWidget: () => import('~/components/dashboard/support-widget.vue')
  },

  apollo: {

    activeAssignmentsCount: {
      query: require('~/query/assignments/dao-active-assignment-count.gql'),
      update: data => data?.aggregateAssignment?.count?.toString(),
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
      update: data => data?.getDao?.badgeAggregate?.count.toString(),
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
      update: data => data?.getDao?.proposalAggregate?.count.toString(),
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
      variables () { return { daoId: this.selectedDao.docId } }
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
      skip () { return !this.selectedDao || !this.selectedDao.docId },
      variables () {
        return {
          first: this.pagination.first,
          offset: 0,
          daoId: this.selectedDao.docId,
          order: this.order,
          filter: this.textFilter ? { details_title_s: { regexp: `/.*${this.textFilter}.*/i` } } : null
        }
      },

      debounce: 500,
      loadingKey: 'loadingQueriesCount',
      result ({ data, loading, networkStatus }) {
        if (this.pagination.offset === 0) {
          this.$refs.scroll?.resume()
        }
      }
    },

    daoMembers: {
      query: require('~/query/members/dao-members.gql'),
      update: data => {
        const dao = data?.getDao

        return dao?.member?.map(v => ({
          name: v.details_member_n,
          joinedDate: new Date(v.createdDate).toDateString()
        }))
      },
      skip () { return !this.selectedDao || !this.selectedDao.docId },
      variables () { return { daoId: this.selectedDao.docId, first: 4 } }
    },

    upvoteElection: {
      query: require('~/query/upvote-election-data.gql'),
      update: data => {
        const election = data.getDao

        return {
          isActive: election.previouselct.length > 1 || election.ongoingelct.length > 1 || election.upcomingelct.length > 1,
          currentRound: election.ongoingelct[0]?.currentround[0].details_type_s,
          nextRound: election.ongoingelct[0]?.currentround[0].nextround,
          upcomingElection: election.upcomingelct,
          startTime: election.upcomingelct[0]?.details_startDate_t,
          endTime: election.ongoingelct[0]?.currentround[0].details_endDate_t
        }
      },
      skip () { return !this.selectedDao || !this.selectedDao.name },
      variables () { return { daoName: this.selectedDao.name } },
      result (data) {
        this.upvoteElectionData = {

          currentRound: data.getDao.ongoingelct[0]?.currentround[0].details_type_s,
          nextRound: data.getDao.ongoingelct[0]?.currentround[0].nextround,
          upcomingElection: data.getDao.upcomingelct,
          endTime: data.getDao.ongoingelct[0]?.currentround[0].details_endDate_t,
          startTime: data.getDao.upcomingelct[0]?.details_startDate_t
        }
      }
    }
  },

  data () {
    return {

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

  computed: {
    ...mapGetters('dao', ['daoSettings', 'selectedDao', 'selectedDaoPlan']),

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
    },

    isUpVoteElectionBannerVisible () { return this.upvoteElection.isActive },

    isWelcomeBannerVisible () { return true },

    upvoteElectionBanner () {
      // TODO: Refactor i18n. $t('title', this.currentStepIndex === 0)
      return {
        title: clsx({
          'Sign up for the election!': this.currentStepIndex === 0,
          'The election is on progress': this.currentStepIndex > 0 && this.currentStepIndex < 4,
          'The election in completed!': this.currentStepIndex === 4
        }),
        description: clsx({
          'Hello Community members! We are soon running our Upvote Election! It will allow everyone in the AwesomeDAO community to actively participate to decision making and building our cool project together! How does it work? In a nutshell: we will run community proposals that can be voted by delegates badge holders. If you feel like being a delegate, apply now for a badge! If want to just vote your favourite delegates, apply for a voter bade!': this.currentStepIndex === 0,
          'Hello Community members! Our Upvote election is up and running! If you signed up for a Voter Badge, click the button below to go express your vote and select the best delegates to represent your ideas in our lorem ipsum dolor sit amet': this.currentStepIndex > 0 && this.currentStepIndex < 4,
          'Hurrey! We have our chief delegates and head delegates! go check the results by clicking the link at the bottom!': this.currentStepIndex === 4
        }),
        header: clsx({
          'Upvote Election starting in': this.currentStepIndex === 0,
          'Upvote Election started!': this.currentStepIndex > 0 && this.currentStepIndex < 3,
          'Upvote Election': this.currentStepIndex > 3
        }),
        round: clsx({
          'Round - 1': this.currentStepIndex === 1,
          'Chief Delegate Round': this.currentStepIndex === 2,
          'Head Delegate Round': this.currentStepIndex === 3,
          'Completed!': this.currentStepIndex !== 0
        }),
        color: this.daoSettings.secondaryColor,
        gradient: false
      }
    },

    welcomeBanner () {
      return {
        title: this.daoSettings.dashboardTitle,
        description: this.daoSettings.dashboardParagraph,
        background: ipfsy(this.daoSettings.dashboardBackgroundImage),
        color: this.daoSettings.primaryColor,
        pattern: this.daoSettings.pattern,
        patternColor: this.daoSettings.patternColor,
        patternAlpha: this.daoSettings.patternOpacity
      }
    }

  },

  created () {
    this.counterdown = setInterval(() => {
      this.formatTimeLeft()
      this.$forceUpdate()
    }, 1000)
    this.$apollo.queries.upvoteElection.refetch()
  },

  beforeDestroy () {
    clearInterval(this.counterdown)
  },

  methods: {
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
    },

    votingTimeLeft () {
      const end = this.upvoteElectionData.upcomingElection?.length ? new Date(this.upvoteElectionData.startTime) : new Date(this.upvoteElectionData.endTime)
      const now = Date.now()
      const t = end - now
      if (t < 0) {
        this.$apollo.queries.upvoteElection.refetch()
      }
      return t
    }
  }
}
</script>

<template lang="pug">
q-page.page-dashboard
  base-banner.q-mb-md(
    v-bind="upvoteElectionBanner"
    v-if="isUpVoteElectionBannerVisible"
  )
    template(v-slot:header)
      header.full-width.q-mb-xl.row.h-h6.text-white
        .row.items-center.font-lato
          .flex.items-center.justify-center.q-mr-xs(:style="{ 'background': 'white', 'border-radius': '50%', 'width': '32px', 'height': '32px' }")
            img(src="/svg/check-to-slot-secondary.svg" width="18px" height="14px")
          .q-mr-md {{ upvoteElectionBanner.header }}
          .q-mr-md {{ upvoteElectionBanner.round }}
          .counter(v-if="currentStepIndex !== 4" :class="{ 'q-mt-md': $q.screen.lt.xs || $q.screen.xs }")
            .time.row.q-ml-md
              .row.items-end
                .days {{ formatTimeLeft().days }}
                .text-xs.q-mr-sm(v-if="formatTimeLeft().days > 1") days
                .text-xs.q-mr-sm(v-else) day
              .row.items-end
                .hours {{ formatTimeLeft().hours }}
                .text-xs.q-mr-sm(v-if="formatTimeLeft().hours > 1") hours
                .text-xs.q-mr-sm(v-else) hour
              .row.items-end
                .mins {{ formatTimeLeft().mins }}
                .text-xs.q-mr-sm(v-if="formatTimeLeft().mins > 1") mins
                .text-xs.q-mr-sm(v-else) min
    template(v-slot:buttons)
      .row.justify-between
        .flex.items-center()
          h-b1.text-white.text-weight-400 More information about UpVote Election
          router-link(:to="{ name: 'plan-manager' }" :class="{ 'h-b1 text-white text-weight-800': true }" :style="{ 'margin-left': '4px', 'text-decoration': 'underline' }") here
        .flex(:class=" { 'q-mt-md': $q.screen.lt.md, 'justify-end': $q.screen.gt.sm }")
          q-btn.q-px-lg.h-btn1(v-if="currentStepIndex === 0" :class="{ 'q-mt-sm': $q.screen.lt.xs || $q.screen.xs }" no-caps rounded unelevated label="Sign-up" color="white" text-color="primary" :to="{ name: 'upvote-election' }")
          q-btn.q-px-lg.h-btn1(v-if="currentStepIndex > 0 && currentStepIndex < 4" :class="{ 'q-ml-md': $q.screen.gt.xs, 'q-mt-sm': $q.screen.lt.xs || $q.screen.xs }" no-caps rounded unelevated label="Go cast your vote!" color="white" text-color="primary" :to="{ name: 'upvote-election' }")
          q-btn.q-px-lg.h-btn1(v-if="currentStepIndex === 4" :class="{ 'q-ml-md': $q.screen.gt.xs, 'q-mt-sm': $q.screen.lt.xs || $q.screen.xs }" no-caps rounded unelevated label="Check results" color="white" text-color="primary" :to="{ name: 'upvote-election' }")

  base-banner(
    :compact="!$q.screen.gt.sm"
    :split="$q.screen.gt.md"
    v-bind="welcomeBanner"
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

  section.q-mt-md.grid
    metric-link(
      :amount="activeAssignmentsCount || '...'"
      :link="{ link: 'search', query: { q: '', filter: 'Active', type: '4' } }"
      :style="{'grid-area': 'assignments'}"
      title="Assignments"
    )
    metric-link(
      :amount="activeBadgesCount || '...'"
      :link="{ link: 'organization/assets', params: { type: 'badge' } }"
      :style="{'grid-area': 'badges'}"
      title="Badges"
    )
    metric-link(
      :amount="activeMembersCount || '...'"
      :link="{ link: 'members', params: { } }"
      :style="{'grid-area': 'members'}"
      title="Members"
    )
    metric-link(
      :amount="activeProposalsCount || '...'"
      :link="{ link: 'proposals', params: { } }"
      :style="{'grid-area': 'proposals'}"
      title="Proposals"
    )
    new-members(
      :members="daoMembers || '...'"
      :style="{'grid-area': 'new'}"
    )
    support-widget(
      :documentationButtonText="daoSettings.documentationButtonText"
      :documentationURL="daoSettings.documentationURL"
      :socialChat="daoSettings.socialChat"
      :style="{'grid-area': 'support'}"
    )
    how-it-works(:style="{'grid-area': 'how'}")

</template>

<style lang="stylus" scoped>
.grid
  display: grid;
  grid-column-gap: $space-md.x;
  grid-row-gap: $space-md.y;
  min-height: 0;
  min-width: 0;

  @media (max-width: $breakpoint-lg-max)
    grid-template-columns: repeat(4, 1fr) 2fr;
    grid-template-rows: minmax(0, 1fr);
    grid-template-areas "assignments badges members proposals new new"\
                        "support support how how new new"

  @media (max-width: $breakpoint-md-max)
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: minmax(0, 1fr);
    grid-template-areas "assignments badges members proposals"\
                        "new new new new"\
                        "support support how how"

  @media (max-width: $breakpoint-xs-max)
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: minmax(0, 1fr);
    grid-template-areas "assignments badges"\
                        "members proposals"\
                        "new new"\
                        "support support"\
                        "how how"
</style>
