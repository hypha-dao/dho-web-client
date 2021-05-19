<script>
/**
 * Widget that shows the salary of an assignment.
 */
export default {
  name: 'salary',
  components: {
    PayoutAmounts: () => import('./payout-amounts.vue'),
    Widget: () => import('~/components/common/widget.vue')
  }
}
</script>

<template lang="pug">
widget(title="Salary")
  payout-amounts
</template>
