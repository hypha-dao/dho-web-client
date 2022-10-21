<script>
export default {
  name: 'active-assignments',
  components: {
    ProposalItem: () => import('~/components/profiles/proposal-item.vue'),
    Chips: () => import('~/components/common/chips.vue'),
    Widget: () => import('~/components/common/widget.vue'),
    WidgetMoreBtn: () => import('~/components/common/widget-more-btn.vue')
  },

  props: {
    selectedDao: Object,
    daoSettings: Object,
    supply: Number,
    votingPercentages: Object,
    hasMore: Boolean,
    assignments: {
      type: Array,
      default: undefined
    },
    contributions: {
      type: Array,
      default: undefined
    },
    owner: Boolean,
    compact: Boolean
  },

  data () {
    return {
      page: 1,
      filter: {
        active: true,
        archived: true,
        contributions: true
      }
    }
  },

  computed: {
    filteredActivity () {
      const activity = []
      this.assignments?.forEach((assignment) => {
        if (assignment?.type === 'Assignbadge') {
          activity.push({
            type: 'assignbadge',
            assignbadge: assignment
          })
        } else {
          activity.push({
            type: 'assignment',
            assignment
          })
        }
      })

      if (this.filter.contributions) {
        this.contributions?.forEach((contribution) => {
          activity.push({
            type: 'contribution',
            contribution
          })
        })
      }

      return activity
    },

    paginatedActivity () {
      return this.filteredActivity
    }
  },
  methods: {
    onMore (onLoadResult) {
      this.$emit('onMore', onLoadResult)
    }
  }
}
</script>

<template lang="pug">
q-slide-transition
  widget(:title="assignments && contributions ? 'Activity' : (assignments ? 'Assignments' : 'Contributions')")
    //- q-btn.absolute-top-right.q-ma-lg(
    //-   flat size="sm"
    //-   color="primary"
    //-   label="Filter"
    //- )
    //-   q-menu(anchor="bottom right" self="top right")
    //-     q-list(padding)
    //-       q-item-label(header) Assignments
    //-       q-item
    //-         q-item-section(side top)
    //-           q-checkbox(v-model="filter.active")
    //-         q-item-section
    //-           chips(:tags="[{ label: 'Active', color: 'positive', text: 'white' }]")
    //-       q-item
    //-         q-item-section(side top)
    //-           q-checkbox(v-model="filter.archived")
    //-         q-item-section
    //-           chips(:tags="[{ label: 'Archived', color: 'secondary', text: 'white' }]")
    //-       q-separator
    //-       q-item
    //-         q-item-section(side top)
    //-           q-checkbox(v-model="filter.contributions")
    //-         q-item-section
    //-           chips(:tags="[{ label: 'Contributions', color: 'warning', text: 'white' }]")
    //-       q-separator
    //-       q-item
    //-         .row.items-center
    //-           .text-body2 Lunar Periods
    //-           q-toggle(v-model="moons")
    //-             q-icon(name="fas fa-adjust")
    .text-body2.q-mx-md.q-px-md(v-if="!((assignments && assignments.length !== 0) || (contributions && contributions.length !== 0))") User has no activity
    .text-body2.q-mx-md.q-px-md(v-else-if="filteredActivity.length === 0") No activity matching filter
    q-list.q-mt-lg(v-else class="rounded-borders")
      TransitionGroup(
        name="list"
      )
        template(v-for="(activity, index) in paginatedActivity")
          proposal-item.q-my-sm(v-if="activity.type === 'contribution'"
            :proposal="activity.contribution"
            :clickable="owner || activity.contribution.details_state_s === 'proposed'"
            :owner="owner"
            :key="activity.contribution.docId"
            @onClick="$router.push( '/'+ $route.params.dhoname + '/proposals/' + activity.contribution.docId)"
            :selectedDao="selectedDao"
            :daoSettings="daoSettings"
            :supply="supply"
            :votingPercentages="votingPercentages"
            :compact="compact"
          )
          proposal-item.q-my-sm(v-else-if="activity.type === 'assignment'"
            :proposal="activity.assignment"
            :clickable="owner || activity.assignment.details_state_s === 'proposed'"
            :owner="owner"
            :key="activity.assignment.docId"
            @claim-all="$emit('claim-all')"
            @change-deferred="(val) => $emit('change-deferred', val)"
            @onClick="$router.push( '/'+ $route.params.dhoname + '/proposals/' + activity.assignment.docId)"
            :selectedDao="selectedDao"
            :daoSettings="daoSettings"
            :supply="supply"
            :votingPercentages="votingPercentages"
            :compact="compact"
          )
          proposal-item.q-my-sm(v-else-if="activity.type === 'assignbadge'"
            :proposal="activity.assignbadge"
            :clickable="owner || activity.assignbadge.details_state_s === 'proposed'"
            :owner="owner"
            :key="activity.assignbadge.docId"
            @claim-all="$emit('claim-all')"
            @change-deferred="(val) => $emit('change-deferred', val)"
            @onClick="$router.push( '/'+ $route.params.dhoname + '/proposals/' + activity.assignbadge.docId)"
            :compact="compact"
          )
    .flex.flex-center
      widget-more-btn(@onMore="onMore" v-if="hasMore")
</template>

<style lang="stylus" scoped>
.list, .list-move, .list-enter-active, .list-leave-active
  transition all 0.5s ease

.list-enter, .list-leave-to
  opacity 0
  transform translateY(-30px)

.list-leave-active
  position absolute
</style>
