<script>
export default {
  name: 'active-assignments',
  components: {
    AssignmentItem: () => import('./assignment-item.vue'),
    Chips: () => import('~/components/common/chips.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    assignments: {
      type: Array,
      default: () => []
    },
    owner: Boolean
  },

  data () {
    return {
      moons: true,
      filter: {
        active: true,
        archived: true,
        contributions: false
      }
    }
  },

  computed: {
    filteredAssignments () {
      return this.assignments.filter(a => (a.active && this.filter.active) || (a.past && this.filter.archived))
    }
  }
}
</script>

<template lang="pug">
widget(noPadding title="My works").relative-position
  q-btn.absolute-top-right.q-ma-lg(
    flat size="sm"
    color="primary"
    label="Filter"
  )
    q-menu(anchor="bottom right" self="top right")
      q-list(padding)
        q-item-label(header) Assignments
        q-item(v-ripple)
          q-item-section(side top)
            q-checkbox(v-model="filter.active")
          q-item-section
            chips(:tags="[{ label: 'Active', color: 'positive', text: 'white' }]")
        q-item(v-ripple)
          q-item-section(side top)
            q-checkbox(v-model="filter.archived")
          q-item-section
            chips(:tags="[{ label: 'Archived', color: 'secondary', text: 'white' }]")
        q-separator
        q-item
          q-item-section(side top)
            q-checkbox(v-model="filter.contributions" disable)
          q-item-section
            q-item-label Contributions
            q-item-label(caption) (Coming Soon)
        q-separator
        q-item
          .row.items-center
            .text-body2 Lunar Periods
            q-toggle(v-model="moons")
              q-icon(name="fas fa-adjust")
  .text-body2.q-mx-md.q-px-md(v-if="assignments.length === 0") User has no works
  .text-body2.q-mx-md.q-px-md(v-else-if="filteredAssignments.length === 0") No works matching filter
  q-list.q-mx-md(v-else class="rounded-borders")
    template(v-for="assign in filteredAssignments")
      assignment-item(v-show="(assign.active && filter.active) || (assign.past && filter.archived)"
        :assignment="assign" :owner="owner" :moons="moons")
</template>
