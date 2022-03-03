<script>
export default {
  name: 'badges-widget',
  components: {
    Widget: () => import('../common/widget.vue'),
    BadgeCard: () => import('./badge-card.vue'),
    EmptyWidgetLabel: () => import('../common/empty-widget-label.vue')
  },
  props: {
    /**
     * Circles Array
     */
    badges: {
      type: Array,
      default: () => []
    },
    /**
     * Show compact style
     */
    compact: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<template lang="pug">
widget(title="Badges" more morePosition="top" @more-clicked="$router.push({ path: `${$route.path}/assets/badge` })").full-width
  .row(v-if="!badges ||badges.length === 0")
    empty-widget-label(sectionTitle="badges")
  .row(v-else v-for="badge in badges")
      .col-12
          badge-card(v-bind="badge" :compact="compact")
</template>
