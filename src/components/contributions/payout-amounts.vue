<script>
/**
 * Displays the amounts of tokens earned for a contribution.
 */
export default {
  name: 'payout-amounts',
  props: {
    husd: Number,
    hvoice: Number,
    hypha: Number
  }
}
</script>

<template lang="pug">
.row.q-col-gutter-xs
  .col-4
    q-input.bg-liquid.text-black(
      v-model="husd"
      outlined
      dense
      readonly
    )
    .hint husd
  .col-4
    q-input.bg-liquid.text-black(
      v-model="hvoice"
      outlined
      dense
      readonly
    )
    .hint hvoice
  .col-4
    q-input.bg-liquid.text-black(
      v-model="hypha"
      outlined
      dense
      readonly
    )
    .hint hypha
</template>
