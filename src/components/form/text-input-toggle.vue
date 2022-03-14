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
    showToggle: {
      type: Boolean,
      default: true
    },
    validateRules: Array,
    disable: Boolean,
    iconBackground: {
      type: Boolean,
      default: true
    }
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
    .text-caption.text-weight-bold.q-my-sm {{ label }}
    q-space
    q-toggle(v-show="showToggle" :value="toggle" @input="input($event, 'toggle')" color="secondary" :disable= "disable")
  .row
    .col-auto.q-mr-sm
      q-btn.q-pa-xxs(round unelevated :icon="icon" color="primary" text-color="white" size="sm" :ripple="false" v-if="iconBackground")
      q-icon.chain-icon(:name="icon" :ripple="false" size='40px' v-else)
    .col
      q-input.full-width.rounded-border.q-pb-none(
        dense
        outlined
        ref="text"
        :value="text"
        @input="input($event, 'text')"
        :type = "type"
        :rules="validateRules"
        :disable= "disable")
      slot
</template>

<style lang="stylus" scoped>
.rounded-border
  :first-child
    border-radius 15px
</style>
