<script>
export default {
  name: 'proposal-filters',
  components: {
    Chips: () => import('../common/chips.vue'),
    Widget: () => import('../common/widget.vue')
  },

  data () {
    return {
      search: '',
      contributions: true,
      assignments: true,
      // quests: true,
      badges: true,
      view: 'list',
      options: [
        'Sorted by most recent'
      ]
    }
  }
}
</script>

<template lang="pug">
widget(title="Filters")
  // q-input.search.q-mb-md(
    v-model="search"
    placeholder="Search"
    rounded
    outlined
    bg-color="white"
    dense
  // )
  .row.full-width.items-center.justify-between.q-pa-sm
    .text-grey-6 Proposals view
    q-btn-toggle(
      v-model="view"
      padding="10px"
      size="sm"
      toggle-color="primary"
      :options="[{ value: 'list', icon: 'fas fa-list' },{ value: 'card', icon: 'fas fa-th-large' }]"
    )
  .row.full-width.q-pa-sm
    q-select.full-width(dense filled v-model="model" :options="options" label="Sorted by most recent")
  .row.full-width.q-pa-sm
    q-select.full-width(dense filled v-model="model" :options="options" label="All circles")
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
