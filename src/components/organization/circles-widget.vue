<script>
export default {
  name: 'circles-widget',
  components: {
    Widget: () => import('../common/widget.vue'),
    CircleCard: () => import('./circle-card.vue')
  },
  props: {
    /**
     * Circles Array
     */
    circles: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<template lang="pug">
widget.full-height.full-width
    .row.justify-between.q-mt-md.q-mb-md
        .col-9
            .text-h6 Circles
        .col
            q-btn.full-width(
                label="See all"
                flat
                no-caps
                dense
            )
    .row

      .col-4(v-for="circle in circles")
        circle-card(v-bind="circle")
</template>
