<script>
export default {
  name: 'badges-widget',
  components: {
    Widget: () => import('../common/widget.vue'),
    BadgeCard: () => import('./badge-card.vue')
  },
  props: {
    /**
     * Circles Array
     */
    badges: {
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
            .text-h6.text-weight-bold Badges
        .col
            q-btn.full-width(
                label="See all"
                flat
                no-caps
                dense
            )
    .row(v-for="badge in badges")
        .col-12
            badge-card(v-bind="badge")
</template>
