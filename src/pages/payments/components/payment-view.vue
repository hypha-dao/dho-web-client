<script>
import { mapMutations } from 'vuex'

export default {
  name: 'payment-view',
  props: {
    payment: { type: Object }
  },
  methods: {
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    hide () {
      this.setShowRightSidebar(false)
      this.setRightSidebarType(null)
    }
  }
}
</script>

<template lang="pug">
.q-pa-xs
  .text-h6.q-mb-sm.q-ml-md Payment Receipt
  p Date: {{ payment.payment_date }}
  p Assignment (optional): {{ payment.assignment_id }}
  p Period (optional): {{ payment.period_id }}
  p Recipient: {{ payment.recipient }}
  p Amount: {{ payment.amount }}
  p Memo: {{ payment.memo }}
  .row.flex.justify-between.q-mt-md
    q-btn(
      label="Close"
      rounded
      color="grey"
      unelevated
      @click="hide"
    )
</template>

<style lang="stylus" scoped>

</style>
