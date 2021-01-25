<script>
import { uid } from 'quasar'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { validation } from '~/mixins/validation'
import { profileRequired } from '~/mixins/profile-required'
import { forms } from '~/mixins/forms'
import { format } from '~/mixins/format'
import PeriodSelect from '~/components/form/period-select'

const defaultDesc = 'Hypha applies a pattern of <b>Objectives and Key Results (OKRs)</b> to all assignments. At the beginning of your assignment, state your <b>Objective</b> (e.g. "Have a thriving community on SEEDS"), which is something that you and/or your circle hope to accomplish within the next quarter <em>as well as</em> <b>2-5 Key Results</b>, which are measurable expressions of success or progress towards this objective (e.g. "Invite 100 new Residents"). At the time of your re-evaluation, write down how much of your KR you completed towards your Objective (e.g. "80% completed"). Then, repeat the process for the next quarter assignment, keeping the previous OKRs for reference. We recommend to add a link to a video, CV, or other supporting documents, below.'

export default {
  name: 'assignment-form',
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
        description: defaultDesc,
        url: null,
        salaryCommitted: null,
        salaryDeferred: null,
        startPeriod: null,
        endPeriod: null,
        cycles: null,
        edit: false
      },
      display: {
        deferredSeeds: 0,
        hvoice: 0,
        hypha: 0,
        husd: 0
      },
      isFullScreen: false,
      submitting: false,
      monthly: false
    }
  },
  computed: {
    ...mapGetters('periods', ['periodOptionsStartProposal', 'periodOptionsEditProposal']),
    ...mapGetters('payouts', ['seedsToUsd']),
    title () {
      if (!this.form.role) return ''
      const data = this.form.role.strings.find(o => o.key === 'title')
      return (data && data.value) || ''
    },
    minCommitted () {
      if (!this.form.role) return 0
      const data = this.form.role.ints.find(o => o.key === 'min_time_share_x100')
      return (data && data.value && data.value) || 0
    },
    minDeferred () {
      if (!this.form.role) return 0
      const data = this.form.role.ints.find(o => o.key === 'min_deferred_x100')
      return (data && data.value && data.value) || 0
    },
    usdEquity () {
      if (!this.form.role) return ''
      const data = this.form.role.assets.find(o => o.key === 'annual_usd_salary')
      return (data && data.value && parseFloat(data.value).toFixed(2)) || ''
    },
    idStartPeriod () {
      if (!this.form.role) return 0
      const data = this.form.role.ints.find(o => o.key === 'start_period')
      return (data && data.value) || 0
    },
    idEndPeriod () {
      if (!this.form.role) return 0
      const data = this.form.role.ints.find(o => o.key === 'end_period')
      return (data && data.value + 52) || 1e20 // 52 (periods/weeks): Extend up to 12 months after the end date of the role
    }
  },
  methods: {
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    ...mapActions('profiles', ['saveDraft']),
    async onSaveDraft () {
      await this.resetValidation(this.form)
      if (!(await this.validate(this.form))) return
      this.submitting = true
      const success = await this.saveDraft({
        type: 'assignment',
        draft: this.form
      })
      if (success) {
        await this.reset()
        this.hideForm()
        if (this.$router.currentRoute.path !== '/proposals/assignment') {
          await this.$router.push({ path: '/proposals/assignment' })
        }
      }
      this.submitting = false
    },
    async reset () {
      this.form = {
        id: uid(),
        description: defaultDesc,
        url: null,
        salaryCommitted: null,
        salaryDeferred: null,
        startPeriod: null,
        endPeriod: null,
        cycles: null,
        edit: false
      }
      await this.resetValidation(this.form)
    },
    hideForm () {
      this.setShowRightSidebar(false)
      this.setRightSidebarType(null)
    },
    computeTokens (committed, deferred) {
      const committedSan = isNaN(committed) ? 0 : parseFloat(committed || 0)
      const deferredSan = isNaN(deferred) ? 0 : parseFloat(deferred || 0)
      const ratioUsdEquity = parseFloat(this.usdEquity || 0) * committedSan / 100
      this.display.hvoice = this.toAsset((2 * ratioUsdEquity / (365.25 / 7.4)) * (this.monthly ? 4 : 1))
      this.display.hypha = this.toAsset((ratioUsdEquity * deferredSan / 100 * this.$config.contracts.hyphaMultiplier / (365.25 / 7.4)) * (this.monthly ? 4 : 1))
      this.display.husd = this.toAsset((ratioUsdEquity * (1 - deferredSan / 100) / (365.25 / 7.4)) * (this.monthly ? 4 : 1))
    }
  },
  watch: {
    monthly: {
      immediate: true,
      handler () {
        this.computeTokens(this.form.salaryCommitted, this.form.salaryDeferred)
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
    'form.salaryCommitted': {
      immediate: true,
      handler (val) {
        this.computeTokens(val, this.form.salaryDeferred)
      }
    },
    'form.salaryDeferred': {
      immediate: true,
      handler (val) {
        this.computeTokens(this.form.salaryCommitted, val)
      }
    },
    draft: {
      immediate: true,
      handler (val) {
        if (val) {
          if (val.type === 'new') {
            this.reset()
            this.form.role = val.role
          } else {
            this.form = {
              ...val
            }
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
  strong.title {{ title }}
  q-editor.q-mt-sm(
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
    legend Salary
    p
      | Please enter your % commitment and % HYPHA tokens vs. HUSD tokens for this assignment.
      | The payout of this assignment computes the corresponding amounts in HVOICE, HYPHA and HUSD for a {{ this.monthly ? 'full lunar cycle (ca. 1 month)' : 'single lunar period (ca. 1 week)' }}.
    .row.q-col-gutter-xs.q-mb-md
      .col-xs-12.col-md-6
        q-input(
          ref="salaryCommitted"
          v-model="form.salaryCommitted"
          type="number"
          color="accent"
          label="Committed"
          :rules="[rules.required, rules.positiveAmount, rules.lessOrEqualThan(100), rules.greaterThanOrEqual(minCommitted)]"
          :hint="`Min ${minCommitted}%`"
          lazy-rules
          outlined
          dense
          @blur="form.salaryCommitted = parseFloat(form.salaryCommitted).toFixed(0)"
        )
          template(v-slot:append)
            q-icon(
              name="fas fa-percentage"
              size="xs"
            )
      .col-xs-12.col-md-6
        q-input(
          ref="salaryDeferred"
          v-model="form.salaryDeferred"
          type="number"
          color="accent"
          label="Deferred"
          :rules="[rules.required, rules.positiveAmount, rules.lessOrEqualThan(100), rules.greaterThanOrEqual(minDeferred)]"
          :hint="`Min ${minDeferred}%`"
          lazy-rules
          outlined
          dense
          @blur="form.salaryDeferred = parseFloat(form.salaryDeferred).toFixed(0)"
        )
          template(v-slot:append)
            q-icon(
              name="fas fa-percentage"
              size="xs"
            )
    .row.q-my-sm
      strong SALARY CALCULATION (BASED ON USD EQUIVALENT OF USD {{ usdEquity }})
    .row.q-col-gutter-xs
      .col-4
        q-input.bg-liquid.text-black(
          v-model="display.husd"
          outlined
          dense
          readonly
        )
        .hint husd
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
    .row
      q-toggle(v-model="monthly" label="Show tokens for a full lunar cycle (ca. 1 month)")
  fieldset.q-mt-sm
    legend Lunar cycles
    p This is the lunar start and re-evaluation date for this assignment, followed by the number of lunar cycles. We recommend a maximum of 3 cycles before reevaluation.
    .row.q-col-gutter-sm
      .col-xs-12.col-md-4
        period-select(
          ref="startPeriod"
          :value.sync="form.startPeriod"
          :period="form.startPeriod && form.startPeriod.value"
          :periods="form.edit ? periodOptionsEditProposal : periodOptionsStartProposal.filter(o => o.value >= idStartPeriod).slice(0, 8)"
          label="Start phase"
          required
        )
      .col-xs-12.col-md-4
        period-select(
          ref="endPeriod"
          :value.sync="form.endPeriod"
          :period="form.edit ? form.endPeriod && form.endPeriod.value : form.startPeriod && (form.cycles || 0) && ((parseInt(form.startPeriod.value) + Math.min(parseInt(form.cycles || 0), 12) * 4) || 0)"
          :periods="form.startPeriod && periodOptionsStartProposal.filter(p => p.phase === form.startPeriod.phase && p.value > form.startPeriod.value && p.value <= idEndPeriod).slice(0, 3)"
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
.title
  font-size 20px
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
.hint
  margin-top 2px
  text-transform uppercase
  font-size 12px
</style>
