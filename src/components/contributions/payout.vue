<script>
/**
 * Widget that shows the payout of a contribution.
 */
export default {
  name: 'payout',
  components: {
    PayoutAmounts: () => import('../common/payout-amounts.vue'),
    Widget: () => import('../common/widget.vue')
  },

  props: {
    tokens: Array
  }
}
</script>

<template lang="pug">
widget(title="Payout")
  payout-amounts(:tokens="tokens")
</template>
