<script>
import { validation } from '~/mixins/validation'

export default {
  name: 'period-select',
  mixins: [validation],
  props: {
    value: { type: Object },
    period: { type: Number },
    periods: { type: Array },
    label: { type: String, required: true },
    required: { type: Boolean, default: () => false }
  },
  data () {
    return {
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
      this.resetValidation(this.form)
      return this.validate(this.form)
    }
  },
  watch: {
    'form.model' (val) {
      this.$emit('update:value', val)
    },
    period: {
      immediate: true,
      handler (val) {
        if (val) {
          this.form.model = this.periods.find(p => p.value === val)
        }
      }
    }
  }
}
</script>

<template lang="pug">
q-select(
  ref="model"
  v-model="form.model"
  :options="periods || []"
  :label="label"
  outlined
  dense
  @clear="$emit('update:value', null)"
  :rules="[rules.requiredIf(required)]"
  lazy-rules
)
  template(v-slot:option="scope")
    q-item(
      v-bind="scope.itemProps"
      v-on="scope.itemEvents"
    )
      q-item-section(avatar)
        q-icon(:name="getIcon(scope.opt.phase)")
      q-item-section
        q-item-label(v-html="scope.opt.label")
        q-item-label(caption) {{ scope.opt.phase }}
  template(v-slot:selected-item="scope")
    | {{ new Date(scope.opt.startDate).toLocaleDateString() }}
</template>

<style lang="stylus" scoped>
.reversed
  transform rotateY(180deg)
</style>
