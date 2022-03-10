<script>
import { validation } from '~/mixins/validation'
export default {
  name: 'step-compensation',
  mixins: [validation],
  components: {
    PayoutAmounts: () => import('~/components/common/payout-amounts.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    fields: Object
  },

  data () {
    return {
      custom: false,
      salaryOption: null
    }
  },

  watch: {
    custom: {
      handler (val) {
        if (!val) {
          this.calculateTokens()
        }
      }
    },

    minDeferred: {
      immediate: true,
      handler () {
        this.calculateTokens()
      }
    },

    usdAmount: {
      immediate: true,
      handler () {
        this.calculateTokens()
      }
    },

    deferred: {
      immediate: true,
      handler () {
        this.calculateTokens()
      }
    },
    commitment: {
      immediate: true,
      handler () {
        this.calculateTokens()
      }
    },

    '$store.state.proposals.draft.type': {
      immediate: true,
      handler () {
        this.custom = false
      }
    },

    '$store.state.proposals.draft.annualUsdSalary': {
      immediate: true,
      handler (val) {
        if (val === 0) {
          this.salaryOption = null
        }
        this.calculateTokens()
      }
    }
  },

  computed: {
    disabledNext () {
      const proposalType = this.$store.state.proposals.draft.category.key
      if (proposalType === 'assignment' && (!this.annualUsdSalary || this.deferred < 1 || this.commitment < 1)) {
        return true
      } else if (proposalType === 'archetype' && !this.annualUsdSalary) {
        return true
      } else if (proposalType === 'obadge' && (this.rewardCoefficientLabel < -20 || this.voiceCoefficientLabel < -20 || this.pegCoefficientLabel < -20 || this.rewardCoefficientLabel > 20 || this.voiceCoefficientLabel > 20 || this.pegCoefficientLabel > 20)) {
        return true
      } else if (proposalType === 'contribution' && (!this.usdAmount || this.usdAmount <= 0)) {
        return true
      }
      // if (!this.usdAmount && this.$store.state.proposals.draft.category.key !== 'assignment') {
      //   return true
      // } else if (!this.annualUsdSalary && this.$store.state.proposals.draft.category.key !== 'archetype') {
      //   return true
      // }
      return false
    },
    usdAmount: {
      get () {
        return this.$store.state.proposals.draft.usdAmount || 0
      },

      set (value) {
        this.$store.commit('proposals/setUsdAmount', parseFloat(value))
      }
    },

    commitment: {
      get () {
        return this.$store.state.proposals.draft.commitment || 0
      },

      set (value) {
        this.$store.commit('proposals/setCommitment', value)
      }
    },

    deferred: {
      get () {
        return this.$store.state.proposals.draft.deferred || 0
      },

      set (value) {
        this.$store.commit('proposals/setDeferred', value)
      }
    },

    peg: {
      get () {
        return this.$store.state.proposals.draft.peg || 0
      },

      set (value) {
        this.$store.commit('proposals/setPeg', parseFloat(value))
      }
    },

    reward: {
      get () {
        return this.$store.state.proposals.draft.reward || 0
      },

      set (value) {
        this.$store.commit('proposals/setReward', parseFloat(value))
      }
    },

    voice: {
      get () {
        return this.$store.state.proposals.draft.voice || 0
      },

      set (value) {
        this.$store.commit('proposals/setVoice', parseFloat(value))
      }
    },

    roleCapacity: {
      get () {
        return this.$store.state.proposals.draft.roleCapacity || 0
      },

      set (value) {
        this.$store.commit('proposals/setRoleCapacity', parseInt(value))
      }
    },

    minDeferred: {
      get () {
        return this.$store.state.proposals.draft.minDeferred || 0
      },

      set (value) {
        this.$store.commit('proposals/setMinDeferred', value)
      }
    },

    annualUsdSalary: {
      get () {
        return this.$store.state.proposals.draft.annualUsdSalary || 0
      },

      set (value) {
        this.$store.commit('proposals/setAnnualUsdSalary', value)
      }
    },

    rewardCoefficientLabel: {
      get () {
        return this.$store.state.proposals.draft.rewardCoefficient.label || 0
      },

      set (value) {
        this.$store.commit('proposals/setRewardCoefficientLabel', value)
        this.$store.commit('proposals/setRewardCoefficient', this.calculateCoefficient(value))
      }
    },
    voiceCoefficientLabel: {
      get () {
        return this.$store.state.proposals.draft.voiceCoefficient.label || 0
      },

      set (value) {
        this.$store.commit('proposals/setVoiceCoefficientLabel', value)
        this.$store.commit('proposals/setVoiceCoefficient', this.calculateCoefficient(value))
      }
    },
    pegCoefficientLabel: {
      get () {
        return this.$store.state.proposals.draft.pegCoefficient.label || 0
      },

      set (value) {
        this.$store.commit('proposals/setPegCoefficientLabel', value)
        this.$store.commit('proposals/setPegCoefficient', this.calculateCoefficient(value))
      }
    }
  },
  // mounted () {
  //   if (!this.pegCoefficientLabel) {
  //     this.$store.commit('proposals/setPegCoefficientLabel', 0)
  //     this.$store.commit('proposals/setPegCoefficient', this.calculateCoefficient(0))
  //   }
  // },

  methods: {
    imageUrl (icon) {
      return require('~/assets/icons/' + icon)
    },

    calculateTokens () {
      this.$store.dispatch('proposals/calculateTokens')
    },

    calculateCoefficient (coefficient) {
      // if (!coefficient || coefficient === 0) return 0
      return (coefficient * 100) + 10000
    }
  }
}
</script>

<template lang="pug">
widget
  .row
    .text-h5.text-bold {{ fields.stepCompensationTitle ? fields.stepCompensationTitle.label : 'Payout' }}
  .row.q-my-sm
    .text-body2.text-grey-7(v-if="fields.stepCompensationTitle && fields.stepCompensationTitle.description") {{ fields.stepCompensationTitle.description }}
  .q-mt-md
    .row.q-col-gutter-sm
      .col(v-if="fields.usdAmount")
        .text-h6 {{ fields.usdAmount.label }}
        .text-body2.text-grey-7.q-my-md(v-if="fields.usdAmount.description") {{ fields.usdAmount.description }}
        q-input.q-my-sm.rounded-border(v-model="usdAmount" outlined :disable="custom")
          template(v-slot:append)
            q-icon(
              name="fas fa-dollar-sign"
              color="primary"
              size="sm"
            )
      .col(v-if="fields.commitment")
        .row.full-width.q-px-sm
          .text-h6 {{ fields.commitment.label }}
          .row.full-width.items-center
            .text-body2.text-grey-7(v-if="fields.commitment.description") {{ fields.commitment.description }}
            .col
              q-slider.q-mb-sm(
                v-model="commitment"
                :min="0"
                :max="100"
                :step="1"
                color="primary"
              )
            .col-4
              q-input.q-ma-sm.rounded-border(
                v-model.number="commitment"
                rounded
                outlined
                :rules="[val => val >= 0 && val <= 100]"
                suffix="%"
              )
      .col(v-if="fields.deferred")
        .row.full-width.q-px-sm
          .text-h6 {{ fields.deferred.label }}
          .row.full-width.items-center
            .text-body2.text-grey-7(v-if="fields.deferred.description") {{ fields.deferred.description }}
            .col
              q-slider.q-mb-sm(
                v-model="deferred"
                :min="0"
                :max="100"
                :step="1"
                :disable="custom"
                color="primary"
              )
            .col-4
              q-input.q-ma-sm.rounded-border(
                v-model.number="deferred"
                rounded
                outlined
                :disable="custom"
                :rules="[val => val >= 0 && val <= 100]"
                suffix="%"
              )
      // .col-6.q-pa-sm(v-if="fields.deferred")
        .text-h6 {{ fields.deferred.label }}
        .text-body2.text-grey-7(v-if="fields.deferred.description") {{ fields.deferred.description }}
        q-input.q-my-sm.rounded-border(v-model="deferred" outlined :disable="custom")
          template(v-slot:append)
            q-icon(
              name="fas fa-percentage"
              color="primary"
              size="sm"
            )
      .col-6.q-pa-sm(v-if="fields.annualUsdSalary")
        .text-h6 {{ fields.annualUsdSalary.label }}
        .text-body2.text-grey-7.q-my-md(v-if="fields.annualUsdSalary.description") {{ fields.annualUsdSalary.description }}
        q-select.q-my-sm.rounded-border(
          :options="fields.annualUsdSalary.options"
          :label="fields.annualUsdSalary.label"
          rounded
          outlined
          v-model="annualUsdSalary"
          emit-value
          map-options
        )

      .col-6.q-pa-sm(v-if="fields.roleCapacity")
        .text-h6 {{ fields.roleCapacity.label }}
        .text-body2.text-grey-7.q-my-md(v-if="fields.roleCapacity.description") {{ fields.roleCapacity.description }}
        q-input.q-my-sm.rounded-border(v-model="roleCapacity" rounded outlined)
  .row.full-width.q-pa-md(v-if="fields.minDeferred")
    .text-h6 {{ fields.minDeferred.label }}
    .row.full-width.items-center
      .text-body2.text-grey-7.q-my-md(v-if="fields.minDeferred.description") {{ fields.minDeferred.description }}
      .col-10.q-pr-md
        q-slider(
          v-model="minDeferred"
          :min="0"
          :max="100"
          :step="1"
          color="primary"
        )
      .col-2.q-mt-md.q-pl-sm
        q-input.rounded-border(
          v-model.number="minDeferred"
          rounded
          outlined
          :rules="[val => val >= 0 && val <= 100]"
        )

  .row.full-width.q-pt-md(v-if="$store.state.proposals.draft.annualUsdSalary")
    .text-h6 {{ `Salary calculation ($${$store.state.proposals.draft.annualUsdSalary} USD / year)` }}
    //- .row.full-width.items-center
    //-   .text-body2.text-grey-7.q-my-md Lorem ipsum this is a test description

  //- .row.bg-grey-2.q-pa-md
  .row.q-py-md
    // TODO: Salary preview
    .col.q-pa-sm(v-if="fields.peg")
      .text-h6 {{ `${fields.peg.label} (${$store.state.dao.settings.pegToken})` }}
      q-input.q-my-sm.rounded-border(v-model="peg" outlined :readonly="!custom")
        template(v-slot:prepend)
        template(v-slot:prepend)
          q-avatar(size="md")
            img(:src="imageUrl('husd.svg')")
    .col.q-pa-sm(v-if="fields.reward")
      .text-h6 {{ `${fields.reward.label} (${$store.state.dao.settings.rewardToken})` }}
      q-input.q-my-sm.rounded-border(v-model="reward" outlined :readonly="!custom")
        template(v-slot:prepend)
          q-avatar(size="md")
            img(:src="imageUrl('hypha.svg')")
    .col.q-pa-sm(v-if="fields.voice")
      .text-h6 {{ `${fields.voice.label} (${$store.state.dao.settings.voiceToken})` }}
      q-input.q-my-sm.rounded-border(v-model="voice" outlined :readonly="!custom")
        template(v-slot:prepend)
          q-avatar(size="md")
            img(:src="imageUrl('hvoice.svg')")
    // Multiplier
    .full-width(v-if="fields.rewardCoefficient || fields.voiceCoefficient || fields.pegCoefficient")
      //- .text-h6.text-bold Multiplier
      //- .text-body2.text-grey-7.q-my-md Lorem ipsum this is a test description
      .row
        .col.q-pa-sm(v-if="fields.pegCoefficient")
          .text-h6 {{ `${fields.pegCoefficient.label} (${$store.state.dao.settings.pegToken})` }}
          .row.items-center
            .col
              q-input.q-my-sm.rounded-border(
                v-model="pegCoefficientLabel"
                outlined
                suffix="%"
                lazy-rules
                :readonly="fields.pegCoefficient.disabled === true"
                :rules="[rules.lessOrEqualThan(20), rules.greaterThanOrEqual(-20)]"
              )
                template(v-slot:prepend)
                  q-avatar(size="md")
                    img(:src="imageUrl('hvoice.svg')")
            .bg-internal-bg.full-height.q-ml-sm.q-pa-sm.rounded-border-2.q-px-lg
              .text-body2 {{ this.$store.state.proposals.draft.pegCoefficient.value || 0 }}
        .col.q-pa-sm(v-if="fields.rewardCoefficient")
          .text-h6 {{ `${fields.rewardCoefficient.label} (${$store.state.dao.settings.rewardToken})` }}
          .row.items-center
            .col
              q-input.q-my-sm.rounded-border(
                v-model="rewardCoefficientLabel" outlined suffix="%"
                :readonly="fields.rewardCoefficient.disabled"
                :rules="[rules.lessOrEqualThan(20), rules.greaterThanOrEqual(-20)]"
              )
                template(v-slot:prepend)
                  q-avatar(size="md")
                    img(:src="imageUrl('hvoice.svg')")
            .bg-internal-bg.full-height.q-ml-sm.q-pa-sm.rounded-border-2.q-px-lg
              .text-body2 {{ this.$store.state.proposals.draft.rewardCoefficient.value || 0 }}
        .col.q-pa-sm(v-if="fields.voiceCoefficient")
          .text-h6 {{ `${fields.voiceCoefficient.label} (${$store.state.dao.settings.voiceToken})` }}
          .row.items-center
            .col
              q-input.q-my-sm.rounded-border(
                v-model="voiceCoefficientLabel" outlined suffix="%"
                :readonly="fields.voiceCoefficient.disabled"
                :rules="[rules.lessOrEqualThan(20), rules.greaterThanOrEqual(-20)]"
              )
                template(v-slot:prepend)
                  q-avatar(size="md")
                    img(:src="imageUrl('hvoice.svg')")
            .bg-internal-bg.full-height.q-ml-sm.q-pa-sm.rounded-border-2.q-px-lg
              .text-body2 {{ this.$store.state.proposals.draft.voiceCoefficient.value || 0 }}
  .row.q-py-md(v-if="fields.custom")
    q-toggle(v-model="custom" :label="fields.custom.label")
  .next-step.q-py-md
    .row.justify-between
      .nothing
      .buttons
        q-btn.q-px-md.q-mr-md(no-caps rounded flat color="primary" label="Prev step" @click="$emit('prev')")
        q-btn.q-px-md(no-caps rounded color="primary" :disable="disabledNext" label="Next step" @click="$emit('next')")
</template>

<style lang="stylus" scoped>
.rounded-border-2
  border-radius 12px
.rounded-border
  :first-child
    border-radius 12px
</style>
