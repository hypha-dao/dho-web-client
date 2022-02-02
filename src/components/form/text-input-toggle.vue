<script>
import { validation } from '~/mixins/validation'

/**
 * Base component for a text input and toggle pair
 */
export default {
  name: 'text-input-toggle',
  mixins: [validation],
  props: {
    label: String,
    type: String,
    icon: String,
    text: String,
    toggle: Boolean,
    validateRules: Array,
    disable: Boolean
  },

  methods: {
    input (value, propName) {
      this.$emit(`update:${propName}`, value)
    },

    async onValidate () {
      await this.resetValidation({ text: this.text })
      return await this.validate({ text: this.text })
    }
  }
}
</script>

<template lang="pug">
div(class="text-input-toggle")
  .row
    .text-caption.text-weight-bold.q-mt-xs {{ label }}
    q-space
    q-toggle(:value="toggle" @input="input($event, 'toggle')" color="secondary" :disable= "disable")
  .row
    .col-auto.q-mr-sm
      q-btn.q-pa-xs(round unelevated :icon="icon" color="primary" text-color="white" size="sm" :ripple="false")
    .col
      q-input.full-width.rounded-border(dense outlined
        ref="text"
        :value="text"
        @input="input($event, 'text')"
        :type = "type"
        :rules="validateRules"
        :disable= "!toggle || disable")
</template>

<style lang="stylus" scoped>
.rounded-border
  :first-child
    border-radius 12px
</style>
