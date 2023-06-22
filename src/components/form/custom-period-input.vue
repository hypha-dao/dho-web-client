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
    value: String,
    type: {
      type: String,
      default: 'time'
    }
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
      if (this.type === ' time') {
        const { months, weeks, days, hours } = secondsToInterval(this.value)

        if (months > 0) { return months }
        if (weeks > 0) { return weeks }
        if (days > 0) { return days }
        if (hours > 0) { return hours }

        return 0
      } else {
        return this.value
      }
    }
  },
  methods: {
    onChange (e) {
      let value = e.target.value

      if (this.type === ' time') {
        if (this.period === 'hours') { value = (value * 60) * 60 }
        if (this.period === 'days') { value = value * 24 * 60 * 60 }
        if (this.period === 'weeks') { value = value * 7 * 24 * 60 * 60 }
        if (this.period === 'months') { value = value * 2628000 }
        // 2628002.88
      }

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
.custom-period-input
  q-btn.full-width.text-bold(border="border" color="internal-bg" no-caps="no-caps" rounded="rounded" text-color="primary" unelevated="unelevated" @click="onSelect()" v-show="!isActive") {{ $t('form.custom-period-input.customPeriod') }}
  .full-width.bg-primary.text-white.rounded-border.q-px-sm.relative-position(v-show="isActive")
    q-input.input-amount.inline(:disable="disable" :value="valueFormated" @change="onChange" bg-color="primary" borderless="borderless" dense="dense" :placeholder="$t('form.custom-period-input.typeAnAmount')" ref="amount")
    q-btn-dropdown.absolute-right(v-if="type === 'time'" :disable="disable" color="primary" :label="period" no-caps="no-caps" rounded="rounded" unelevated="unelevated")
      q-list
        q-item(clickable="clickable" v-close-popup="v-close-popup" @click="period = 'hours'")
          q-item-section
            q-item-label {{ $t('form.custom-period-input.hours') }}
        q-item(clickable="clickable" v-close-popup="v-close-popup" @click="period = 'days'")
          q-item-section
            q-item-label {{ $t('form.custom-period-input.days') }}
        q-item(clickable="clickable" v-close-popup="v-close-popup" @click="period = 'weeks'")
          q-item-section
            q-item-label {{ $t('form.custom-period-input.weeks') }}
        q-item(clickable="clickable" v-close-popup="v-close-popup" @click="period = 'months'")
          q-item-section
            q-item-label {{ $t('form.custom-period-input.months') }}

</template>

<style lang="stylus" scoped>

.input-amount
  :first-child
    font-size: 13px;
    color: white;
    ::placeholder
      color: white;
</style>
