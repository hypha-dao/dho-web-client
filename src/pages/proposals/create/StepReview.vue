<script>
import { mapGetters } from 'vuex'

export default {
  name: 'step-review',
  components: {
    ProposalView: () => import('~/components/proposals/proposal-view.vue')
  },

  props: {
    fields: Object
  },

  computed: {
    ...mapGetters('accounts', ['account']),

    draft () {
      const draft = {
        creator: this.account,
        ...this.$store.state.proposals.draft,
        deferred: {
          value: this.$store.state.proposals.draft.deferred,
          min: this.$store.state.proposals.draft.minDeferred,
          max: 100
        },
        commit: {
          value: this.$store.state.proposals.draft.commitment
        },
        tokens: this.tokens
      }
      if (this.$store.state.proposals.draft.category.key === 'assignment') {
        draft.start = this.$store.state.proposals.draft.detailsPeriod.dateString
      } else if (this.$store.state.proposals.draft.category.key === 'archetype') {
        draft.capacity = this.$store.state.proposals.draft.roleCapacity
        draft.salary = this.$store.state.proposals.draft.annualUsdSalary
      } else if (this.$store.state.proposals.draft.category.key === 'obadge') {
        draft.icon = this.$store.state.proposals.draft.icon
      }

      return draft
    },

    tags () {
      const tags = [
        { color: 'primary', label: this.draft.category.title || 'Proposal' }
        // { color: 'primary', outline: true, label: 'Circle One' }
      ]

      if (this.draft.category.key === 'assignment') {
        tags.push({
          color: 'primary',
          outline: true,
          label: `${this.draft.role.description} ${this.draft.role.salaryBucket}`
        })
      }

      return tags
    },

    // multiplier () {
    //   const multiplier = []
    //   if (this.fields.pegCoefficient) {
    //     multiplier.push({
    //       label: `${this.fields.pegCoefficient.label} (${this.$store.state.dao.settings.pegToken})`,
    //       icon: 'husd.svg',
    //       symbol: this.$store.state.dao.settings.pegToken,
    //       value: this.$store.state.proposals.draft.pegCoefficient.value,
    //       coefficient: true,
    //       coefficientPercentage: this.$store.state.proposals.draft.pegCoefficient.label
    //     })
    //   }
    //   if (this.fields.rewardCoefficient) {
    //     multiplier.push({
    //       label: `${this.fields.rewardCoefficient.label} (${this.$store.state.dao.settings.rewardToken})`,
    //       icon: 'husd.svg',
    //       symbol: this.$store.state.dao.settings.rewardToken,
    //       value: this.$store.state.proposals.draft.rewardCoefficient.value,
    //       coefficient: true,
    //       coefficientPercentage: this.$store.state.proposals.draft.rewardCoefficient.label
    //     })
    //   }
    //   if (this.fields.voiceCoefficient) {
    //     multiplier.push({
    //       label: `${this.fields.voiceCoefficient.label} (${this.$store.state.dao.settings.voiceToken})`,
    //       icon: 'husd.svg',
    //       symbol: this.$store.state.dao.settings.voiceToken,
    //       value: this.$store.state.proposals.draft.voiceCoefficient.value,
    //       coefficient: true,
    //       coefficientPercentage: this.$store.state.proposals.draft.voiceCoefficient.label
    //     })
    //   }
    //   return multiplier
    // },

    tokens () {
      const tokens = []
      if (this.fields.peg) {
        tokens.push({
          label: this.fields.peg.label,
          icon: 'husd.svg',
          symbol: this.$store.state.dao.settings.pegToken,
          value: this.$store.state.proposals.draft.peg
        })
      }

      if (this.fields.reward) {
        tokens.push({
          label: this.fields.reward.label,
          icon: 'husd.svg',
          symbol: this.$store.state.dao.settings.rewardToken,
          value: this.$store.state.proposals.draft.reward
        })
      }

      if (this.fields.voice) {
        tokens.push({
          label: this.fields.voice.label,
          icon: 'husd.svg',
          symbol: this.$store.state.dao.settings.voiceToken,
          value: this.$store.state.proposals.draft.voice
        })
      }

      if (this.fields.pegCoefficient) {
        tokens.push({
          label: `${this.fields.pegCoefficient.label} (${this.$store.state.dao.settings.pegToken})`,
          icon: 'husd.svg',
          symbol: this.$store.state.dao.settings.pegToken,
          value: parseFloat(this.$store.state.proposals.draft.pegCoefficient.value),
          coefficient: true,
          coefficientPercentage: parseFloat(this.$store.state.proposals.draft.pegCoefficient.label)
        })
      }
      if (this.fields.rewardCoefficient) {
        tokens.push({
          label: `${this.fields.rewardCoefficient.label} (${this.$store.state.dao.settings.rewardToken})`,
          icon: 'husd.svg',
          symbol: this.$store.state.dao.settings.rewardToken,
          value: parseFloat(this.$store.state.proposals.draft.rewardCoefficient.value),
          coefficient: true,
          coefficientPercentage: parseFloat(this.$store.state.proposals.draft.rewardCoefficient.label)
        })
      }
      if (this.fields.voiceCoefficient) {
        tokens.push({
          label: `${this.fields.voiceCoefficient.label} (${this.$store.state.dao.settings.voiceToken})`,
          icon: 'husd.svg',
          symbol: this.$store.state.dao.settings.voiceToken,
          value: parseFloat(this.$store.state.proposals.draft.voiceCoefficient.value),
          coefficient: true,
          coefficientPercentage: parseFloat(this.$store.state.proposals.draft.voiceCoefficient.label)
        })
      }

      return tokens
    }
  }
}
</script>

<template lang="pug">
proposal-view(
  v-bind="draft"
  :tags="tags"
  preview
)
</template>
