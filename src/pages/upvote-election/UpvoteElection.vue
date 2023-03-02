<script>
import CONFIG from './config.json'
import { mapGetters } from 'vuex'
export default {
  name: 'upvote-election',
  components: {
    Widget: () => import('~/components/common/widget.vue'),
    CreationStepper: () => import('~/components/proposals/creation-stepper.vue'),
    StepSignUp: () => import('./steps/StepSignUp.vue'),
    StepRound1: () => import('./steps/StepRound1.vue'),
    StepChiefDelegates: () => import('./steps/StepChiefDelegates.vue'),
    StepHeadDelegate: () => import('./steps/StepHeadDelegate.vue'),
    StepResults: () => import('./steps/StepResults.vue'),
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue')
  },
  data () {
    return {
      config: Object.freeze(CONFIG),
      counterdown: undefined,
      delegates: 50,
      headDelegate: 1,
      upvoteElectionData: {},
      selectedUsers: [],
      votedUsers: [],
      votingState: false
    }
  },
  apollo: {
    upvoteElectionQuery: {
      query: require('~/query/upvote-election-data.gql'),
      update: data => {
        return {
          currentRound: data.getDao.ongoingelct[0]?.currentround[0].details_type_s,
          nextRound: data.getDao.ongoingelct[0]?.currentround[0].nextround,
          upcomingElection: data.getDao.upcomingelct,
          endTime: data.getDao.ongoingelct[0]?.currentround[0]?.details_endDate_t,
          startTime: data.getDao.upcomingelct[0]?.details_startDate_t,
          totalVotersProgressPercentage: data.getDao.voterAggregate.count / data.getDao.ongoingelct[0]?.currentround[0]?.candidate[0]?.voteAggregate.count,
          votersBadgeCount: data.getDao.voterAggregate.count,
          delegatesBadgeCount: data.getDao.ongoingelct[0]?.currentround[0].candidateAggregate.count,
          previousRounds: data.getDao.previouselct[0]?.round,
          totalDelegatesCount: data.getDao.delegateAggregate.count,
          candidates: data.getDao.ongoingelct[0]?.currentround[0]?.candidate,
          currentRoundDocId: data.getDao.ongoingelct[0]?.currentround[0]?.docId,
          passingCount: data.getDao.ongoingelct[0]?.currentround[0]?.details_passingCount_i
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
          startTime: data.data.getDao.upcomingelct[0]?.details_startDate_t,
          totalVotersProgressPercentage: data.data.getDao.ongoingelct[0]?.currentround[0]?.candidate[0]?.voteAggregate.count ? data.data.getDao.ongoingelct[0]?.currentround[0]?.candidate[0]?.voteAggregate.count : 0,
          votersBadgeCount: data.data.getDao.voterAggregate.count,
          delegatesBadgeCount: data.data.getDao.ongoingelct[0]?.currentround[0].candidateAggregate.count,
          previousRounds: data.data.getDao.previouselct[0]?.round,
          totalDelegatesCount: data.data.getDao.delegateAggregate.count,
          candidates: data.data.getDao.ongoingelct[0]?.currentround[0]?.candidate,
          currentRoundDocId: data.data.getDao.ongoingelct[0]?.currentround[0]?.docId,
          passingCount: data.data.getDao.ongoingelct[0]?.currentround[0]?.details_passingCount_i
        }
      }
    },
    upvoteElectionVotedUsers: {
      query: require('~/query/upvote-election-voted-users.gql'),
      update: data => { return data },
      variables () {
        return {
          roundId: this.upvoteElectionData.currentRoundDocId,
          account: this.account
        }
      },
      subscribeToMore: {
        document: require('~/query/upvote-election-voted-users-subs.gql'),
        variables () {
          return {
            roundId: this.upvoteElectionData.currentRoundDocId,
            account: this.account
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
      skip () { return !this.upvoteElectionData.currentRoundDocId || !this.account },
      result (data) {
        data.data.getMember.elctngroup[0]?.vote.forEach(user => {
          if (!this.votedUsers.includes(user.details_member_n)) {
            this.votedUsers.push(user.details_member_n)
          }
        })
      }
    }
  },
  computed: {
    ...mapGetters('dao', ['selectedDao']),
    ...mapGetters('accounts', ['account']),
    stepsBasedOnSelection () {
      const steps = {}

      // Merge step settings in from the selected config
      Object.values(this.config.steps).forEach((step) => {
        steps[step.key] = Object.assign({}, step)
      })

      // Return the steps in order
      return Object.values(steps).sort((a, b) => a.index - b.index)
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
        await this.$apollo.queries.upvoteElectionQuery.refetch()
        await this.$apollo.queries.upvoteElectionVotedUsers.refetch()
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
      await this.$apollo.queries.upvoteElectionQuery.refetch()
      await this.$apollo.queries.upvoteElectionVotedUsers.refetch()
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
      await this.$apollo.queries.upvoteElectionQuery.refetch()
      await this.$apollo.queries.upvoteElectionVotedUsers.refetch()
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
      q-card.widget.full-width.q-pa-xl.relative-position.rounded(flat)
        .row.items-center.q-mb-md
          .row.items-center.q-mr-md
            img(src="/svg/check-to-slot.svg" width="18px" height="14px")
            .h-h4.text-bold.q-ml-sm {{ stepsBasedOnSelection[currentStepIndex].label }}
            .font-lato.text-h-grey.q-ml-sm.text-weight-600(v-if="currentStepIndex === 1" :style="{ 'font-size': '18px' }") {{ `Passing: ${this.upvoteElectionData.passingCount} Delegates` }}
            .font-lato.text-h-grey.q-ml-sm.text-weight-600(v-if="currentStepIndex === 2" :style="{ 'font-size': '18px' }") {{ `Passing: ${this.upvoteElectionData.passingCount} Chief Delegates` }}
            .font-lato.text-h-grey.q-ml-sm.text-weight-600(v-if="currentStepIndex === 3" :style="{ 'font-size': '18px' }") {{ `Passing: ${this.upvoteElectionData.passingCount} Head Delegate` }}
          .counter(v-if="currentStepIndex !== 4")
            .title Time left:
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
              .row.items-end
                .seconds {{ formatTimeLeft().sec }}
                .subtext(v-if="formatTimeLeft().sec > 1") secs
                .subtext(v-else) sec
        template(v-if="this.$apollo.queries.upvoteElectionQuery.loading || this.$apollo.queries.upvoteElectionVotedUsers.loading")
          .flex.full-width.justify-center
            loading-spinner(
              color="primary"
              size="56px"
            )
        template(v-else v-for="step in stepsBasedOnSelection")
          component(
            v-if="(step.index - 1) === currentStepIndex"
            :is="step.component"
            :step="step"
            :selectedUsers="selectedUsers"
            :votingState="votingState"
            :upvoteElectionData="upvoteElectionData"
            :currentElectionIndex="currentStepIndex"
            :votedUsers="votedUsers"
            @selectUser="selectUser"
          )
    .col-3.q-pl-md
      widget.q-pa-xxl.bg-secondary.q-mb-md(v-if="selectedUsers.length || votedUsers.length" rounded)
        .h-h4.text-white Cast your vote
        .text-white.q-my-md Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
        q-btn.q-px-lg.h-btn1.full-width(
          @click="vote"
          color="white"
          :label="votingState ? 'Revert / Change' : 'Vote!'"
          no-caps
          rounded
          text-color="primary"
          unelevated
        )
      creation-stepper.sticky(
        :steps="stepsBasedOnSelection"
        :activeStepIndex="currentStepIndex"
        title="Election process"
      )
</template>

<style lang="sass" scoped>
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
