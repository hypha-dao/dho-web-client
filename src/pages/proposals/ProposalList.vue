<script>
import { mapActions, mapGetters } from 'vuex'
import ipfsy from '~/utils/ipfsy'

export default {
  name: 'active-proposals',
  components: {
    Chips: () => import('~/components/common/chips.vue'),
    BaseBanner: () => import('~/components/common/base-banner'),
    ProposalList: () => import('~/components/proposals/proposal-list'),
    FilterWidgetMobile: () => import('~/components/filters/filter-widget-mobile.vue'),
    FilterOpenButton: () => import('~/components/filters/filter-open-button.vue'),
    FilterWidget: () => import('~/components/filters/filter-widget.vue'),
    Widget: () => import('~/components/common/widget.vue'),
    BasePlaceholder: () => import('~/components/placeholders/base-placeholder.vue'),
    ButtonRadio: () => import('~/components/common/button-radio.vue'),
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue')
  },

  apollo: {
    dao: {
      query: () => require('../../query/proposals/dao-proposals-active-vote.gql'),
      update: data => data.queryDao,
      skip: true,
      variables () {
        // Date restriction implementation can be seen in proposals-active.gql
        // Only get proposals that are active or recently expired
        // const date = new Date(Date.now() - 2 * (this.$config.contracts.voteDurationSeconds * 1000))
        // const dateString = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`
        return {
          // after: dateString,
          docId: this.selectedDao.docId,
          first: this.pagination.first,
          offset: 0,
          user: this.account
        }
      },
      subscribeToMore: {
        document: require('~/query/proposals/dao-proposals-active-vote-subs.gql'),
        variables () {
          return {
            // first: (this.pagination.offset + this.pagination.first), // TODO: For some reason this does not work
            docId: this.selectedDao.docId,
            user: this.account
          }
        },
        skip () { return !this.selectedDao?.docId },
        updateQuery: (previousResult, { subscriptionData }) => {
          if (!subscriptionData?.data) {
            return previousResult
          }
          if (!previousResult?.data) {
            return undefined
          }
          subscriptionData.data.queryDao[0].proposal = [...previousResult.data.queryDao[0].proposal, ...subscriptionData.data.queryDao[0].proposal]
          return subscriptionData
        }
      }
    },
    stagedProposals: {
      query: () => require('../../query/proposals/dao-proposals-stage.gql'),
      update: data => data?.queryDao[0]?.stagingprop,
      variables () {
        return {
          docId: this.selectedDao.docId,
          first: this.pagination.first,
          offset: 0,
          user: this.account
        }
      },
      skip () { return !this.selectedDao?.docId },
      fetchPolicy: 'no-cache',
      subscribeToMore: {
        document: require('~/query/proposals/dao-proposals-stage-subs.gql'),
        variables () {
          return {
            docId: this.selectedDao.docId,
            user: this.account
          }
        },
        skip () { return !this.selectedDao?.docId },
        updateQuery: (previousResult, { subscriptionData }) => {
          if (!subscriptionData?.data) {
            return previousResult
          }
          if (!previousResult?.data) {
            return undefined
          }
          subscriptionData.data.queryDao[0].stagingprop = [...previousResult.data.queryDao[0].stagingprop, ...subscriptionData.data.queryDao[0].stagingprop]
          return subscriptionData
        }
      }
    },
    proposalsCount: {
      query: () => require('../../query/proposals/dao-proposals-count.gql'),
      update: data => {
        return data.queryDao[0].proposalAggregate.count
      },
      variables () {
        return {
          docId: this.selectedDao.docId
        }
      },
      skip () { return !this.selectedDao?.docId },
      fetchPolicy: 'no-cache'
    }
  },

  data () {
    return {
      mobileFilterOpen: false,
      isShowingProposalBanner: true,
      view: '',
      textFilter: null,
      sort: 'Sort by last added',
      circle: 'All circles',
      optionArray: [{ label: 'Sort by', disable: true }, 'Last added'],
      circleArray: ['All circles', 'Circle One'],
      pagination: {
        first: 50,
        offset: 0,
        more: true
      },
      mobileFilterStyles: {
        width: this.$q.screen.md ? '400px' : '100%',
        right: this.$q.screen.md ? '0' : '0',
        left: this.$q.screen.md ? 'auto' : '0'
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
          label: 'Generic Contributions',
          enabled: false,
          filter: (p) => p.__typename === 'Payout'
        },
        {
          label: 'Role Assignments',
          enabled: false,
          filter: (p) => p.__typename === 'Assignment' || p.__typename === 'Edit'
        },
        {
          label: 'Role Archetypes',
          enabled: false,
          filter: (p) => p.__typename === 'Role'
        },
        {
          label: 'Badge Types',
          enabled: false,
          filter: (p) => p.__typename === 'Badge'
        },
        {
          label: 'Badge Assignments',
          enabled: false,
          filter: (p) => p.__typename === 'Assignbadge'
        },
        {
          label: 'Suspension',
          enabled: false,
          filter: (p) => p.__typename === 'Suspend'
        }
      ],
      filtersToEvaluate: undefined,

      showStagedProposals: true,

      state: 'LOADING'
    }
  },

  computed: {
    ...mapGetters('accounts', ['account', 'isMember']),
    ...mapGetters('ballots', ['supply']),
    ...mapGetters('dao', ['daoSettings', 'selectedDao', 'votingPercentages']),

    banner () {
      return {
        title: this.daoSettings.proposalsTitle,
        description: this.daoSettings.proposalsParagraph,
        background: ipfsy(this.daoSettings.proposalsBackgroundImage),
        color: this.daoSettings.primaryColor,
        pattern: this.daoSettings.pattern,
        patternColor: this.daoSettings.patternColor,
        patternAlpha: this.daoSettings.patternOpacity
      }
    },

    proposals () {
      const daos = this.dao
      if (!(daos && daos.length && Array.isArray(daos[0].proposal))) return []

      // if (this.sort === this.optionArray[0]) {
      //   const withVote = []
      //   const withOutVote = []
      //   daos[0].proposal.forEach(prop => {
      //     if (prop.vote && prop.vote.length === 1) {
      //       withVote.push(prop)
      //     } else {
      //       withOutVote.push(prop)
      //     }
      //   })
      //   return [...withOutVote, ...withVote]
      // }

      return daos[0].proposal
    },

    filteredProposals () {
      const proposalOrder = this.proposals

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
    },
    filteredStagedProposals () {
      if (!this.stagedProposals) return []

      const proposals = [
        ...(this.state === 'RUNNING' ? [{ loading: true }] : [])
      ]
      this.stagedProposals.forEach((proposal) => {
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
    },
    countForFetching () {
      return Math.ceil(this.proposalsCount / this.pagination.first) || 0
    },
    quorumTitle () {
      const { quorum } = this.votingPercentages
      return `${quorum}% min`
    },
    unityTitle () {
      const { unity } = this.votingPercentages
      return `${unity}% min`
    },
    hasProposals () {
      return this.proposals.length || this.stagedProposals.length
    }
  },
  watch: {
    selectedDao () {
      this.getSupply()
      this.$apollo.queries.dao.stop()
      if (this.dao) {
        this.resetPaginationValues()
      }
      this.$apollo.queries.dao.start()
    },
    sort () {
      if (this.dao) {
        this.resetPaginationValues()
      }
    },
    filters: {
      deep: true,
      handler () {
        if (!this.filtersToEvaluate) {
          const someFilterIsTrue = this.filters.some(filter => filter.enabled && (filter.label !== this.filters[0].label))
          this.filters[0].enabled = !someFilterIsTrue
          this.filtersToEvaluate = JSON.parse(JSON.stringify(this.filters))
          return
        }
        if (!this.filtersToEvaluate[0].enabled && this.filters[0].enabled) {
          this.filters = this.filters.map(f => {
            if (f.label === this.filters[0].label) {
              return f
            }
            return { ...f, enabled: false }
          })
        } else {
          const someFilterIsTrue = this.filters.some(filter => filter.enabled && (filter.label !== this.filters[0].label))
          this.filters[0].enabled = !someFilterIsTrue
        }

        this.filtersToEvaluate = JSON.parse(JSON.stringify(this.filters))
      }
    }
  },

  created () {
    if (!this.supply) {
      this.getSupply()
    }
  },
  activated () {
    this.$apollo.queries.stagedProposals.refetch()
    // this.$apollo.queries.dao.refetch()
  },
  mounted () {
    if (localStorage.getItem('showProposalBanner') === 'false') {
      this.isShowingProposalBanner = false
    }
  },
  methods: {
    ...mapActions('ballots', ['getSupply']),

    hideProposalBanner () {
      localStorage.setItem('showProposalBanner', false)
      this.isShowingProposalBanner = false
    },

    async onLoad (index, done) {
      if (this.$apollo.queries.dao.loading) {
        return
      }

      if (this.pagination.more) {
        this.pagination.offset = this.pagination.offset + this.pagination.first
        try {
          await this.$apollo.queries.dao.fetchMore({
            variables: {
              docId: this.selectedDao.docId,
              offset: this.pagination.offset,
              first: this.pagination.first
            },
            fetchPolicy: 'network-only',
            updateQuery: (prev, { fetchMoreResult }) => {
              if (fetchMoreResult.queryDao[0].proposal.length < this.pagination.first) this.pagination.more = false

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

          done(!this.pagination.more)
        } catch (e) {}
      } else {
        done(true)
      }
    },

    resetPaginationValues () {
      this.$refs.scroll.resume()
      this.pagination.offset = 0
      this.pagination.more = true
      this.$apollo.queries.archivedProposals.refetch()
    }
  }
}
</script>

<template lang="pug">
q-page.page-proposals
  base-banner(
    :compact="!$q.screen.gt.md"
    @onClose="hideProposalBanner"
    split
    v-bind="banner"
    v-if="isShowingProposalBanner"
  )
    template(v-slot:buttons)
      q-btn.q-px-lg.h-btn1(
        :to="{ name: 'proposal-create', params: { dhoname: daoSettings.url } }"
        color="secondary"
        label="Create proposal"
        no-caps
        rounded
        unelevated
        v-if="isMember"
      )

      a(:href='daoSettings.documentationURL' target="_blank")
        q-btn.q-px-lg.h-btn1(
          :class="{'bg-secondary': !isMember}"
          color="white"
          flat
          label="Learn more"
          no-caps
          rounded
        )

    template(v-slot:right)
      .row
        .col-6.q-pa-xxs
          button-radio.full-height(
            icon="fas fa-vote-yea"
            title="Unity"
            :subtitle="unityTitle"
            description="Is the minimum required percentage of members endorsing a proposal for it to pass."
            opacity
            primary
          )
        .col-6.q-pa-xxs
          button-radio.full-height(
            icon="fas fa-users"
            title="Quorum"
            :subtitle="quorumTitle"
            description="Is the minimum required percentage of total members participating in the vote for it to pass. "
            opacity
            primary
          )

  .row.q-py-md
    .col-12.col-lg-9
      base-placeholder.q-mr-sm(:compact="!$q.screen.gt.md" v-if="!filteredStagedProposals.length && !filteredProposals.length && !hasProposals" title= "No Proposals" subtitle="Your organization has not created any proposals yet. You can create a new proposal by clicking the button below."
        icon= "fas fa-file-medical" :actionButtons="[{label: 'Create a new Proposal', color: 'primary', onClick: () => $router.push(`/${this.daoSettings.url}/proposals/create`), disable: !isMember, disableTooltip: 'You must be a member'}]" )
      base-placeholder.q-mr-sm(:compact="!$q.screen.gt.md" v-if="!filteredProposals.length && !filteredStagedProposals.length && hasProposals" title= "Oops, nothing could be found here" subtitle="Try a different filter or another keyword"
        icon= "far fa-check-square" :actionButtons="[{label: 'Reset filter(s)', color: 'primary', onClick: () => this.$refs.filter.resetFilters() }]" )
      div(v-if="$apollo.loading" class="row justify-center q-my-md")
        loading-spinner(color="primary" size="72px")
      .row.q-mb-md(v-if="filteredStagedProposals.length")
        .h-h4 Staging proposals
        .h-h4-regular.q-ml-xs ({{ filteredStagedProposals.length }})
      .q-mb-xl(v-show="showStagedProposals && filteredStagedProposals.length > 0")
        proposal-list(:username="account" :proposals="filteredStagedProposals" :supply="supply" :view="'list'" :loading="state !== 'RUNNING'" count="1")
      .row.q-mb-md(v-if="filteredProposals.length")
        .h-h4 Active proposals
        .h-h4-regular.q-ml-xs ({{ filteredProposals.length }})
      q-infinite-scroll(@load="onLoad" :offset="500" ref="scroll" :initial-index="1" v-if="filteredProposals.length").scroll
        proposal-list(:username="account" :proposals="filteredProposals" :supply="supply" :view="'card'")
    .col-3
      filter-widget.sticky(ref="filter"
      :view.sync="view",
      :defaultOption="1",
      :sort.sync="sort",
      :textFilter.sync="textFilter",
      :circle.sync="circle",
      :showCircle="false",
      :optionArray.sync="optionArray",
      :circleArray.sync="circleArray"
      :viewSelectorLabel="'View'",
      :chipsFiltersLabel="'Proposal types'",
      :filters.sync="filters"
      :toggleLabel="'Show Staging Proposals'"
      :toggle.sync="showStagedProposals",
      :toggleDefault="true"
      :showToggle="true"
      )
  .row.full-width.q-my-md(v-if="!$q.screen.gt.md")
      filter-open-button(@open="mobileFilterOpen = true")
      filter-widget-mobile(:view.sync="view",
      v-show="mobileFilterOpen"
      @close="mobileFilterOpen = false"
      :defaultOption="1",
      :sort.sync="sort",
      :textFilter.sync="textFilter",
      :circle.sync="circle",
      :showCircle="false",
      :optionArray.sync="optionArray",
      :circleArray.sync="circleArray"
      :viewSelectorLabel="'View'",
      :chipsFiltersLabel="'Proposal types'",
      :filters.sync="filters"
      :toggleLabel="'Show Staging Proposals'"
      :toggle.sync="showStagedProposals",
      :toggleDefault="true"
      :showToggle="true",
      :style="mobileFilterStyles"
      )
</template>

<style lang="stylus" scoped>
</style>
