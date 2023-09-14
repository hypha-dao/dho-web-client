<script>
import { mapActions, mapGetters } from 'vuex'
import { validation } from '~/mixins/validation'
import currency from 'src/data/currency.json'
import map from '~/utils/map'
import { MIN_TOKEN_MULTIPLIER, MAX_TOKEN_MULTIPLIER } from '~/const'

const mapCurrency = (currency) => (_) => ({
  label: `${currency[_]?.symbol} - ${currency[_]?.name}`,
  value: currency[_].code,
  ...currency[_]
})

const MIN_DECAY = 0
const MAX_DECAY = 10000000

export default {
  name: 'settings-token',
  mixins: [validation],
  components: {
    CustomPeriodInput: () => import('~/components/form/custom-period-input.vue'),
    InputSlider: () => import('~/components/form/input-slider.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    form: {
      type: Object,
      default: () => {}
    },

    isAdmin: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      tokens: {
        // Treasury token (aka peg_token = treasuryDigits treasurySymbol)
        treasuryName: null,
        treasurySymbol: null,
        treasuryDigits: 2, // 1.0, 1.00, 1.000
        treasuryTokenMultiplier: 1,
        treasuryCurrency: {
          label: `${currency.USD?.symbol} - ${currency.USD?.name}`,
          value: currency.USD.code,
          ...currency.USD
        },

        // Utilitrt token
        utilityName: null,
        utilitySymbol: null,
        utilityDigits: 2, // 1.0, 1.00, 1.000
        utilityTokenMultiplier: 1,
        utilityAmount: null, // i.e 100000 or -1 for infinite supply

        // Voice token (aka voice_token = voiceDigits voiceSymbol)
        voiceName: 'Voice Token',
        voiceSymbol: 'VOICE',
        voiceDigits: 2, // 1.0, 1.00, 1.000
        voiceTokenMultiplier: 1,
        voiceDecayPeriod: 604800,
        voiceDecayPercent: 1,

        use_seeds: false
      }
    }
  },

  computed: {
    ...mapGetters('dao', ['daoSettings', 'selectedDao']),

    currencies () { return Object.keys(currency).map(mapCurrency(currency)) },

    selectedCurrency () { return this.currencies.find(_ => _.value === this.tokens.treasuryCurrency) }
  },

  methods: {
    ...mapActions('dao', ['createTokens']),

    async _createTokens () {
      try {
        const isValid = await this.validate(this.tokens)
        if (isValid) {
          await this.createTokens({
            ...this.tokens,

            utilityTokenMultiplier: map(this.tokens.utilityTokenMultiplier, 0, 100, MIN_TOKEN_MULTIPLIER, MAX_TOKEN_MULTIPLIER),
            voiceTokenMultiplier: map(this.tokens.voiceTokenMultiplier, 0, 100, MIN_TOKEN_MULTIPLIER, MAX_TOKEN_MULTIPLIER),
            treasuryTokenMultiplier: map(this.tokens.treasuryTokenMultiplier, 0, 100, MIN_TOKEN_MULTIPLIER, MAX_TOKEN_MULTIPLIER),

            voiceDecayPercent: map(this.tokens.voiceDecayPercent, 0, 100, MIN_DECAY, MAX_DECAY)
          })
        }
      } catch (e) {
        const message = e.message || e.cause.message
        this.showNotification({ message, color: 'red' })
      }
    },

    initTokens () {
      if (!this.selectedDao.hasCustomToken) return

      const [treasuryDigits, treasurySymbol] = this.daoSettings.settings_pegToken_a.split(' ')
      const [utilityDigits, utilitySymbol] = this.daoSettings.settings_rewardToken_a.split(' ')
      const [voiceDigits, voiceSymbol] = this.daoSettings.settings_voiceToken_a.split(' ')
      const [utilityAmount] = this.daoSettings?.settings_rewardTokenMaxSupply_a?.split(' ')

      this.tokens = {
        // ...this.tokens,
        treasuryName: this.daoSettings.settings_pegTokenName_s || treasurySymbol,
        treasurySymbol,
        treasuryDigits: treasuryDigits.split('.')[1].length, // 1.0, 1.00, 1.000
        treasuryTokenMultiplier: this.daoSettings.settings_treasuryTokenMultiplier_i,

        // // Utility token
        utilityName: this.daoSettings.settings_rewardTokenName_s || utilitySymbol,
        utilitySymbol,
        utilityDigits: utilityDigits.split('.')[1].length, // 1.0, 1.00, 1.000, // 1.0, 1.00, 1.000
        utilityTokenMultiplier: this.daoSettings.settings_utilityTokenMultiplier_i,
        utilityAmount: parseInt(utilityAmount) === -1 ? '∞' : utilityAmount, // i.e 100000 or -1 for infinite supply

        // // Voice token
        voiceName: voiceSymbol,
        voiceSymbol,
        voiceDigits: voiceDigits.split('.')[1].length,
        voiceTokenMultiplier: this.daoSettings.settings_voiceTokenMultiplier_i,
        voiceDecayPeriod: this.daoSettings.settings_voiceTokenDecayPeriod_i,
        voiceDecayPercent: map(this.daoSettings.settings_voiceTokenDecayPerPeriodX10M_i, MIN_DECAY, MAX_DECAY, 0, 100)

      }
    }
  },

  watch: {
    daoSettings: {
      handler: function (value) {
        if (value) {
          this.initTokens()
        }
      },
      immediate: true
    },

    selectedCurrency: {
      handler: function (value) {
        if (value) {
          this.tokens.treasuryCurrency = value?.code
        }
      },
      immediate: true
    }

    // 'tokens.treasuryCurrency': {
    //   handler: function (value) {
    //     if (value) {
    //       this.tokens.treasuryName = value?.name
    //       this.tokens.treasurySymbol = value?.code
    //     }
    //   },
    //   immediate: true
    // }

  }

}

