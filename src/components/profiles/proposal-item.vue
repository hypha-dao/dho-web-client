<script>
import { mapActions, mapGetters } from 'vuex'
import CONFIG from '../../pages/proposals/create/config.json'
import { format } from '../../mixins/format'
import { proposals } from '../../mixins/proposals'
/**
 * A component to display profile proposal item
 */
export default {
  name: 'proposal-item',
  mixins: [format, proposals],
  components: {
    AssignmentClaimExtend: () => import('../assignments/assignment-claim-extend.vue'),
    AssignmentHeader: () => import('../assignments/assignment-header.vue'),
    ContributionHeader: () => import('../contributions/contribution-header.vue'),
    AssignbadgeHeader: () => import('../assignments/assignbadge-header.vue'),
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
      firstPeriod: undefined,
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
      assignbadge: undefined
    }
  },

  computed: {
    ...mapGetters('dao', ['selectedDao', 'daoSettings']),
    ...mapGetters('ballots', ['supply']),
    ...mapGetters('dao', ['votingPercentages']),
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
          } else if (this.type === 'Assignbadge') {
            this.assignbadge = await this.parseAssignbadge(proposal)
            this.periods = this.assignbadge.periods
          }
        }
      },
      immediate: true
    }
  },

  methods: {
    ...mapActions('assignments', ['claimAllAssignmentPayment', 'adjustCommitment', 'adjustDeferred', 'suspendAssignment', 'withdrawFromAssignment']),
    ...mapActions('proposals', ['saveDraft']),

    onClick () {
      if (this.owner) {
        if (this.expandable && this.periods.length) {
          this.expanded = !this.expanded
        }
      }
      this.$emit('onClick')
    },

    async onClaimAll () {
      this.claiming = true
      const numClaims = this.claims
      try {
        const error = !(await this.claimAllAssignmentPayment({ docId: this.assignment.docId, numPeriods: numClaims }))
        if (!error) {
          this.periods.forEach(element => {
            if (element.claimable) {
              element.claimed = true
            }
          })
        }
      } catch (e) {
        const message = e.message || e.cause.message
        this.showNotification({
          message,
          color: 'red'
        })
      }
      this.claiming = false
      this.$emit('claim-all')
    },

    async onExtend () {
      const roleProposal = this.proposal.role[0]
      roleProposal.type = 'Role'
      // this.$store.commit('proposals/setNext', true)
      this.$store.commit('proposals/setType', CONFIG.options.recurring.options.assignment.type)
      this.$store.commit('proposals/setCategory', { key: CONFIG.options.recurring.options.assignment.key, title: CONFIG.options.recurring.options.assignment.title })
      const salary = parseFloat(roleProposal.details_annualUsdSalary_a)

      const salaryBucket = this.getSalaryBucket(salary)
      this.$store.commit('proposals/setRole', {
        docId: roleProposal.docId,
        title: roleProposal.details_title_s,
        description: roleProposal.details_description_s,
        salary,
        minDeferred: roleProposal.details_minDeferredX100_i,
        minCommitment: roleProposal.details_minTimeShareX100_i,
        type: roleProposal.type,
        salaryBucket
      })
      this.$store.commit('proposals/setAnnualUsdSalary', salary)
      this.$store.commit('proposals/setMinDeferred', roleProposal.details_minDeferredX100_i)
      this.$store.commit('proposals/setStepIndex', 1)

      this.$store.commit('proposals/setLinkedDocId', this.proposal.docId)
      this.$store.commit('proposals/setEdit', true)
      this.$store.commit('proposals/setPeg', parseFloat(this.proposal.details_pegSalaryPerPeriod_a))
      this.$store.commit('proposals/setReward', parseFloat(this.proposal.details_rewardSalaryPerPeriod_a))
      this.$store.commit('proposals/setVoice', parseFloat(this.proposal.details_voiceSalaryPerPeriod_a))
      this.$store.commit('proposals/setDeferred', this.proposal.details_approvedDeferredPercX100_i)
      this.$store.commit('proposals/setCommitment', this.proposal.details_timeShareX100_i)
      this.$store.commit('proposals/setTitle', this.proposal.details_title_s)
      this.$store.commit('proposals/setDescription', this.proposal.details_description_s)
      this.$store.commit('proposals/setStartPeriod', this.firstPeriod)
      this.$store.commit('proposals/setPeriodCount', this.proposal.details_periodCount_i)
      this.$store.commit('proposals/setStartDate', this.firstPeriod.details_startTime_t)
      this.$store.commit('proposals/setDetailsPeriod', {
        dateString: this.firstPeriod.details_startTime_t
      })

      const draftId = Date.now()
      this.$store.commit('proposals/setDraftId', draftId)
      this.saveDraft()
      this.$router.push({
        name: 'proposal-create', params: { draftId }
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
widget(noPadding :background="background" :class="{ 'cursor-pointer': owner || isProposed }" @click.native="(owner || isProposed) && onClick()").q-px-sm
  .flex.justify-center(:class="{item: !expandable, 'item-expandable': expandable}")
    contribution-header.q-px-lg(
      v-if="contribution"
      v-bind="contribution"
      :votingExpired="isVotingExpired"
      :accepted="isAccepted"
    )
      template(v-slot:right)
        .q-mt-md(v-if="$q.screen.sm")
        voting-result(v-if="isProposed" v-bind="voting" :colorConfig="colorConfig" :colorConfigQuorum="colorConfigQuorum")
        q-btn.q-mr-md.view-proposa-btn(
          v-if="!owner && !isProposed"
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
      :votingExpired="isVotingExpired"
      :accepted="isAccepted"
    )
      template(v-slot:right)
        .q-mt-md(v-if="$q.screen.sm")
        voting-result(v-if="isProposed" v-bind="voting" :colorConfig="colorConfig" :colorConfigQuorum="colorConfigQuorum")
        assignment-claim-extend(
          v-if="!assignment.future && owner && !isProposed && (proposal.details_state_s === 'approved' || proposal.details_state_s === 'archived')"
          :claims="claims"
          :claiming="claiming"
          :extend="assignment.extend"
          :state="proposal.details_state_s"
          :stacked="true"
          @claim-all="onClaimAll"
          @extend="onExtend"
        )
          //- :notClaim="newDeferred < 100"
        q-btn.q-pr-md.view-proposa-btn(
          v-if="!owner && !isProposed"
          label="View proposal"
          color="primary"
          rounded
          unelevated
          no-caps
          outline
          @click="onClick"
        )
    assignbadge-header.q-px-lg(
      v-if="assignbadge"
      v-bind="assignbadge"
      calendar
      :accepted="isAccepted"
      :expanded="expanded"
      :votingExpired="isVotingExpired"
    )
      template(v-slot:right)
        .q-mt-md(v-if="$q.screen.sm")
        voting-result(v-if="isProposed" v-bind="voting" :colorConfig="colorConfig" :colorConfigQuorum="colorConfigQuorum")
        q-btn.q-pr-md.view-proposa-btn(
          v-if="!owner && !isProposed"
          label="View proposal"
          color="primary"
          rounded
          unelevated
          no-caps
          outline
          @click="onClick"
        )
    .row.justify-center(v-if="owner && expandable && periods.length")
      q-icon.expand-icon(:name="'fas fa-chevron-down' + (expanded ? ' fa-rotate-180' : '')" color="grey-7")
</template>

<style lang="stylus" scoped>
.view-proposa-btn
  width 100%
.expand-icon
  margin-top 16px
  margin-bottom -12px
  transition transform 0.5s
.item
  min-height: 143px
  padding 24px 0
  height auto
.item-expandable
  min-height 170px
  height auto
  padding 24px 0
</style>
