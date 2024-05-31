<script>
import { mapGetters } from 'vuex'
import ipfsy from '~/utils/ipfsy'
import { getProposalChipFilters } from '../../utils/proposal-filter'
import gql from 'graphql-tag'
import { date } from 'quasar'
import { formatDuration } from '~/utils/TimeUtils'

const STAGED_PROPOSALS_QUERY = `
  queryDao(filter: { docId: { eq: $docId } }) {
    details_daoName_n
    docId
    stagingprop(first: $first, offset: $offset, order: {desc: createdDate}, filter: {createdDate: {gt: $startDate}}) {
      docId
      type

      ... on Poll {
        details_title_s
        details_description_s
        details_state_s
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

      ... on Budget {
        details_title_s
        details_description_s
        details_state_s
        circle {
          docId
        }
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

      ... on Queststart {
        details_title_s
        details_description_s
        details_state_s
        # parentcircle {
        #   docId
        #   details_title_s
        #   details_description_s
        #   details_name_s
        #   details_purpose_s
        # }

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

      ... on Policy {
        details_title_s
        details_description_s
        details_name_s
        details_purpose_s
        details_state_s
        # parentcircle {
        #   docId
        #   details_title_s
        #   details_description_s
        #   details_name_s
        #   details_purpose_s
        # }

        masterpolicy {
          details_title_s
        }

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

      ... on Circle {
        details_title_s
        details_description_s
        details_name_s
        details_purpose_s
        details_state_s

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

        start {
          details_startTime_t
        }
        claimed {
          docId
        }

        salaryband {
          details_annualUsdSalary_a
          details_name_s
          assignment {
            role {
              system_nodeLabel_s
            }
          }
        }

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
        badge {
          details_icon_s
          details_pegCoefficientX10000_i
          details_voiceCoefficientX10000_i
          details_rewardCoefficientX10000_i
        }
        details_startPeriod_i
        details_assignee_n
        details_autoApprove_i
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

      ... on Role {
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
        details_owner_n
        createdDate
        creator
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
      skip() { return !this.selectedDao?.docId },
      variables() {
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
      fetchPolicy: 'no-cache',
      pollInterval: 1000 // TODO: Swap with subscribe once dgraph is ready
      // subscribeToMore: {
      //   document: require('~/query/proposals/dao-proposals-active-vote-subs.gql'),
      //   variables() {
      //     return {
      //       docId: this.selectedDao.docId,
      //       // first: this.pagination.first,
      //       // offset: 0,
      //       user: this.account
      //     }
      //   },
      //   skip() { return !this.selectedDao?.docId },
      //   updateQuery: (previousResult, { subscriptionData }) => {
      //     if (!subscriptionData?.data) {
      //       return previousResult
      //     }
      //     if (!previousResult?.data) {
      //       return undefined
      //     }
      //     subscriptionData.data.queryDao[0].proposal = [
      //       ...previousResult.data.queryDao[0].proposal,
      //       ...subscriptionData.data.queryDao[0].proposal
      //     ]
      //     return subscriptionData
      //   }
      // }
    },
    stagedProposals: {
      query: gql`query stageProposals($docId: String!, $first: Int!, $offset: Int!, $startDate: DateTime!) { ${STAGED_PROPOSALS_QUERY} }`,
      update: data => data?.queryDao[0]?.stagingprop,
      skip() { return !this.selectedDao?.docId },
      variables() {
        return {
          docId: this.selectedDao.docId,
          first: this.pagination.first,
          offset: 0,
          user: this.account,
          startDate: date.formatDate(date.subtractFromDate(new Date(), { days: 31 }), 'YYYY-MM-DDTHH:mm:ss.SZ')
        }
      },
      errorPolicy: 'all',
      fetchPolicy: 'no-cache',
      pollInterval: 1000 // TODO: Swap with subscribe once dgraph is ready
      // subscribeToMore: {
      //   document: gql`subscription stageProposals($docId: String!, $first: Int, $offset: Int) { ${STAGED_PROPOSALS_QUERY} }`,
      //   skip() { return !this.selectedDao?.docId },
      //   variables() {
      //     return {
      //       docId: this.selectedDao.docId,
      //       user: this.account
      //     }
      //   },
      //   updateQuery: (previousResult, { subscriptionData }) => {
      //     if (!subscriptionData?.data) {
      //       return previousResult
      //     }
      //     if (!previousResult?.data) {
      //       return undefined
      //     }
      //     subscriptionData.data.queryDao[0].stagingprop = [
      //       ...previousResult.data.queryDao[0].stagingprop,
      //       ...subscriptionData.data.queryDao[0].stagingprop
      //     ]
      //     return subscriptionData
      //   }
      // }
    },

    proposalsCount: {
      query: () => require('../../query/proposals/dao-proposals-count.gql'),
      update: data => {
        return {
          active: data.queryDao[0].proposalAggregate.count,
          staging: data.queryDao[0].stagingpropAggregate.count,
          archived: (data.queryDao[0].passedpropsAggregate.count + data.queryDao[0].failedpropsAggregate.count)
        }
      },
      variables() { return { docId: this.selectedDao.docId, systemAccount: 'dao.hypha' } },
      skip() { return !this.selectedDao?.docId },
      fetchPolicy: 'no-cache'
    }
  },

  data() {
    return {
      mobileFilterOpen: false,
      isShowingProposalBanner: true,
      view: '',
      textFilter: null,
      sort: 'Sort by last added',
      circle: 'All circles',
      optionArray: [{ label: this.$t('pages.proposals.proposallist.sortByLastAdded') }],
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
      filtersToEvaluate: undefined,

      showStagedProposals: true,

      state: 'LOADING'
    }
  },

  computed: {
    ...mapGetters('accounts', ['account', 'isMember']),
    ...mapGetters('ballots', ['supply']),
    ...mapGetters('dao', ['daoSettings', 'selectedDao', 'votingPercentages']),

    banner() {
      return {
        title: this.daoSettings.proposalsTitle || this.$t('pages.proposals.proposallist.yourVoteIsTheVoice'),
        description: this.daoSettings.proposalsParagraph || this.$t('pages.proposals.proposallist.atHyphaTheFuture', { unity: this.daoSettings.settings_votingAlignmentX100_i, quorum: this.daoSettings.settings_votingQuorumX100_i, time: formatDuration(1800) }),
        background: ipfsy(this.daoSettings.proposalsBackgroundImage),
        color: this.daoSettings.primaryColor,
        pattern: this.daoSettings.pattern,
        patternColor: this.daoSettings.patternColor,
        patternAlpha: this.daoSettings.patternOpacity
      }
    },

    proposals() {
      const daos = this.dao
      if (!(daos && daos?.length && Array.isArray(daos[0].proposal))) return []

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
      return daos[0].proposal.filter(proposal => new Date(proposal.ballot_expiration_t) > new Date(Date.now()))
    },

    filteredProposals() {
      const proposalOrder = this.proposals

      if (proposalOrder?.length === 0) return proposalOrder

      const proposals = []
      proposalOrder.forEach((proposal) => {
        let found = false
        this.filters.forEach((filter) => {
          if (!found && filter.enabled && filter.filter(proposal)) {
            if (!this.textFilter || this.textFilter?.length === 0 ||
              proposal?.details_title_s?.toLocaleLowerCase().includes(this.textFilter.toLocaleLowerCase())) {
              proposals.push(proposal)
            }
            found = true
          }
        })
      })

      return proposals
    },
    filteredStagedProposals() {
      if (!this.stagedProposals) return []

      const proposals = [
        ...(this.state === 'RUNNING' ? [{ loading: true }] : [])
      ]
      this.stagedProposals.forEach((proposal) => {
        let found = false
        this.filters.forEach((filter) => {
          if (!found && filter.enabled && filter.filter(proposal)) {
            if (!this.textFilter || this.textFilter?.length === 0 ||
              proposal?.details_title_s?.toLocaleLowerCase().includes(this.textFilter.toLocaleLowerCase())) {
              proposals.push(proposal)
            }
            found = true
          }
        })
      })

      return proposals
    },
    countForFetching() {
      return Math.ceil(this.proposalsCount?.active / this.pagination.first) || 0
    },
    quorumTitle() {
      const { quorum } = this.votingPercentages
      return `${quorum}% min`
    },
    unityTitle() {
      const { unity } = this.votingPercentages
      return `${unity}% min`
    },
    hasProposals() {
      return this.proposals?.length || this.stagedProposals?.length
    },
    proposalTitleWithCount() {
      const count = this.proposalsCount
      return `Proposal History (${count})`
    }
  },
  watch: {
    selectedDao() {
      this.$apollo.queries.dao.stop()
      if (this.dao) {
        this.resetPaginationValues()
      }
      this.$apollo.queries.dao.start()
    },
    sort() {
      if (this.dao) {
        this.resetPaginationValues()
      }
    },
    filters: {
      deep: true,
      handler() {
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

  activated() {
    this.$apollo.queries.stagedProposals?.refetch()
  },
  mounted() {
    if (localStorage.getItem('showProposalBanner') === 'false') {
      this.isShowingProposalBanner = false
    }
  },
  methods: {

    hideProposalBanner() {
      localStorage.setItem('showProposalBanner', false)
      this.isShowingProposalBanner = false
    },

    async onLoad(index, done) {
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
              if (fetchMoreResult.queryDao?.[0]?.proposal?.length < this.pagination.first) this.pagination.more = false

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
        } catch (e) { }
      } else {
        done(true)
      }
    },

    resetPaginationValues() {
      this.$refs.scroll.resume()
      this.pagination.offset = 0
      this.pagination.more = true
      this.$apollo.queries.archivedProposals?.refetch()
    },
    handleCreateNewProposal() {
      this.$router.push(`/${this.daoSettings.url}/agreements/create`)
    }
  }
}
</script>

<template lang="pug">
q-page.page-proposals
  base-banner(:compact="!$q.screen.gt.md" @onClose="hideProposalBanner" split="split" v-bind="banner" v-if="isShowingProposalBanner")
    template(v-slot:buttons)
      q-btn.q-px-lg.h-btn1(:to="{ name: 'proposal-create', params: { dhoname: daoSettings.url } }" color="secondary" :label="$t('pages.proposals.proposallist.createProposal')" no-caps rounded unelevated v-if="isMember")
      a(:href="daoSettings.settings_documentationUrl_s || 'https://help.hypha.earth/hc/2431449449'" target="_blank")
        q-btn.q-px-lg.h-btn1(:class="{'bg-secondary': !isMember}" color="white" flat :label="$t('pages.proposals.proposallist.learnMore')" no-caps rounded)
    template(v-slot:right)
      .row
        .col-6.q-pa-xxs
          button-radio.full-height(icon="fas fa-vote-yea" :title="$t('pages.proposals.proposallist.unity')" :subtitle="unityTitle" :description="$t('pages.proposals.proposallist.isTheMinimumRequiredPercentageOfMembers')" opacity="opacity" primary="primary")
        .col-6.q-pa-xxs
          button-radio.full-height(icon="fas fa-users" :title="$t('pages.proposals.proposallist.quorum')" :subtitle="quorumTitle" :description="$t('pages.proposals.proposallist.isTheMinimumRequiredPercentageOfTotal')" opacity="opacity" primary="primary")
  .row.q-py-md(v-if="$q.screen.gt.md")
    .col-12.col-lg-9
      base-placeholder.q-mr-sm(:compact="!$q.screen.gt.md" v-if="!filteredStagedProposals?.length && !filteredProposals?.length && !hasProposals" :title="$t('pages.proposals.proposallist.noProposals')" subtitle="Your organization has not created any proposals yet. You can create a new proposal by clicking the button below." icon="fas fa-file-medical" :actionButtons="[{label: 'Create a new Proposal', color: 'primary', onClick: () => $router.push(`/${this.daoSettings.url}/agreements/create`), disable: !isMember, disableTooltip: 'You must be a member'}]")
      base-placeholder.q-mr-sm(:compact="!$q.screen.gt.md" v-if="!filteredProposals?.length && !filteredStagedProposals?.length && hasProposals" :title="$t('pages.proposals.proposallist.oopsNothingCould')" subtitle="Try a different filter or another keyword" icon="far fa-check-square" :actionButtons="[{label: 'Reset filter(s)', color: 'primary', onClick: () => this.$refs.filter.resetFilters() }]")
      .row.justify-center.q-my-md(v-if="$apollo.loading")
        loading-spinner(color="primary" size="72px")
      .row.q-mb-md(v-if="filteredStagedProposals?.length")
        .h-h4 {{ $t('pages.proposals.proposallist.drafts') }}
        .h-h4-regular.q-ml-xs (
          | {{ filteredStagedProposals?.length }}
          | )
      .q-mb-xl(v-show="showStagedProposals && filteredStagedProposals?.length > 0")
        proposal-list(:username="account" :proposals="filteredStagedProposals" :supply="supply" :view="'list'" :loading="state !== 'RUNNING'" count="1")
      .row.q-mb-md(v-if="filteredProposals?.length")
        .h-h4 {{ $t('pages.proposals.proposallist.activeProposals') }}
        .h-h4-regular.q-ml-xs (
          | {{ filteredProposals?.length }}
          | )
      q-infinite-scroll.scroll(@load="onLoad" :offset="500" ref="scroll" :initial-index="1" v-if="proposalsCount?.active")
        proposal-list(:username="account" :proposals="filteredProposals" :supply="supply" :view="'card'")
    .col-3(v-if="$q.screen.gt.md")
      filter-widget.sticky(ref="filter" :view.sync="view" :sort.sync="sort" :textFilter.sync="textFilter" :circle.sync="circle" :showCircle="false" :optionArray.sync="optionArray" :circleArray.sync="circleArray" :filters.sync="filters" :toggle.sync="showStagedProposals" :toggleDefault="true" :showToggle="true" :showViewSelector="false" viewSelectorLabel="View" :chipsFiltersLabel="$t('pages.proposals.proposallist.proposalTypes')" :filterTitle="$t('pages.proposals.proposallist.searchProposals')" :toggleLabel="$t('pages.proposals.proposallist.drafts')")
  .row.full-width.q-my-md(v-else)
    filter-open-button(@open="mobileFilterOpen = true")
    filter-widget-mobile(:view.sync="view" v-show="mobileFilterOpen" @close="mobileFilterOpen = false" :sort.sync="sort" :textFilter.sync="textFilter" :circle.sync="circle" :showCircle="false" :optionArray.sync="optionArray" :circleArray.sync="circleArray" :filters.sync="filters" :toggle.sync="showStagedProposals" :toggleDefault="true" :showToggle="true" :style="mobileFilterStyles" :showViewSelector="false" viewSelectorLabel="View" :chipsFiltersLabel="$t('pages.proposals.proposallist.proposalTypes')" :filterTitle="$t('pages.proposals.proposallist.searchProposals')" :toggleLabel="$t('pages.proposals.proposallist.drafts')")
    .col
      base-placeholder.q-mr-sm(v-if="!filteredProposals?.length && !filteredStagedProposals?.length && !$apollo.loading" :title="$t('pages.proposals.proposallist.noProposals1')" subtitle="Your organization has not created any proposals yet. You can create a new proposal by clicking the button below." icon="fas fa-file-medical" :actionButtons="[{label: 'Create a new Proposal', color: 'primary', onClick: () => this.handleCreateNewProposal, disable: !isMember, disableTooltip: 'You must be a member'}]")
      .row.justify-center.q-my-md(v-if="!filteredProposals?.length && !filteredStagedProposals?.length")
        loading-spinner(color="primary" size="72px")
      .row.q-mb-md(v-if="filteredStagedProposals?.length")
        .h-h4 {{ $t('pages.proposals.proposallist.drafts1') }}
        .h-h4-regular.q-ml-xs (
          | {{ filteredStagedProposals.length }}
          | )
      .q-mb-xl(v-show="showStagedProposals && filteredStagedProposals?.length > 0")
        proposal-list(:username="account" :proposals="filteredStagedProposals" :supply="supply" view="card" compact)
      .row.q-mb-md(v-if="filteredProposals?.length")
        .h-h4 {{ $t('pages.proposals.proposallist.activeProposals1') }}
        .h-h4-regular.q-ml-xs (
          | {{ filteredProposals?.length }}
          | )
      q-infinite-scroll.scroll(@load="onLoad" :offset="0" ref="scroll" :initial-index="1" v-if="proposalsCount?.active")
        proposal-list(:username="account" :proposals="filteredProposals" :supply="supply" view="card" compact)
  .row.q-my-md
    .col-12.col-lg-9
      widget.full-width
        .q-pa-sm
          .row
            .h-h1 {{ $t('pages.proposals.proposallist.proposalHistory') }}
            .h-h1.q-ml-xs.proposal-amount (
              | {{ proposalsCount?.archived }}
              | )
          .row.flex.justify-between.items-end
            .h-b2.q-mt-lg {{ $t('pages.proposals.proposallist.lookingToMonitor') }}
            q-btn.q-px-lg.h-btn1(:to="{ name: 'proposal-history' }" color="primary" :label="$t('pages.proposals.proposallist.seeHistory')" no-caps rounded unelevated :class="{ 'full-width q-mt-md': !$q.screen.gt.md }")

</template>

<style lang="stylus" scoped>
.proposal-amount
  font-weight: 500;
</style>
