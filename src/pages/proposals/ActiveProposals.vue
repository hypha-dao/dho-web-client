<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'active-proposals',
  components: {
    Chips: () => import('~/components/common/chips.vue'),
    ProposalBanner: () => import('~/components/proposals/proposal-banner'),
    ProposalList: () => import('~/components/proposals/proposal-list'),
    FilterWidget: () => import('~/components/filters/filter-widget.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  meta: {
    title: 'Active Proposals'
  },

  apollo: {
    dao: {
      query: require('../../query/dao-proposals-active.gql'),
      update: data => data.queryDao,
      variables () {
        // Date restriction implementation can be seen in proposals-active.gql
        // Only get proposals that are active or recently expired
        // const date = new Date(Date.now() - 2 * (this.$config.contracts.voteDurationSeconds * 1000))
        // const dateString = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`
        return {
          // after: dateString,
          name: this.$route.params.dhoname
        }
      }
    }
  },

  data () {
    return {
      view: '',
      textFilter: null,
      sort: 'Sort by last added',
      circle: 'All circles',
      optionArray: ['Sort by last added', 'Sort by something else'],
      circleArray: ['All circles', 'Circle One'],

      // TODO: Expand to include all types from creation wizard
      // Should this be driven from same config file?
      filters: [
        {
          label: 'All',
          enabled: true,
          filter: () => true
        },
        {
          label: 'Contributions',
          enabled: true,
          filter: (p) => p.__typename === 'Payout'
        },
        {
          label: 'Assignments',
          enabled: true,
          filter: (p) => p.__typename === 'Assignment' || p.__typename === 'Edit'
        },
        {
          label: 'Archetypes',
          enabled: true,
          filter: (p) => p.__typename === 'Role'
        },
        {
          label: 'Badges',
          enabled: true,
          filter: (p) => p.__typename === 'Assignbadge'
        },
        {
          label: 'Suspension',
          enabled: true,
          filter: (p) => p.__typename === 'Suspend'
        }
      ]
    }
  },

  computed: {
    ...mapGetters('accounts', ['account']),
    ...mapGetters('ballots', ['supply']),

    filteredProposals () {
      const proposals = []
      if (this.dao && this.dao.length && Array.isArray(this.dao[0].proposal)) {
        this.dao[0].proposal.forEach((proposal) => {
          let found = false
          this.filters.forEach((filter) => {
            if (!found && filter.enabled && filter.filter(proposal)) {
              if (!this.textFilter || this.textFilter.length === 0 ||
                  proposal.details_title_s.toLocaleLowerCase().includes(this.textFilter.toLocaleLowerCase())) {
                proposals.push(proposal)
              }
              found = true
            }
          })
        })
      }

      return proposals
    }
  },

  created () {
    if (!this.supply) {
      this.getSupply()
    }
  },

  methods: {
    ...mapActions('ballots', ['getSupply'])
  }
}
</script>

<template lang="pug">
.active-proposals.full-width
  .row.full-width.relative-position.q-mb-md
    q-btn.absolute-top-right.q-mt-md.q-mr-md.q-pa-xs.close-btn(
      flat round size="sm"
      icon="fas fa-times"
      color="white"
    )
    proposal-banner
  .row.q-mt-sm
    .col-9.q-pr-sm.q-py-sm
      proposal-list(v-if="dao" :username="account" :proposals="filteredProposals" :supply="supply" :view="view")
    .col-3.q-pl-sm.q-py-sm
      filter-widget(:view.sync="view",
      :sort.sync="sort",
      :textFilter.sync="textFilter",
      :circle.sync="circle",
      :optionArray.sync="optionArray",
      :circleArray.sync="circleArray"
      :viewSelectorLabel="'Proposals view'",
      :chipsFiltersLabel="'Proposal types'",
      :filters.sync="filters")
</template>

<style lang="stylus" scoped>
.rounded-border
  :first-child
    border-radius 12px

.close-btn
  z-index 1
</style>
