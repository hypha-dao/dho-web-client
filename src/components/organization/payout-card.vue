<template lang="pug">
widget.bg-internal-bg.q-my-xxs.cursor-pointer(noPadding)
  .row.items-center.content(:style="cssVars")
    .col
      .row.flex.items-center
        .h-h5.one-line {{ title }}
    template(v-if="!compact")
      .col(:class="{'col-8': !payments}")
        .h-b2.text-weight-thin.text-body  {{description.substr(0,150) + (description.length > 150 ? '...' : '')}}
      .col-3(v-if="payments && payments.length > 0")
        .row
          .col(v-for="payment of payments")
            .row.justify-center.h-btn1 {{ shortNumber(parseFloat(payment.details_amount_a.split(' ')[0])) }}
            .row.text-bold.justify-center {{ payment.details_amount_a.split(' ')[1] }}
</template>

<script>
export default {
  name: 'payout-card',
  components: {
    Widget: () => import('../common/widget.vue')
  },
  props: {
    /**
     * Circle Title
     */
    title: String,
    /**
     * Circle Description
     */
    description: String,
    /**
     * Show compact style
     */
    compact: {
      type: Boolean,
      default: false
    },
    payments: {
      type: Array
    }
  },
  computed: {
    cssVars () {
      return {
        '--card-height': this.compact ? '70px' : '90px',
        '--card-ml': this.compact ? '20px' : '30px'
      }
    }
  },
  methods: {
    shortNumber (value) {
      if (value < 10000) return value.toFixed(2)
      if (value < 1e6) return +(value / 1e3).toFixed(1) + 'k'
      if (value < 1e9) return +(value / 1e6).toFixed(1) + 'm'
      if (value < 1e12) return +(value / 1e9).toFixed(1) + 'b'
      return +(value / 1e12).toFixed(1) + 't'
    }
  }
}
</script>

<style lang="stylus" scoped>
.content
  height var(--card-height)
  margin-left var(--card-ml)
  overflow hidden
</style>
