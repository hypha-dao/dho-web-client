<script>
/**
 * Displays the amounts of tokens earned for a contribution.
 */
export default {
  name: 'payout-amounts',
  components: {
    TokenValue: () => import('./token-value.vue')
  },

  props: {
    tokens: {
      type: Array,
      default: () => []
    },
    multiplier: {
      type: Number,
      default: 1
    }
  }
}
</script>

<template lang="pug">
.q-col-gutter-xs
  template(v-for="token in tokens")
    token-value(v-bind="token" :multiplier="multiplier")
</template>
