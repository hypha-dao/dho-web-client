<script>
import { mapGetters } from 'vuex'
import { validation } from '~/mixins/validation'
export default {
  name: 'step-compensation',
  mixins: [validation],
  components: {
    PayoutAmounts: () => import('~/components/common/payout-amounts.vue'),
    Widget: () => import('~/components/common/widget.vue'),
    InfoTooltip: () => import('~/components/common/info-tooltip.vue'),
    TokenLogo: () => import('~/components/common/token-logo.vue')
  },

  props: {
    fields: Object
  },

  data () {
    return {
      // custom: false,
      salaryOption: null,
      firstPaintCommitment: true,
      firstPaintDeferred: true,
      toggle: true,
      cycleDurationSec: 2629800
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
        if (this.deferred > 0) {
          this.firstPaintDeferred = false
        }
      }
    },
    commitment: {
      immediate: true,
      handler () {
        this.calculateTokens()
        if (this.commitment > 0) {
          this.firstPaintCommitment = false
        }
      }
    },

    // '$store.state.proposals.draft.type': {
    //   immediate: true,
    //   handler () {
    //     this.custom = false
    //   }
    // },

    '$store.state.proposals.draft.annualUsdSalary': {
      immediate: true,
      handler (val) {
        if (!this.custom) {
          if (val === 0) {
            this.salaryOption = null
          }
          this.calculateTokens()
        }
      }
    }
  },

  computed: {
    ...mapGetters('dao', ['daoSettings']),
    nextDisabled () {
      const proposalType = this.$store.state.proposals.draft.category.key

      if (proposalType === 'assignment' && (!this.annualUsdSalary || this.deferred < 1 || this.commitment < 1 || !this.isValidCommitment(this.commitment) || !this.isValidDeferred(this.deferred))) {
        return true
      } else if (proposalType === 'archetype' && !this.annualUsdSalary) {
        return true
      } else if (proposalType === 'obadge' && (this.rewardCoefficientLabel < -20 || this.voiceCoefficientLabel < -20 || this.pegCoefficientLabel < -20 || this.rewardCoefficientLabel > 20 || this.voiceCoefficientLabel > 20 || this.pegCoefficientLabel > 20)) {
        return true
      } else if (proposalType === 'contribution' && (!this.usdAmount || this.usdAmount <= 0) && !this.custom) {
        return true
      }
      // if (!this.usdAmount && this.$store.state.proposals.draft.category.key !== 'assignment') {
      //   return true
      // } else if (!this.annualUsdSalary && this.$store.state.proposals.draft.category.key !== 'archetype') {
      //   return true
      // }
      return false
    },

    custom: {
      get () {
        return this.$store.state.proposals.draft.custom
      },

      set (value) {
        this.$store.commit('proposals/setCustom', value)
      }
    },

    usdAmount: {
      get () {
        return this.$store.state.proposals.draft.usdAmount || null
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
        this.$store.commit('proposals/setCommitment', parseFloat(value))
      }
    },

    deferred: {
      get () {
        return this.$store.state.proposals.draft.deferred || 0
      },

      set (value) {
        this.$store.commit('proposals/setDeferred', parseFloat(value))
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
        this.$store.commit('proposals/setMinDeferred', parseFloat(value))
      }
    },

    annualUsdSalary: {
      get () {
        return this.$store.state.proposals.draft.annualUsdSalary || null
      },

      set (value) {
        this.$store.commit('proposals/setAnnualUsdSalary', parseFloat(value))
      }
    },

    rewardCoefficientLabel: {
      get () {
        return this.$store.state.proposals.draft.rewardCoefficient.label || 0
      },

      set (value) {
        this.$store.commit('proposals/setRewardCoefficientLabel', parseFloat(value))
        this.$store.commit('proposals/setRewardCoefficient', this.calculateCoefficient(value))
      }
    },

    voiceCoefficientLabel: {
      get () {
        return this.$store.state.proposals.draft.voiceCoefficient.label || 0
      },

      set (value) {
        this.$store.commit('proposals/setVoiceCoefficientLabel', parseFloat(value))
        this.$store.commit('proposals/setVoiceCoefficient', this.calculateCoefficient(value))
      }
    },

    pegCoefficientLabel: {
      get () {
        return this.$store.state.proposals.draft.pegCoefficient.label || 0
      },

      set (value) {
        this.$store.commit('proposals/setPegCoefficientLabel', parseFloat(value))
        this.$store.commit('proposals/setPegCoefficient', this.calculateCoefficient(value))
      }
    },
    showToggle () {
      const proposalType = this.$store.state.proposals.draft.category.key
      return proposalType === 'assignment' || proposalType === 'contribution'
    },
    periodsOnCycle () {
      return (this.cycleDurationSec / this.daoSettings.periodDurationSec).toFixed(2)
    },
    cashToken () {
      return (this.peg / this.periodsOnCycle).toFixed(2)
    },
    utilityToken () {
      return (this.reward / this.periodsOnCycle).toFixed(2)
    },
    voiceToken () {
      return (this.voice / this.periodsOnCycle).toFixed(2)
    },
    isAssignment () {
      const proposalType = this.$store.state.proposals.draft.category.key
      return proposalType === 'assignment'
    }
  },
  // mounted () {
  //   if (!this.pegCoefficientLabel) {
  //     this.$store.commit('proposals/setPegCoefficientLabel', 0)
  //     this.$store.commit('proposals/setPegCoefficient', this.calculateCoefficient(0))
  //   }
  // },

  methods: {
    isValidCommitment (commitment) {
      const proposalType = this.$store.state.proposals.draft.category.key
      if (proposalType === 'assignment') {
        const roleSelected = this.$store.state.proposals.draft.role
        const minCommitment = roleSelected.details_minTimeShareX100_i ? roleSelected.details_minTimeShareX100_i : roleSelected.minCommitment

        if (!minCommitment) return true

        if (commitment >= minCommitment) {
          return true
        } return false
      } else return true
    },

    isValidDeferred (deferred) {
      const proposalType = this.$store.state.proposals.draft.category.key
      if (proposalType === 'assignment') {
        const roleSelected = this.$store.state.proposals.draft.role
        const minDeferred = roleSelected.details_minDeferredX100_i ? roleSelected.details_minDeferredX100_i : roleSelected.minDeferred
        if (!minDeferred) return true
        if (deferred >= minDeferred) {
          return true
        } return false
      } else return true
    },

    imageUrl (icon) {
      return require('~/assets/icons/' + icon)
    },

    calculateTokens () {
      if (!this.custom) {
        this.$store.dispatch('proposals/calculateTokens')
      }
    },

    calculateCoefficient (coefficient) {
      // if (!coefficient || coefficient === 0) return 0
      return ((coefficient * 100) + 10000)
    }
  }
}
</script>

