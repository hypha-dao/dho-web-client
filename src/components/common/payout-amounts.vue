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
    },
    stacked: Boolean,
    daoLogo: {
      type: String,
      default: undefined
    }
  }
}
</script>

<template lang="pug">
.row.full-width
  template(v-for="token in tokens")
    .col.q-pa-xs(:class="{ 'col-12': stacked }")
      token-value(v-bind="token" :multiplier="multiplier" :daoLogo="daoLogo")
</template>
