<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'active-proposals',
  components: {
    Chips: () => import('~/components/common/chips.vue'),
    BaseBanner: () => import('~/components/common/base-banner'),
    ProposalList: () => import('~/components/proposals/proposal-list'),
    FilterWidget: () => import('~/components/filters/filter-widget.vue'),
    Widget: () => import('~/components/common/widget.vue'),
    BasePlaceholder: () => import('~/components/placeholders/base-placeholder.vue'),
    ButtonRadio: () => import('~/components/common/button-radio.vue')
  },

  meta: {
    title: 'Active Proposals'
  },

  apollo: {
    dao: {
      query: () => require('../../query/proposals/dao-proposals-active-vote.gql'),
      update: data => data.queryDao,
      variables () {
        // Date restriction implementation can be seen in proposals-active.gql
        // Only get proposals that are active or recently expired
        // const date = new Date(Date.now() - 2 * (this.$config.contracts.voteDurationSeconds * 1000))
        // const dateString = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`
        return {
          // after: dateString,
          name: this.$route.params.dhoname,
          first: this.pagination.first,
          offset: 0,
          user: this.account
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
      optionArray: ['Sort by last added'],
      circleArray: ['All circles', 'Circle One'],
      pagination: {
        first: 2,
        offset: 0,
        more: true,
        restart: false
      },

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
          filter: (p) => p.__typename === 'Badge'
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
    ...mapGetters('accounts', ['account', 'isMember']),
    ...mapGetters('dao', ['selectedDao']),
    ...mapGetters('ballots', ['supply']),

    orderByVote () {
      const daos = this.dao
      if (!(daos && daos.length && Array.isArray(daos[0].proposal))) return []

      if (this.sort === this.optionArray[0]) {
        const withVote = []
        const withOutVote = []
        daos[0].proposal.forEach(prop => {
          if (prop.vote.length === 1) {
            withVote.push(prop)
          } else {
            withOutVote.push(prop)
          }
        })
        return [...withOutVote, ...withVote]
      }

      return daos[0].proposal
    },

    filteredProposals () {
      const proposalOrder = this.orderByVote

      if (proposalOrder.length === 0) return proposalOrder

      const proposals = []
      proposalOrder.forEach((proposal) => {
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

      return proposals
    }
  },
  watch: {
    selectedDao () {
      this.getSupply()
      if (this.dao) {
        this.pagination.restart = true
        this.resetPagination()
      }
    },
    sort () {
      if (this.dao) {
        this.pagination.restart = true
        this.resetPagination()
      }
    }
  },

  created () {
    if (!this.supply) {
      this.getSupply()
    }
  },
  activated () {
    if (this.dao) {
      this.pagination.restart = true
      this.resetPagination()
    }
  },

  methods: {
    ...mapActions('ballots', ['getSupply']),
    onLoad (index, done) {
      if (this.pagination.more) {
        this.pagination.offset = this.pagination.restart ? this.pagination.offset : this.pagination.offset + this.pagination.first
        this.$apollo.queries.dao.fetchMore({
          variables: {
            name: this.$route.params.dhoname,
            offset: this.pagination.offset,
            first: this.pagination.first
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (fetchMoreResult.queryDao[0].proposal.length === 0 || fetchMoreResult.queryDao[0].proposal.length < this.pagination.first) this.pagination.more = false
            if (this.pagination.restart) {
              this.pagination.restart = false
              return fetchMoreResult
            }
            return {
              queryDao: [
                {
                  ...prev.queryDao[0],
                  proposal: [
                    ...prev.queryDao[0].proposal,
                    ...fetchMoreResult.queryDao[0].proposal
                  ]
                }
              ]
            }
          }
        })
        done()
      }
    },
    async resetPagination () {
      this.pagination.offset = 0
      this.pagination.more = true
      await this.$nextTick()
      this.$refs.scroll.stop()
      await this.$nextTick()
      this.$refs.scroll.resume()
      await this.$nextTick()
      this.$refs.scroll.reset()
      await this.$nextTick()
      this.$refs.scroll.trigger()
    }
  }
}
</script>

<template lang="pug">
.active-proposals.full-width
  .row.full-width.relative-position.q-mb-md
    base-banner(
      title="Every vote **counts**"
      description="Decentralized decision making is a new kind of governance framework that ensures that decisions are open, just and equitable for all participants. In the DHO we use the 80/20 voting method as well as HVOICE, our token that determines your voting power. Votes are open for 7 days.",
      background="img/member-banner-bg.png"
    )
      template(v-slot:buttons)
        q-btn.q-px-lg.h-h7(color="secondary" no-caps unelevated rounded label="Create proposal", :to="{ name: 'proposal-create', params: { dhoname: selectedDao.name } }" :disable="!isMember")
        q-btn.h-h7(color="white" no-caps flat rounded label="Learn more")
      template(v-slot:right)
        .row
          .col-6.q-pa-xxs
            button-radio.full-height(
              icon="fas fa-vote-yea"
              title="Unity"
              subtitle="80% min"
              description="Of all votes cast on a proposal, at least 80% must be in favor for a proposal to pass"
            )
          .col-6.q-pa-xxs
            button-radio.full-height(
              icon="fas fa-users"
              title="Quorum"
              subtitle="20% min"
              description="The minimum % of the total vote supply that must be cast for a proposal to be considered"
            )

  .row.q-mt-sm
    .col-9.q-pr-sm.q-py-sm
      base-placeholder(v-if="!filteredProposals.length" title= "Proposals" subtitle="Your organization has not created any proposals yet. You can create a new proposal by clicking the button below."
        icon= "fas fa-file-medical" :actionButtons="[{label: 'Create a new Proposal', color: 'primary', onClick: () => $router.push(`/${this.selectedDao.name}/proposals/create`), disable: !this.isMember, disableTooltip: 'You must be a member'}]" )
      q-infinite-scroll(@load="onLoad" :offset="500" ref="scroll" :initial-index="1" v-if="filteredProposals.length").scroll.q-pt-md
        proposal-list(:username="account" :proposals="filteredProposals" :supply="supply" :view="view")
    .col-3.q-pl-sm.q-py-sm
      filter-widget(:view.sync="view",
      :sort.sync="sort",
      :textFilter.sync="textFilter",
      :circle.sync="circle",
      :showCircle="false",
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
.scroll
  min-height: 500px
</style>
