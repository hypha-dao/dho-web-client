<script>
import { uid } from 'quasar'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { validation } from '~/mixins/validation'
import { forms } from '~/mixins/forms'
import PeriodSelect from '~/components/form/period-select'

const defaultDesc = 'Please describe in a paragraph or two why you are getting this payout.  We recommend to add a link to other supporting documents in the text box below.'

export default {
  name: 'payout-form',
  mixins: [forms, validation],
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
        cycles: null
      },
      display: {
        deferredSeeds: 0,
        liquidSeeds: 0,
        hvoice: 0,
        hypha: 0,
        husd: 0
      },
      isFullScreen: false,
      submitting: false
    }
  },
  computed: {
    ...mapGetters('periods', ['periodOptionsStartContribution']),
    ...mapGetters('accounts', ['account']),
    ...mapGetters('profiles', ['isConnected'])
  },
  mounted () {
    this.form.recipient = this.account
  },
  methods: {
    ...mapActions('profiles', ['saveDraft', 'connectProfileApi']),
    ...mapActions('payouts', ['saveProposal']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    async onSaveDraft () {
      await this.resetValidation(this.form)
      if (!(await this.validate(this.form))) return
      this.submitting = true
      if (!this.isConnected) {
        await this.connectProfileApi()
      }
      const success = await this.saveDraft({ type: 'contribution', draft: this.form })
      if (success) {
        await this.reset()
        this.hideForm()
        if (this.$route.path !== '/proposals/contribution') {
          await this.$router.push({ path: '/proposals/contribution' })
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
        cycles: null
      }
      await this.resetValidation(this.form)
    },
    hideForm () {
      this.setShowRightSidebar(false)
      this.setRightSidebarType(null)
    },
    computeTokens (amount, deferred, instant) {
      const deferredSan = isNaN(deferred) ? 0 : parseFloat(deferred || 0)
      const instantSan = isNaN(instant) ? 0 : parseFloat(instant || 0)
      const ratioUsdEquity = parseFloat(amount || 0)
      this.display.hvoice = (2 * ratioUsdEquity).toFixed(2)
      this.display.deferredSeeds = (ratioUsdEquity * deferredSan / 100 * (1.3 / 0.01) + (ratioUsdEquity * (1 - deferredSan / 100)) / 0.01).toFixed(4)
      this.display.hypha = (ratioUsdEquity * deferredSan / 100 * 0.6).toFixed(2)
      this.display.husd = (ratioUsdEquity * (1 - deferredSan / 100) * (instantSan / 100)).toFixed(2)
      this.display.liquidSeeds = (ratioUsdEquity * (1 - deferredSan / 100) * (1 - instantSan / 100)).toFixed(2)
    }
  },
  watch: {
    'form.amount': {
      immediate: true,
      handler (val) {
        this.computeTokens(val, this.form.deferred, this.form.instant)
      }
    },
    'form.deferred': {
      immediate: true,
      handler (val) {
        this.computeTokens(this.form.amount, val, this.form.instant)
      }
    },
    'form.instant': {
      immediate: true,
      handler (val) {
        this.computeTokens(this.form.amount, this.form.deferred, val)
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
  fieldset.q-mt-sm
    legend Payout
    p Please enter your USD equivalent and % deferral for this contribution. The more you defer to a later date, the higher the bonus will be.
    .row.q-col-gutter-xs
      .col-xs-12.col-md-4
        q-input(
          ref="amount"
          v-model="form.amount"
          type="number"
          color="accent"
          label="USD"
          :rules="[rules.required, rules.positiveAmount]"
          lazy-rules
          outlined
          dense
          @blur="form.amount = parseFloat(form.amount).toFixed(0)"
        )
          template(v-slot:append)
            q-icon(
              name="fas fa-dollar-sign"
              size="xs"
            )
      .col-xs-12.col-md-4
        q-input(
          ref="deferred"
          v-model="form.deferred"
          type="number"
          color="accent"
          label="Deferred"
          :rules="[rules.required, rules.positiveAmount, rules.lessOrEqualThan(100)]"
          lazy-rules
          outlined
          dense
          @blur="form.deferred = parseFloat(form.deferred).toFixed(0)"
        )
          template(v-slot:append)
            q-icon(
              name="fas fa-percentage"
              size="xs"
            )
      .col-xs-12.col-md-4
        q-input(
          ref="instant"
          v-model="form.instant"
          type="number"
          color="accent"
          label="HUSD"
          :rules="[rules.required, rules.positiveAmount, rules.lessOrEqualThan(100)]"
          lazy-rules
          outlined
          dense
          @blur="form.instant = parseFloat(form.instant).toFixed(0)"
        )
          template(v-slot:append)
            q-icon(
              name="fas fa-percentage"
              size="xs"
            )
    .row.q-col-gutter-xs
      .col-6
        q-input.bg-seeds.text-black(
          v-model="display.deferredSeeds"
          outlined
          dense
          readonly
        )
          template(v-slot:append)
            q-icon(
              name="img:statics/app/icons/seeds.png"
              size="xs"
            )
        .hint Deferred Seeds
      .col-6
        q-input.bg-seeds.text-black(
          v-model="display.liquidSeeds"
          outlined
          dense
          readonly
        )
          template(v-slot:append)
            q-icon(
              name="img:statics/app/icons/seeds.png"
              size="xs"
            )
        .hint Liquid Seeds
      .col-4
        q-input.bg-liquid.text-black(
          v-model="display.hvoice"
          outlined
          dense
          readonly
        )
        .hint hvoice
      .col-4
        q-input.bg-liquid.text-black(
          v-model="display.hypha"
          outlined
          dense
          readonly
        )
        .hint hypha
      .col-4
        q-input.bg-liquid.text-black(
          v-model="display.husd"
          outlined
          dense
          readonly
        )
        .hint husd
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
          ref="cycles"
          v-model="form.cycles"
          label="Cycles"
          type="number"
          :rules="[rules.required, rules.positiveAmount]"
          lazy-rules
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
