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
    }
  }
}
</script>

<template lang="pug">
widget(more morePosition="top" title= "Archetypes" @more-clicked="$router.push({ path: `${$route.path}/assets/role` })"
  tooltip="Archetypes describe accountabilities and/or key tasks assigned to members of the DAO. These archetypes allow members to apply for a role.").full-width
  .row(v-if="!archetypes ||archetypes.length === 0")
    empty-widget-label(sectionTitle="archetypes")
  .row(v-for="archetype in archetypes" v-else)
      .col-12.q-mt-xs
          archetype-card(v-bind="archetype" @click.native="$router.push({ path: `${$route.path}/assets/role/${archetype.docId}` })")
</template>
