<script>

const secondsToInterval = (seconds) => {
  // const hours = Math.floor((seconds % (3600 * 24)) / 3600)
  // const days = Math.floor(((seconds % 31536000) % 2628000) / 86400)
  // const months = Math.floor((seconds % 31536000) / 2628000)

  let period = ''

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
  }

  return { period, months, weeks, days, hours }
}

export default {
  name: 'custom-period-input',
  data () {
    return {
      period: 'days'
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
          if (this.period === 'hours') { value = (value * 60) * 60 }
          if (this.period === 'days') { value = value * 24 * 60 * 60 }
          if (this.period === 'weeks') { value = value * 7 * 24 * 60 * 60 }
          if (this.period === 'months') { value = value * 2628000 }
        }

        this.$emit('input', value)
      }

    }
  },

  mounted () {
    this.period = secondsToInterval(this.value).period
  }

}
</script>

<template lang="pug">
div.custom-period-input
  .row.full-width.items-center
    .col.row.q-mr-sm
      q-input.full-width.q-py-sm(
        :disable="disable"
        dense
        outlined
        rounded
        v-model.number="valueFormated"
      )
    .col-3
      q-btn-dropdown.full-width(:label="[$t('periods.'+[period])]"  outline no-caps rounded unelevated)
        q-list
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
