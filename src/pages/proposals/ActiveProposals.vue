<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'active-proposals',
  components: {
    Chips: () => import('~/components/common/chips.vue'),
    ProposalBanner: () => import('~/components/proposals/proposal-banner'),
    ProposalList: () => import('~/components/proposals/proposal-list'),
    ProposalFilters: () => import('~/components/proposals/proposal-filters'),
    Widget: () => import('~/components/common/widget.vue')
  },

  meta: {
    title: 'Active Proposals'
  },

  apollo: {
    dho: {
      query: require('../../query/proposals-active.gql'),
      update: data => data.getDho,
      variables () {
        // Only get proposals that are active or recently expired
        const date = new Date(Date.now() - 2 * (this.$config.contracts.voteDurationSeconds * 1000))
        const dateString = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`
        return {
          after: dateString,
          // TODO: dho value determined by url?
          hash: '52a7ff82bd6f53b31285e97d6806d886eefb650e79754784e9d923d3df347c91'
        }
      }
    }
  },

  data () {
    return {
      view: 'list',
      textFilter: null,
      sort: 'Sort by last added',
      options: ['Sort by last added', 'Sort by something else'],
      circle: 'All circles',
      circles: ['All circles', 'Circle One'],

      // TODO: Expand to include all types from creation wizard
      // Should this be driven from same config file?
      filters: [
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
      if (Array.isArray(this.dho.proposal)) {
        this.dho.proposal.forEach((proposal) => {
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
    },

    filterTags () {
      const tags = []
      this.filters.forEach((option) => {
        tags.push({
          color: option.enabled ? 'primary' : 'grey-4',
          text: option.enabled ? 'white' : 'grey-7',
          label: option.label
        })
      })

      return tags
    }
  },

  created () {
    if (!this.supply) {
      this.getSupply()
    }
  },

  methods: {
    ...mapActions('ballots', ['getSupply']),

    toggleFilter (tag) {
      const filter = this.filters.find(f => f.label === tag.label)
      if (filter) {
        filter.enabled = !filter.enabled
      }
    }
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
      proposal-list(v-if="dho" :username="account" :proposals="filteredProposals" :supply="supply" :view="view")
    .col-3.q-pl-sm.q-py-sm
      widget(title="Filters")
        .row.full-width.items-center.justify-between.q-pa-sm
          q-input.rounded-border.full-width(outlined v-model="textFilter" label="Filter by name")
        .row.full-width.items-center.justify-between.q-pa-sm
          .text-grey-6 Proposals view
          .btn-container
            q-btn.q-mr-sm(
              unelevated
              rounded
              padding="12px"
              size="sm"
              icon="fas fa-th-large"
              :color="view === 'card' ? 'primary' : 'grey-4'"
              :text-color="view === 'card' ? 'white' : 'primary'"
              @click="view = 'card'"
            )
            q-btn(
              unelevated
              rounded
              padding="12px"
              size="sm"
              icon="fas fa-list"
              :color="view === 'list' ? 'primary' : 'grey-4'"
              :text-color="view === 'list' ? 'white' : 'primary'"
              @click="view = 'list'"
            )
        .row.full-width.q-pa-sm
          q-select.full-width(dense filled v-model="sort" :options="options")
        .row.full-width.q-pa-sm
          q-select.full-width(dense filled v-model="circle" :options="circles")
        .row.full-width.q-my-md
          .text-subtitle1.q-mb-sm Proposal types
          chips(:tags="filterTags" clickable @click-tag="toggleFilter")
</template>

<style lang="stylus" scoped>
.rounded-border
  :first-child
    border-radius 12px

.close-btn
  z-index 1
</style>
