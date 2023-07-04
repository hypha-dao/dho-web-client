<script>
import { dateToStringShort } from '~/utils/TimeUtils'

export default {
  name: 'transaction-history',
  components: {
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    more: Boolean,
    transactions: Array
  },

  methods: {
    dateToStringShort
  }
}
</script>

<template lang="pug">
widget(:more :title="$t('profiles.transaction-history.transactionHistory')")
  q-list.margin-fix
    template(v-for="(item, index) in transactions")
      q-item(clickable v-ripple)
        q-item-section
          q-item-label.text-body1.text-bold(lines="2") {{ item.account + ':' + item.name }}
          q-item-label.caption {{ dateToStringShort(item.timestamp) }}
        q-item-section(side)
          q-icon(name="fas fa-chevron-right")
      q-separator(v-if="index < transactions.length - 1" spaced="spaced" inset :key="'sep' + index")

</template>

<style lang="stylus" scoped>
// Add negative margins to the list so its
// contents line up properly with widget title
.margin-fix
  margin-left -16px
  margin-right -16px
</style>
