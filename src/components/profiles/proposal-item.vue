<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'proposal-item',
  components: {
    AssignmentClaimExtend: () => import('../assignments/assignment-claim-extend.vue'),
    AssignmentHeader: () => import('../assignments/assignment-header.vue'),
    ContributionHeader: () => import('../contributions/contribution-header.vue'),
    // AssignmentSuspend: () => import('./assignment-suspend.vue'),
    // AssignmentWithdraw: () => import('./assignment-withdraw.vue'),
    PeriodCalendar: () => import('../assignments/period-calendar.vue'),
    Salary: () => import('../assignments/salary.vue'),
    Widget: () => import('../common/widget.vue'),
    VotingResult: () => import('../proposals/voting-result.vue')
  },

  props: {
    background: {
      type: String,
      default: 'grey-3'
    },
    proposal: undefined,
    expandable: Boolean,
    owner: Boolean,
    now: {
      type: Date,
      default: () => new Date()
    }
  },

  data () {
    return {
      expanded: false,
      newCommit: undefined,
      newDeferred: undefined,
      periods: undefined,
      claiming: false,
      committing: false,
      suspending: false,
      withdrawing: false,
      assignment: undefined,
      contribution: undefined,
      expired: false,
      voting: undefined
    }
  },

  computed: {
    ...mapGetters('dao', ['selectedDao', 'daoSettings']),
    ...mapGetters('ballots', ['supply']),
    claims () {
      if (this.assignment?.periods) {
        return this.assignment.periods.reduce((result, p) => {
          if (!p.claimed && p.end < this.now) {
            return result + 1
          }
          return result
        }, 0)
      }
      return 0
    },
    proposed () {
      return this.proposal.details_state_s === 'proposed'
    },
    type () {
      return this.proposal.__typename
    },
    colorConfig () {
      const config = {
        progress: '',
        icons: '',
        text: {}
      }

      if (this.expired) {
        config.progress = config.icons = 'white'
        config.text['text-white'] = true
        return config
      }

      if (this.voting.unity > 0) {
        config.progress = config.icons = 'positive'
        config.text['text-positive'] = true
        return config
      }

      return undefined
    },
    colorConfigQuorum () {
      const config = {
        progress: '',
        icons: '',
        text: {}
      }

      if (this.expired) {
        config.progress = config.icons = 'white'
        config.text['text-white'] = true
        return config
      }

      return undefined
    }
  },

  watch: {
    proposal: {
      handler: async function (proposal) {
        if (proposal) {
          if (this.type === 'Assignment') {
            this.assignment = await this.parseAssignment(proposal)
            this.newCommit = this.assignment.commit.value
            this.newDeferred = this.assignment.deferred.value
            this.periods = this.assignment.periods
          } else if (this.type === 'Payout') {
            this.contribution = await this.parseContribution(proposal)
          }
          if (this.proposed) {
            console.log('Proposal is proposed', proposal)
            this.voting = this.calculateVoting(proposal)
          }
        }
      },
      immediate: true
    }
  },

  methods: {
    ...mapActions('assignments', ['claimAssignmentPayment', 'adjustCommitment', 'adjustDeferred', 'suspendAssignment', 'withdrawFromAssignment']),
    // TODO: Move this to a mixin
    calculateVoting (proposal) {
      if (proposal && proposal.votetally && proposal.votetally.length) {
        const abstain = parseFloat(proposal.votetally[0].abstain_votePower_a)
        const pass = parseFloat(proposal.votetally[0].pass_votePower_a)
        const fail = parseFloat(proposal.votetally[0].fail_votePower_a)
        const unity = (pass + fail > 0) ? pass / (pass + fail) : 0
        const quorum = this.supply > 0 ? (abstain + pass + fail) / this.supply : 0
        return {
          unity,
          quorum
        }
      }
      return {
        unity: 0,
        quorum: 0
      }
    },
    parseContribution (data) {
      return {
        owner: this.username,
        created: new Date(data.createdDate),
        recipient: data.details_recipient_n,
        title: data.details_title_s,
        state: data.details_state_s,
        docId: data.docId
      }
    },
    async parseAssignment (data) {
      let periodCount = 0
      let periodResponse = []
      let deferred = { value: 0, min: 0, max: 0 }
      let commit = { value: 0, min: 0, max: 0 }
      let periods = []
      let start
      let lastEnd

      if (data.details_state_s !== 'proposed') {
        periodCount = data.details_periodCount_i
        periodResponse = await this.$apollo.query({
          query: require('../../query/periods/dao-periods-range.gql'),
          variables: {
            daoId: this.selectedDao.docId,
            min: data.start[0].details_startTime_t,
            max: new Date(new Date(data.start[0].details_startTime_t).getTime() +
              (data.details_periodCount_i * this.daoSettings.periodDurationSec * 1000)).toISOString()
          }
        })
        periodResponse = periodResponse.data.getDao.period.map((value, index) => {
          return {
            docId: value.docId,
            label: value.details_startTime_t,
            phase: value.details_label_s,
            startDate: value.details_startTime_t,
            endDate: periodResponse.data.getDao.period[index + 1]?.details_startTime_t
          }
        })
        // Calculate start and end time for all periods
        start = new Date(periodResponse[0].startDate)

        // Add the periods
        periods = []
        for (let i = 0; i < periodCount; i += 1) {
          const claimed = data.claimed
            ? data.claimed.some(c => c.docId === periodResponse[i].docId)
            : false
          periods.push({
            start: new Date(periodResponse[i].startDate),
            end: new Date(periodResponse[i].endDate),
            title: ['First Quarter', 'Full Moon', 'New Moon', 'Last Quarter'].includes(periodResponse[i].phase)
              ? periodResponse[i].phase
              : 'First Quarter',
            claimed: claimed
          })
        }

        // Add the assignment
        commit = { value: 0, min: 0, max: data.details_timeShareX100_i }
        if (data.lastimeshare) {
          commit.value = data.lastimeshare[0].details_timeShareX100_i
        }
        deferred = {
          value: data.details_deferredPercX100_i,
          min: data.details_approvedDeferredPercX100_i || data.details_deferredPercX100_i,
          max: 100
        }
        lastEnd = periods[periods.length - 1].end
      }

      // To ensure no disruption in assignment, an extension must be
      // created more than 1 voting period before it expires
      const VOTE_DURATION = this.daoSettings.votingDurationSeconds * 1000
      return {
        state: data.details_state_s,
        owner: this.username,
        docId: data.docId,
        start,
        end: lastEnd,
        active: start < Date.now() && lastEnd > Date.now(),
        past: lastEnd < Date.now(),
        future: start > Date.now(),
        periods,
        extend: {
          start: new Date(lastEnd - 3 * VOTE_DURATION),
          end: new Date(lastEnd - VOTE_DURATION)
        },
        title: data.details_title_s || data.role[0].details_title_s,
        description: data.details_description_s,
        commit,
        deferred,
        usdEquivalent: Number.parseFloat(data.role[0].details_annualUsdSalary_a),

        // Needed for 'extend' functionality
        minDeferred: data.role[0].details_minDeferredX100_i,
        roleTitle: data.role[0].details_title_s,
        startPeriod: periodResponse[0],
        url: undefined
      }
    },

    onClick () {
      if (this.owner) {
        if (this.expandable) {
          this.expanded = !this.expanded
        }
      }
      this.$emit('onClick')
    },

    async onClaimAll () {
      this.claiming = true
      let error = false
      let i = 0
      const numClaims = this.claims
      while (!error && i < numClaims) {
        error = !(await this.claimAssignmentPayment(this.assignment.docId))
        if (!error) {
          this.periods.find(p => !p.claimed).claimed = true
          i += 1
          // We need to wait briefly between transactions to avoid 'duplicate' error
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }
      this.claiming = false
      this.$emit('claim-all')
    },

    async onExtend () {
      this.$router.push({
        name: 'proposal-create'
      })
    },

    async onDynamicCommit (value) {
      this.committing = true
      if (await this.adjustCommitment({ hash: this.assignment.hash, commitment: value })) {
        this.newCommit = value
      }
      this.committing = false
    },

    async onDynamicDeferred (value) {
      this.committing = true
      if (await this.adjustDeferred({ hash: this.assignment.hash, deferred: value })) {
        this.newDeferred = value
        this.$emit('change-deferred', value)
      }
      this.committing = false
    },

    async onSuspend (reason) {
      this.suspending = true
      if (await this.suspendAssignment({ hash: this.assignment.hash, reason })) {
        if (this.$router.currentRoute.path !== '/documents-proposal/assignment') {
          await this.$router.push({ path: '/documents-proposal/assignment' })
        }
      }
      this.suspending = false
    },

    async onWithdraw (notes) {
      this.withdrawing = true
      if (await this.withdrawFromAssignment({ hash: this.assignment.hash, notes })) {
        // TODO: Update assignment to say 'Withdrawn' ??
      }
      this.withdrawing = false
    }
  }
}
</script>

