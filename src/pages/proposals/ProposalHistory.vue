<script>
import { mapGetters } from 'vuex'
import { getProposalChipFilters } from '../../utils/proposal-filter'
import { PROPOSAL_STATE } from '~/const'
import gql from 'graphql-tag'

const ARCHIVED_PROPOSALS_QUERY = `
queryDao(filter: { docId: { eq: $docId } }) {
  details_daoName_n
  docId
  votable(first: $first, offset: $offset, order: { desc: createdDate }) {
    docId
    type

    ... on Poll {
      ballot_expiration_t
      details_title_s
      details_description_s
      details_state_s
      creator
      createdDate
      details_ballotQuorum_i
      details_ballotSupply_a
      details_ballotAlignment_i
      vote {
        vote_voter_n
        vote_vote_s
      }
      votetally {
        ... on VoteTally {
          pass_votePower_a
          fail_votePower_a
          abstain_votePower_a
          creator
          createdDate
        }
      }

      cmntsect {
        docId
        comment {
          id: docId
          deletedStatus: comment_deleted_i
        }
      }
    }

    ... on Budget {
      details_title_s
      details_description_s
      details_state_s
      circle {
        docId
      }
      details_ballotQuorum_i
      details_ballotSupply_a
      details_ballotAlignment_i
      details_pegAmount_a
      details_voiceAmount_a
      details_rewardAmount_a
      creator
      createdDate
      vote {
        vote_voter_n
        vote_vote_s
      }
      votetally {
        ... on VoteTally {
          pass_votePower_a
          fail_votePower_a
          abstain_votePower_a
          creator
          createdDate
        }
      }

      cmntsect {
        docId
        comment {
          id: docId
          deletedStatus: comment_deleted_i
        }
      }
    }

    ... on Questcomplet {
      ballot_expiration_t

      creator
      createdDate

      details_title_s
      details_description_s
      details_state_s
      details_ballotQuorum_i
      details_ballotSupply_a
      details_ballotAlignment_i
      vote {
        vote_voter_n
        vote_vote_s
      }
      votetally {
        ... on VoteTally {
          pass_votePower_a
          fail_votePower_a
          abstain_votePower_a
          creator
          createdDate
        }
      }

      cmntsect {
        docId
        comment {
          id: docId
          deletedStatus: comment_deleted_i
        }
      }
    }

    ... on Queststart {
      ballot_expiration_t

      creator
      createdDate

      details_title_s
      details_description_s
      details_state_s
      details_ballotQuorum_i
      details_ballotSupply_a
      details_ballotAlignment_i
      vote {
        vote_voter_n
        vote_vote_s
      }
      votetally {
        ... on VoteTally {
          pass_votePower_a
          fail_votePower_a
          abstain_votePower_a
          creator
          createdDate
        }
      }

      cmntsect {
        docId
        comment {
          id: docId
          deletedStatus: comment_deleted_i
        }
      }
    }

    ... on Policy {
      ballot_expiration_t

      creator
      createdDate

      details_title_s
      details_description_s
      details_state_s
      details_ballotQuorum_i
      details_ballotSupply_a
      details_ballotAlignment_i
      vote {
        vote_voter_n
        vote_vote_s
      }
      votetally {
        ... on VoteTally {
          pass_votePower_a
          fail_votePower_a
          abstain_votePower_a
          creator
          createdDate
        }
      }

      cmntsect {
        docId
        comment {
          id: docId
          deletedStatus: comment_deleted_i
        }
      }
    }

    ... on Circle {
      details_dao_i
      details_state_s
      
      details_autoApprove_i

      details_title_s
      details_description_s

      ballot_expiration_t
      creator
      createdDate
      details_ballotQuorum_i
      details_ballotSupply_a
      details_ballotAlignment_i
      vote {
        vote_voter_n
        vote_vote_s
      }
      votetally {
        ... on VoteTally {
          pass_votePower_a
          fail_votePower_a
          abstain_votePower_a
          creator
          createdDate
        }
      }

      cmntsect {
        docId
        comment {
          id: docId
          deletedStatus: comment_deleted_i
        }
      }
    }

    ... on Payout {
      details_dao_i
      details_state_s

      details_title_s
      details_description_s
      details_url_s

      details_usdAmount_a
      details_deferredPercX100_i

      details_pegAmount_a
      details_rewardAmount_a
      details_voiceAmount_a
      details_ballotQuorum_i
      details_ballotSupply_a
      details_ballotAlignment_i
      vote {
        vote_voter_n
        vote_vote_s
      }
      votetally {
        ... on VoteTally {
          pass_votePower_a
          fail_votePower_a
          abstain_votePower_a
          creator
          createdDate
        }
      }

      ballot_expiration_t
      creator
      createdDate
      details_owner_n
      cmntsect {
        docId
        comment {
          id: docId
          deletedStatus: comment_deleted_i
        }
      }
    }

    ... on Assignment {
      creator
      createdDate

      ballot_expiration_t

      details_title_s
      details_description_s

      details_assignee_n
      details_periodCount_i
      details_ballotQuorum_i
      details_ballotSupply_a
      details_ballotAlignment_i
      vote {
        vote_voter_n
        vote_vote_s
      }
      votetally {
        ... on VoteTally {
          pass_votePower_a
          fail_votePower_a
          abstain_votePower_a
          creator
          createdDate
        }
      }

      salaryband {
        details_annualUsdSalary_a
        details_name_s
      }

      start {
        details_startTime_t
      }
      claimed {
        docId
      }

      details_pegSalaryPerPeriod_a
      details_rewardSalaryPerPeriod_a
      details_voiceSalaryPerPeriod_a

      details_timeShareX100_i
      details_deferredPercX100_i

      details_state_s
      role {
        ... on Role {
          type
          docId
          details_state_s
          details_title_s
          details_description_s
          details_annualUsdSalary_a
          details_minDeferredX100_i
          details_minTimeShareX100_i
        }
      }
      details_assignee_n
      cmntsect {
        docId
        comment {
          id: docId
          deletedStatus: comment_deleted_i
        }
      }
    }

    ... on Assignbadge {
      details_description_s
      details_title_s
      ballot_expiration_t
      details_state_s
      details_periodCount_i
      details_ballotQuorum_i
      details_ballotSupply_a
      details_ballotAlignment_i
      details_autoApprove_i
      vote {
        vote_voter_n
        vote_vote_s
      }
      votetally {
        ... on VoteTally {
          pass_votePower_a
          fail_votePower_a
          abstain_votePower_a
          creator
          createdDate
        }
      }
      badge {
        details_icon_s
        details_pegCoefficientX10000_i
        details_voiceCoefficientX10000_i
        details_rewardCoefficientX10000_i
      }
      details_startPeriod_i
      details_assignee_n
      createdDate
      creator
      cmntsect {
        docId
        comment {
          id: docId
          deletedStatus: comment_deleted_i
        }
      }
    }

    ... on Role {
      details_autoApprove_i
      ballot_expiration_t
      details_title_s
      details_description_s
      details_annualUsdSalary_a
      details_minDeferredX100_i
      details_state_s
      details_ballotQuorum_i
      details_ballotSupply_a
      details_ballotAlignment_i
      details_minTimeShareX100_i
      vote {
        vote_voter_n
        vote_vote_s
      }
      votetally {
        ... on VoteTally {
          pass_votePower_a
          fail_votePower_a
          abstain_votePower_a
          creator
          createdDate
        }
      }
      details_owner_n
      createdDate
      creator
      cmntsect {
        docId
        comment {
          id: docId
          deletedStatus: comment_deleted_i
        }
      }
    }

    ... on Badge {
      creator
      createdDate

      ballot_expiration_t
      details_title_s
      details_description_s
      details_pegCoefficientX10000_i
      details_voiceCoefficientX10000_i
      details_rewardCoefficientX10000_i
      details_icon_s
      details_state_s
      details_maxCycles_i
      details_ballotQuorum_i
      details_ballotSupply_a
      details_ballotAlignment_i
      vote {
        vote_voter_n
        vote_vote_s
      }
      votetally {
        ... on VoteTally {
          pass_votePower_a
          fail_votePower_a
          abstain_votePower_a
          creator
          createdDate
        }
      }
      system_proposer_n
      cmntsect {
        docId
        comment {
          id: docId
          deletedStatus: comment_deleted_i
        }
      }
    }

    ... on Edit {
      details_dao_i
      details_state_s

      creator
      details_ballotTitle_s
      details_ballotDescription_s
      ballot_expiration_t
      details_assignee_n
      details_periodCount_i
      details_ballotQuorum_i
      details_ballotSupply_a
      details_ballotAlignment_i
      details_timeShareX100_i
      details_deferredPercX100_i
      details_state_s
      createdDate
      vote {
        vote_voter_n
        vote_vote_s
      }
      votetally {
        ... on VoteTally {
          pass_votePower_a
          fail_votePower_a
          abstain_votePower_a
          creator
          createdDate
        }
      }
      original {
        __typename
        ... on Assignbadge {
          details_title_s
          details_description_s
          start {
            details_startTime_t
          }
          badge {
            details_title_s
          }
        }
        ... on Assignment {
          details_title_s
          details_description_s
          claimed {
            docId
          }
          start {
            details_startTime_t
          }
          details_pegSalaryPerPeriod_a
          details_rewardSalaryPerPeriod_a
          details_voiceSalaryPerPeriod_a
          role {
            ... on Role {
              details_title_s
              details_annualUsdSalary_a
              details_minDeferredX100_i
            }
          }
        }
      }

      cmntsect {
        docId
        comment {
          id: docId
          deletedStatus: comment_deleted_i
        }
      }
    }
  }
}
`

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
      skip: false,
      query: gql`query historyProposals($docId: String!, $first: Int!, $offset: Int!) {${ARCHIVED_PROPOSALS_QUERY}}`,
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

  activated () {
    this.$apollo.queries.archivedProposals.refetch()
  },

  methods: {
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
      base-placeholder.q-mr-sm(:compact="!$q.screen.gt.md" v-if="!isLoading && !hasProposals" :title="$t('pages.proposals.proposalhistory.noProposals')" subtitle="Your organization has not created any proposals yet. You can create a new proposal by clicking the button below." icon="fas fa-file-medical" :actionButtons="[{label: 'Create a new Proposal', color: 'primary', onClick: () => $router.push(`/${this.daoSettings.url}/agreements/create`), disable: !isMember, disableTooltip: 'You must be a member'}]")
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
