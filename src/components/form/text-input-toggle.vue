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
    placeholder: String,
    /**
     * Text input type
     */
    type: String,
    icon: String,
    /**
     * Text start value
     */
    text: String,
    /**
     * Toggle start value
     */
    toggle: Boolean,
    showToggle: {
      type: Boolean,
      default: true
    },
    /**
     * Validation rules array
     */
    validateRules: Array,
    disable: Boolean,
    /**
     * If true, the icon will have a solid background
     */
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
  .row.q-mb-xxs
    .h-body1.text-weight-bold.q-mt-xs {{ label }}
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
        :disable= "disable"
        :placeholder="placeholder"
        )
      slot
</template>

<style lang="stylus" scoped>
.rounded-border
  :first-child
    border-radius 15px
</style>
