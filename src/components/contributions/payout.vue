<script>
/**
 * Widget that shows the payout of a contribution.
 */
export default {
  name: 'payout',
  components: {
    PayoutAmounts: () => import('./payout-amounts.vue'),
    Widget: () => import('~/components/common/widget.vue')
  }
}
</script>

<template lang="pug">
widget(title="Payout")
  payout-amounts
</template>
