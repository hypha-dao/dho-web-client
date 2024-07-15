<script>
import { mapGetters } from 'vuex'
import { PROPOSAL_TYPE } from '~/const'
import { format } from '~/mixins/format'
import gql from 'graphql-tag'

const TIERS_QUERY = `
  querySalaryband(
    filter: {
      details_dao_i: { eq: $daoId },
    }
  ) {
    id: docId
    name: details_name_s
    annualAmount: details_annualUsdSalary_a
    minDeferred: details_minDeferredX100_i

    assignmentAggregate {
      count
    }
  }
`

/**
 * A component to display proposal chips
 */
export default {
  name: 'proposal-card-chips',
  components: {
    Chips: () => import('../common/chips.vue')
  },
  mixins: [format],
  props: {
    type: String,
    state: String,
    compensation: Object,
    commit: Number,
    salary: String,
    showVotingState: Boolean,
    votingExpired: Boolean,
    accepted: Boolean,
    proposal: Object
  },

  apollo: {
    tiers: {
      query: gql`query TIERS($daoId: Int64!) { ${TIERS_QUERY} }`,
      update: data => data.querySalaryband,
      skip () { return !this.selectedDao?.docId },
      variables () { return { daoId: this.selectedDao.docId } },
      // pollInterval: 1000, // TODO: Just for demo remove after
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
    }
  },

  computed: {
    ...mapGetters('dao', ['daoSettings', 'selectedDao']),
    originalType () {
      return this.proposal.original[0] ? this.proposal.original[0].__typename : null
    },
    tags () {
      const result = []
      // Type tags
      if (this.type === PROPOSAL_TYPE.POLL) {
        result.push(
          { color: 'primary', label: this.$t('proposals.proposal-card-chips.poll') }
        )
      }

      if (this.type === PROPOSAL_TYPE.BUDGET) {
        result.push(
          { color: 'primary', label: this.$t('proposals.proposal-card-chips.circleBudget') }
        )
      }

      if (this.type === PROPOSAL_TYPE.QUEST_START) {
        result.push(
          { color: 'primary', label: this.$t('proposals.proposal-card-chips.quest') },
          { color: 'primary', outline: true, label: this.$t('proposals.proposal-card-chips.start') },
          ...(this.proposal?.circles
            ? [
                ...this.proposal?.circles?.map(_ => ({
                  color: 'secondary',
                  outline: false,
                  label: `${_.name} CIRCLE`
                }))

              ]
            : [])

        )
      }

      if (this.type === PROPOSAL_TYPE.QUEST_PAYOUT) {
        result.push(
          { color: 'primary', label: this.$t('proposals.proposal-card-chips.quest') },
          { color: 'primary', outline: true, label: this.$t('proposals.proposal-card-chips.payout') }
        )
      }

      if (this.type === PROPOSAL_TYPE.CIRCLE) {
        result.push(
          { color: 'primary', label: this.$t('proposals.proposal-card-chips.circle') }
        )
      }

      if (this.type === PROPOSAL_TYPE.POLICY) {
        result.push(
          { color: 'primary', label: this.$t('proposals.proposal-card-chips.policy') }
        )
      }

      if (this.type === PROPOSAL_TYPE.PAYOUT) {
        result.push(
          { color: 'primary', label: this.$t('proposals.proposal-card-chips.genericContribution') }
        )
      }

      if (this.type === PROPOSAL_TYPE.ROLE) {
        result.push(...[
          { color: 'primary', label: this.$t('proposals.proposal-card-chips.role') },
          { color: 'primary', outline: true, label: this.$t('proposals.proposal-card-chips.assignment') }
        ])
      }

      if (this.type === PROPOSAL_TYPE.EDIT) {
        result.push(...[
          { color: 'primary', label: this.$t('proposals.proposal-card-chips.extension') }
        ])
        if (this.originalType) {
          switch (this.originalType) {
            case 'Payout':
              result.push(
                { color: 'primary', label: this.$t('proposals.proposal-card-chips.genericContribution') }
              )
              break
            case 'Assignment':
              result.push(...[
                { color: 'primary', label: this.$t('proposals.proposal-card-chips.role') },
                { color: 'primary', outline: true, label: this.$t('proposals.proposal-card-chips.assignment') }
              ])
              break
            case 'Assignbadge' || 'Assignment Badge':
              result.push(...[
                { color: 'primary', label: this.$t('proposals.proposal-card-chips.badge') },
                { color: 'primary', outline: true, label: this.$t('proposals.proposal-card-chips.application') }])
              break
            case 'Role':
              result.push(...[
                { color: 'primary', label: this.$t('proposals.proposal-card-chips.archetype') }
              ])
              break
            case 'Badge':
              result.push(
                { color: 'primary', label: this.$t('proposals.proposal-card-chips.badge') }
              )
              break
          }
        }
      }
      if (this.type === PROPOSAL_TYPE.ABILITY || this.type === PROPOSAL_TYPE.ASSIGNBADGE) {
        result.push(...[
          { color: 'primary', label: this.$t('proposals.proposal-card-chips.badge') },
          { color: 'primary', outline: true, label: this.$t('proposals.proposal-card-chips.application') }
        ])
      }

      if (this.type === 'Role') {
        result.push(...[
          { color: 'primary', label: this.$t('proposals.proposal-card-chips.role') }
        ])
      }

      if (this.type === 'Badge') {
        result.push(
          { color: 'primary', label: this.$t('proposals.proposal-card-chips.badge') }
        )
      }

      // State tags
      if (this.type === 'Suspend') {
        result.push(...[
          { color: 'warning', label: this.$t('proposals.proposal-card-chips.suspension') }
        ])
      }

      if (this.state === 'withdrawed') {
        result.push({ color: 'negative', label: this.$t('proposals.proposal-card-chips.withdrawn'), text: 'white' })
      }

      if (this.state === 'proposed' && this.showVotingState) {
        if (this.votingExpired) {
          if (this.accepted) {
            result.push(
              {
                label: this.$t('proposals.proposal-card-chips.accepted'),
                color: 'secondary',
                text: 'white'
              }
            )
          } else {
            result.push(
              {
                label: this.$t('proposals.proposal-card-chips.rejected'),
                color: 'negative',
                text: 'white'
              }
            )
          }
        } else {
          result.push(
            {
              label: this.$t('proposals.proposal-card-chips.voting'),
              color: 'secondary'
            }
          )
        }
      } else if (this.state === 'approved' && this.type !== 'Payout') {
        result.push(
          {
            label: this.$t('proposals.proposal-card-chips.active'),
            color: 'positive',
            text: 'white'
          }
        )
      } else if (this.state === 'rejected') {
        result.push(
          {
            label: this.$t('proposals.proposal-card-chips.rejected'),
            color: 'negative',
            text: 'white'
          }
        )
      } else if (this.state === 'archived') {
        result.push(
          {
            label: this.$t('proposals.proposal-card-chips.archived'),
            color: 'body',
            text: 'white'
          }
        )
      } else if (this.state === 'suspended') {
        result.push({ color: 'negative', label: this.$t('proposals.proposal-card-chips.suspended'), text: 'white' })
      }

      // Compensation tags
      if (this.compensation) {
        const usdAmount = Number.parseFloat(this.compensation.amount.split(' ')[0])
        result.push(
          { color: 'primary', outline: true, label: `${this.getFormatedTokenAmount(usdAmount, 3, 0)} ${this.daoSettings.treasuryCurrency ? this.daoSettings.treasuryCurrency : 'USD'}E`, tooltip: this.compensation.tooltip })
      }

      if (this.salary) {
        const amount = Number.parseFloat(this.salary.split(' ')[0])
        const band = this.getSalaryBucket(amount)
        if (this.proposal?.salaryband?.[0]?.details_name_s || this.proposal?.salaryband?.[0]?.name) {
          result.push(
            {
              color: 'secondary',
              outline: false,
              label: `${this.proposal?.salaryband?.[0]?.details_name_s || this.proposal?.salaryband?.[0]?.name}`
            }
          )
        } else {
          result.push(
            {
              color: 'secondary',
              outline: false,
              label: `${band}`
            }
          )
        }
      }

      if (this.commit) {
        result.push(
          {
            color: 'primary',
            outline: true,
            label: `${this.commit.toString()}%`
          }
        )
      }

      return result
    }
  }
}
</script>

<template lang="pug">
chips(v-if="tags" :tags="tags" chipSize="10px")

</template>

<style lang="stylus" scoped>

</style>
