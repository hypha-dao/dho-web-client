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
widget(more morePosition="top" title= "Archetypes" @more-clicked="$router.push({ path: `${$route.path}/assets/role` })").full-width
  .h-b2.q-mt-sm.q-my-md.text-justify Archetypes represent a recurrent symbol or pattern of the organization as a way to group certain kinds of activities together; they are a way to combine natural talents and strengths with the needs and capacities of the organization.
  .row(v-if="!archetypes ||archetypes.length === 0")
    empty-widget-label(sectionTitle="archetypes")
  .row(v-for="archetype in archetypes" v-else)
      .col-12.q-mt-xs
          archetype-card(v-bind="archetype" @click.native="$router.push({ path: `${$route.path}/assets/role/${archetype.docId}` })")
</template>
