<script>
import { mapGetters } from 'vuex'
import I18n from '~/utils/i18n'
import { dateToStringShort } from '~/utils/TimeUtils'
export default {
  name: 'upvote-election',
  components: {
    Widget: () => import('~/components/common/widget.vue'),
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue'),
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue')
  },
  data () {
    return {
      dateToStringShort,
      I18n,
      counterdown: undefined,
      delegates: 50,
      headDelegate: 1,
      upvoteElectionData: {},
      selectedUsers: [],
      votedUsers: [],
      votingState: false,
      upvoteWidgetState: 'signup',
      upvoteTimeRemaining: '',
      roundTimeRemaining: '',
      endDate: 'August 20, 2023 19:00:00', // TODO: waiting API
      isRegister: false, // TODO: waiting API
      endRoundTime: 'August 18, 2023 14:00:00', // TODO: waiting API
      waitingTime: 'August 18, 2023 14:00:00', // TODO: waiting API
      displacements: { // TODO: waiting API
        headChiefDelegate: 2.528,
        chiefDelegate: 1.731,
        delegateL2: 512,
        delegateL1: 326
      },
      participants: 126, // TODO: waiting API
      treasury: 34560, // TODO: waiting API
      roundTime: 50, // TODO: waiting API
      showApplications: false,
      applications: [ // TODO: waiting API
        {
          account: 'accountname',
          fullName: 'Howard S. Lowe',
          telegram: 'telegramhandle',
          joinDate: 'July 14, 2023'
        },
        {
          account: 'accountname',
          fullName: 'Howard S. Lowe',
          telegram: 'telegramhandle',
          joinDate: 'July 14, 2023'
        },
        {
          account: 'accountname',
          fullName: 'Howard S. Lowe',
          telegram: 'telegramhandle',
          joinDate: 'July 14, 2023'
        },
        {
          account: 'accountname',
          fullName: 'Howard S. Lowe',
          telegram: 'telegramhandle',
          joinDate: 'July 14, 2023'
        },
        {
          account: 'accountname',
          fullName: 'Howard S. Lowe',
          telegram: 'telegramhandle',
          joinDate: 'July 14, 2023'
        },
        {
          account: 'accountname',
          fullName: 'Howard S. Lowe',
          telegram: 'telegramhandle',
          joinDate: 'July 14, 2023'
        },
        {
          account: 'accountname',
          fullName: 'Howard S. Lowe',
          telegram: 'telegramhandle',
          joinDate: 'July 14, 2023'
        }
      ],
      page: 1
    }
  },
  apollo: {
    // upvoteElectionQuery: {
    //   query: require('~/query/upvote-election-data.gql'),
    //   update: data => {
    //     return {
    //       currentRound: data.getDao.ongoingelct[0]?.currentround[0].details_type_s,
    //       nextRound: data.getDao.ongoingelct[0]?.currentround[0].nextround,
    //       upcomingElection: data.getDao.upcomingelct,
    //       endTime: data.getDao.ongoingelct[0]?.currentround[0]?.details_endDate_t,
    //       startTime: data.getDao.upcomingelct[0]?.details_startDate_t,
    //       totalVotersProgressPercentage: data.getDao.voterAggregate.count / data.getDao.ongoingelct[0]?.currentround[0]?.candidate[0]?.voteAggregate.count,
    //       votersBadgeCount: data.getDao.voterAggregate.count,
    //       delegatesBadgeCount: data.getDao.ongoingelct[0]?.currentround[0].candidateAggregate.count,
    //       previousRounds: data.getDao.previouselct[0]?.round,
    //       totalDelegatesCount: data.getDao.delegateAggregate.count,
    //       candidates: data.getDao.ongoingelct[0]?.currentround[0]?.candidate,
    //       currentRoundDocId: data.getDao.ongoingelct[0]?.currentround[0]?.docId,
    //       passingCount: data.getDao.ongoingelct[0]?.currentround[0]?.details_passingCount_i,
    //       currentVotedAggregateCount: data.getDao.ongoingelct[0]?.currentround[0]?.votedAggregate.count
    //     }
    //   },
    //   variables () {
    //     return {
    //       daoName: this.selectedDao.name
    //     }
    //   },
    //   subscribeToMore: {
    //     document: require('~/query/upvote-election-data-subs.gql'),
    //     variables () {
    //       return {
    //         daoName: this.selectedDao.name
    //       }
    //     },
    //     updateQuery: (previousResult, { subscriptionData }) => {
    //       if (!subscriptionData.data) {
    //         return previousResult
    //       }
    //       if (!previousResult) {
    //         return undefined
    //       }
    //       return {
    //         ...previousResult,
    //         ...subscriptionData
    //       }
    //     }
    //   },
    //   result (data) {
    //     this.upvoteElectionData = {
    //       currentRound: data.data.getDao.ongoingelct[0]?.currentround[0].details_type_s,
    //       nextRound: data.data.getDao.ongoingelct[0]?.currentround[0].nextround,
    //       upcomingElection: data.data.getDao.upcomingelct,
    //       endTime: data.data.getDao.ongoingelct[0]?.currentround[0].details_endDate_t,
    //       startTime: data.data.getDao.upcomingelct[0]?.details_startDate_t,
    //       totalVotersProgressPercentage: data.data.getDao.ongoingelct[0]?.currentround[0]?.candidate[0]?.voteAggregate.count ? data.data.getDao.ongoingelct[0]?.currentround[0]?.candidate[0]?.voteAggregate.count : 0,
    //       votersBadgeCount: data.data.getDao.voterAggregate.count,
    //       delegatesBadgeCount: data.data.getDao.ongoingelct[0]?.currentround[0].candidateAggregate.count,
    //       previousRounds: data.data.getDao.previouselct[0]?.round,
    //       totalDelegatesCount: data.data.getDao.delegateAggregate.count,
    //       candidates: data.data.getDao.ongoingelct[0]?.currentround[0]?.candidate,
    //       currentRoundDocId: data.data.getDao.ongoingelct[0]?.currentround[0]?.docId,
    //       passingCount: data.data.getDao.ongoingelct[0]?.currentround[0]?.details_passingCount_i,
    //       currentVotedAggregateCount: data.data.getDao.ongoingelct[0]?.currentround[0]?.votedAggregate.count
    //     }
    //   }
    // },
    // upvoteElectionVotedUsers: {
    //   query: require('~/query/upvote-election-voted-users.gql'),
    //   update: data => { return data },
    //   variables () {
    //     return {
    //       roundId: this.upvoteElectionData.currentRoundDocId,
    //       account: this.account
    //     }
    //   },
    //   subscribeToMore: {
    //     document: require('~/query/upvote-election-voted-users-subs.gql'),
    //     variables () {
    //       return {
    //         roundId: this.upvoteElectionData.currentRoundDocId,
    //         account: this.account
    //       }
    //     },
    //     updateQuery: (previousResult, { subscriptionData }) => {
    //       if (!subscriptionData.data) {
    //         return previousResult
    //       }
    //       if (!previousResult) {
    //         return undefined
    //       }
    //       return {
    //         ...previousResult,
    //         ...subscriptionData
    //       }
    //     }
    //   },
    //   skip () { return !this.upvoteElectionData.currentRoundDocId || !this.account },
    //   result (data) {
    //     data.data.getMember.elctngroup[0]?.vote.forEach(user => {
    //       if (!this.votedUsers.includes(user.details_member_n)) {
    //         this.votedUsers.push(user.details_member_n)
    //       }
    //     })
    //   }
    // }
  },
  computed: {
    ...mapGetters('dao', ['selectedDao']),
    ...mapGetters('accounts', ['account']),

    widgetTitle() {
      if (this.upvoteWidgetState === 'signup' && this.isRegister) {
        return this.I18n.t('pages.upvote-election.upvoteelection.thanksForRegistering')
      } else if (this.upvoteWidgetState === 'signup') {
        return this.I18n.t('pages.upvote-election.upvoteelection.signUpForThisElection')
      } else if (this.upvoteWidgetState === 'finish') {
        return this.I18n.t('pages.upvote-election.upvoteelection.displacements')
      }
      return ''
    },

    widgetDescription() {
      if (this.upvoteWidgetState === 'signup' && this.isRegister) {
        return this.I18n.t('pages.upvote-election.upvoteelection.theElectionIsAboutToStart')
      } else if (this.upvoteWidgetState === 'active') {
        return this.I18n.t('pages.upvote-election.upvoteelection.youCanVote')
      } else if (this.upvoteWidgetState === 'waiting') {
        return this.I18n.t('pages.upvote-election.upvoteelection.wellDone')
      }
      return ''
    },

    paginatedApplications () {
      return this.applications.slice((this.page - 1) * 5, this.page * 5)
    },

    isLastPage () {
      if (this.pages === 0) return true
      return this.page === this.pages
    },

    pages () {
      return Math.ceil(this.applications.length / 5)
    }
  },
  methods: {
    onPrev () {
      this.page--
    },

    onNext () {
      this.page++
    },

    votingTimeLeft () {
      // const end = this.upvoteElectionData.upcomingElection?.length ? new Date(this.upvoteElectionData.startTime) : new Date(this.upvoteElectionData.endTime)
      const end = this.upvoteWidgetState === 'signup' ? new Date(this.endDate) : this.upvoteWidgetState === 'active' ? new Date(this.endRoundTime) : new Date(this.waitingTime)
      const now = Date.now()
      const t = end - now
      // if (t < 0) {
      //   this.$apollo.queries.upvoteElectionQuery.refetch()
      // }
      return t
    },

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
        this.roundTimeRemaining = {
          days: days,
          hours: hours,
          mins: min,
          sec: sec
        }
        this.upvoteTimeRemaining = {
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
    selectUser (user) {
      const existedUser = this.selectedUsers.find(compItem => compItem === user)
      if (!existedUser && !this.votingState) {
        this.selectedUsers.push(user)
      } else {
        if (this.selectedUsers.indexOf(existedUser) > -1) {
          this.selectedUsers.splice(this.selectedUsers.indexOf(existedUser), 1)
        }
      }
    },
    async vote () {
      if (!this.votingState) {
        await this.voteTransact()
        this.selectedUsers.length = 0
        // await this.$apollo.queries.upvoteElectionQuery.refetch()
        // await this.$apollo.queries.upvoteElectionVotedUsers.refetch()
      } else {
        this.selectedUsers.length = 0
        this.votedUsers.length = 0
        this.votingState = false
        this.$forceUpdate()
      }
    },

    async voteTransact () {
      const candidatesIds = []
      this.selectedUsers.forEach(user => {
        candidatesIds.push(user.docId)
      })
      const actions = [{
        account: this.$config.contracts.dao,
        name: 'castelctnvote',
        data: {
          round_id: this.upvoteElectionData.currentRoundDocId,
          voter: this.account,
          voted: candidatesIds
        }
      }]
      return await this.$store.$api.signTransaction(actions)
    }

  },
  async mounted () {
    if (!this.upvoteElectionData || !this.votedUsers.length) {
      // await this.$apollo.queries.upvoteElectionQuery.refetch()
      // await this.$apollo.queries.upvoteElectionVotedUsers.refetch()
    }
    this.counterdown = setInterval(() => {
      this.formatTimeLeft()
      this.$forceUpdate()
    }, 1000)
  },
  created () {
    this.counterdown = setInterval(() => {
      this.formatTimeLeft()
      this.$forceUpdate()
    }, 1000)
  },
  async activated () {
    this.counterdown = setInterval(() => {
      this.formatTimeLeft()
      this.$forceUpdate()
    }, 1000)
    if (!this.upvoteElectionData || !this.votedUsers.length) {
      // await this.$apollo.queries.upvoteElectionQuery.refetch()
      // await this.$apollo.queries.upvoteElectionVotedUsers.refetch()
    }
  },
  deactivated () {
    clearInterval(this.counterdown)
  },
  updated () {
    if (this.votedUsers.length) {
      this.votingState = true
    }
  }
}
</script>

<template lang="pug">
.upvote-election
  .row.full-width.q-my-md.q-mt-lg
    .col-9
      q-card.widget.full-width.q-pa-xl.relative-position.rounded-card(flat)
        .title
          .row.flex.items-center.justify-between
            .col.flex.items-center
              q-icon(name="fas fa-users")
              .h-h4.q-ml-md {{ $t('pages.upvote-election.applications') }}
            q-btn(@click="showApplications = !showApplications" flat rounded :icon="showApplications ? 'fas fa-chevron-up' : 'fas fa-chevron-down'")
          .row.q-mt-md {{ $t('pages.upvote-election.youCanViewTheMembersWho') }}
          .row.q-mt-md.q-gutter-sm
            .col
              q-card.rounded-card.q-pa-xl.applications-metric
                .row.flex.items-center
                  .col-2
                    q-icon(name="fas fa-users" size="24px")
                  .col.q-ml-sm
                    .row
                      .h-h4 {{ participants }}
                    .row {{ $t('pages.upvote-election.participants') }}
            .col
              q-card.rounded-card.q-pa-xl.applications-metric
                .row.flex.items-center
                  .col-2
                    q-icon(name="fas fa-university" size="24px")
                  .col.q-ml-sm
                    .row
                      .h-h4 $ {{ treasury }}
                    .row {{ $t('pages.upvote-election.treasury') }}
            .col
              q-card.rounded-card.q-pa-xl.applications-metric
                .row.flex.items-center
                  .col-2
                    q-icon(name="far fa-clock" size="24px")
                  .col.q-ml-sm
                    .row
                      .h-h4 {{ roundTime }} {{ $t('pages.upvote-election.upvoteelection.min') }}
                    .row {{ $t('pages.upvote-election.eachRound') }}
          q-slide-transition
            div.q-my-xl.q-pt-xl(v-show="showApplications" :style="{ 'border-top': '1px solid #CBCDD1'}")
              template(v-if="paginatedApplications.length")
                .row.q-mb-sm.applicant-row.q-pa-xs(v-for="applicant in paginatedApplications")
                  .col-1
                    profile-picture(:username="applicant.account" size="24px" :key="applicant")
                  .col
                    .text-bold {{ applicant.fullName }}
                  .col @{{ applicant.account }}
                  .col
                    .row.flex.items-center
                      q-icon(name="fas fa-paper-plane" size="12px")
                      .q-ml-xs {{ applicant.telegram }}
                  .col Member since {{ dateToStringShort(applicant.joinDate) }}
                .row.justify-between.q-pt-sm.items-center
                  q-btn(:disable="page === 1" @click="onPrev()" flat rounded icon="fas fa-chevron-left")
                  .row.flex.items-center
                    div.q-ml-xs(v-for="dot, index in pages" :style="{'width': '10px', 'height': '10px', 'background': '#CAC8B0', 'border-radius': '50%'}" :class="{ 'bg-primary': index === page - 1}")
                  q-btn(:disable="isLastPage" @click="onNext()" flat rounded icon="fas fa-chevron-right")
    .col-3.q-pl-md
      widget.q-pa-xxl.bg-primary.q-mb-md(:class="{ 'bg-secondary': upvoteWidgetState === 'waiting' }")
        template(v-if="upvoteWidgetState !== 'active' && upvoteWidgetState !== 'waiting'")
          .h-h4.text-white.q-mb-md {{ widgetTitle }}
        template(v-else-if="upvoteWidgetState === 'active'")
          .row.items-center.q-mb-md
            .h-h4.text-white {{ roundTimeRemaining.mins }}
            .h-h4.q-mx-xxs.text-white(v-if="roundTimeRemaining.mins > 1") {{ $t('pages.upvote-election.upvoteelection.mins') }}
            .h-h4.q-mx-xxs.text-white(v-else) {{ $t('pages.upvote-election.upvoteelection.min') }}
            .h-h4.q-mr-xxs.text-white(v-if="!roundTimeRemaining.days > 0") :
            .h-h4.text-white {{ roundTimeRemaining.sec }}
            .h-h4.q-mx-xxs.text-white(v-if="roundTimeRemaining.sec > 1") {{ $t('pages.upvote-election.upvoteelection.sec') }}
            .h-h4.q-mx-xxs.text-white(v-else) {{ $t('pages.upvote-election.upvoteelection.sec') }}
            .h-h4.text-white.text-weight-400 {{ $t('pages.upvote-election.upvoteelection.left') }}
        template(v-else-if="upvoteWidgetState === 'waiting'")
          .row.q-mb-md
            .h-h4.text-white {{ roundTimeRemaining.sec }}
            .h-h4.q-mx-xxs.text-white(v-if="roundTimeRemaining.sec > 1") {{ $t('pages.upvote-election.upvoteelection.sec') }}
            .h-h4.q-mx-xxs.text-white(v-else) {{ $t('pages.upvote-election.upvoteelection.sec') }}
            .h-h4.text-white.text-weight-400 {{ $t('pages.upvote-election.upvoteelection.toNextRound') }}
        .text-white.q-mb-md {{ widgetDescription }}
        template(v-if="upvoteWidgetState === 'finish'")
          .row.q-mb-md.flex.items-center
            .col-2.flex.items-center.justify-center
              img(src="~/assets/icons/head-chief.svg")
            .col.text-white.q-ml-xs {{ $t('pages.upvote-election.upvoteelection.headChiefDelegate') }}
            .col-3.flex.items-center.justify-end.text-white $ {{ displacements.headChiefDelegate }}
          .row.q-mb-md.flex.items-center
            .col-2.flex.items-center.justify-center
              img(src="~/assets/icons/chief-delegate.svg")
            .col.text-white.q-ml-xs {{ $t('pages.upvote-election.upvoteelection.chiefDelegate') }}
            .col-3.flex.items-center.justify-end.text-white $ {{ displacements.chiefDelegate }}
          .row.q-mb-md.flex.items-center
            .col-2.flex.items-center.justify-center
              img(src="~/assets/icons/delegate-l2.svg")
            .col.text-white.q-ml-xs {{ $t('pages.upvote-election.upvoteelection.delegatel2') }}
            .col-3.flex.items-center.justify-end.text-white $ {{ displacements.delegateL2 }}
          .row.q-mb-md.flex.items-center
            .col-2.flex.items-center.justify-center
              img(src="~/assets/icons/delegate-l1.svg")
            .col.text-white.q-ml-xs {{ $t('pages.upvote-election.upvoteelection.delegatel1') }}
            .col-3.flex.items-center.justify-end.text-white $ {{ displacements.delegateL1 }}
        template(v-if="!isRegister")
          q-btn.q-px-lg.h-btn1.full-width.q-mb-sm(icon="fas fa-paper-plane" color="white" textColor="grey" :label="$t('pages.upvote-election.upvoteelection.telegramHandle')" no-caps rounded text-color="primary" unelevated)
          q-btn.q-px-lg.h-btn1.full-width(@click="isRegister = true" color="secondary" textColor="white" :label="$t('pages.upvote-election.upvoteelection.signUp')" no-caps rounded text-color="primary" unelevated)
        template(v-else-if="upvoteWidgetState !== 'finish'")
          q-btn.q-px-lg.h-btn1.full-width(@click="upvoteWidgetState = 'active'" outline color="white" textColor="white" :label="$t('pages.upvote-election.upvoteelection.learnMore')" no-caps rounded text-color="primary" unelevated)
        template(v-if="upvoteWidgetState === 'finish'")
          q-btn.q-px-lg.h-btn1.full-width(color="white" textColor="primary" :label="$t('pages.upvote-election.upvoteelection.goToMyBadges')" no-caps rounded text-color="primary" unelevated)
        .timer.row.q-mt-xl.justify-center(v-if="upvoteWidgetState === 'signup'" :style="{ 'color': 'white' }")
          .row.items-center(v-if="upvoteTimeRemaining.days > 0")
            div {{ upvoteTimeRemaining.days }}
            .q-mx-xxs(v-if="upvoteTimeRemaining.days > 1") {{ $t('pages.upvote-election.upvoteelection.days') }} :
            .q-mx-xxs(v-else) {{ $t('pages.upvote-election.upvoteelection.day') }} :
          .row.items-center
            div {{ upvoteTimeRemaining.hours }}
            .q-mx-xxs(v-if="upvoteTimeRemaining.hours > 1") {{ $t('pages.upvote-election.upvoteelection.hours') }} :
            .q-mx-xxs(v-else) {{ $t('pages.upvote-election.upvoteelection.hour') }} :
          .row.items-center
            div {{ upvoteTimeRemaining.mins }}
            .q-mx-xxs(v-if="upvoteTimeRemaining.mins > 1") {{ $t('pages.upvote-election.upvoteelection.mins') }}
            .q-mx-xxs(v-else) {{ $t('pages.upvote-election.upvoteelection.min') }}
            .q-mr-xxs(v-if="!upvoteTimeRemaining.days > 0") :
          .row.items-center(v-if="!upvoteTimeRemaining.days > 0")
            div {{ upvoteTimeRemaining.sec }}
            .q-mx-xxs(v-if="upvoteTimeRemaining.sec > 1") {{ $t('pages.upvote-election.upvoteelection.sec') }}
            .q-mx-xxs(v-else) {{ $t('pages.upvote-election.upvoteelection.sec') }}
        div(v-if="upvoteWidgetState === 'active'" @click="upvoteWidgetState = 'waiting'") waiting
        div(v-if="upvoteWidgetState === 'waiting'" @click="upvoteWidgetState = 'finish'") finish
</template>

<style lang="sass" scoped>
.applicant-row:hover
  background: #f1f1f3
  border-radius: 15px
.applications-metric
  box-shadow: 0px 0px 16px -3px rgba(34, 60, 80, 0.2)
.rounded-card
  border-radius: 15px

.rounded
  border-radius: 26px
.counter
  display: flex
  font-family: 'Lato', sans-serif
  font-weight: 600
  color: #3F64EE
  font-size: 18px
  .title
    margin-right: 25px
  .time
    .subtext
      font-size: 12px
      padding-bottom: 2px
      margin-right: 4px
</style>
