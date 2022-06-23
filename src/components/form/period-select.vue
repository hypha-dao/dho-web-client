<script>
import { validation } from '~/mixins/validation'
import { date } from 'quasar'

export default {
  name: 'period-select',
  mixins: [validation],
  components: {
    InputField: () => import('~/components/common/input-field.vue')
  },
  props: {
    value: { type: Object },
    readonly: { type: Boolean, default: false },
    period: { type: String },
    periods: { type: Array },
    label: { type: String, required: true },
    required: { type: Boolean, default: () => false }
  },
  data () {
    return {
      options: [],
      init: true,
      phase: null,
      form: {
        model: null
      }
    }
  },
  methods: {
    getIcon (phase) {
      switch (phase) {
        case 'First Quarter':
          return 'fas fa-adjust'
        case 'Full Moon':
          return 'far fa-circle'
        case 'Last Quarter':
          return 'fas fa-adjust reversed'
        case 'New Moon':
          return 'fas fa-circle'
        default:
          return 'fas fa-circle'
      }
    },
    async onValidate () {
      await this.resetValidation(this.form)
      return this.validate(this.form)
    },
    initForm () {
      // this list takes time to load and fails the init
      if (!this.periods || !this.periods.length) {
        setTimeout(this.initForm, 100)
        return
      }
      if (this.init) {
        const p = this.periods.find(p => p.value === this.period)
        if (p) {
          this.form.model = date.formatDate(new Date(p.startDate).getTime(), 'YYYY/MM/DD')
        }
        this.init = false
      }
    }
  },
  computed: {
    minDate () {
      return (this.options && this.options.length && this.options[0].slice(0, -3)) || date.formatDate(new Date().getTime(), 'YYYY/MM')
    }
  },
  watch: {
    periods: {
      immediate: true,
      handler (val) {
        this.options = val && val.map(d => date.formatDate(new Date(d.startDate).getTime(), 'YYYY/MM/DD'))
      }
    },
    'form.model' (val) {
      if (!this.init && typeof val === 'string') {
        const d = date.extractDate(val, 'YYYY/MM/DD').getTime()
        const p = this.periods.find(p => date.extractDate(date.formatDate(new Date(p.startDate).getTime(), 'YYYY/MM/DD'), 'YYYY/MM/DD').getTime() === d)
        this.phase = p.phase
        this.$emit('update:value', p)
      }
    },
    period: {
      immediate: true,
      handler () {
        this.initForm()
      }
    }
  }
}
</script>

<template lang="pug">
q-input(
  ref="model"
  v-model="form.model"
  :readonly="readonly"
  :label="label"
  outlined
  dense
  color = "heading"
  @clear="$emit('update:value', null)"
  :rules="[rules.requiredIf(required)]"
  lazy-rules
)
  template(v-slot:append)
    q-icon(
      :name="getIcon (phase)"
      class="{ 'cursor-pointer': !readonly }"
    )
      q-popup-proxy(v-if="!readonly" ref="qDateProxy" transition-show="scale" transition-hide="scale")
        q-date(
          v-model="form.model"
          :options="options"
          @input="() => $refs.qDateProxy.hide()"
          :subtitle="label"
          :default-year-month="minDate"
        )
</template>

<style lang="stylus" scoped>
.reversed
  transform rotateY(180deg)
</style>
