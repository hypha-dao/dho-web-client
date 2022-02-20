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
      const categoryKey = this.$store.state.proposals.draft.category.key
      if (categoryKey === 'assignment') {
        draft.start = this.$store.state.proposals.draft.detailsPeriod.dateString
      } else if (categoryKey === 'archetype') {
        draft.capacity = this.$store.state.proposals.draft.roleCapacity
        draft.salary = this.$store.state.proposals.draft.annualUsdSalary
      } else if (categoryKey === 'obadge') {
        draft.icon = this.$store.state.proposals.draft.icon
      } else if (categoryKey === 'contribution') {
        draft.icon = this.$store.state.proposals.draft.icon
      } else if (categoryKey === 'badge') {
        draft.icon = this.$store.state.proposals.draft.icon
        draft.start = this.$store.state.proposals.draft.detailsPeriod.dateString
        draft.badge = this.$store.state.proposals.draft.badge
        draft.deferred = null
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
          label: `${this.draft.role.title} ${this.draft.role.salaryBucket}`
        })
      }
      if (this.draft.category.key === 'badge') {
        tags.push({
          color: 'primary',
          outline: true,
          label: `${this.draft.badge.details_title_s}`
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
#container
  proposal-view(
    v-bind="draft"
    :tags="tags"
    preview
  )
  .next-step.q-py-md
    .row.justify-between
      .nothing
      .buttons
        q-btn.q-px-md.q-mr-md(no-caps rounded flat color="primary" label="Prev step" @click="$emit('prev')")
</template>
