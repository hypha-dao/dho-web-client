<script>
import { format } from '~/mixins/format'

export default {
  name: 'proposal-card-chips',
  components: {
    Chips: () => import('../common/chips.vue')
  },
  mixins: [format],
  props: {
    type: String,
    state: String,
    compensation: String,
    salary: String,
    showVotingState: Boolean,
    votingExpired: Boolean,
    accepted: Boolean,
    active: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    tags () {
      const result = []

      if (this.type === 'Payout') {
        result.push(
          { color: 'primary', label: 'Generic Contribution' }
        )
      }

      if (this.type === 'Assignment' || this.type === 'Edit') {
        result.push(...[
          { color: 'primary', label: 'Role Assignment' }
        ])
      }

      if (this.type === 'Assignbadge') {
        result.push(...[
          { color: 'primary', label: 'Badge Assignment' }
        ])
      }

      if (this.type === 'Suspend') {
        result.push(...[
          { color: 'warning', label: 'Suspension' }
        ])
      }

      if (this.type === 'Role') {
        result.push(...[
          { color: 'primary', label: ' Role Archetype' }
        ])
      }

      if (this.type === 'Badge') {
        result.push(
          { color: 'primary', label: 'Badge' }
        )
      }

      if (this.state === 'withdrawed') {
        result.push({ color: 'negative', label: 'Withdrawn', text: 'white' })
      }

      if (this.compensation) {
        const usdAmount = Number.parseFloat(this.compensation.split(' ')[0])
        result.push(
          { color: 'primary', outline: true, label: `${this.shortNumber(usdAmount)}` }
        )
      }

      if (this.salary) {
        const amount = Number.parseFloat(this.salary.split(' ')[0])
        const band = this.getSalaryBucket(amount)
        result.push(
          {
            color: 'primary',
            outline: true,
            label: `${band} ${this.shortNumber(amount)}`,
            tooltip: `Based on equivalent: $${new Intl.NumberFormat().format(amount)} USD`
          }
        )
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
      } else if (this.state === 'approved') {
        result.push(
          {
            label: this.active ? 'ACTIVE' : 'ARCHIVED',
            color: this.active ? 'positive' : 'body',
            text: 'white'
          }
        )
      }
      return result
    }
  }
}
</script>

<template lang="pug">
  chips(v-if="tags" :tags="tags" chipSize="sm")
</template>

<style lang="stylus" scoped>

</style>