<template lang="pug">
widget(noPadding :background="background" :class="{ 'cursor-pointer': owner || proposed }" @click.native="(owner || proposed) && onClick()").q-px-sm
  .flex.justify-center(:class="{item: !expandable, 'item-expandable': expandable}")
    contribution-header.q-px-lg(
      v-if="contribution"
      v-bind="contribution"
      :claiming="claiming"
      :expanded="expanded"
      :owner="owner"
      :show-buttons="owner"
      @claim-all="onClaimAll"
    )
      template(v-slot:right)
        .q-mt-md(v-if="$q.screen.sm")
        voting-result(v-if="proposed" v-bind="voting" :colorConfig="colorConfig" :colorConfigQuorum="colorConfigQuorum")
        q-btn.q-mr-md.view-proposa-btn(
          v-if="!owner && !proposed"
          label="View proposal"
          color="primary"
          rounded
          unelevated
          no-caps
          outline
          @click="onClick"
        )
    assignment-header.q-px-lg(
      v-if="assignment"
      v-bind="assignment"
      calendar
      :claims="claims"
      :claiming="claiming"
      :commit="{ min: assignment.commit.min, value: newCommit, max: assignment.commit.max }"
      :deferred="{ min: assignment.deferred.min, value: newDeferred, max: assignment.deferred.max }"
      :periods="periods"
      :expanded="expanded"
      :moons="true"
      :owner="owner"
      @claim-all="onClaimAll"
      @extend="onExtend"
    )
      template(v-slot:right)
        .q-mt-md(v-if="$q.screen.sm")
        voting-result(v-if="proposed" v-bind="voting" :colorConfig="colorConfig" :colorConfigQuorum="colorConfigQuorum")
        assignment-claim-extend(
          v-if="!future && owner && !proposed"
          :claims="claims"
          :claiming="claiming"
          :extend="extend"
          :stacked="true"
          @claim-all="$emit('claim-all')"
          @extend="$emit('extend')"
        )
        q-btn.q-mr-md.view-proposa-btn(
          v-if="!owner && !proposed"
          label="View proposal"
          color="primary"
          rounded
          unelevated
          no-caps
          outline
          @click="onClick"
        )

    .row.justify-center(v-if="owner && expandable")
      q-icon.expand-icon(:name="'fas fa-chevron-down' + (expanded ? ' fa-rotate-180' : '')" color="grey-7")
</template>

<style lang="stylus" scoped>
.expand-icon
  margin-top 16px
  margin-bottom -12px
  transition transform 0.5s
.item
  height: 143px
.item-expandable
  min-height 170px
  height auto
  padding 24px 0
</style>
