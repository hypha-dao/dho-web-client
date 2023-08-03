<script>
export default {
  name: 'role-assignments-widget',
  components: {
    Widget: () => import('../common/widget.vue'),
    RoleAssignmentCard: () => import('./role-assignment-card.vue'),
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
    },
    isMobile: Boolean
  }
}
</script>

<template lang="pug">
widget.full-width(:title="$t('organization.role-assignments-widget.activeRoleAssignments')" more :morePosition="isMobile ?'bottom': 'top'" @more-clicked="$router.push({ name: 'search', params: { dhoname: $route.params.dhoname, findBy: 'Role Assignments', filterBy: 'document' }, query: {q: '', type: '4', filter: 'Active'} })")
  .q-mt-xs
  .row(v-if="!assignments || assignments.length === 0")
    slot(name="empty")
      empty-widget-label(:sectionTitle="$t('organization.role-assignments-widget.activeRoleAssignments')")
  .row(v-else v-for="assignment in assignments")
    .col-12
      role-assignment-card(v-bind="assignment" :compact="compact" @click.native="$router.push({ path: `/${$route.params.dhoname}/proposals/${assignment.docId}` })")

</template>
