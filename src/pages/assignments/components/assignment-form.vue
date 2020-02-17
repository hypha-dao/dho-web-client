<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { validation } from '~/mixins/validation'
import { forms } from '~/mixins/forms'
import PeriodSelect from '~/components/form/period-select'

const defaultDesc = 'Please describe in a paragraph or two why you are a good fit for this role.  We recommend to add a link to a video, CV, or other supporting documents.'

export default {
  name: 'assignment-form',
  mixins: [forms, validation],
  components: { PeriodSelect },
  props: {
    role: { type: Object, required: true }
  },
  data () {
    return {
      rules: {
        periodBefore: () => {
          if (!this.roleForm.startPeriod || !this.roleForm.endPeriod) {
            return true
          }
          return new Date(this.roleForm.startPeriod.startDate).getTime() < new Date(this.roleForm.endPeriod.startDate).getTime() || 'The start period must be before the end period'
        }
      },
      form: {
        description: defaultDesc,
        url: null,
        salaryCommitted: null,
        salaryDeferred: null,
        startPeriod: null,
        endPeriod: null,
        cycles: null
      },
      display: {
        seeds: 0,
        hvoice: 0,
        hypha: 0,
        husd: 0
      },
      isFullScreen: false,
      submitting: false
    }
  },
  computed: {
    ...mapGetters('periods', ['periodOptionsStart']),
    title () {
      const data = this.role.strings.find(o => o.key === 'title')
      return (data && data.value) || ''
    },
    minCommitted () {
      const data = this.role.ints.find(o => o.key === 'min_timeshare')
      return (data && data.value && `${(data.value / 100).toFixed(2)}%`) || ''
    },
    minDeferred () {
      const data = this.role.ints.find(o => o.key === 'min_deferred')
      return (data && data.value && `${(data.value / 100).toFixed(2)}%`) || ''
    },
    usdEquity () {
      const data = this.role.assets.find(o => o.key === 'annual_usd_salary')
      return (data && data.value && parseFloat(data.value).toFixed(2)) || ''
    },
    idStartPeriod () {
      const data = this.role.ints.find(o => o.key === 'start_period')
      return (data && data.value) || 0
    },
    idEndPeriod () {
      const data = this.role.ints.find(o => o.key === 'end_period')
      return (data && data.value) || 1e20
    }
  },
  methods: {
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    ...mapActions('assignments', ['saveProposal']),
    async onSaveProposal () {
      await this.resetValidation(this.form)
      if (!(await this.validate(this.form))) return
      this.submitting = true
      const success = await this.saveProposal({
        ...this.form,
        role: this.role.id
      })
      if (success) {
        await this.reset()
        this.hide()
      }
      this.submitting = false
    },
    async reset () {
      this.form = {
        description: defaultDesc,
        url: null,
        salaryCommitted: null,
        salaryDeferred: null,
        startPeriod: null,
        endPeriod: null,
        cycles: null
      }
      await this.resetValidation(this.form)
    },
    hide () {
      this.setShowRightSidebar(false)
      this.setRightSidebarType(null)
    },
    computeTokens (committed, deferred) {
      const committedSan = isNaN(committed) ? 0 : parseFloat(committed || 0)
      const deferredSan = isNaN(deferred) ? 0 : parseFloat(deferred || 0)
      const ratioUsdEquity = parseFloat(this.usdEquity) * committedSan / 100
      this.display.hvoice = (2 * ratioUsdEquity).toFixed(2)
      this.display.seeds = (ratioUsdEquity * deferredSan / 100 * (1.3 / 0.01) + (ratioUsdEquity * (1 - deferredSan / 100)) / 0.01).toFixed(4)
      this.display.hypha = (ratioUsdEquity * deferredSan / 100 * 0.6).toFixed(2)
      this.display.husd = (ratioUsdEquity * (1 - deferredSan / 100)).toFixed(2)
    }
  },
  watch: {
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
    }
  }
}
</script>

<template lang="pug">
.q-pa-xs
  strong {{ title }}
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
  fieldset.q-mt-sm
    legend Salary
    p Please enter your % commitment and % deferral for this role. The more you defer to a later date, the higher the bonus will be (see actual salary calculation below).
    .row.q-col-gutter-xs
      .col-xs-12.col-md-6
        q-input(
          ref="salaryCommitted"
          v-model="form.salaryCommitted"
          type="number"
          color="accent"
          label="Min. committed"
          :rules="[rules.required, rules.positiveAmount, rules.lessOrEqualThan(100 - parseInt(form.salaryDeferred || 0)), rules.moreOrEqualThan(parseFloat(minCommitted))]"
          :hint="`Min ${minCommitted}`"
          lazy-rules
          outlined
          dense
          @blur="form.salaryCommitted = parseFloat(form.salaryCommitted).toFixed(2)"
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
          label="Min. deferred"
          :rules="[rules.required, rules.positiveAmount, rules.lessOrEqualThan(form.salaryCommitted ? 100 - form.salaryCommitted : 100), rules.moreOrEqualThan(parseFloat(minDeferred))]"
          :hint="`Min ${minDeferred}`"
          lazy-rules
          outlined
          dense
          @blur="form.salaryDeferred = parseFloat(form.salaryDeferred).toFixed(2)"
        )
          template(v-slot:append)
            q-icon(
              name="fas fa-percentage"
              size="xs"
            )
    .row.q-col-gutter-xs
      .col-6
        q-input.bg-grey-4.text-black(
          v-model="display.seeds"
          outlined
          dense
          readonly
        )
        .hint Seeds
      .col-6
        q-input.bg-grey-4.text-black(
          v-model="display.hvoice"
          outlined
          dense
          readonly
        )
        .hint hvoice
      .col-6
        q-input.bg-grey-4.text-black(
          v-model="display.hypha"
          outlined
          dense
          readonly
        )
        .hint hypha
      .col-6
        q-input.bg-grey-4.text-black(
          v-model="display.husd"
          outlined
          dense
          readonly
        )
        .hint husd
  fieldset.q-mt-sm
    legend Lunar cycles
    p This is the  lunar start and re-evaluation date for this role. You can also specify the number of lunar cycles.
    .row.q-col-gutter-sm
      .col-xs-12.col-md-4
        period-select(
          ref="startPeriod"
          :value.sync="form.startPeriod"
          :periods="periodOptionsStart.filter(o => o.value >= idStartPeriod).slice(0, 8)"
          label="Start phase"
          required
        )
      .col-xs-12.col-md-4
        period-select(
          ref="endPeriod"
          :value.sync="form.endPeriod"
          :period="form.startPeriod && (form.cycles || 0) && ((parseInt(form.startPeriod.value) + Math.min(parseInt(form.cycles || 0), 12) * 4) || 0)"
          :periods="form.startPeriod && periodOptionsStart.filter(p => p.phase === form.startPeriod.phase && p.value > form.startPeriod.value && p.value <= idEndPeriod).slice(0, 12)"
          label="End phase"
          required
        )
      .col-xs-12.col-md-4
        q-input(
          ref="cycles"
          v-model="form.cycles"
          label="Cycles"
          type="number"
          hint="Max 12"
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
  .text-right.q-mt-sm
    q-btn.q-mr-sm(
      label="Cancel"
      rounded
      color="grey"
      dense
      unelevated
      @click="hide"
    )
    q-btn(
      label="Create"
      rounded
      color="hire"
      dense
      unelevated
      :loading="submitting"
      @click="onSaveProposal"
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
.hint
  margin-top 2px
  text-transform uppercase
  font-size 12px
</style>
