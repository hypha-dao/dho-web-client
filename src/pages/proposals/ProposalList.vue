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
    ButtonRadio: () => import('~/components/common/button-radio.vue')
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
      fetchPolicy: 'no-cache'
    },
    stagedProposals: {
      query: () => require('../../query/proposals/dao-proposals-stage.gql'),
      update: data => data?.queryDao[0]?.stagingprop,
      // skip: true,
      variables () {
        return {
          docId: this.selectedDao.docId,
          first: this.pagination.first,
          offset: 0,
          user: this.account
        }
      },
      fetchPolicy: 'no-cache'
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
        more: true,
        restart: false,
        fetch: 0
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
    }
  },
  watch: {
    '$route.query.refetch': {
      handler: function (_refetch) {
        const refetch = true
        const proposal = this.$route.params.data

        if (refetch && proposal) {
          this.state = 'RUNNING'
          const isDeleting = this.$route.params.isDeleting
          const isPublishing = this.$route.params.isPublishing

          const pullStagedProposals = setInterval(() => {
            if (isDeleting) {
              const deletedProposal = this.stagedProposals.find(_ =>
                _.docId === proposal.docId
              )

              if (!deletedProposal) {
                this.state = 'DELETED'
                this.$router.replace({ params: { data: null }, query: {} })
                clearInterval(pullStagedProposals)
              }
            } else if (isPublishing) {
              const isPublished = this.proposals.find(_ =>
                _.docId === proposal.docId
              )

              this.$apollo.queries.dao.refetch()
              if (isPublished) {
                this.state = 'PUBLISHED'
                this.$router.replace({ params: { data: null }, query: {} })
                clearInterval(pullStagedProposals)
              }
            } else {
              const isCreated = this.stagedProposals.find(_ =>
                _.details_title_s === proposal.title &&
                _.details_description_s === proposal.description
              )
              if (isCreated) {
                this.state = 'CREATED'
                this.$router.replace({ params: { data: null }, query: {} })
                clearInterval(pullStagedProposals)
              }
            }
            this.$apollo.queries.stagedProposals.refetch()
          }, 300)
        }
      },
      deep: true,
      immediate: true
    },

    selectedDao () {
      this.getSupply()
      this.$apollo.queries.dao.stop()
      if (this.dao) {
        this.resetPaginationValues()
        this.resetPagination()
      }
      this.$apollo.queries.dao.start()
    },
    sort () {
      this.$apollo.queries.dao.stop()
      if (this.dao) {
        this.resetPaginationValues()
        this.resetPagination()
      }
      this.$apollo.queries.dao.start()
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
    this.$apollo.queries.dao.stop()
    if (this.dao) {
      this.resetPaginationValues()
      this.resetPagination()
    }
    this.$apollo.queries.dao.start()
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
      if (this.pagination.more && this.pagination.fetch < this.countForFetching) {
        this.pagination.offset = this.pagination.restart ? this.pagination.offset : this.pagination.offset + this.pagination.first
        this.pagination.fetch++
        try {
          await this.$apollo.queries.dao.fetchMore({
            variables: {
              docId: this.selectedDao.docId,
              offset: this.pagination.offset,
              first: this.pagination.first
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              if ((this.proposalsCount === fetchMoreResult.queryDao[0].proposal.length) ||
                (this.proposalsCount < prev.queryDao[0].proposal.length)
              ) this.pagination.more = false
              if (this.pagination.restart || (prev.queryDao[0].proposal.length > this.proposalsCount)) {
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
        } catch (e) {}
        done()
      }
      if (this.pagination.fetch === this.countForFetching) {
        done(true)
      }
    },
    resetPaginationValues () {
      this.pagination.restart = true
      this.pagination.offset = 0
      this.pagination.more = true
      this.pagination.fetch = 0
    },
    async resetPagination () {
      if (this.$refs.scroll) {
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
      a(href='https://notepad.hypha.earth/5dC66nNXRVGpb1aTHaRJXw' target="_blank")
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

  .row.q-py-md(v-if="$q.screen.gt.md")
    .col-9
      base-placeholder.q-mr-sm(v-if="!filteredProposals.length && !filteredStagedProposals.length && !$apollo.loading" title= "No Proposals" subtitle="Your organization has not created any proposals yet. You can create a new proposal by clicking the button below."
        icon= "fas fa-file-medical" :actionButtons="[{label: 'Create a new Proposal', color: 'primary', onClick: () => $router.push(`/${this.daoSettings.url}/proposals/create`), disable: !isMember, disableTooltip: 'You must be a member'}]" )
      .q-mb-xl(v-show="showStagedProposals && filteredStagedProposals.length > 0")
        proposal-list(:updateProposals="this.$apollo.queries.stagedProposals.refetch()" :username="account" :proposals="filteredStagedProposals" :supply="supply" :view="view" :loading="state !== 'RUNNING'" count="1")
      q-infinite-scroll(@load="onLoad" :offset="500" ref="scroll" :initial-index="1" v-if="filteredProposals.length").scroll
        proposal-list(:updateProposals="this.$apollo.queries.stagedProposals.refetch()" :username="account" :proposals="filteredProposals" :supply="supply" :view="view")
    .col-3
      filter-widget.sticky(:view.sync="view",
      :defaultOption="1",
      :sort.sync="sort",
      :textFilter.sync="textFilter",
      :circle.sync="circle",
      :showCircle="false",
      :optionArray.sync="optionArray",
      :circleArray.sync="circleArray"
      :viewSelectorLabel="'Proposals view'",
      :chipsFiltersLabel="'Proposal types'",
      :filters.sync="filters"
      :toggleLabel="'Show Staging Proposals'"
      :toggle.sync="showStagedProposals",
      :toggleDefault="true"
      :showToggle="true",
      )
  .row.full-width(v-else).q-my-md
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
      :viewSelectorLabel="'Proposals view'",
      :chipsFiltersLabel="'Proposal types'",
      :filters.sync="filters"
      :toggleLabel="'Show Staging Proposals'"
      :toggle.sync="showStagedProposals",
      :toggleDefault="true"
      :showToggle="true",
      :style="mobileFilterStyles"
      )
      base-placeholder.q-mr-sm(v-if="!filteredProposals.length && !filteredStagedProposals.length && !$apollo.loading" title= "No Proposals" subtitle="Your organization has not created any proposals yet. You can create a new proposal by clicking the button below."
        icon= "fas fa-file-medical" :actionButtons="[{label: 'Create a new Proposal', color: 'primary', onClick: () => $router.push(`/${this.daoSettings.url}/proposals/create`), disable: !isMember, disableTooltip: 'You must be a member'}]" )
      .q-mb-xl(v-show="showStagedProposals && filteredStagedProposals.length > 0")
        proposal-list(:username="account" :proposals="filteredStagedProposals" :supply="supply" view="card" compact)
      q-infinite-scroll(@load="onLoad" :offset="0" ref="scroll" :initial-index="1" v-if="filteredProposals.length").scroll
        proposal-list(:username="account" :proposals="filteredProposals" :supply="supply" view="card" compact)
</template>

<style lang="stylus" scoped>
</style>
