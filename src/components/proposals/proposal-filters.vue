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
      quests: true,
      badges: true
    }
  }
}
</script>

<template lang="pug">
widget(title="Filters")
  q-input.search.q-mb-md(
    v-model="search"
    placeholder="Search"
    rounded
    outlined
    bg-color="white"
    dense
  )
  .row.full-width.items-center.justify-between.q-pa-sm
    chips(:tags="[{ color: 'warning', label: 'Contributions' }]")
    q-toggle(v-model="contributions")
  .row.full-width.items-center.justify-between.q-pa-sm
    chips(:tags="[{ color: 'positive', label: 'Assignments' }]")
    q-toggle(v-model="assignments")
  .row.full-width.items-center.justify-between.q-pa-sm
    chips(:tags="[{ color: 'negative', label: 'Quests' }]")
    q-toggle(v-model="quests")
  .row.full-width.items-center.justify-between.q-pa-sm
    chips(:tags="[{ color: 'black', label: 'Badges' }]")
    q-toggle(v-model="badges")
</template>
