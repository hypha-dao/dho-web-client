<script>
import { mapActions, mapGetters } from 'vuex'
import { getProposalChipFilters } from '../../utils/proposal-filter'
import { PROPOSAL_STATE } from '~/const'

export default {
  name: 'proposal-history',
  components: {
    Chips: () => import('~/components/common/chips.vue'),
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
    archivedProposals: {
      skip: true,
      query: () => require('../../query/proposals/dao-proposals-history.gql'),
      update: data => data?.queryDao[0]?.votable,
      variables () {
        return {
          docId: this.selectedDao.docId,
          first: this.pagination.first,
          offset: 0,
          user: this.account
        }
      }
    }
  },

  data () {
    return {
      mobileFilterOpen: false,
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

      filters: getProposalChipFilters(),
      filtersToEvaluate: undefined
    }
  },

  computed: {
    ...mapGetters('accounts', ['account', 'isMember']),
    ...mapGetters('ballots', ['supply']),
    ...mapGetters('dao', ['daoSettings', 'selectedDao', 'votingPercentages']),

    filteredProposals () {
      if (!this.archivedProposals) return []

      const enabledFilters = this.filters.filter(filter => filter.enabled)
      return this.archivedProposals.filter((proposal) => {
        return enabledFilters.some((filter) => {
          return filter.filter(proposal) &&
            proposal.details_state_s !== PROPOSAL_STATE.DRAFTED &&
            proposal.details_state_s !== PROPOSAL_STATE.PROPOSED &&
            !proposal.details_autoApprove_i &&
            proposal.creator !== 'dao.hypha' &&
            (!this.textFilter || this.textFilter.length === 0 ||
            (proposal.details_title_s?.toLocaleLowerCase() || '').includes(this.textFilter.toLocaleLowerCase()))
        })
      })
    },

    hasProposals () { return this.archivedProposals?.length },
    isLoading () { return this.$apollo.queries.archivedProposals.loading }
  },
  watch: {
    selectedDao () {
      this.getSupply()
      this.$apollo.queries.archivedProposals.stop()
      if (this.archivedProposals) {
        this.resetPaginationValues()
      }
      this.$apollo.queries.archivedProposals.start()
    },

    sort () {
      this.$apollo.queries.archivedProposals.stop()
      if (this.archivedProposals) {
        this.resetPaginationValues()
      }
      this.$apollo.queries.archivedProposals.start()
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
  mounted () {
    window.scrollTo(0, 0)
  },

  created () {
    if (!this.supply) {
      this.getSupply()
    }
  },

  activated () {
    this.$apollo.queries.archivedProposals.refetch()
  },

  methods: {
    ...mapActions('ballots', ['getSupply']),
    async onLoad (index, done) {
      if (this.$apollo.queries.archivedProposals.loading) {
        return
      }
      if (this.pagination.more) {
        this.pagination.offset = this.pagination.offset + this.pagination.first
        try {
          await this.$apollo.queries.archivedProposals.fetchMore({
            variables: {
              docId: this.selectedDao.docId,
              offset: this.pagination.offset,
              first: this.pagination.first
            },
            fetchPolicy: 'network-only',
            updateQuery: (prev, { fetchMoreResult }) => {
              if (fetchMoreResult.queryDao[0].votable.length < this.pagination.first) this.pagination.more = false
              return {
                queryDao: [
                  {
                    ...fetchMoreResult.queryDao[0],
                    votable: [
                      ...prev.queryDao[0].votable,
                      ...fetchMoreResult.queryDao[0].votable
                    ]
                  }
                ]
              }
            }
          })
          done(!this.pagination.more)
        } catch (e) {
        }
      } else {
        done(true)
      }
    },

    resetPaginationValues () {
      this.$refs?.scroll?.resume()
      this.pagination.offset = 0
      this.pagination.more = true
      this.$apollo.queries.archivedProposals.refetch()
    }
  }
}
</script>

<template lang="pug">
q-page.page-proposals
  .row.q-py-md
    .col-12.col-lg-9
      base-placeholder.q-mr-sm(:compact="!$q.screen.gt.md" v-if="!isLoading && !hasProposals" :title="$t('pages.proposals.proposalhistory.noProposals')" subtitle="Your organization has not created any proposals yet. You can create a new proposal by clicking the button below." icon="fas fa-file-medical" :actionButtons="[{label: 'Create a new Proposal', color: 'primary', onClick: () => $router.push(`/${this.daoSettings.url}/proposals/create`), disable: !isMember, disableTooltip: 'You must be a member'}]")
      base-placeholder.q-mr-sm(:compact="!$q.screen.gt.md" v-if="!isLoading && !filteredProposals.length && hasProposals" :title="$t('pages.proposals.proposalhistory.oopsNothingCould')" subtitle="Try a different filter or another keyword" icon="far fa-check-square" :actionButtons="[{label: 'Reset filter(s)', color: 'primary', onClick: () => this.$refs.filter.resetFilters() }]")
      proposal-list.q-mb-xxxl(:username="account" :proposals="filteredProposals" :supply="supply" :view="$q.screen.gt.md ? view: 'card'" :compact="!$q.screen.gt.md")
      .row.justify-center.q-mb-xxxl(v-if="$apollo.loading")
        loading-spinner(color="primary" size="72px")
      q-infinite-scroll.scroll(@load="onLoad" :offset="1000" ref="scroll" v-if="filteredProposals.length" :disable="!pagination.more" debounce="30" scroll-target=".hide-scrollbar")
    .col-3(v-if="$q.screen.gt.md")
      filter-widget.sticky(ref="filter" :view.sync="view" :defaultOption="1" :sort.sync="sort" :textFilter.sync="textFilter" :circle.sync="circle" :showCircle="false" :optionArray.sync="optionArray" :circleArray.sync="circleArray" :viewSelectorLabel="'View'" :chipsFiltersLabel="'Proposal types'" :showViewSelector="false" :filters.sync="filters")
  .row.full-width.q-my-md(v-if="!$q.screen.gt.md")
    filter-open-button(@open="mobileFilterOpen = true")
    filter-widget-mobile(:view.sync="view" v-show="mobileFilterOpen" @close="mobileFilterOpen = false" :defaultOption="1" :sort.sync="sort" :textFilter.sync="textFilter" :circle.sync="circle" :showCircle="false" :optionArray.sync="optionArray" :circleArray.sync="circleArray" :viewSelectorLabel="'View'" :chipsFiltersLabel="'Proposal types'" :filters.sync="filters" :style="mobileFilterStyles")

</template>

<style lang="stylus" scoped>
</style>
