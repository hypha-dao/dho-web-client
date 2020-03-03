<script>
import PeriodSelect from '~/components/form/period-select'
import { validation } from '~/mixins/validation'
import { forms } from '~/mixins/forms'
import { mapActions, mapGetters, mapMutations } from 'vuex'

const defaultDesc = '<b>Purpose</b><div>This guides the evolution of the role and is the part that changes the least.</div><div><br></div><div><b>Accountabilities</b></div><div>What is this role accountable to doing - what can others expect from this role? Provide a list of 5-10 bullet points.</div><div><br></div><div><b>Domain</b></div><div>What is under explicit control of that role? What do others need to ask this role permission to edit/change/interact with? Provide a list of tags.</div>'

export default {
  name: 'role-form',
  mixins: [forms, validation],
  components: { PeriodSelect },
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
        title: null,
        description: defaultDesc,
        url: null,
        salaryCommitted: null,
        salaryDeferred: null,
        salaryUsd: null,
        salaryCapacity: null,
        startPeriod: null,
        endPeriod: null,
        cycles: null
      },
      isFullScreen: false,
      submitting: false
    }
  },
  computed: {
    ...mapGetters('periods', ['periodOptionsStart'])
  },
  methods: {
    ...mapActions('roles', ['saveProposal']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    async onSaveProposal () {
      await this.resetValidation(this.form)
      if (!(await this.validate(this.form))) return
      this.submitting = true
      const success = await this.saveProposal(this.form)
      if (success) {
        await this.reset()
        this.hideForm()
        await this.$router.push({ path: '/proposals/role' })
      }
      this.submitting = false
    },
    async reset () {
      this.form = {
        title: null,
        description: defaultDesc,
        url: null,
        salaryCommitted: null,
        salaryDeferred: null,
        salaryUsd: null,
        salaryCapacity: null,
        startPeriod: null,
        endPeriod: null,
        cycles: null
      }
      await this.resetValidation(this.form)
    },
    hideForm () {
      this.setShowRightSidebar(false)
      this.setRightSidebarType(null)
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
    legend Salary
    p Please enter the minimum % commitment  and minimum deferred salary required for this role. Then enter the USD equivalent and FT capacity in the text fields below.
    .row.q-col-gutter-sm
      .col-xs-12.col-md-6
        q-input(
          ref="salaryCommitted"
          v-model="form.salaryCommitted"
          type="number"
          color="accent"
          label="Min. committed"
          :rules="[rules.required, rules.positiveAmount, rules.lessOrEqualThan(100)]"
          hint="Min %"
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
          label="Min. deferred"
          :rules="[rules.required, rules.positiveAmount, rules.lessOrEqualThan(100)]"
          hint="Min %"
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
    .row.q-col-gutter-sm
      .col-xs-12.col-md-6
        q-input(
          ref="salaryUsd"
          v-model="form.salaryUsd"
          type="number"
          color="accent"
          label="USD equivalent"
          :rules="[rules.required, rules.positiveAmount]"
          hint="Yearly"
          lazy-rules
          outlined
          dense
          @blur="form.salaryUsd = parseFloat(form.salaryUsd).toFixed(2)"
        )
          template(v-slot:append)
            q-icon(
              name="fas fa-dollar-sign"
              size="xs"
            )
      .col-xs-12.col-md-6
        q-input(
          ref="salaryCapacity"
          v-model="form.salaryCapacity"
          type="number"
          color="accent"
          label="FT Capacity"
          :rules="[rules.required, rules.positiveAmount]"
          hint="1.0=FT"
          lazy-rules
          outlined
          dense
          @blur="form.salaryCapacity = parseFloat(form.salaryCapacity).toFixed(2)"
        )
          template(v-slot:append)
            q-icon(
              name="fas fa-hashtag"
              size="xs"
            )
  fieldset.q-mt-sm
    legend Lunar cycles
    p This is the  lunar start and re-evaluation date for this role. You can also specify the number of lunar cycles.
    .row.q-col-gutter-sm
      .col-xs-12.col-md-4
        period-select(
          ref="startPeriod"
          :value.sync="form.startPeriod"
          :periods="periodOptionsStart.slice(0, 8)"
          label="Start phase"
          required
        )
      .col-xs-12.col-md-4
        period-select(
          ref="endPeriod"
          :value.sync="form.endPeriod"
          :period="form.startPeriod && (form.cycles || 0) && ((parseInt(form.startPeriod.value) + Math.min(parseInt(form.cycles || 0), 12) * 4) || 0)"
          :periods="form.startPeriod && periodOptionsStart.filter(p => p.phase === form.startPeriod.phase && p.value > form.startPeriod.value).slice(0, 12)"
          label="Eval phase"
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
</style>
