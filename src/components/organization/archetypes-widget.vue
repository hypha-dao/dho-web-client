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
widget.full-width
    .row.justify-between
        .col-8
            .h-h4 Archetypes
        .col
            q-btn.full-width(
                label="See all"
                flat
                no-caps
                dense
                @click="$router.push({ path: `${$route.path}/assets/role` })"
            )
    .h-b2.q-mt-sm.text-weight-thin.text-grey-7.q-my-md.text-justify.font-size-w-desc Archetypes represent a recurrent symbol or pattern of the organization as a way to group certain kinds of activities together; they are a way to combine natural talents and strengths with the needs and capacities of the organization.
    .row(v-if="!archetypes ||archetypes.length === 0")
      empty-widget-label(sectionTitle="archetypes")
    .row(v-for="archetype in archetypes" v-else)
        .col-12
            archetype-card(v-bind="archetype")
</template>
