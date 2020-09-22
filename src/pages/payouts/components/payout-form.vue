<script>
import { uid } from 'quasar'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { validation } from '~/mixins/validation'
import { profileRequired } from '~/mixins/profile-required'
import { forms } from '~/mixins/forms'
import { format } from '~/mixins/format'
import PeriodSelect from '~/components/form/period-select'

const defaultDesc = 'Please describe in a paragraph or two why you are getting this payout.  We recommend to add a link to other supporting documents in the text box below.'

export default {
  name: 'payout-form',
  mixins: [forms, validation, profileRequired, format],
  components: { PeriodSelect },
  props: {
    draft: { type: Object }
  },
  data () {
    return {
      rules: {
        periodBefore: () => {
          if (!this.form.startPeriod || !this.form.endPeriod) {
            return true
          }
          return new Date(this.form.startPeriod.startDate).getTime() < new Date(this.form.endPeriod.startDate).getTime() || 'The start period must be before the end period'
        }
      },
      form: {
        id: uid(),
        title: null,
        description: defaultDesc,
        recipient: null,
        url: null,
        amount: 0,
        deferred: 0,
        startPeriod: null,
        endPeriod: null,
        cycles: null,
        deferredSeeds: 0.00,
        hvoice: 0.00,
        hypha: 0.00,
        husd: 0.00
      },
      manualInput: false,
      isFullScreen: false,
      submitting: false
    }
  },
  computed: {
    ...mapGetters('periods', ['periodOptionsStartContribution']),
    ...mapGetters('accounts', ['account']),
    ...mapGetters('payouts', ['seedsToUsd'])
  },
  mounted () {
    this.form.recipient = this.account
  },
  methods: {
    ...mapActions('profiles', ['saveDraft']),
    ...mapActions('payouts', ['saveProposal']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    async onSaveDraft () {
      await this.resetValidation(this.form)
      if (!(await this.validate(this.form))) return
      this.submitting = true
      const success = await this.saveDraft({ type: 'payout', draft: this.form })
      if (success) {
        await this.reset()
        this.hideForm()
        if (this.$route.path !== '/proposals/payout') {
          await this.$router.push({ path: '/proposals/payout' })
        }
      }
      this.submitting = false
    },
    async reset () {
      this.form = {
        id: uid(),
        title: null,
        description: defaultDesc,
        recipient: null,
        url: null,
        amount: 0,
        deferred: 0,
        instant: 0,
        startPeriod: null,
        endPeriod: null,
        cycles: null,
        deferredSeeds: 0.00,
        hvoice: 0.00,
        hypha: 0.00,
        husd: 0.00
      }
      await this.resetValidation(this.form)
    },
    hideForm () {
      this.setShowRightSidebar(false)
      this.setRightSidebarType(null)
    },
    computeTokens (amount, deferred) {
      const deferredSan = isNaN(deferred) ? 0 : parseFloat(deferred || 0)
      const ratioUsdEquity = parseFloat(amount || 0)
      this.form.hvoice = ratioUsdEquity
      this.form.deferredSeeds = (ratioUsdEquity / this.seedsToUsd * (deferredSan / 100) * this.$config.contracts.seedsMultiplier).toFixed(2)
      this.form.hypha = (ratioUsdEquity * deferredSan / 100 * this.$config.contracts.hyphaMultiplier).toFixed(2)
      this.form.husd = (ratioUsdEquity * (1 - deferredSan / 100)).toFixed(2)
    }
  },
  watch: {
    manualInput: {
      handler (val) {
        if (val) {
          this.form.amount = 0
          this.form.deferred = 0
        } else {
          this.form.deferredSeeds = 0
          this.form.hypha = 0
          this.form.husd = 0
          this.form.hvoice = 0
        }
      }
    },
    'form.amount': {
      immediate: true,
      handler (val) {
        if (this.manualInput) return
        this.computeTokens(val, this.form.deferred)
      }
    },
    'form.deferred': {
      immediate: true,
      handler (val) {
        if (this.manualInput) return
        if (parseFloat(val) === 100) {
          this.form.instant = '0'
        }
        this.computeTokens(this.form.amount, val)
      }
    },
    'form.startPeriod': {
      immediate: true,
      deep: true,
      handler (val) {
        if (this.form.endPeriod && val) {
          this.form.cycles = (this.form.endPeriod.value - val.value) / 4
        }
      }
    },
    'form.endPeriod': {
      immediate: true,
      deep: true,
      handler (val) {
        if (val && this.form.startPeriod) {
          this.form.cycles = (val.value - this.form.startPeriod.value) / 4
        }
      }
    },
    draft: {
      immediate: true,
      handler (val) {
        if (val) {
          this.form = {
            ...val
          }
        } else {
          this.reset()
        }
      }
    }
  }
}
</script>

<template lang="pug">
.q-pa-xs
  q-input(
    ref="title"
    v-model="form.title"
    color="accent"
    label="Title"
    maxlength="100"
    :rules="[rules.required]"
    lazy-rules
    outlined
    dense
  )
  q-editor(
    v-model="form.description"
    :fullscreen.sync="isFullScreen"
    min-height="100px"
    :toolbar="isFullScreen ? fullScreenToolbar : defaultToolbar"
  )
  fieldset.q-mt-sm
    legend Supporting documentation
    q-input(
      ref="url"
      v-model="form.url"
      color="accent"
      label="URL Link"
      :rules="[rules.url]"
      lazy-rules
      outlined
      dense
    )
      template(v-slot:append)
        q-icon(
          name="fas fa-link"
          size="xs"
        )
  fieldset.q-mt-sm
    legend Payout
    p
      | Please enter the USD equivalent and % deferral for this contribution – the more you defer to a later date, the higher the bonus will be (see actual salary calculation below or use our&nbsp;
      a(href="https://drive.google.com/open?id=1xngcdfqhoqE9uCUURybUDU5pCYrI3UjY6aIgf1auD38" target="_blank" style="text-decoration:none") calculator
      |). The bottom fields compute the actual payout in SEEDS, HVOICE, HYPHA and HUSD.
    .row.q-col-gutter-xs(v-if="!manualInput")
      .col-xs-12.col-md-6
        q-input(
          ref="amount"
          v-model="form.amount"
          type="number"
          color="accent"
          label="USD"
          :rules="[rules.positiveAmount]"
          lazy-rules
          outlined
          dense
          :readonly="manualInput"
          @blur="form.amount = parseFloat(form.amount).toFixed(0)"
        )
          template(v-slot:append)
            q-icon(
              name="fas fa-dollar-sign"
              size="xs"
            )
      .col-xs-12.col-md-6
        q-input(
          ref="deferred"
          v-model="form.deferred"
          type="number"
          color="accent"
          label="Deferred"
          :rules="[rules.positiveAmount, rules.lessOrEqualThan(100)]"
          lazy-rules
          outlined
          dense
          :readonly="manualInput"
          @blur="form.deferred = parseFloat(form.deferred).toFixed(0)"
        )
          template(v-slot:append)
            q-icon(
              name="fas fa-percentage"
              size="xs"
            )
    .row.q-my-sm
      strong SALARY CALCULATION
    .row.q-col-gutter-xs
      .col-6
        q-input.bg-seeds.text-black(
          v-model="form.deferredSeeds"
          type="number"
          outlined
          dense
          :readonly="!manualInput"
        )
          template(v-slot:append)
            q-icon(
              name="img:statics/app/icons/seeds.png"
              size="xs"
            )
        .hint Deferred Seeds
      .col-6
        q-input.bg-liquid.text-black(
          v-model="form.husd"
          type="number"
          outlined
          dense
          :readonly="!manualInput"
        )
        .hint HUSD
      .col-6
        q-input.bg-liquid.text-black(
          v-model="form.hvoice"
          type="number"
          outlined
          dense
          :readonly="!manualInput"
        )
        .hint HVOICE
      .col-6
        q-input.bg-liquid.text-black(
          v-model="form.hypha"
          type="number"
          outlined
          dense
          :readonly="!manualInput"
        )
        .hint HYPHA
    .row
      q-toggle(v-model="manualInput" label="Edit token fields (toggle back will erase the values)")
  fieldset.q-mt-sm
    legend Lunar cycles
    p Please select your lunar start and end date or lunar start date and number of lunar cycles.
    .row.q-col-gutter-sm
      .col-xs-12.col-md-4
        period-select(
          ref="startPeriod"
          :value.sync="form.startPeriod"
          :period="form.startPeriod && form.startPeriod.value"
          :periods="periodOptionsStartContribution.slice(0, 12 * 4)"
          label="Start phase"
          required
        )
      .col-xs-12.col-md-4
        period-select(
          ref="endPeriod"
          :value.sync="form.endPeriod"
          :period="form.startPeriod && (form.cycles || 0) && ((parseInt(form.startPeriod.value) + Math.min(parseInt(form.cycles || 0), 12) * 4) || 0)"
          :periods="form.startPeriod && periodOptionsStartContribution.filter(p => p.phase === form.startPeriod.phase && p.value > form.startPeriod.value).slice(0, 12)"
          label="End phase"
          required
        )
      .col-xs-12.col-md-4
        q-input(
          v-model="form.cycles"
          label="Cycles"
          type="number"
          readonly
          outlined
          dense
        )
          template(v-slot:append)
            q-icon(
              name="fas fa-hashtag"
              size="xs"
            )
  .text-center.q-mt-sm
    q-btn.q-mr-sm(
      label="Cancel"
      rounded
      color="grey"
      dense
      unelevated
      @click="hideForm"
    )
    q-btn(
      label="Save draft"
      rounded
      color="green"
      dense
      unelevated
      :loading="submitting"
      @click="onSaveDraft"
    )
</template>

<style lang="stylus" scoped>
fieldset
  border-radius 4px
  border 1px solid rgba(0,0,0,.24)
  legend
    text-transform uppercase
    font-size 12px
  p
    font-size 12px
button
  width 30%
</style>
