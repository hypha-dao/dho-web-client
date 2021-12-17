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
    .text-body2.q-mt-sm.text-weight-thin.text-grey-7.q-my-md Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
    .row(v-for="archetype in archetypes")
        .col-12
            archetype-card(v-bind="archetype")
</template>
