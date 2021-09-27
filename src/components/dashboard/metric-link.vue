<script>
export default {
  name: 'metric-link',

  props: {
    amount: String,
    link: String,
    title: String
  }
}
</script>

<template lang="pug">
q-btn.fit(:to="{ name: link }" rounded unelevated color="white" size="0.9em")
  .column.q-py-md
    .text-h3.text-bold.text-grey-9.text-left.q-pa-md {{ amount }}
    .row.justify-between.items-center
      .text-subtitle2.text-no-wrap.text-grey-7 {{ title }}
      q-icon.q-pl-xl(color="grey-5" size="xs" name="fas fa-chevron-right")
</template>