<template lang="pug">
widget
  .row
    label.h-h4 {{ fields.stepCompensationTitle ? fields.stepCompensationTitle.label : 'Payout' }}
  .row.q-my-sm
    .text-body2.text-grey-7(v-if="fields.stepCompensationTitle && fields.stepCompensationTitle.description") {{ fields.stepCompensationTitle.description }}
  .row.q-col-gutter-sm.q-mt-xl
    .col(v-if="fields.usdAmount")
      label.h-label {{ fields.usdAmount.label }}
      .text-body2.text-grey-7.q-my-md(v-if="fields.usdAmount.description") {{ fields.usdAmount.description }}

      .row.full-width.items-center.q-mt-xs
        q-avatar(size='40px').q-mr-xs
          img(src="~assets/icons/usd.svg")
        q-input.rounded-border.col(
          :disable="custom"
          dense
          outlined
          rounded
          suffix="$"
          type='number'
          v-model="usdAmount"
          placeholder='Type the amount of HUSD'
        )

    .col(v-if="fields.commitment").q-pr-sm
      label.h-label {{ fields.commitment.label }}
      .text-body2.text-grey-7.q-my-md(v-if="fields.commitment.description") {{ fields.commitment.description }}
      .row.full-width.justify-center.items-center.q-pl-xs.q-pt-xs
        .col.q-pr-xs
          q-slider(
            v-model="commitment"
            :min="0"
            :max="100"
            :step="1"
            color="primary"
          )
        .col-4
          q-input.q-ma-none.q-pa-none.rounded-border(
            :disable="custom"
            :rules="[val => val >= 0 && val <= 100]"
            dense
            outlined
            rounded
            suffix="%"
            v-model.number="commitment"
          )
      .row
        .text-negative.h-b2.q-ml-xs(v-if="!isValidCommitment(commitment) && !firstPaintCommitment") Commitment must be greater than or equal to the role configuration. Role value for min commitment is {{ this.$store.state.proposals.draft.minCommitment }} %

    .col(v-if="fields.deferred").q-pl-sm
      label.h-label {{ fields.deferred.label }}
      .text-body2.text-grey-7(v-if="fields.deferred.description") {{ fields.deferred.description }}
      .row.full-width.justify-center.items-center.q-pl-xs.q-pt-xs
        .col.q-pr-xs
          q-slider(
            :disable="custom"
            :max="100"
            :min="0"
            :step="1"
            color="primary"
            v-model="deferred"
          )
        .col-4
          q-input.q-ma-none.q-pa-none.rounded-border(
            :disable="custom"
            :rules="[val => val >= 0 && val <= 100]"
            dense
            outlined
            rounded
            suffix="%"
            v-model.number="deferred"
          )
      .row
        .text-negative.h-b2.q-ml-xs(v-if="!isValidDeferred(deferred) && !firstPaintDeferred") Deferred must be greater than or equal to the role configuration. Role value for min deferred is {{ this.$store.state.proposals.draft.minDeferred }} %

    .col-6(v-if="fields.annualUsdSalary")
      label.h-label {{ fields.annualUsdSalary.label }}
      .text-body2.text-grey-7.q-my-md(v-if="fields.annualUsdSalary.description") {{ fields.annualUsdSalary.description }}
      q-select.q-mt-xs.rounded-border(
        :options="fields.annualUsdSalary.options"
        dense
        emit-value
        map-options
        outlined
        placeholder="B2 - $ 100.000/year"
        rounded
        v-model="annualUsdSalary"
      )

    .col-6(v-if="fields.roleCapacity")
      label.h-label {{ fields.roleCapacity.label }}
      .text-body2.text-grey-7.q-my-md(v-if="fields.roleCapacity.description") {{ fields.roleCapacity.description }}
      q-input.q-mt-xs.rounded-border(
        dense
        outlined
        rounded
        v-model="roleCapacity"
      )

  .row.full-width.q-mt-xl(v-if="fields.minDeferred")
    label.h-label {{ fields.minDeferred.label }}
    .text-body2.text-grey-7.q-my-md(v-if="fields.minDeferred.description") {{ fields.minDeferred.description }}
    .row.full-width.items-center.q-pl-xxs
      .col-8.q-pr-md
        q-slider(
          v-model="minDeferred"
          :min="0"
          :max="100"
          :step="1"
          color="primary"
        )
      .col-4.q-pl-sm.q-mt-md
        q-input.rounded-border(
          :rules="[val => val >= 0 && val <= 100]"
          outlined
          rounded
          v-model.number="minDeferred"
          dense
          suffix="%"
        )

  .row.full-width.q-pt-md(v-if="$store.state.proposals.draft.annualUsdSalary")
    label.h-label(v-if="$store.state.proposals.draft.annualUsdSalary.toString().includes('USD')") {{ `Salary compensation for one year ( $${$store.state.proposals.draft.annualUsdSalary} )` }}
    label.h-label(v-else) {{ `Salary compensation for one year ( $${$store.state.proposals.draft.annualUsdSalary} USD )` }}

  .row.q-mt-xxxl
    label.h-h4 Tokens redistribution
    .text-body2.text-grey-7.q-my-md Please enter the USD equivalent and % deferral for this contribution – the more you defer to a later date, the higher the bonus will be (see actual salary calculation below or use our calculator). The bottom fields compute the actual payout in SEEDS, HVOICE, HYPHA and HUSD.

  .row.q-col-gutter-xs.q-mt-sm
    .col-4(v-if="fields.reward")
      label.h-label {{ `${fields.reward.label} (${$store.state.dao.settings.rewardToken})` }}
      .row.full-width.items-center.q-mt-xs
        token-logo(size='40px' type='utility' :daoLogo="daoSettings.logo").q-mr-xs
        q-input.rounded-border.col(
          dense
          :readonly="!custom"
          outlined
          v-model="!toggle ? reward : utilityToken"
          rounded
          v-if="isAssignment"
        )
        q-input.rounded-border.col(
          dense
          :readonly="!custom"
          outlined
          v-model="reward"
          rounded
          v-else
        )

    .col-4(v-if="fields.peg")
      label.h-label {{ `${fields.peg.label} (${$store.state.dao.settings.pegToken})` }}
      .row.full-width.items-center.q-mt-xs
        token-logo(size='40px' type='cash' :daoLogo="daoSettings.logo").q-mr-xs
        q-input.rounded-border.col(
          dense
          :readonly="!custom"
          outlined
          v-model="!toggle ? peg : cashToken"
          rounded
          v-if="isAssignment"
        )
        q-input.rounded-border.col(
          dense
          :readonly="!custom"
          outlined
          v-model="peg"
          rounded
          v-else
        )

    .col-4(v-if="fields.voice")
      label.h-label {{ `${fields.voice.label} (${$store.state.dao.settings.voiceToken})` }}
      .row.full-width.items-center.q-mt-xs
        token-logo(size='40px' type='voice' :daoLogo="daoSettings.logo").q-mr-xs
        q-input.rounded-border.col(
          dense
          :readonly="!custom"
          outlined
          v-model="!toggle ? voice : voiceToken"
          rounded
          v-if="isAssignment"
        )
        q-input.rounded-border.col(
          dense
          :readonly="!custom"
          outlined
          v-model="voice"
          rounded
          v-else
        )
  .row.items-center.q-mt-md(v-if="showToggle")
    template(v-if="fields.custom")
      .col-1
        q-toggle(v-model="custom" size="md")
      .col.q-mt-xxs Custom compensation
    template(v-else)
      .col-1
        q-toggle(v-model="toggle" size="md")
      .col.q-mt-xxs Compensation for one period
  //- .row.bg-grey-2.q-pa-md
  .row.q-py-md
    // TODO: Salary preview

    // Multiplier
    .full-width(v-if="fields.rewardCoefficient || fields.voiceCoefficient || fields.pegCoefficient")
      //- label.h-label.text-bold Multiplier
      //- .text-body2.text-grey-7.q-my-md Lorem ipsum this is a test description
      .row
        .col(v-if="fields.rewardCoefficient")
          label.h-label {{ `${fields.rewardCoefficient.label} (${$store.state.dao.settings.rewardToken})` }}
          .row.items-center
            .col
              q-input.q-my-sm.rounded-border(
                v-model="rewardCoefficientLabel" outlined suffix="%"
                :prefix="fields.rewardCoefficient.disabled ? 'x' : rewardCoefficientLabel > 9 ? 'x1.' : 'x1.0'"
                :readonly="fields.rewardCoefficient.disabled"
                :rules="[rules.lessOrEqualThan(20), rules.greaterThanOrEqual(-20)]"
              )
                template(v-slot:prepend)
                  token-logo(size='md' type='utility' :daoLogo="daoSettings.logo").logo-border
            //- .bg-internal-bg.full-height.q-ml-sm.rounded-border-2.q-px-lg
            //-   .text-body2 {{ this.$store.state.proposals.draft.rewardCoefficient.value || 0 }}
        .col(v-if="fields.pegCoefficient")
          label.h-label {{ `${fields.pegCoefficient.label} (${$store.state.dao.settings.pegToken})` }}
          .row.items-center
            .col
              q-input.q-my-sm.rounded-border(
                v-model="pegCoefficientLabel" outlined suffix="%"
                :prefix="fields.pegCoefficient.disabled ? 'x' : pegCoefficientLabel > 9 ? 'x1.' : 'x1.0'"
                :readonly="fields.pegCoefficient.disabled"
                :rules="[rules.lessOrEqualThan(20), rules.greaterThanOrEqual(-20)]"
              )
                template(v-slot:prepend)
                  token-logo(size='md' type='cash' :daoLogo="daoSettings.logo").logo-border

        //- .col.q-pa-sm(v-if="fields.rewardCoefficient")
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
            //- .bg-internal-bg.full-height.q-ml-sm.q-pa-sm.rounded-border-2.q-px-lg
            //-   .text-body2 {{ this.$store.state.proposals.draft.rewardCoefficient.value || 0 }}
        .col(v-if="fields.voiceCoefficient")
          label.h-label {{ `${fields.voiceCoefficient.label} (${$store.state.dao.settings.voiceToken})` }}
          .row.items-center
            .col
              q-input.q-my-sm.rounded-border(
                v-model="voiceCoefficientLabel" outlined suffix="%"
                :prefix="fields.voiceCoefficient.disabled ? 'x' : voiceCoefficientLabel > 9 ? 'x1.' : 'x1.0'"
                :readonly="fields.voiceCoefficient.disabled"
                :rules="[rules.lessOrEqualThan(20), rules.greaterThanOrEqual(-20)]"
              )
                template(v-slot:prepend)
                  token-logo(size='md' type='voice' :daoLogo="daoSettings.logo").logo-border
            //- .bg-internal-bg.full-height.q-ml-sm.rounded-border-2.q-px-lg
            //-   .text-body2 {{ this.$store.state.proposals.draft.voiceCoefficient.value || 0 }}
  //- .row.q-py-md(v-if="fields.custom")
  //-   q-toggle(v-model="custom" :label="fields.custom.label")
  nav.row.justify-end.q-mt-xl.q-gutter-xs
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
      :disable="nextDisabled"
      @click="$emit('next')"
      color="primary"
      label="Next step"
      no-caps
      rounded
      unelevated
    )
</template>

<style lang="stylus" scoped>
.logo-border >>> div
  border-radius: 50% !important
.rounded-border-2
  border-radius 12px
.rounded-border
  :first-child
    border-radius 12px
</style>
