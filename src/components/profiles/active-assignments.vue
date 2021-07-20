<script>
export default {
  name: 'active-assignments',
  components: {
    AssignmentItem: () => import('~/components/assignments/assignment-item.vue'),
    ContributionItem: () => import('./contribution-item.vue'),
    Chips: () => import('~/components/common/chips.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    assignments: {
      type: Array,
      default: () => []
    },
    contributions: {
      type: Array,
      default: () => []
    },
    owner: Boolean
  },

  data () {
    return {
      page: 1,
      moons: true,
      filter: {
        active: true,
        archived: true,
        contributions: true
      }
    }
  },

  computed: {
    filteredAssignments () {
      return this.assignments.filter(a => (a.active && this.filter.active) || (a.past && this.filter.archived))
    },

    filteredActivity () {
      const activity = []
      this.filteredAssignments.forEach((assignment) => {
        activity.push({
          type: 'assignment',
          date: assignment.end,
          assignment
        })
      })

      if (this.filter.contributions) {
        this.contributions.forEach((contribution) => {
          const insertIndex = activity.findIndex(a => a.date < contribution.created)
          if (insertIndex >= 0) {
            activity.splice(insertIndex, 0, {
              type: 'contribution',
              date: contribution.created,
              contribution
            })
          } else {
            activity.push({
              type: 'contribution',
              date: contribution.created,
              contribution
            })
          }
        })
      }

      return activity
    },

    paginatedActivity () {
      return this.filteredActivity.slice((this.page - 1) * 5, this.page * 5)
    },

    total () {
      return (this.filter.contributions ? this.contributions.length : 0) + this.filteredAssignments.length
    }
  }
}
</script>

<template lang="pug">
widget(noPadding title="My activity").relative-position
  q-btn.absolute-top-right.q-ma-lg(
    flat size="sm"
    color="primary"
    label="Filter"
  )
    q-menu(anchor="bottom right" self="top right")
      q-list(padding)
        q-item-label(header) Assignments
        q-item
          q-item-section(side top)
            q-checkbox(v-model="filter.active")
          q-item-section
            chips(:tags="[{ label: 'Active', color: 'positive', text: 'white' }]")
        q-item
          q-item-section(side top)
            q-checkbox(v-model="filter.archived")
          q-item-section
            chips(:tags="[{ label: 'Archived', color: 'secondary', text: 'white' }]")
        q-separator
        q-item
          q-item-section(side top)
            q-checkbox(v-model="filter.contributions")
          q-item-section
            chips(:tags="[{ label: 'Contributions', color: 'warning', text: 'white' }]")
        q-separator
        q-item
          .row.items-center
            .text-body2 Lunar Periods
            q-toggle(v-model="moons")
              q-icon(name="fas fa-adjust")
  .text-body2.q-mx-md.q-px-md(v-if="assignments.length === 0 && contributions.length === 0") User has no activity
  .text-body2.q-mx-md.q-px-md(v-else-if="filteredActivity.length === 0") No activity matching filter
  q-list.q-mx-md(v-else class="rounded-borders")
    template(v-for="activity in paginatedActivity")
      contribution-item(v-if="activity.type === 'contribution'"
        :contribution="activity.contribution"
        :owner="owner"
        v-key="activity.date"
      )
      assignment-item(v-else-if="activity.type === 'assignment'"
        :assignment="activity.assignment"
        :owner="owner"
        :moons="moons"
        v-key="activity.date"
        @claim-all="$emit('claim-all')"
      )
  .q-pt-lg.flex.flex-center(v-if="total > 5")
    q-pagination(v-model="page" color="primary" :max="Math.ceil(total * 0.2)" direction-links)
</template>
