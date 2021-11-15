<script>
/**
 * A widget containing the controls for sorting and filtering the proposal list
 */
export default {
  name: 'proposal-filters',
  components: {
    Chips: () => import('../common/chips.vue'),
    Widget: () => import('../common/widget.vue')
  },

  props: {
    view: String,
    types: Array
  },

  data () {
    return {
      search: '',
      contributions: true,
      assignments: true,
      // quests: true,
      badges: true,
      sort: '',
      circles: '',
      options: [
        'Sorted by most recent'
      ]
    }
  }
}
</script>

<template lang="pug">
widget(title="Filters")
  .row.full-width.items-center.justify-between.q-pa-sm
    .text-grey-6 Proposals view
    #container
      q-btn.q-mr-sm(
        unelevated
        rounded
        padding="12px"
        size="sm"
        icon="fas fa-th-large"
        :color="view === 'card' ? 'primary' : 'grey-4'"
        :text-color="view === 'card' ? 'white' : 'primary'"
        @click="$emit('card')"
      )
      q-btn(
        unelevated
        rounded
        padding="12px"
        size="sm"
        icon="fas fa-list"
        :color="view === 'list' ? 'primary' : 'grey-4'"
        :text-color="view === 'list' ? 'white' : 'primary'"
        @click="$emit('list')"
      )
  .row.full-width.q-pa-sm
    q-select.full-width(dense filled v-model="sort" :options="options" label="Sorted by most recent")
  .row.full-width.q-pa-sm
    q-select.full-width(dense filled v-model="circles" :options="options" label="All circles")
  .row.full-width.items-center.justify-between.q-pa-sm
    chips(:tags="[{ color: 'primary', label: 'Contributions' }]")
    q-toggle(v-model="contributions" disable)
  .row.full-width.items-center.justify-between.q-pa-sm
    chips(:tags="[{ color: 'primary', label: 'Assignments' }]")
    q-toggle(v-model="assignments" disable)
  // .row.full-width.items-center.justify-between.q-pa-sm
    chips(:tags="[{ color: 'primary', label: 'Quests' }]")
    q-toggle(v-model="quests" disable)
  .row.full-width.items-center.justify-between.q-pa-sm
    chips(:tags="[{ color: 'primary', label: 'Badges' }]")
    q-toggle(v-model="badges" disable)
</template>
