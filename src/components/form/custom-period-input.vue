<script>

/**
 * Base component for a text input and toggle pair
 */

const secondsToInterval = (seconds) => {
  // const hours = Math.floor((seconds % (3600 * 24)) / 3600)
  // const days = Math.floor(((seconds % 31536000) % 2628000) / 86400)
  // const months = Math.floor((seconds % 31536000) / 2628000)

  const hours = Math.floor(seconds / 3600)
  const days = Math.floor(seconds / 86400)
  const weeks = Math.floor(seconds / 604800)
  const months = Math.floor(seconds / 2628000)

  return { months, weeks, days, hours }
}
export default {
  name: 'custom-period-input',
  components: {

  },
  data: function () {
    return {
      period: 'days'
    }
  },

  props: {
    disable: Boolean,
    isActive: Boolean,
    value: String
  },

  mounted () {
    const { months, weeks, days, hours } = secondsToInterval(this.value)

    if (months > 0) {
      this.period = 'months'
      return
    }
    if (weeks > 0) {
      this.period = 'weeks'
      return
    }
    if (days > 0) {
      this.period = 'days'
      return
    }
    if (hours > 0) {
      this.period = 'hours'
    }
  },

  computed: {
    valueFormated () {
      const { months, weeks, days, hours } = secondsToInterval(this.value)

      if (months > 0) { return months }
      if (weeks > 0) { return weeks }
      if (days > 0) { return days }
      if (hours > 0) { return hours }

      return 0
    }
  },
  methods: {

    onChange (e) {
      let value = e.target.value

      if (this.period === 'hours') { value = (value * 60) * 60 }
      if (this.period === 'days') { value = value * 24 * 60 * 60 }
      if (this.period === 'weeks') { value = value * 7 * 24 * 60 * 60 }
      if (this.period === 'months') { value = value * 2628000 }
      // 2628002.88

      this.$emit('input', value)
    },

    onSelect () {
      this.$emit('selected')
      this.$refs.amount.focus()
    }
  }

}
</script>

<template lang="pug">
div.custom-period-input
  q-btn.full-width.text-bold(
    border
    color='internal-bg'
    no-caps
    rounded
    text-color='primary'
    unelevated
    @click="onSelect()"
    v-show="!isActive"
  ) Custom period

  div(v-show="isActive").full-width.bg-primary.text-white.rounded-border.q-px-sm.relative-position
      q-input(
        :disable="disable"
        :value="valueFormated"
        @change='onChange'
        bg-color="primary"
        borderless
        dense
        placeholder='Type an amount'
        ref='amount'
      ).input-amount.inline

      q-btn-dropdown(:disable="disable" color="primary" :label="period"  no-caps rounded unelevated).absolute-right
        q-list
          q-item(clickable v-close-popup @click="period = 'hours'")
            q-item-section
              q-item-label hours

          q-item(clickable v-close-popup  @click="period = 'days'")
            q-item-section
              q-item-label days

          q-item(clickable v-close-popup  @click="period = 'weeks'")
            q-item-section
              q-item-label weeks

          q-item(clickable v-close-popup  @click="period = 'months'")
            q-item-section
              q-item-label months
</template>

<style lang="stylus" scoped>

.input-amount
  :first-child
    font-size: 13px;
    color: white;
    ::placeholder
      color: white;

.rounded-border
  border-radius 15px
</style>
