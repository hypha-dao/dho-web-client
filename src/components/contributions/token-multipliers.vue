<script>
export default {
  name: 'token-multipliers',
  props: {
    seeds: Number,
    husd: Number,
    hvoice: Number,
    hypha: Number
  },
  components: {
    InputField: () => import('~/components/common/input-field.vue')
  }
}
</script>

<template lang="pug">
.row.q-col-gutter-xs
  .col-6
    input-field.bg-seeds.text-black(
      v-model="seeds"
      type="number"
      outlined
      readonly
      dense
    )
      template(v-slot:append)
        q-icon(
          name="img:app/icons/seeds.png"
          size="xs"
        )
    .hint Deferred Seeds
  .col-6
    input-field.bg-liquid.text-black(
      v-model="husd"
      type="number"
      outlined
      readonly
      dense
    )
    .hint HUSD
  .col-6
    input-field.bg-liquid.text-black(
      v-model="hvoice"
      type="number"
      outlined
      readonly
      dense
    )
    .hint HVOICE
  .col-6
    input-field.bg-liquid.text-black(
      v-model="hypha"
      type="number"
      readonly
      outlined
      dense
    )
    .hint HYPHA
</template>
