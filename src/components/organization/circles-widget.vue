<script>
export default {
  name: 'circles-widget',
  components: {
    Widget: () => import('../common/widget.vue'),
    CircleCard: () => import('./circle-card.vue'),
    ComingSoonTag: () => import('~/components/common/coming-soon-tag')
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
    coming-soon-tag(message="IN DEVELOPMENT - COMING SOON")
    .row.justify-between.q-my-md
        .col-9
            .text-h6.text-weight-bold Circles
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
