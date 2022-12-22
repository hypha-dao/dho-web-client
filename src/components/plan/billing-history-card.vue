<script>
import { dateToString } from '~/utils/TimeUtils.js'

export default {
  name: 'billing-history-card',
  components: {
    Widget: () => import('~/components/common/widget.vue')
  },
  props: {
    planName: String,
    status: String,
    date: Date
  },
  data () {
    return {
      dateToString
    }
  }
}
</script>

<template lang="pug">
  .pricing-history-card
    widget(:background="status === 'PAID' ? 'secondary' : 'primary'")
      q-btn(
        round
        unelevated
        :icon="status === 'PAID' ? 'fas fa-check' : 'fa fa-exclamation-triangle'"
        color="white"
        text-color="primary"
        size="12px"
        :ripple="false"
      )
      .h-h5.text-white.q-mt-xs {{planName}}
      .text-ellipsis.text-xs.text-white {{status === 'PAID' ? 'Payed/active': 'Next billing'}}
      .text-ellipsis.text-xs.text-white.q-mt-sm {{ planName === 'Founders' ? 'Free forever' : dateToString(date)}}
      q-badge(v-if="status === 'EXPIRED'" floating rounded color="red" label="\xa0").badge
</template>

<style lang="stylus" scoped>
.pricing-history-card
  width: 180px
  height: 180px
.badge
  position: absolute
  right: -28px
  top: -28px
</style>
