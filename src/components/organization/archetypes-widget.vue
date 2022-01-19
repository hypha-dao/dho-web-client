<script>
export default {
  name: 'archetypes-widget',
  components: {
    Widget: () => import('../common/widget.vue'),
    ArchetypeCard: () => import('./archetype-card.vue')
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
            .text-h6.text-weight-bold Archetypes
        .col
            q-btn.full-width(
                label="See all"
                flat
                no-caps
                dense
            )
    .text-body2.q-mt-sm.text-weight-thin.text-grey-7.q-my-md Archetypes represent a recurrent symbol or pattern of the organization as a way to group certain kinds of activities together; they are a way to combine natural talents and strengths with the needs and capacities of the organization.
    .row(v-for="archetype in archetypes")
        .col-12
            archetype-card(v-bind="archetype")
</template>
