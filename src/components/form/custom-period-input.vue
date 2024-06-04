<script>

const secondsToInterval = (seconds) => {
  // const hours = Math.floor((seconds % (3600 * 24)) / 3600)
  // const days = Math.floor(((seconds % 31536000) % 2628000) / 86400)
  // const months = Math.floor((seconds % 31536000) / 2628000)

  let period = ''

  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(seconds / 3600)
  const days = Math.floor(seconds / 86400)
  const weeks = Math.floor(seconds / 604800)
  const months = Math.floor(seconds / 2628000)

  if (months > 0) {
    period = 'months'
  } else if (weeks > 0) {
    period = 'weeks'
  } else if (days > 0) {
    period = 'days'
  } else if (hours > 0) {
    period = 'hours'
  } else if (minutes > 0) {
    period = 'minutes'
  }

  return { period, months, weeks, days, hours, minutes }
}

export default {
  name: 'custom-period-input',
  data () {
    return {
      period: ''
    }
  },

  props: {
    disable: Boolean,
    value: Number,
    type: {
      type: String,
      default: 'time'
    }
  },

  computed: {

    valueFormated: {
      get () {
        const period = secondsToInterval(this.value).period
        return secondsToInterval(this.value)[period]
      },
      set (value) {
        if (this.type === 'time' && this.period !== '') {
          if (this.period === 'minutes') { value = (value * 60) }
          if (this.period === 'hours') { value = (value * 60) * 60 }
          if (this.period === 'days') { value = value * 24 * 60 * 60 }
          if (this.period === 'weeks') { value = value * 7 * 24 * 60 * 60 }
          if (this.period === 'months') { value = value * 2628000 }
        }
        this.$emit('input', value)
      }

    },

    label  () { return this.$t(`periods.${this.period}`) }
  },

  watch: {
    value: {
      handler: function (value) {
        if (value) {
          this.period = secondsToInterval(this.value).period
        }
      },
      immediate: true
    },
    period: {
      handler: function (value) {
        let time = ''
        if (this.period === 'minutes') { time = (this.valueFormated * 60) }
        if (this.period === 'hours') { time = (this.valueFormated * 60) * 60 }
        if (this.period === 'days') { time = this.valueFormated * 24 * 60 * 60 }
        if (this.period === 'weeks') { time = this.valueFormated * 7 * 24 * 60 * 60 }
        if (this.period === 'months') { time = this.valueFormated * 2628000 }
        this.$emit('input', time)
      }
    }
  }

}
</script>

<template lang="pug">
div.custom-period-input
  .row.full-width.items-center
    .col.row.q-mr-sm
      q-input.full-width(
        :disable="disable"
        :filled="disable"
        dense
        outlined
        rounded
        v-model.number="valueFormated"
      )
    .col-6
      q-btn-dropdown.full-width(:disable="disable" :label="label" outline no-caps rounded unelevated)
        q-list
          q-item(clickable v-close-popup @click="period = 'minutes'")
            q-item-section
              q-item-label {{ $t('periods.minutes') }}

          q-item(clickable v-close-popup @click="period = 'hours'")
            q-item-section
              q-item-label {{ $t('periods.hours') }}

          q-item(clickable v-close-popup  @click="period = 'days'")
            q-item-section
              q-item-label {{ $t('periods.days') }}

          q-item(clickable v-close-popup  @click="period = 'weeks'")
            q-item-section
              q-item-label {{ $t('periods.weeks') }}

          q-item(clickable v-close-popup  @click="period = 'months'")
            q-item-section
              q-item-label {{ $t('periods.months') }}
</template>

<style lang="stylus" scoped>

</style>
