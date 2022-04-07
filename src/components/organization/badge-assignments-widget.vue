<script>
export default {
  name: 'badge-assignments-widget',
  components: {
    Widget: () => import('../common/widget.vue'),
    BadgeAssignmentCard: () => import('./badge-assignment-card.vue'),
    EmptyWidgetLabel: () => import('../common/empty-widget-label.vue')
  },
  props: {
    assignments: {
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
widget(title="Badge assignments").full-width
  .q-mt-xs
  .row(v-if="!assignments || assignments.length === 0")
    slot(name="empty")
      empty-widget-label(sectionTitle="Badge assignments")
  .row(v-else v-for="assignment in assignments")
      .col-12
          badge-assignment-card(v-bind="assignment" :compact="compact" @click.native="$router.push({ path: `/${$route.params.dhoname}/proposals/${assignment.docId}` })")
</template>
