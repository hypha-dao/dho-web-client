<script>
// import clsx from 'clsx'
import { mapGetters } from 'vuex'
import { date } from 'quasar'
import I18n from '~/utils/i18n'

import ipfsy from '~/utils/ipfsy'

import formatNumber from '~/utils/formatNumber'

const ordersMap = [{ asc: 'createdDate' }, { desc: 'createdDate' }, { asc: 'details_title_s' }]
const UPVOTE_DOC_URL = 'https://help.hypha.earth/hc/2431449449/93/community-voting-method?category_id=42'

export default {
  name: 'dashboard',
  components: {
    BaseBanner: () => import('~/components/common/base-banner.vue'),
    HowItWorks: () => import('~/components/dashboard/how-it-works.vue'),
    Members: () => import('~/components/organization/members.vue'),
    MetricLink: () => import('~/components/dashboard/metric-link.vue'),
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
      query: require('~/query/members/dao-members-count.gql'),
      update: data => data?.getDao?.memberAggregate?.count,
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
        const election = data?.getDao
        const previousElection = election?.previouselct[0]
        const ongoingElection = election?.ongoingelct[0]
        const upcomingElection = election?.upcomingelct[0]
        const currentRound = ongoingElection?.currentround[0]

        return {
          isActive: previousElection?.length > 1 || ongoingElection?.length > 1 || upcomingElection?.length > 1,
          currentRound: currentRound?.details_type_s,
          nextRound: currentRound?.nextround,
          startTime: upcomingElection?.details_startDate_t,
          endTime: currentRound?.details_endDate_t,
          upcomingElection
        }
      },
      skip () { return !this.selectedDao || !this.selectedDao?.name },
      variables () { return { daoName: this.selectedDao?.name } }
    }
  },

  data () {
    return {
      formatNumber,
      I18n,
      counterdown: undefined,
      endDate: '2023-08-18',
      pagination: {
        first: 6,
        offset: 0,
        fetchMore: true
      },
      textFilter: null,
      order: ordersMap[0],
      currentUpvoteStep: null,
      UPVOTE_DOC_URL,
      timeRemaining: {},
      participants: 126, // TODO: waiting API
      treasury: 1200000,
      isUpVoteElectionBannerVisible: true // TODO: waiting API
    }
  },

  computed: {
    ...mapGetters('dao', ['daoSettings', 'selectedDao', 'selectedDaoPlan']),

    currentStepIndex () {
      let stepIndex = null
      if (this.upvoteElection?.upcomingElection?.length) {
        stepIndex = 0
      } else if (!this.upvoteElection?.nextRound?.length && this.upvoteElection?.currentRound !== 'head') {
        stepIndex = 4
      } else {
        switch (this.upvoteElection?.currentRound) {
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

    // isUpVoteElectionBannerVisible () {
    //   // TODO: waiting API
    //   // return this.upvoteElection?.isActive
    //   return true
    // },

    isWelcomeBannerVisible () { return true },

    upvoteElectionBanner () {
      return {
        title: this.I18n.t('pages.dho.home.communityElectionsAreAbout'),
        description: this.I18n.t('pages.dho.home.weUseAFairAndInclusive')
      }
    },

    // TODO: waiting API
    // upvoteElectionBanner () {
    //   // TODO: Refactor i18n. $t('title', this.currentStepIndex === 0)
    //   return {
    //     title: clsx({
    //       'Sign up for the election!': this.currentStepIndex === 0,
    //       'The election is on progress': this.currentStepIndex > 0 && this.currentStepIndex < 4,
    //       'The election in completed!': this.currentStepIndex === 4
    //     }),
    //     description: clsx({
    //       'Hello Community members! We are soon running our Upvote Election! It will allow everyone in the AwesomeDAO community to actively participate to decision making and building our cool project together! How does it work? In a nutshell: we will run community proposals that can be voted by delegates badge holders. If you feel like being a delegate, apply now for a badge! If want to just vote your favourite delegates, apply for a voter bade!': this.currentStepIndex === 0,
    //       'Hello Community members! Our Upvote election is up and running! If you signed up for a Voter Badge, click the button below to go express your vote and select the best delegates to represent your ideas in our lorem ipsum dolor sit amet': this.currentStepIndex > 0 && this.currentStepIndex < 4,
    //       'Hurrey! We have our chief delegates and head delegates! go check the results by clicking the link at the bottom!': this.currentStepIndex === 4
    //     }),
    //     header: clsx({
    //       'Upvote Election starting in': this.currentStepIndex === 0,
    //       'Upvote Election started!': this.currentStepIndex > 0 && this.currentStepIndex < 3,
    //       'Upvote Election': this.currentStepIndex > 3
    //     }),
    //     round: clsx({
    //       'Round - 1': this.currentStepIndex === 1,
    //       'Chief Delegate Round': this.currentStepIndex === 2,
    //       'Head Delegate Round': this.currentStepIndex === 3,
    //       'Completed!': this.currentStepIndex !== 0
    //     }),
    //     color: this.daoSettings?.secondaryColor,
    //     gradient: false
    //   }
    // },

    welcomeBanner () {
      return {
        title: this.daoSettings?.dashboardTitle || this.$t('pages.dho.home.welcomeToHyphaEvolution'),
        description: this.daoSettings?.dashboardParagraph || this.$t('pages.dho.home.atHyphaWere'),
        background: ipfsy(this.daoSettings?.dashboardBackgroundImage),
        color: this.daoSettings?.primaryColor,
        pattern: this.daoSettings?.pattern,
        patternColor: this.daoSettings?.patternColor,
        patternAlpha: this.daoSettings?.patternOpacity
      }
    }

  },

  created () {
    if (localStorage.getItem('showUpvoteBanner') === 'false') {
      this.isUpVoteElectionBannerVisible = false
    }
    this.counterdown = setInterval(() => {
      this.formatTimeLeft()
      this.$forceUpdate()
    }, 1000)
    // TODO: waiting API
    // this.$apollo.queries.upvoteElection.refetch()
  },

  beforeDestroy () {
    clearInterval(this.counterdown)
  },

  methods: {
    formatTimeLeft () {
      const MS_PER_DAY = 1000 * 60 * 60 * 24
      const MS_PER_HOUR = 1000 * 60 * 60
      const MS_PER_MIN = 1000 * 60
      const MS = 1000
      const timeRemaining = this.votingTimeLeft()
      if (timeRemaining > 0) {
        const days = Math.floor(timeRemaining / MS_PER_DAY)
        let lesstime = timeRemaining - (days * MS_PER_DAY)
        const hours = Math.floor(lesstime / MS_PER_HOUR)
        lesstime = lesstime - (hours * MS_PER_HOUR)
        const min = Math.floor(lesstime / MS_PER_MIN)
        lesstime = lesstime - (min * MS_PER_MIN)
        const sec = Math.floor(lesstime / MS)
        this.timeRemaining = {
          days: days,
          hours: hours,
          mins: min,
          sec: sec
        }
        return {
          days: days,
          hours: hours,
          mins: min,
          sec: sec
        }
      }
      return 0
    },

    votingTimeLeft () {
      // TODO: waiting API

      // if (!this.upvoteElection) return 0

      // const end = this.upvoteElection?.upcomingElection?.length ? new Date(this.upvoteElection?.startTime) : new Date(this.upvoteElection?.endTime)
      const end = new Date(this.endDate)
      const now = Date.now()
      const t = end - now
      // if (t < 0) {
      //   this.$apollo.queries.upvoteElection.refetch()
      // }
      return t
    },

    hideUpvoteBanner () {
      localStorage.setItem('showUpvoteBanner', false)
      this.isUpVoteElectionBannerVisible = false
    }
  }
}
</script>

<template lang="pug">
q-page.page-dashboard
  base-banner.q-mb-md(v-bind="upvoteElectionBanner" @onClose="hideUpvoteBanner" upvoteBanner :background="require('~/assets/images/election-banner-bg.jpeg')" v-if="isUpVoteElectionBannerVisible")
    template(v-slot:right)
      .flex.full-width.full-height.items-center.justify-center
        q-card.q-pa-xl(:style="{ 'width': '350px', 'opacity': '.7', 'border-radius': '15px' }")
          .col
            .row.full-width.justify-center.q-pb-md(:style="{ 'border-bottom': '1px solid #242f5d'}")
              .row
                .time.row
                  .row.items-center(v-if="timeRemaining.days > 0")
                    .h-h4 {{ timeRemaining.days }}
                    .h-h4.q-mx-xxs(v-if="timeRemaining.days > 1") {{ $t('pages.dho.home.days') }} :
                    .h-h4.q-mx-xxs(v-else) {{ $t('pages.dho.home.day') }} :
                  .row.items-center
                    .h-h4 {{ timeRemaining.hours }}
                    .h-h4.q-mx-xxs(v-if="timeRemaining.hours > 1") {{ $t('pages.dho.home.hours') }} :
                    .h-h4.q-mx-xxs(v-else) {{ $t('pages.dho.home.hour') }} :
                  .row.items-center
                    .h-h4 {{ timeRemaining.mins }}
                    .h-h4.q-mx-xxs(v-if="timeRemaining.mins > 1") {{ $t('pages.dho.home.mins') }}
                    .h-h4.q-mx-xxs(v-else) {{ $t('pages.dho.home.min') }}
                    .h-h4.q-mr-xxs(v-if="!timeRemaining.days > 0") :
                  .row.items-center(v-if="!timeRemaining.days > 0")
                    .h-h4 {{ timeRemaining.sec }}
                    .h-h4.q-mx-xxs(v-if="timeRemaining.sec > 1") {{ $t('pages.dho.home.sec') }}
                    .h-h4.q-mx-xxs(v-else) {{ $t('pages.dho.home.sec') }}
              .row
                .text-secondary {{ $t('pages.dho.home.timeLeftForSigningUp') }}
            .row.q-pt-md
              .col.flex.justify-center(:style="{ 'border-right': '1px solid #242f5d' }")
                .h-h6 {{ participants }}
                .full-width.flex.justify-center.text-secondary {{ $t('pages.dho.home.participants') }}
              .col.flex.justify-center
                .h-h6 $ {{ formatNumber(treasury) }}
                .full-width.flex.justify-center.text-secondary {{ $t('pages.dho.home.treasury') }}
    template(v-slot:buttons)
      .row.justify-start
        .flex(:class=" { 'q-mt-md': $q.screen.lt.md, 'justify-end': $q.screen.gt.sm }")
        router-link(:to="{ name: 'upvote-election' }")
          q-btn.q-px-lg.h-btn1(:class="{ 'q-mt-sm': $q.screen.lt.xs || $q.screen.xs }" no-caps rounded unelevated :label="$t('pages.dho.home.signup')" color="secondary" text-color="white")
          q-btn.q-px-lg.h-btn1.q-ml-sm(color="white" flat :label="$t('pages.dho.home.learnMore')" no-caps rounded)
  base-banner(:compact="!$q.screen.gt.sm" :split="$q.screen.gt.md" v-bind="welcomeBanner" v-if="isWelcomeBannerVisible")
    template(v-slot:buttons)
      router-link(:to="{ name: 'organization' }")
        q-btn.q-px-lg.h-btn1(color="secondary" :label="$t('pages.dho.home.discoverMore')" no-caps rounded unelevated)
  section.q-mt-md.grid
    metric-link(:amount="activeAssignmentsCount || '...'" :link="{ link: 'search', query: { q: '', filter: 'Active', type: '4' } }" :style="{'grid-area': 'assignments'}" :title="$t('pages.dho.home.assignments')")
    metric-link(:amount="activeBadgesCount || '...'" :link="{ link: 'organization/assets', params: { type: 'badge' } }" :style="{'grid-area': 'badges'}" :title="$t('pages.dho.home.badges')")
    metric-link(:amount="activeMembersCount || '...'" :link="{ link: 'members', params: { } }" :style="{'grid-area': 'members'}" :title="$t('pages.dho.home.members')")
    metric-link(:amount="activeProposalsCount || '...'" :link="{ link: 'proposals', params: { } }" :style="{'grid-area': 'proposals'}" :title="$t('pages.dho.home.proposals')")
    members(:title="$t('pages.dho.home.members')" :members="daoMembers || []" :style="{'grid-area': 'new'}")
    support-widget(:documentationButtonText="daoSettings.documentationButtonText" :documentationURL="daoSettings.documentationURL" :socialChat="daoSettings.socialChat" :style="{'grid-area': 'support'}")
    how-it-works(:style="{'grid-area': 'how'}")

</template>

<style lang="stylus" scoped>
.grid
  display: grid;
  grid-column-gap: $space-md.x;
  grid-row-gap: $space-md.y;
  min-height: 0;
  min-width: 0;
  grid-template-columns: repeat(4, 1fr) 2fr;
  grid-template-rows: minmax(0, 1fr);
  grid-template-areas "assignments badges members proposals new new"\
                      "support support how how new new"
  @media (max-width: $breakpoint-md-max)
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: minmax(0, 1fr);
    grid-template-areas "assignments badges"\
                        "members proposals"\
                        "new new"\
                        "support support"\
                        "how how"
</style>
