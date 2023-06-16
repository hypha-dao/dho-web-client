<script>
export default {
  name: 'token-multipliers',
  props: {
    seeds: Number,
    husd: Number,
    hvoice: Number,
    hypha: Number
  }
}
</script>

<template lang="pug">
.row.q-col-gutter-xs
  .col-6
    q-input.bg-seeds.text-black(v-model="seeds" type="number" outlined="outlined" readonly="readonly" dense="dense")
      template(v-slot:append)
        q-icon(name="img:app/icons/seeds.png" size="xs")
    .hint {{ $t('contributions.token-multipliers.deferredSeeds') }}
  .col-6
    q-input.bg-liquid.text-black(v-model="husd" type="number" outlined="outlined" readonly="readonly" dense="dense")
    .hint {{ $t('contributions.token-multipliers.husd') }}
  .col-6
    q-input.bg-liquid.text-black(v-model="hvoice" type="number" outlined="outlined" readonly="readonly" dense="dense")
    .hint {{ $t('contributions.token-multipliers.hvoice') }}
  .col-6
    q-input.bg-liquid.text-black(v-model="hypha" type="number" readonly="readonly" outlined="outlined" dense="dense")
    .hint {{ $t('contributions.token-multipliers.hypha') }}
</template>
