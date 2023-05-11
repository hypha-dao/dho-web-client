<script>
import { PROPOSAL_TYPE } from '~/const'
import { format } from '~/mixins/format'

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

  computed: {
    originalType () {
      return this.proposal.original[0] ? this.proposal.original[0].__typename : null
    },
    tags () {
      const result = []
      // Type tags

      if (this.type === PROPOSAL_TYPE.POLL) {
        result.push(
          { color: 'primary', label: 'Poll' }
        )
      }

      if (this.type === PROPOSAL_TYPE.BUDGET) {
        result.push(
          { color: 'primary', label: 'Circle Budget' }
        )
      }

      if (this.type === PROPOSAL_TYPE.QUEST_START) {
        result.push(
          { color: 'primary', label: 'Quest' },
          { color: 'primary', outline: true, label: 'Start' },
          ...(this.proposal.circles
            ? [
                ...this.proposal.circles.map(_ => ({
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
          { color: 'primary', label: 'Quest' },
          { color: 'primary', outline: true, label: 'Payout' }
        )
      }

      if (this.type === PROPOSAL_TYPE.CIRCLE) {
        result.push(
          { color: 'primary', label: 'Circle' }
        )
      }

      if (this.type === PROPOSAL_TYPE.POLICY) {
        result.push(
          { color: 'primary', label: 'Policy' }
        )
      }

      if (this.type === PROPOSAL_TYPE.PAYOUT) {
        result.push(
          { color: 'primary', label: 'Generic Contribution' }
        )
      }

      if (this.type === PROPOSAL_TYPE.ROLE) {
        result.push(...[
          { color: 'primary', label: 'Role' },
          { color: 'primary', outline: true, label: 'Assignment' }
        ])
      }

      if (this.type === PROPOSAL_TYPE.EDIT) {
        result.push(...[
          { color: 'primary', label: 'Extension' }
        ])
        if (this.originalType) {
          switch (this.originalType) {
            case 'Payout':
              result.push(
                { color: 'primary', label: 'Generic Contribution' }
              )
              break
            case 'Assignment':
              result.push(...[
                { color: 'primary', label: 'Role' },
                { color: 'primary', outline: true, label: 'Assignment' }
              ])
              break
            case 'Assignbadge' || 'Assignment Badge':
              result.push(...[
                { color: 'primary', label: 'Ability' },
                { color: 'primary', outline: true, label: 'Assignment' }
              ])
              break
            case 'Role':
              result.push(...[
                { color: 'primary', label: ' Archetype' }
              ])
              break
            case 'Badge':
              result.push(
                { color: 'primary', label: 'Badge' }
              )
              break
          }
        }
      }

      if (this.type === PROPOSAL_TYPE.ABILITY) {
        result.push(...[
          { color: 'primary', label: 'Ability' },
          { color: 'primary', outline: true, label: 'Ability' }
        ])
      }

      if (this.type === 'Role') {
        result.push(...[
          { color: 'primary', label: ' Archetype' }
        ])
      }

      if (this.type === 'Badge') {
        result.push(
          { color: 'primary', label: 'Badge' }
        )
      }

      // State tags
      if (this.type === 'Suspend') {
        result.push(...[
          { color: 'warning', label: 'Suspension' }
        ])
      }

      if (this.state === 'withdrawed') {
        result.push({ color: 'negative', label: 'Withdrawn', text: 'white' })
      }

      if (this.state === 'proposed' && this.showVotingState) {
        if (this.votingExpired) {
          if (this.accepted) {
            result.push(
              {
                label: 'ACCEPTED',
                color: 'secondary',
                text: 'white'
              }
            )
          } else {
            result.push(
              {
                label: 'REJECTED',
                color: 'negative',
                text: 'white'
              }
            )
          }
        } else {
          result.push(
            {
              label: 'VOTING',
              color: 'secondary'
            }
          )
        }
      } else if (this.state === 'approved' && this.type !== 'Payout') {
        result.push(
          {
            label: 'ACTIVE',
            color: 'positive',
            text: 'white'
          }
        )
      } else if (this.state === 'rejected') {
        result.push(
          {
            label: 'REJECTED',
            color: 'negative',
            text: 'white'
          }
        )
      } else if (this.state === 'archived') {
        result.push(
          {
            label: 'ARCHIVED',
            color: 'body',
            text: 'white'
          }
        )
      } else if (this.state === 'suspended') {
        result.push({ color: 'negative', label: 'SUSPENDED', text: 'white' })
      }

      // Compensation tags
      if (this.compensation) {
        const usdAmount = Number.parseFloat(this.compensation.amount.split(' ')[0])
        result.push(
          { color: 'primary', outline: true, label: `${this.getFormatedTokenAmount(usdAmount, 3, 0)} USDE`, tooltip: this.compensation.tooltip })
      }

      if (this.salary) {
        const amount = Number.parseFloat(this.salary.split(' ')[0])
        const band = this.getSalaryBucket(amount)
        result.push(
          {
            color: 'secondary',
            outline: false,
            label: `${band}`
          }
        )
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
