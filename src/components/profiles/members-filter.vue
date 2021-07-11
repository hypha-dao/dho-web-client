<script>
export default {
  name: 'members-filters',
  components: {
    Chips: () => import('../common/chips.vue'),
    Widget: () => import('../common/widget.vue')
  },

  data () {
    return {
      search: '',
      applicant: true
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
    chips(:tags="[{ color: 'primary', label: 'Applicants' }]")
    q-toggle(v-model="applicant")
</template>
