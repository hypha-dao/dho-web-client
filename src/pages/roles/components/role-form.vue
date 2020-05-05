<script>
import { uid } from 'quasar'
import PeriodSelect from '~/components/form/period-select'
import { validation } from '~/mixins/validation'
import { forms } from '~/mixins/forms'
import { mapActions, mapGetters, mapMutations } from 'vuex'

const defaultDesc = '<b>Purpose</b><div>This guides the evolution of the role and is the part that changes the least.</div><div><br></div><div><b>Accountabilities</b></div><div>What is this role accountable to doing - what can others expect from this role? Provide a list of 5-10 bullet points.</div><div><br></div><div><b>Domain</b></div><div>What is under explicit control of that role? What do others need to ask this role permission to edit/change/interact with? Provide a list of tags.</div>'

export default {
  name: 'role-form',
  mixins: [forms, validation],
  components: { PeriodSelect },
  props: {
    draft: { type: Object }
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
        id: uid(),
        originId: null,
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
    ...mapGetters('periods', ['periodOptionsStart']),
    ...mapGetters('profiles', ['isConnected'])
  },
  methods: {
    ...mapActions('profiles', ['saveDraft', 'connectProfileApi']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    async onSaveDraft () {
      await this.resetValidation(this.form)
      if (!(await this.validate(this.form))) return
      this.submitting = true
      if (!this.isConnected) {
        await this.connectProfileApi()
      }
      const success = await this.saveDraft({ type: 'role', draft: this.form })
      if (success) {
        await this.reset()
        this.hideForm()
        if (this.$route.path !== '/proposals/role') {
          await this.$router.push({ path: '/proposals/role' })
        }
      }
      this.submitting = false
    },
    async reset () {
      this.form = {
        id: uid(),
        originId: null,
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
    legend Salary
    p Please enter the minimum % commitment and % deferred salary required for this role (applicants for this role will not be able to select a larger amount), followed by the USD equivalent and role capacity (how many people can be assigned to this role).
    .row.q-col-gutter-sm.q-mb-md
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
          @blur="form.salaryUsd = parseFloat(form.salaryUsd).toFixed(0)"
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
          label="ROLE CAP"
          :rules="[rules.required, rules.positiveAmount]"
          hint="1.0=FT"
          lazy-rules
          outlined
          dense
          @blur="form.salaryCapacity = parseFloat(form.salaryCapacity).toFixed(1)"
        )
          template(v-slot:append)
            q-icon(
              name="fas fa-hashtag"
              size="xs"
            )
  fieldset.q-mt-sm
    legend Lunar cycles
    p This is the lunar start and re-evaluation date for this role, followed by the number of lunar cycles. We recommend a maximum of 3 cycles before reevaluation.
    .row.q-col-gutter-sm
      .col-xs-12.col-md-4
        period-select(
          ref="startPeriod"
          :value.sync="form.startPeriod"
          :period="form.startPeriod && form.startPeriod.value"
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
