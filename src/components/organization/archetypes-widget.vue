<script>
export default {
  name: 'archetypes-widget',
  components: {
    Widget: () => import('../common/widget.vue'),
    ArchetypeCard: () => import('./archetype-card.vue'),
    EmptyWidgetLabel: () => import('~/components/common/empty-widget-label.vue')
  },
  props: {
    /**
     * Archetypes Array
     */
    archetypes: {
      type: Array,
      default: () => []
    },
    isMobile: Boolean
  }
}
</script>

<template lang="pug">
widget.full-width(more :morePosition="isMobile ?'bottom': 'top'" :title="$t('organization.archetypes-widget.archetypes')" @more-clicked="$router.push({ path: `${$route.path}/assets/role` })" :tooltip="$t('organization.archetypes-widget.archetypesDescribeAccountabilities')")
  .row(v-if="!archetypes || archetypes.length === 0")
    empty-widget-label(sectionTitle="archetypes")
  .row(v-for="archetype in archetypes" v-else)
    .col-12.q-mt-xs
      archetype-card(v-bind="archetype" @click.native="$router.push({ path: `${$route.path}/assets/role/${archetype.docId}` })")

</template>
