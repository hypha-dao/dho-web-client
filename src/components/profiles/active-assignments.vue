<script>
import { PROPOSAL_TYPE } from '~/const'
import lodash from 'lodash'

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
    compact: Boolean,
    tablet: Boolean,
    typeOnly: String
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
        const uniqueContributions = lodash.uniqBy(this.contributions, 'docId')
        uniqueContributions?.forEach((contribution) => {
          if (contribution?.type === PROPOSAL_TYPE.QUEST_PAYOUT) {
            activity.push({
              type: 'questcomplet',
              contribution
            })
          } else if (contribution?.type === PROPOSAL_TYPE.QUEST_START) {
            activity.push({
              type: 'queststart',
              contribution
            })
          } else {
            activity.push({
              type: 'contribution',
              contribution
            })
          }
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
  template(v-if="tablet")
    .text-body2.q-mx-md.q-px-md(v-if="!((assignments && assignments.length !== 0) || (contributions && contributions.length !== 0))") {{ $t('profiles.active-assignments.userHasNoActivity') }}
    .text-body2.q-mx-md.q-px-md(v-else-if="filteredActivity.length === 0") {{ $t('profiles.active-assignments.noActivityMatchingFilter') }}
    .q-mt-lg.rounded-borders(v-else)
      .row
        .template(v-for="activity in paginatedActivity" :class="'col-12 q-px-xs q-mb-md'")
          proposal-item(v-if="activity.type === 'contribution'" :proposal="activity.contribution" :clickable="owner || activity.contribution.details_state_s === 'proposed'" :owner="owner" :key="activity.contribution.docId" @onClick="$router.push( '/'+ $route.params.dhoname + '/agreements/' + activity.contribution.docId)" :selectedDao="selectedDao" :daoSettings="daoSettings" :supply="supply" :votingPercentages="votingPercentages" :compact="compact")
          proposal-item(v-else-if="activity.type === 'assignment'" :proposal="activity.assignment" :clickable="owner || activity.assignment.details_state_s === 'proposed'" :owner="owner" :key="activity.assignment.docId" @claim-all="$emit('claim-all')" @change-deferred="(val) => $emit('change-deferred', val)" @onClick="$router.push( '/'+ $route.params.dhoname + '/agreements/' + activity.assignment.docId)" :selectedDao="selectedDao" :daoSettings="daoSettings" :supply="supply" :votingPercentages="votingPercentages" :compact="compact")
          proposal-item(v-else-if="activity.type === 'assignbadge'" :proposal="activity.assignbadge" :clickable="owner || activity.assignbadge.details_state_s === 'proposed'" :owner="owner" :key="activity.assignbadge.docId" @claim-all="$emit('claim-all')" @change-deferred="(val) => $emit('change-deferred', val)" @onClick="$router.push( '/'+ $route.params.dhoname + '/agreements/' + activity.assignbadge.docId)" :compact="compact")
          proposal-item(v-else-if="activity.type === 'questcomplet'" :proposal="activity.contribution" :clickable="owner || activity.contribution.details_state_s === 'proposed'" :owner="owner" :key="activity.contribution.docId" @onClick="$router.push( '/'+ $route.params.dhoname + '/agreements/' + activity.contribution.docId)" :selectedDao="selectedDao" :daoSettings="daoSettings" :supply="supply" :votingPercentages="votingPercentages" :compact="compact")
          proposal-item(v-else-if="activity.type === 'queststart'" :proposal="activity.contribution" :clickable="owner || activity.contribution.details_state_s === 'proposed'" :owner="owner" :key="activity.contribution.docId" @onClick="$router.push( '/'+ $route.params.dhoname + '/agreements/' + activity.contribution.docId)" :selectedDao="selectedDao" :daoSettings="daoSettings" :supply="supply" :votingPercentages="votingPercentages" :compact="compact")
      .flex.flex-center
        widget-more-btn(@onMore="onMore" v-if="hasMore")
  widget(v-else :title="assignments && contributions ? 'Activity' : (assignments ? 'Assignments' : 'Contributions')")
    .text-body2.q-mx-md.q-px-md(v-if="!((assignments && assignments.length !== 0) || (contributions && contributions.length !== 0))") {{ $t('profiles.active-assignments.userHasNoActivity1') }}
    .text-body2.q-mx-md.q-px-md(v-else-if="filteredActivity.length === 0") {{ $t('profiles.active-assignments.noActivityMatchingFilter1') }}
    q-list.q-mt-lg.rounded-borders(v-else)
      template(v-for="(activity, index) in paginatedActivity")
        proposal-item.q-my-sm(v-if="activity.type === 'contribution'" :proposal="activity.contribution" :clickable="owner || activity.contribution.details_state_s === 'proposed'" :owner="owner" :key="activity.contribution.docId" @onClick="$router.push( '/'+ $route.params.dhoname + '/agreements/' + activity.contribution.docId)" :selectedDao="selectedDao" :daoSettings="daoSettings" :supply="supply" :votingPercentages="votingPercentages" :compact="compact")
        proposal-item.q-my-sm(v-else-if="activity.type === 'assignment'" :proposal="activity.assignment" :clickable="owner || activity.assignment.details_state_s === 'proposed'" :owner="owner" :key="activity.assignment.docId" @claim-all="$emit('claim-all')" @change-deferred="(val) => $emit('change-deferred', val)" @onClick="$router.push( '/'+ $route.params.dhoname + '/agreements/' + activity.assignment.docId)" :selectedDao="selectedDao" :daoSettings="daoSettings" :supply="supply" :votingPercentages="votingPercentages" :compact="compact")
        proposal-item.q-my-sm(v-else-if="activity.type === 'assignbadge'" :proposal="activity.assignbadge" :clickable="owner || activity.assignbadge.details_state_s === 'proposed'" :owner="owner" :key="activity.assignbadge.docId" @claim-all="$emit('claim-all')" @change-deferred="(val) => $emit('change-deferred', val)" @onClick="$router.push( '/'+ $route.params.dhoname + '/agreements/' + activity.assignbadge.docId)" :compact="compact")
        proposal-item.q-my-sm(v-else-if="activity.type === 'questcomplet'" :proposal="activity.contribution" :clickable="owner || activity.contribution.details_state_s === 'proposed'" :owner="owner" :key="activity.contribution.docId" @onClick="$router.push( '/'+ $route.params.dhoname + '/agreements/' + activity.contribution.docId)" :selectedDao="selectedDao" :daoSettings="daoSettings" :supply="supply" :votingPercentages="votingPercentages" :compact="compact")
        proposal-item.q-my-sm(v-else-if="activity.type === 'queststart'" :proposal="activity.contribution" :clickable="owner || activity.contribution.details_state_s === 'proposed'" :owner="owner" :key="activity.contribution.docId" @onClick="$router.push( '/'+ $route.params.dhoname + '/agreements/' + activity.contribution.docId)" :selectedDao="selectedDao" :daoSettings="daoSettings" :supply="supply" :votingPercentages="votingPercentages" :compact="compact")
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
