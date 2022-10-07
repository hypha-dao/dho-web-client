<script>
import { mapGetters } from 'vuex'

export default {
  name: 'step-review',
  components: {
    ProposalView: () => import('~/components/proposals/proposal-view.vue'),
    Widget: () => import('~/components/common/widget.vue'),
    CreationStepper: () => import('~/components/proposals/creation-stepper.vue')
  },

  props: {
    fields: Object,
    stepIndex: Number,
    steps: Array
  },

  computed: {
    ...mapGetters('accounts', ['account']),

    draft () {
      const draft = {
        creator: this.account,
        ...this.$store.state.proposals.draft,
        deferred: {
          value: this.$store.state.proposals.draft.custom ? undefined : this.$store.state.proposals.draft.deferred, // undefined to hide
          min: this.$store.state.proposals.draft.minDeferred,
          max: 100
        },
        commit: {
          value: this.$store.state.proposals.draft.commitment
        },
        tokens: this.tokens
      }
      if (this.$store.state.proposals.draft.edit) {
        draft.type = 'Edit'
      }

      const categoryKey = this.$store.state.proposals.draft.category.key
      if (categoryKey === 'assignment' || (categoryKey === 'roleExtension')) {
        draft.start = this.$store.state.proposals.draft.detailsPeriod.dateString
        draft.commit.value = this.$store.state.proposals.draft.commitment
      } else if (categoryKey === 'archetype') {
        draft.capacity = this.$store.state.proposals.draft.roleCapacity
        draft.salary = this.$store.state.proposals.draft.annualUsdSalary
      } else if (categoryKey === 'obadge') {
        draft.icon = this.$store.state.proposals.draft.icon
        draft.restrictions = this.$store.state.proposals.draft.badgeRestriction
      } else if (categoryKey === 'contribution') {
        draft.icon = this.$store.state.proposals.draft.icon
      } else if (categoryKey === 'badge' || (categoryKey === 'badgeExtension')) {
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
          label: `${this.draft.role.details_title_s}`
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
      if (this.fields.reward) {
        tokens.push({
          label: this.fields.reward.label,
          type: 'utility',
          symbol: this.$store.state.dao.settings.rewardToken,
          value: this.$store.state.proposals.draft.reward
        })
      }

      if (this.fields.peg) {
        tokens.push({
          label: this.fields.peg.label,
          type: 'cash',
          symbol: this.$store.state.dao.settings.pegToken,
          value: this.$store.state.proposals.draft.peg
        })
      }

      if (this.fields.voice) {
        tokens.push({
          label: this.fields.voice.label,
          type: 'voice',
          symbol: this.$store.state.dao.settings.voiceToken,
          value: this.$store.state.proposals.draft.voice
        })
      }

      if (this.fields.rewardCoefficient) {
        const coefficientPercentage = this.fields.rewardCoefficient.defaultValue ? 1 : this.$store.state.proposals.draft.rewardCoefficient.value / 10000
        tokens.push({
          label: `${this.fields.rewardCoefficient.label} (${this.$store.state.dao.settings.rewardToken})`,
          type: 'utility',
          symbol: this.$store.state.dao.settings.rewardToken,
          value: parseFloat(this.$store.state.proposals.draft.rewardCoefficient.value),
          coefficient: true,
          coefficientPercentage
        })
      }

      if (this.fields.pegCoefficient) {
        const coefficientPercentage = this.fields.pegCoefficient.defaultValue ? 1 : this.$store.state.proposals.draft.pegCoefficient.value / 10000
        tokens.push({
          label: `${this.fields.pegCoefficient.label} (${this.$store.state.dao.settings.pegToken})`,
          type: 'cash',
          symbol: this.$store.state.dao.settings.pegToken,
          value: parseFloat(this.$store.state.proposals.draft.pegCoefficient.value),
          coefficient: true,
          coefficientPercentage
        })
      }
      if (this.fields.voiceCoefficient) {
        const coefficientPercentage = this.fields.voiceCoefficient.defaultValue ? 1 : this.$store.state.proposals.draft.voiceCoefficient.value / 10000
        tokens.push({
          label: `${this.fields.voiceCoefficient.label} (${this.$store.state.dao.settings.voiceToken})`,
          type: 'voice',
          symbol: this.$store.state.dao.settings.voiceToken,
          value: parseFloat(this.$store.state.proposals.draft.voiceCoefficient.value),
          coefficient: true,
          coefficientPercentage
        })
      }

      return tokens
    },
    withToggle () {
      const categoryKey = this.$store.state.proposals.draft.category.key
      return categoryKey === 'assignment' || categoryKey === 'archetype' || categoryKey === 'roleExtension'
    }
  }
}
</script>

<template lang="pug">
.step-review
  proposal-view(preview v-bind="draft" :withToggle="withToggle")
    template(v-slot:bottom)
      nav(v-if="$q.platform.is.desktop").full-width.row.justify-end.q-mt-xl.q-gutter-xs
        q-btn.q-px-xl(
          @click="$emit('prev')"
          color="primary"
          label="Previous step"
          no-caps
          outline
          rounded
          unelevated
        )
        q-btn.q-px-xl(
          @click="$emit('publish')"
          color="primary"
          :label="$store.state.proposals.draft.edit ? 'Publish' : 'Publish to staging'"
          no-caps
          rounded
          unelevated
        )
  template(v-if="$q.platform.is.mobile")
    q-card(:style="'border-radius: 25px; box-shadow: none; z-index: 7000; position: fixed; bottom: -20px; left: 0; right: 0; box-shadow: 0px 0px 26px 0px rgba(0, 0, 41, 0.2);'")
      creation-stepper(
        :style="'padding: 20px 50px 40px;'"
        :activeStepIndex="stepIndex"
        :steps="steps"
        :nextDisabled="nextDisabled"
        @publish="$emit('publish')"
        @save="$emit('save')"
        @next="$emit('next')"
      )
</template>
