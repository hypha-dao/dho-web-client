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
    /**
     * An array of tokens
     * See token-value.vue for properties
     */
    tokens: Array
  }
}
</script>

<template lang="pug">
widget(title="Payout")
  payout-amounts(stacked :tokens="tokens")
</template>
