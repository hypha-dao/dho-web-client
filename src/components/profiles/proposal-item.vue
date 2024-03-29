<script>
import { mapActions, mapGetters } from 'vuex'
import CONFIG from '../../pages/proposals/create/config.js'
import { format } from '../../mixins/format'
import { proposals } from '../../mixins/proposals'
import { cycleDurationSec } from '../../utils/proposal-parsing'
import { PROPOSAL_TYPE } from '~/const'
import gql from 'graphql-tag'

const TIERS_QUERY = `
  querySalaryband(
    filter: {
      details_dao_i: { in: [0, $daoId] },
    }
  ) {
    id: docId
    name: details_name_s
    annualAmount: details_annualUsdSalary_a
    minDeferred: details_minDeferredX100_i
  }
`

const ROLES_QUERY = `
  queryRole(
    filter: { 
      details_dao_i: { in: [0, $daoId] },
      details_autoApprove_i: { eq: 1 } 
    }
  ) {
    id: docId
    name: details_title_s
  }
`

/**
 * A component to display profile proposal item
 */
export default {
  name: 'proposal-item',
  mixins: [format, proposals],
  components: {
    AssignmentClaimExtend: () => import('../assignments/assignment-claim-extend.vue'),
    RecurringActivityHeader: () => import('../proposals/recurring-activity-header.vue'),
    OneTimeActivityHeader: () => import('../proposals/one-time-activity-header.vue'),
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
    clickable: Boolean,
    owner: Boolean,
    compact: Boolean,
    now: {
      type: Date,
      default: () => new Date()
    }
  },

  apollo: {
    tiers: {
      query: gql`query TIERS($daoId: Int64!) { ${TIERS_QUERY} }`,
      update: data => data?.querySalaryband?.map(level => ({
        label: level?.name,
        value: { ...level }
      })),
      skip () { return !this.selectedDao?.docId },
      variables () { return { daoId: this.selectedDao.docId } },
      subscribeToMore: {
        document: gql`subscription TIERS($daoId: Int64!) { ${TIERS_QUERY} }`,
        skip () { return !this.selectedDao?.docId },
        variables () { return { daoId: this.selectedDao.docId } },
        updateQuery: (previousResult, { subscriptionData }) => {
          if (!subscriptionData.data) {
            return previousResult
          }
          if (!previousResult) {
            return undefined
          }

          return subscriptionData.data
        }
      }
    },

    archetypes: {
      query: gql`query ROLES($daoId: Int64!) { ${ROLES_QUERY} }`,
      update: data => data?.queryRole?.map(archetype => ({
        label: archetype?.name,
        value: { ...archetype }
      })),
      skip () { return !this.selectedDao?.docId },
      variables () { return { daoId: this.selectedDao.docId } },
      subscribeToMore: {
        document: gql`subscription ROLES($daoId: Int64!) { ${ROLES_QUERY} }`,
        skip () { return !this.selectedDao?.docId },
        variables () { return { daoId: this.selectedDao.docId } },
        updateQuery: (previousResult, { subscriptionData }) => {
          if (!subscriptionData.data) {
            return previousResult
          }
          if (!previousResult) {
            return undefined
          }

          return subscriptionData.data
        }
      }
    }
  },

  data () {
    return {
      PROPOSAL_TYPE,
      firstPeriod: undefined,
      expanded: false,
      newCommit: undefined,
      newDeferred: undefined,
      periods: undefined,
      claiming: false,
      committing: false,
      suspending: false,
      withdrawing: false,
      extend: undefined,
      expiredColorConfig: {
        progress: 'header',
        icons: 'header',
        text: { 'text-header': true }
      },
      endDate: undefined
    }
  },

  computed: {
    ...mapGetters('dao', ['daoSettings, selectedDao']),
    claims () {
      if (this?.periods) {
        return this.periods.reduce((result, p) => {
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
          if (['Assignment', 'Assignbadge'].includes(this.type)) {
            if (this.type === 'Assignment') {
              this.newCommit = this.commit.value
              this.newDeferred = this.deferred.value
            }
            const periodsRes = await this.getPeriods()
            this.periods = periodsRes.periods
            this.firstPeriod = periodsRes.firstPeriod
            this.extend = periodsRes.extend
            this.endDate = periodsRes.end
          }
        }
      },
      immediate: true
    }
  },

  methods: {
    ...mapActions('assignments', ['claimAssignmentPayment', 'adjustCommitment', 'adjustDeferred', 'suspendAssignment', 'withdrawFromAssignment']),
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
      try {
        for (let i = 0; i < this.periods.length; i++) {
          const element = this.periods[i]
          if (element.claimable && !element.claimed) {
            const error = !(await this.claimAssignmentPayment(this.docId))
            if (!error) {
              element.claimed = true
            } else {
              break
            }
          }
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
      if (this.type === 'Assignment') {
        return this._extendAssignment()
      } else if (this.type === 'Assignbadge') {
        return this._extendBadge()
      }
    },

    async _extendBadge () {
      const roleProposal = this.proposal.badge[0]
      roleProposal.type = 'Badge'
      this.$store.commit('proposals/setType', CONFIG.types.core.options.badge.type)
      this.$store.commit('proposals/setCategory', { key: CONFIG.types.core.options.badge.key, title: CONFIG.types.core.options.badge.title })

      this.$store.commit('proposals/setBadge', {
        docId: roleProposal.docId,
        title: roleProposal.details_title_s,
        description: roleProposal.details_description_s,
        type: roleProposal.type
      })
      this.$store.commit('proposals/setStepIndex', 1)

      this.$store.commit('proposals/setRewardCoefficientLabel', (roleProposal.details_rewardCoefficientX10000_i) / 10000)
      this.$store.commit('proposals/setRewardCoefficient', roleProposal.details_rewardCoefficientX10000_i)
      this.$store.commit('proposals/setVoiceCoefficientLabel', (roleProposal.details_voiceCoefficientX10000_i) / 10000)
      this.$store.commit('proposals/setVoiceCoefficient', roleProposal.details_voiceCoefficientX10000_i)
      this.$store.commit('proposals/setPegCoefficientLabel', (roleProposal.details_pegCoefficientX10000_i) / 10000)
      this.$store.commit('proposals/setPegCoefficient', roleProposal.details_pegCoefficientX10000_i)
      this.$store.commit('proposals/setIcon', roleProposal.details_icon_s)

      this.$store.commit('proposals/setLinkedDocId', this.proposal.docId)
      this.$store.commit('proposals/setEdit', true)
      this.$store.commit('proposals/setTitle', this.proposal.details_title_s)
      this.$store.commit('proposals/setDescription', `[Extension for proposal ${this.proposal.docId}] ` + this.proposal.details_description_s)
      this.$store.commit('proposals/setIsExtension', true)
      this.$store.commit('proposals/setStartDate', this.endDate)
      this.$store.commit('proposals/setDetailsPeriod', {
        dateString: this.endDate
      })

      const draftId = Date.now()
      this.$store.commit('proposals/setDraftId', draftId)
      this.saveDraft()
      this.$router.push({
        name: 'proposal-create', params: { draftId }
      })
    },
    async _extendAssignment () {
      if (this.proposal.salaryband.length !== 0) {
        const roleProposal = this.proposal?.role?.[0]
        roleProposal.type = 'Role'
        this.$store.commit('proposals/setType', CONFIG.types.core.options.assignment.type)
        this.$store.commit('proposals/setCategory', { key: CONFIG.types.core.options.assignment.key, title: CONFIG.types.core.options.assignment.title })
        const tier = this.tiers.find(tier => tier.label === this.proposal?.salaryband?.[0]?.details_name_s)
        const archetype = this.archetypes.find(archetype => archetype.label === this.proposal?.salaryband?.[0]?.assignment?.[0]?.role?.[0]?.system_nodeLabel_s)
        this.$store.commit('proposals/setRole', archetype)
        this.$store.commit('proposals/setTier', tier)

        this.$store.commit('proposals/setAnnualUsdSalary', tier?.value?.annualAmount || 0)
        this.$store.commit('proposals/setMinDeferred', tier?.value?.minDeferred || 0)
        this.$store.commit('proposals/setMinCommitment', 0)

        this.$store.commit('proposals/setCommitment', parseFloat(1))
        this.$store.commit('proposals/setDeferred', parseFloat(tier.value.minDeferred))

        const cycleMul = (cycleDurationSec / this.daoSettings.periodDurationSec).toFixed(2)

        this.$store.commit('proposals/setLinkedDocId', this.proposal.docId)
        this.$store.commit('proposals/setPeg', parseFloat(this.proposal.details_pegSalaryPerPeriod_a) * cycleMul)
        this.$store.commit('proposals/setReward', parseFloat(this.proposal.details_rewardSalaryPerPeriod_a) * cycleMul)
        this.$store.commit('proposals/setVoice', parseFloat(this.proposal.details_voiceSalaryPerPeriod_a) * cycleMul)
        this.$store.commit('proposals/setTitle', this.proposal.details_title_s)
        this.$store.commit('proposals/setDescription', `[Extension for proposal ${this.proposal.docId}] ` + this.proposal.details_description_s)
        this.$store.commit('proposals/setIsExtension', true)
        this.$store.commit('proposals/setStartDate', this.endDate)
        this.$store.commit('proposals/setDetailsPeriod', {
          dateString: this.endDate
        })

        const draftId = Date.now()
        this.$store.commit('proposals/setDraftId', draftId)
        this.saveDraft()
        this.$router.push({
          name: 'proposal-create', params: { draftId }
        })
      } else {
        this.$router.push({
          name: 'proposal-create'
        })
      }
    }
  }
}
</script>

<template lang="pug">
widget.q-px-sm(noPadding :background="background" :class="{ 'cursor-pointer': clickable }" @click.native="clickable && onClick()")
  .flex.justify-center(:class="{item: !expandable, 'item-expandable': expandable, 'compact-card': compact}")
    one-time-activity-header.q-px-lg(v-if="type === 'Payout' || type === PROPOSAL_TYPE.QUEST_PAYOUT || type === PROPOSAL_TYPE.QUEST_START" :votingExpired="isVotingExpired" :accepted="isAccepted" :title="title" :state="status" :compensation="compensation" :created="created" :type="type")
      template(v-slot:right)
        .q-mt-md(v-if="$q.screen.sm")
        voting-result(:class="{'q-mt-xl': compact}" v-if="isProposed" v-bind="voting" :colorConfig="isVotingExpired || isApproved ? expiredColorConfig : colorConfig" :colorConfigQuorum="isVotingExpired || isApproved ? expiredColorConfig : colorConfigQuorum")
        q-btn.q-mr-md.view-proposa-btn(v-if="!owner && !isProposed" :label="$t('profiles.proposal-item.viewProposal')" color="primary" rounded unelevated no-caps outline @click="onClick")
    recurring-activity-header.q-px-lg(v-if="type === 'Assignment' || type === 'Assignbadge'" calendar="calendar" :type="type" :claims="claims" :periods="periods" :expanded="expanded" :moons="true" :votingExpired="isVotingExpired" :accepted="isAccepted" :title="title" :subtitle="subtitle" :state="status" :salary="salary" :commit="commit")
      template(v-slot:right)
        .q-mt-md(v-if="$q.screen.sm")
        voting-result(:class="{'q-mt-xl': compact}" v-if="isProposed" v-bind="voting" :colorConfig="isVotingExpired || isApproved ? expiredColorConfig : colorConfig" :colorConfigQuorum="isVotingExpired || isApproved ? expiredColorConfig : colorConfigQuorum")
        assignment-claim-extend(:class="{'q-mt-xl': compact}" v-if="owner && !isProposed && (proposal.details_state_s === 'approved' || proposal.details_state_s === 'archived')" :notClaim="!daoSettings.cashClaimsEnabled && (newDeferred < 100)" :showClaim="type === 'Assignment'" :claims="claims" :claiming="claiming" :extend="extend" :state="proposal.details_state_s" :stacked="true" @claim-all="onClaimAll" @extend="onExtend")
        q-btn.q-mr-md.view-proposa-btn(v-if="!owner && !isProposed" :label="$t('profiles.proposal-item.viewProposal1')" color="primary" rounded unelevated no-caps outline @click="onClick")
    .row.justify-center(v-if="owner && expandable && periods.length")
      q-icon.expand-icon(:name="'fas fa-chevron-down' + (expanded ? ' fa-rotate-180' : '')" color="grey-7")

</template>

<style lang="stylus" scoped>
.compact-card
  min-height: 300px
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
.item.compact-card
  padding 34px 0
  min-height: 343px
  align-content: flex-start;
  gap: 34px;

.item-expandable
  min-height 170px
  height auto
  padding 24px 0
</style>
