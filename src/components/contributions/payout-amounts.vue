<script>
/**
 * Displays the amounts of tokens earned for a contribution.
 */
export default {
  name: 'payout-amounts',
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
.row.q-col-gutter-xs
  template(v-for="token in tokens")
    .col-4(:key="token.value")
      q-input.bg-liquid.text-black(
        v-model="token.value * multiplier"
        outlined
        dense
        readonly
      )
      .hint {{ token.label }}
</template>
