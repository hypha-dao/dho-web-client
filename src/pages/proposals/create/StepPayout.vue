<script>
import { mapGetters } from 'vuex'
import { validation } from '~/mixins/validation'
import { format } from '~/mixins/format'
import { PROPOSAL_TYPE } from '~/const'

export default {
  name: 'step-payout',
  mixins: [validation, format],
  components: {
    InfoTooltip: () => import('~/components/common/info-tooltip.vue'),
    PayoutAmounts: () => import('~/components/common/payout-amounts.vue'),
    TokenLogo: () => import('~/components/common/token-logo.vue'),
    Widget: () => import('~/components/common/widget.vue'),
    CreationStepper: () => import('~/components/proposals/creation-stepper.vue')
  },

  props: {
    fields: Object,
    stepIndex: Number,
    steps: Array,
    currentStepName: String,
    disablePrevButton: Boolean
  },

  data () {
    return {
      PROPOSAL_TYPE,

      cycleDurationSec: 2629800,
      firstPaintCommitment: true,
      firstPaintDeferred: true,
      salaryOption: null,
      toggle: false
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

  mounted () {
    if (!this.daoSettings.cashClaimsEnabled && this.isContribution) {
      this.deferred = 100
    }
  },

  computed: {
    ...mapGetters('dao', ['daoSettings', 'selectedDao']),
    nextDisabled () {
      const proposalType = this.$store.state.proposals.draft.category.key

      if (
        proposalType === 'assignment' &&
        (
          !this.annualUsdSalary ||
          this.deferred < 1 ||
          this.commitment < 1 ||
          !this.isValidCommitment(this.commitment) ||
          !this.isValidDeferred(this.deferred))) {
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

    isFounderRole: {
      get () {
        return this.$store.state.proposals.draft.role.label === 'Founders' &&
          this.$store.state.proposals.draft.tier.label === 'Founders'
      }
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
      return proposalType === 'assignment' || proposalType === 'contribution' || proposalType === 'archetype'
    },
    periodsOnCycle () {
      return (this.cycleDurationSec / this.daoSettings.periodDurationSec).toFixed(2)
    },
    cashToken () {
      return !this.toggle ? this.getFormatedTokenAmount(this.peg, Number.MAX_VALUE) : this.getFormatedTokenAmount((this.peg / this.periodsOnCycle).toFixed(2), Number.MAX_VALUE)
    },
    utilityToken () {
      return !this.toggle ? this.getFormatedTokenAmount(this.reward, Number.MAX_VALUE) : this.getFormatedTokenAmount((this.reward / this.periodsOnCycle).toFixed(2), Number.MAX_VALUE)
    },
    voiceToken () {
      return !this.toggle ? this.getFormatedTokenAmount(this.voice, Number.MAX_VALUE) : this.getFormatedTokenAmount((this.voice / this.periodsOnCycle).toFixed(2), Number.MAX_VALUE)
    },
    isAssignment () {
      const proposalType = this.$store.state.proposals.draft.category.key
      return proposalType === 'assignment' || proposalType === 'archetype'
    },
    isContribution () {
      const proposalType = this.$store.state.proposals.draft.category.key
      return proposalType === 'contribution'
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
        return deferred >= this.minDeferred
      }

      return true
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
widget(:class="{ 'disable-step': currentStepName !== 'step-payout' && $q.screen.gt.md }")
  .row
    label.h-h4 {{ fields.stepCompensationTitle ? fields.stepCompensationTitle.label : $t('pages.proposals.create.steppayout.payout') }}
  .row.q-my-sm
    .text-body2.text-grey-7(v-if="fields.stepCompensationTitle && fields.stepCompensationTitle.description") {{ fields.stepCompensationTitle.description }}
  .text-body2.text-grey-7.q-mb-xl(v-if="$q.screen.lt.md || $q.screen.md") {{ $t('pages.proposals.create.steppayout.pleaseEnterTheUsd') }}
  .q-col-gutter-sm(:class="{ 'row':$q.screen.gt.md, 'q-mt-xl':$q.screen.gt.md }")
    .col(v-if="fields.usdAmount" :class="{ 'q-mb-xxl':$q.screen.lt.md || $q.screen.md }")
      label.h-label {{ fields.usdAmount.label }}
      .text-body2.text-grey-7.q-my-md(v-if="fields.usdAmount.description") {{ fields.usdAmount.description }}
      .row.full-width.items-center.q-mt-xs
        q-avatar.q-mr-xs(size="40px")
          img(src="~assets/icons/usd.svg")
        q-input.rounded-border.col(:disable="custom" dense outlined rounded suffix="$" type="number" v-model="usdAmount" :placeholder="$t('pages.proposals.create.steppayout.typeTheAmountOfUsd')")
    .col.q-pr-sm(v-if="fields.commitment")
      label.h-label {{ fields.commitment.label }}
      .text-body2.text-grey-7.q-my-md(v-if="fields.commitment.description") {{ fields.commitment.description }}
      .row.full-width.justify-center.items-center.q-pl-xs.q-pt-xs
        .col.q-pr-xs
          q-slider(v-model="commitment" :min="0" :max="100" :step="1" color="primary")
        .col-4
          q-input.q-ma-none.q-pa-none.rounded-border(:disable="custom" :rules="[val => val >= 0 && val <= 100]" dense outlined rounded suffix="%" v-model.number="commitment")
      .row
        .text-negative.h-b2.q-ml-xs(v-if="!isValidCommitment(commitment) && !firstPaintCommitment") {{ $t('pages.proposals.create.steppayout.commitmentMustBeGreater') }}
          | {{ this.$store.state.proposals.draft.minCommitment }}
          | %
    .col.q-pl-sm(v-if="fields.deferred")
      label.h-label {{ fields.deferred.label }}
      .text-body2.text-grey-7(v-if="fields.deferred.description") {{ fields.deferred.description }}
      .full-width.justify-center.items-center.q-pl-xs.q-pt-xs(:class="{ 'row':$q.screen.gt.md }")
        .col.q-pr-xs
          q-slider(:disable="custom || (!daoSettings.cashClaimsEnabled && isContribution)" :max="100" :min="0" :step="1" color="primary" v-model="deferred")
        .col-4
          q-input.q-ma-none.q-pa-none.rounded-border(:disable="custom || (!daoSettings.cashClaimsEnabled && isContribution)" :rules="[val => val >= 0 && val <= 100]" dense outlined rounded suffix="%" v-model.number="deferred")
      .row
        .text-negative.h-b2.q-ml-xs(v-if="!isValidDeferred(deferred) && !firstPaintDeferred") {{ $t('pages.proposals.create.steppayout.defferedMustBeGreater') }}
    .col-6(v-if="fields.annualUsdSalary")
      label.h-label {{ fields.annualUsdSalary.label }}
      .text-body2.text-grey-7.q-my-md(v-if="fields.annualUsdSalary.description") {{ fields.annualUsdSalary.description }}
      q-select.q-mt-xs.rounded-border(:options="fields.annualUsdSalary.options" dense emit-value map-options outlined placeholder="B2 - $ 100.000/year" rounded v-model="annualUsdSalary")
    .col-6(v-if="fields.roleCapacity")
      label.h-label {{ fields.roleCapacity.label }}
      .text-body2.text-grey-7.q-my-md(v-if="fields.roleCapacity.description") {{ fields.roleCapacity.description }}
      q-input.q-mt-xs.rounded-border(dense outlined rounded v-model="roleCapacity")
  .row.full-width.q-mt-xl(v-if="fields.minDeferred")
    label.h-label {{ fields.minDeferred.label }}
    .text-body2.text-grey-7.q-my-md(v-if="fields.minDeferred.description") {{ fields.minDeferred.description }}
    .row.full-width.items-center.q-pl-xxs
      .col-8.q-pr-md
        q-slider(v-model="minDeferred" :min="0" :max="100" :step="1" color="primary")
      .col-4.q-pl-sm.q-mt-md
        q-input.rounded-border(:rules="[val => val >= 0 && val <= 100]" outlined rounded v-model.number="minDeferred" dense suffix="%")
  .row.full-width.q-pt-md(v-if="$store.state.proposals.draft.annualUsdSalary")
    label.h-label(v-if="$store.state.proposals.draft.annualUsdSalary.toString().includes('USD')") {{ $t('pages.proposals.create.steppayout.salaryCompensationForOneYear', { value: $store.state.proposals.draft.annualUsdSalary }) }}
    label.h-label(v-else) {{ $t('pages.proposals.create.steppayout.salaryCompensationForOneYearUsd', { value: $store.state.proposals.draft.annualUsdSalary }) }}
  .row.q-mt-xxxl(v-if="$q.screen.gt.md")
    label.h-h4 {{ $t('pages.proposals.create.steppayout.compensation') }}
    .text-body2.text-grey-7.q-my-md.full-width {{ $t('pages.proposals.create.steppayout.belowYouCanSeeTheActual') }}
  .row(v-if="isAssignment")
    label.text-bold {{ toggle ? $t('pages.proposals.create.steppayout.compensationForOnePeriod') : $t('pages.proposals.create.steppayout.compensationForOneCycle') }}
  .q-col-gutter-xs.q-mt-sm(:class="{ 'q-mt-xxl':$q.screen.lt.md || $q.screen.md, 'row':$q.screen.gt.md }")
    .col-4(:class="{ 'q-mt-md':$q.screen.lt.md || $q.screen.md }" v-if="fields.reward && selectedDao.hasCustomToken")
      label.h-label(v-if="$store.state.dao.settings.rewardToken !== 'HYPHA'") {{ `${fields.reward.label} (${$store.state.dao.settings.rewardToken})` }}
      label.h-label(v-else) {{ `${fields.reward.label}` }}
      .row.full-width.items-center.q-mt-xs
        token-logo.q-mr-xs(size="40px" type="utility" :daoLogo="daoSettings.logo")
        q-input.rounded-border.col(dense :readonly="!custom" outlined v-model="utilityToken" rounded v-if="isAssignment && !isFounderRole")
        q-input.rounded-border.col(dense :readonly="!custom" outlined v-model="reward" rounded v-else)
    .col-4(:class="{ 'q-mt-md':$q.screen.lt.md || $q.screen.md }" v-if="fields.peg")
      label.h-label(v-if="$store.state.dao.settings.pegToken !== 'HUSD'") {{ `${fields.peg.label} ${$store.state.dao.settings.pegToken ? `(${$store.state.dao.settings.pegToken})`:''}`}}
      label.h-label(v-else) {{ `${fields.peg.label}` }}
      .row.full-width.items-center.q-mt-xs
        token-logo.q-mr-xs(size="40px" type="cash" :daoLogo="daoSettings.logo")
        q-input.rounded-border.col(dense :readonly="!custom" outlined v-model="cashToken" rounded v-if="isAssignment && !isFounderRole")
        q-input.rounded-border.col(dense :readonly="!custom || !daoSettings.cashClaimsEnabled" outlined v-model="peg" rounded v-else)
    .col-4(:class="{ 'q-mt-md':$q.screen.lt.md || $q.screen.md }" v-if="fields.voice")
      label.h-label(v-if="$store.state.dao.settings.voiceToken !== 'HVOICE'") {{ `${fields.voice.label} (${$store.state.dao.settings.voiceToken})` }}
      label.h-label(v-else) {{ `${fields.voice.label}` }}
      .row.full-width.items-center.q-mt-xs
        token-logo.q-mr-xs(size="40px" type="voice" :daoLogo="daoSettings.logo")
        q-input.rounded-border.col(dense :readonly="!custom" outlined v-model="voiceToken" rounded v-if="isAssignment && !isFounderRole")
        q-input.rounded-border.col(dense :readonly="!custom" outlined v-model="voice" rounded v-else)
  .row.items-center.q-mt-md(v-if="showToggle")
    template(v-if="fields.custom || isFounderRole")
      div(:class="{ 'col-1':$q.screen.gt.md }")
        q-toggle(v-model="custom" size="md")
      .col.q-mt-xxs {{ $t('pages.proposals.create.steppayout.customCompensation') }}
    template(v-else)
      div(:class="{ 'col-1':$q.screen.gt.md }")
        q-toggle(v-model="toggle" size="md")
      .col.q-mt-xxs {{ $t('pages.proposals.create.steppayout.compensationForOnePeriod') }}
      q-tooltip(v-if="toggle") {{ $t('pages.proposals.create.steppayout.1MoonPeriod') }}
      q-tooltip(v-else) {{ $t('pages.proposals.create.steppayout.1MoonCycle') }}
  .row.q-py-md
    // TODO: Salary preview
    // Multiplier
    .full-width(v-if="fields.rewardCoefficient || fields.voiceCoefficient || fields.pegCoefficient")
      .row
        .col(v-if="fields.rewardCoefficient")
          label.h-label(v-if="$store.state.dao.settings.rewardToken !== 'HYPHA'") {{ `${fields.rewardCoefficient.label} (${$store.state.dao.settings.rewardToken})` }}
          label.h-label(v-else) {{ `${fields.rewardCoefficient.label}` }}
          .row.items-center
            .col
              q-input.q-my-sm.rounded-border(v-model="rewardCoefficientLabel" outlined suffix="%" :prefix="fields.rewardCoefficient.disabled ? 'x' : rewardCoefficientLabel > 9 ? 'x1.' : 'x1.0'" :readonly="fields.rewardCoefficient.disabled" :rules="[rules.lessOrEqualThan(20), rules.greaterThanOrEqual(-20)]")
                template(v-slot:prepend)
                  token-logo.logo-border(size="md" type="utility" :daoLogo="daoSettings.logo")
        .col(v-if="fields.pegCoefficient")
          label.h-label(v-if="$store.state.dao.settings.pegToken !== 'HUSD'") {{ `${fields.pegCoefficient.label} (${$store.state.dao.settings.pegToken})` }}
          label.h-label(v-else) {{ `${fields.pegCoefficient.label}` }}
          .row.items-center
            .col
              q-input.q-my-sm.rounded-border(v-model="pegCoefficientLabel" outlined suffix="%" :prefix="fields.pegCoefficient.disabled ? 'x' : pegCoefficientLabel > 9 ? 'x1.' : 'x1.0'" :readonly="fields.pegCoefficient.disabled" :rules="[rules.lessOrEqualThan(20), rules.greaterThanOrEqual(-20)]")
                template(v-slot:prepend)
                  token-logo.logo-border(size="md" type="cash" :daoLogo="daoSettings.logo")
        .col(v-if="fields.voiceCoefficient")
          label.h-label(v-if="$store.state.dao.settings.voiceToken !== 'HVOICE'") {{ `${fields.voiceCoefficient.label} (${$store.state.dao.settings.voiceToken})` }}
          label.h-label(v-else) {{ `${fields.voiceCoefficient.label}` }}
          .row.items-center
            .col
              q-input.q-my-sm.rounded-border(v-model="voiceCoefficientLabel" outlined suffix="%" :prefix="fields.voiceCoefficient.disabled ? 'x' : voiceCoefficientLabel > 9 ? 'x1.' : 'x1.0'" :readonly="fields.voiceCoefficient.disabled" :rules="[rules.lessOrEqualThan(20), rules.greaterThanOrEqual(-20)]")
                template(v-slot:prepend)
                  token-logo.logo-border(size="md" type="voice" :daoLogo="daoSettings.logo")
  nav.row.justify-end.q-mt-xl.q-gutter-xs(v-if="$q.screen.gt.md")
    q-btn.h-btn2.q-px-xl(v-if="!disablePrevButton" @click="$emit('prev')" color="primary" :label="$t('pages.proposals.create.steppayout.back')" no-caps outline rounded flat)
    q-btn.q-px-xl(:disable="nextDisabled" @click="$emit('next')" color="primary" :label="$t('pages.proposals.create.steppayout.nextStep')" no-caps rounded unelevated)
  template(v-if="$q.screen.lt.md || $q.screen.md")
    q-card(:style="'border-radius: 25px; box-shadow: none; z-index: 7000; position: fixed; bottom: -20px; left: 0; right: 0; box-shadow: 0px 0px 26px 0px rgba(0, 0, 41, 0.2);'")
      creation-stepper(
        :activeStepIndex="stepIndex"
        :steps="steps"
        :nextDisabled="nextDisabled"
        @publish="$emit('publish')"
        @save="$emit('save')"
        @next="$emit('next')"
      )
</template>

<style lang="stylus" scoped>
.logo-border >>> div
  border-radius: 50% !important
.rounded-border-2
  border-radius 12px

</style>
