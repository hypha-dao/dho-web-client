<template lang="pug">
widget.bg-internal-bg.q-mb-sm
  .row.items-center.justify-between
    q-btn(round unelevated :icon="icon" color="primary" text-color="white" size="sm" :ripple="false")
    .q-ml-md.q-mr-auto
      .text-body1.text-bold {{ title }}
      .text-body2.text-italic.grey-color {{ type }}
    chips(:tags="tags")
</template>

<script>
export default {
  name: 'result',
  components: {
    Widget: () => import('~/components/common/widget.vue'),
    Chips: () => import('~/components/common/chips.vue')
  },
  props: {
    icon: String,
    title: String,
    type: String,
    tags: Array
  }
}
</script>

<style scope lang="stylus">
.grey-color
  color: #84878E
</style>