</script>

<template lang="pug">
.tab.settings-token
  widget(:title="$t('configuration.settings-tokens.title')" titleImage='/svg/core-voting.svg' bar).q-pa-none.full-width
    p.text-sm.text-h-gray.leading-loose.q-mt-md {{ $t('configuration.settings-tokens.description') }}

    section.q-mt-md.row.q-col-gutter-xs
      //- PAYOUT TOKEN
      .col-12.col-md-4
        widget(:title="$t('configuration.settings-tokens.tresury.title')" shadow bar).full-height
          p.text-sm.text-h-gray.leading-loose.q-mt-md {{ $t('configuration.settings-tokens.tresury.description') }}
          .hr.q-my-xl

          #form
            .row.q-col-gutter-md
              .col-12.col-md-6
                label.h-label {{ $t('configuration.settings-tokens.tresury.form.name.label') }}
                q-input.q-my-xs(
                  :debounce="200"
                  :disable="selectedDao.hasCustomToken || !isAdmin"
                  :filled="selectedDao.hasCustomToken || !isAdmin"
                  :placeholder="$t('configuration.settings-tokens.utility.form.name.placeholder')"
                  :rules="[rules.required]"
                  color="accent"
                  dense
                  lazy-rules
                  outlined
                  ref="treasuryName"
                  rounded
                  v-model='tokens.treasuryName'
                )
                q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!selectedDao.hasCustomToken") {{ $t('common.onlyDaoAdmins') }}

              .col-12.col-md-6
                label.h-label {{ $t('configuration.settings-tokens.tresury.form.symbol.label') }}
                q-input.q-my-xs(
                  :debounce="200"
                  :disable="selectedDao.hasCustomToken || !isAdmin"
                  :filled="selectedDao.hasCustomToken || !isAdmin"
                  :placeholder="$t('configuration.settings-tokens.utility.form.symbol.placeholder')"
                  :rules="[rules.required, rules.isTokenAvailable]"
                  dense
                  lazy-rules
                  mask="AAAAAAAA"
                  maxlength="7"
                  outlined
                  ref="treasurySymbol"
                  rounded
                  v-model="tokens.treasurySymbol"
                )
                q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!selectedDao.hasCustomToken") {{ $t('common.onlyDaoAdmins') }}

            .col-12(:class="{ 'invisible': selectedDao.hasCustomToken }")
              label.h-label {{ $t('configuration.settings-tokens.tresury.form.currency.label') }}
              q-select.q-my-xs(
                :disable="!isAdmin"
                :options="currencies"
                :rules="[rules.required]"
                :style='{"min-height":"60px"}'
                dense
                dropdown-icon="fas fa-chevron-down"
                hide-bottom-space
                options-dense
                outlined
                rounded
                v-model="tokens.treasuryCurrency"
              )
              q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!selectedDao.hasCustomToken") {{ $t('common.onlyDaoAdmins') }}

            .col-12.invisible
              label.h-label {{ $t('configuration.settings-tokens.tresury.form.multiplier.label') }}
              q-input.q-my-xs(
                :debounce="200"
                :disable="!selectedDao.hasCustomToken"
                :max="100"
                :min="0"
                :placeholder="$t('configuration.settings-tokens.tresury.form.value.placeholder')"
                :rules="[rules.required, rules.greaterThan(0), rules.lessOrEqualThan(100)]"
                bg-color="white"
                color="accent"
                dense
                lazy-rules
                outlined
                ref="treasuryTokenMultiplier"
                rounded
                suffix="x"
                v-model='tokens.treasuryTokenMultiplier'
              )
              q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!selectedDao.hasCustomToken") {{ $t('common.onlyDaoAdmins') }}

            .col-12
              label.h-label {{ $t('configuration.settings-tokens.tresury.form.digits.label') }}
              input-slider(
                :disable="selectedDao.hasCustomToken || !isAdmin"
                :max="3"
                :maxLabel="$t('configuration.settings-tokens.tresury.form.digits.morePrecise')"
                :min="1"
                :minLabel="$t('configuration.settings-tokens.tresury.form.digits.lessPrecise')"
                :step="1"
                v-model="tokens.treasuryDigits"
              )

      //- UTILITY TOKEN
      .col-12.col-md-4
        widget(:title="$t('configuration.settings-tokens.utility.title')" shadow bar).full-height
          p.text-sm.text-h-gray.leading-loose.q-mt-md {{ $t('configuration.settings-tokens.utility.description') }}
          .hr.q-my-xl

          #form
            .row.q-col-gutter-md
              .col-12.col-md-6
                label.h-label {{ $t('configuration.settings-tokens.utility.form.name.label') }}
                q-input.q-my-xs(
                  :debounce="200"
                  :disable="selectedDao.hasCustomToken || !isAdmin"
                  :filled="selectedDao.hasCustomToken || !isAdmin"
                  :placeholder="$t('configuration.settings-tokens.utility.form.name.placeholder')"
                  :rules="[rules.required]"
                  color="accent"
                  dense
                  lazy-rules
                  outlined
                  ref="utilityName"
                  rounded
                  v-model='tokens.utilityName'
                )
                q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!selectedDao.hasCustomToken") {{ $t('common.onlyDaoAdmins') }}

              .col-12.col-md-6
                label.h-label {{ $t('configuration.settings-tokens.utility.form.symbol.label') }}
                q-input.q-my-xs(
                  :debounce="200"
                  :disable="selectedDao.hasCustomToken || !isAdmin"
                  :filled="selectedDao.hasCustomToken || !isAdmin"
                  :placeholder="$t('configuration.settings-tokens.utility.form.symbol.placeholder')"
                  :rules="[rules.required, rules.isTokenAvailable]"
                  dense
                  lazy-rules
                  mask="AAAAAAAA"
                  maxlength="7"
                  outlined
                  ref="utilitySymbol"
                  rounded
                  v-model="tokens.utilitySymbol"
                )
                q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!selectedDao.hasCustomToken") {{ $t('common.onlyDaoAdmins') }}

            .col-12
              label.h-label {{ $t('configuration.settings-tokens.utility.form.value.label') }}
              q-input.q-my-xs(
                :debounce="200"
                :disable="selectedDao.hasCustomToken || !isAdmin"
                :filled="selectedDao.hasCustomToken || !isAdmin"
                :placeholder="$t('configuration.settings-tokens.utility.form.value.placeholder')"
                :rules="[rules.requiredIf(tokens.utilityAmount > 0)]"
                color="accent"
                dense
                lazy-rules
                outlined
                ref="utilityAmount"
                rounded
                v-model='tokens.utilityAmount'
              )
              q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!selectedDao.hasCustomToken") {{ $t('common.onlyDaoAdmins') }}

            .col-12
              label.h-label {{ $t('configuration.settings-tokens.utility.form.multiplier.label') }}
              q-input.q-my-xs(
                :debounce="200"
                :disable="selectedDao.hasCustomToken || !isAdmin"
                :filled="selectedDao.hasCustomToken || !isAdmin"
                :max="100"
                :min="0"
                :rules="[rules.required, rules.greaterThan(0), rules.lessOrEqualThan(100)]"
                color="accent"
                dense
                lazy-rules
                outlined
                ref="utilityTokenMultiplier"
                rounded
                suffix="x"
                v-model='tokens.utilityTokenMultiplier'
              )
              q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!selectedDao.hasCustomToken") {{ $t('common.onlyDaoAdmins') }}

            .col-12
              label.h-label {{ $t('configuration.settings-tokens.utility.form.digits.label') }}
              input-slider(
                :disable="selectedDao.hasCustomToken || !isAdmin"
                :max="3"
                :maxLabel="$t('configuration.settings-tokens.tresury.form.digits.morePrecise')"
                :min="1"
                :minLabel="$t('configuration.settings-tokens.tresury.form.digits.lessPrecise')"
                :step="1"
                v-model="tokens.utilityDigits"
              )

      //- VOICE TOKEN
      .col-12.col-md-4
        widget(:title="$t('configuration.settings-tokens.voice.title')" shadow bar).full-height
          p.text-sm.text-h-gray.leading-loose.q-mt-md {{ $t('configuration.settings-tokens.voice.description') }}
          .hr.q-my-xl

          #form
            .row.q-col-gutter-md
              .col-12.col-md-6(:class="{'q-mt-sm': !$q.screen.gt.md}")
                label.h-label {{ $t('configuration.settings-tokens.voice.form.name.label') }}
                q-input.q-my-xs(
                  :placeholder="$t('configuration.settings-tokens.voice.form.name.placeholder')"
                  :rules="[rules.required]"
                  dense
                  disable
                  filled
                  lazy-rules
                  ref="voiceName"
                  rounded
                  v-model='tokens.voiceName'
                )
                q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!selectedDao.hasCustomToken") {{ $t('common.onlyDaoAdmins') }}

              .col-12.col-md-6(:class="{'q-mt-sm': !$q.screen.gt.md}")
                label.h-label {{ $t('configuration.settings-tokens.voice.form.symbol.label') }}
                q-input.q-my-xs(
                  :placeholder="$t('configuration.settings-tokens.voice.form.symbol.placeholder')"
                  :rules="[rules.required]"
                  dense
                  disable
                  filled
                  lazy-rules
                  ref="voiceSymbol"
                  rounded
                  v-model='tokens.voiceSymbol'
                )
                q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!selectedDao.hasCustomToken") {{ $t('common.onlyDaoAdmins') }}

            .row.q-col-gutter-md
              .col-12.col-md-8(:class="{'q-mt-sm': !$q.screen.gt.md}")
                label.h-label {{ $t('configuration.settings-tokens.voice.form.decayPeriod.label') }}
                custom-period-input.q-my-xs(:disable="selectedDao.hasCustomToken || !isAdmin" v-model='tokens.voiceDecayPeriod')
                q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!selectedDao.hasCustomToken") {{ $t('common.onlyDaoAdmins') }}

              .col-12.col-md-4(:class="{'q-mt-sm': !$q.screen.gt.md}")
                label.h-label {{ $t('configuration.settings-tokens.voice.form.decayPercent.label') }}
                q-input.q-my-xs(
                  :debounce="200"
                  :disable="selectedDao.hasCustomToken || !isAdmin"
                  :filled="selectedDao.hasCustomToken || !isAdmin"
                  :max="100"
                  :min="0"
                  :placeholder="$t('configuration.settings-tokens.voice.form.decayPercent.placeholder')"
                  :rules="[rules.required, rules.greaterThan(0), rules.lessOrEqualThan(100)]"
                  color="accent"
                  dense
                  lazy-rules
                  outlined
                  ref="voiceDecayPercent"
                  rounded
                  suffix="%"
                  type="number"
                  v-model='tokens.voiceDecayPercent'
                )
                q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!selectedDao.hasCustomToken") {{ $t('common.onlyDaoAdmins') }}

            .col-12
              label.h-label {{ $t('configuration.settings-tokens.voice.form.multiplier.label') }}
              q-input.q-my-xs(
                :debounce="200"
                :disable="selectedDao.hasCustomToken || !isAdmin"
                :filled="selectedDao.hasCustomToken || !isAdmin"
                :max="100"
                :min="0"
                :rules="[rules.required, rules.greaterThan(0), rules.lessOrEqualThan(100)]"
                color="accent"
                dense
                lazy-rules
                outlined
                ref="voiceTokenMultiplier"
                rounded
                suffix="x"
                v-model='tokens.voiceTokenMultiplier'
              )
              q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-if="!selectedDao.hasCustomToken") {{ $t('common.onlyDaoAdmins') }}

            .col-12
              label.h-label {{ $t('configuration.settings-tokens.voice.form.digits.label') }}
              input-slider(
                :disable="selectedDao.hasCustomToken || !isAdmin"
                :max="3"
                :maxLabel="$t('configuration.settings-tokens.tresury.form.digits.morePrecise')"
                :min="1"
                :minLabel="$t('configuration.settings-tokens.tresury.form.digits.lessPrecise')"
                :step="1"
                v-model="tokens.voiceDigits"
              )

    nav.full-width.q-my-xl.row.justify-end(v-if="!selectedDao.hasCustomToken")
      q-btn.col-auto.q-px-xl.rounded-border.text-bold.q-mr-xs(
        :label="$t('configuration.settings-tokens.nav.cancel')"
        color="white"
        no-caps
        rounded
        text-color="primary"
        unelevated
      )
      q-btn.col-auto.q-px-xl.rounded-border.text-bold.q-ml-xs(
        :label="$t('configuration.settings-tokens.nav.submit')"
        @click="_createTokens"
        color="secondary"
        no-caps
        rounded
        unelevated
      )
</template>

<style lang="stylus" scoped>
</style>
