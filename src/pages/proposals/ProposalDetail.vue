<script>
import { mapActions, mapGetters } from 'vuex'
import gql from 'graphql-tag'

import CONFIG from './create/config.js'
import { PROPOSAL_STATE, PROPOSAL_TYPE, DEFAULT_TIER } from '~/const'
// import { calcVoicePercentage } from '~/utils/eosio'

import { format } from '~/mixins/format'
import lodash from 'lodash'

// eslint-disable-next-line no-unused-vars
import * as proposalParsing from '~/utils/proposal-parsing'

const TIERS_QUERY = `
  querySalaryband(
    filter: {
      details_dao_i: { in: [0, $daoId] },
    }
  ) {
    id: docId
    name: details_name_s
    annualAmount: details_annualUsdSalary_a
    minDeferred: details_minDeferredX100_i
  }
`

const ROLES_QUERY = `
  queryRole(
    filter: { 
      details_dao_i: { in: [0, $daoId] },
      details_autoApprove_i: { eq: 1 } 
    }
  ) {
    id: docId
    name: details_title_s
  }
`

const PROPOSAL_QUERY = `
  getDocument(docId: $docId) {
    __typename
    docId
    creator
    createdDate

    ... on Poll {
      ballot_expiration_t
      docId
      details_title_s
      details_description_s
      details_votingMethod_s

      details_state_s
      details_ballotQuorum_i
      details_ballotSupply_a
      details_ballotAlignment_i

      votetally {
        docId
        ... on VoteTally {
          docId
          pass_votePower_a
          fail_votePower_a
          abstain_votePower_a
        }
      }

      cmntsect {
        docId

        comment {
          id: docId
          author: comment_author_n
          content: comment_content_s
          createdDate
          deletedStatus: comment_deleted_i

          reactions: reaction {
            reactionlnkrAggregate {
              count
            }

            reactionlnkr {
              author: details_member_n
            }
          }

          commentAggregate {
            count
          }
        }
      }
    }

    ... on Budget {
      ballot_expiration_t
      details_title_s
      details_description_s
      details_state_s
      details_ballotQuorum_i
      details_ballotSupply_a
      details_ballotAlignment_i

      votetally {
        docId
        ... on VoteTally {
          docId
          pass_votePower_a
          fail_votePower_a
          abstain_votePower_a
        }
      }

      circle {
        ... on Circle {
          id: docId
          name: details_title_s
          purpose: details_description_s
          budget: details_purpose_s

          applicant {
            username: details_member_n
          }

          members: member {
            username: details_member_n
          }

          subcircles: subcircle {
            id: docId
            name: details_title_s
            purpose: details_description_s
            budget: details_purpose_s
          }
        }
      }
      details_pegAmount_a
      details_voiceAmount_a
      details_rewardAmount_a
      creator
      createdDate

      cmntsect {
        docId

        comment {
          id: docId
          author: comment_author_n
          content: comment_content_s
          createdDate
          deletedStatus: comment_deleted_i

          reactions: reaction {
            reactionlnkrAggregate {
              count
            }

            reactionlnkr {
              author: details_member_n
            }
          }

          commentAggregate {
            count
          }
        }
      }
    }

    ... on Queststart {
      ballot_expiration_t

      details_title_s
      details_description_s

      # details_deferredPercX100_i

      details_annualUsdSalary_a
      details_usdAmount_a

      details_pegAmount_a
      details_rewardAmount_a
      details_voiceAmount_a

      details_state_s
      details_ballotQuorum_i
      details_ballotSupply_a
      details_ballotAlignment_i
      details_url_s

      votetally {
        docId
        ... on VoteTally {
          docId
          pass_votePower_a
          fail_votePower_a
          abstain_votePower_a
        }
      }

      start {
        docId
        details_startTime_t
      }

      details_periodCount_i

      lockedby {
        docId
      }

      completedby {
        docId
      }

      dao {
        details_daoName_n
      }

      circles: circle {
        name: details_title_s
      }

      cmntsect {
        docId

        comment {
          id: docId
          author: comment_author_n
          content: comment_content_s
          createdDate
          deletedStatus: comment_deleted_i

          reactions: reaction {
            reactionlnkrAggregate {
              count
            }

            reactionlnkr {
              author: details_member_n
            }
          }

          commentAggregate {
            count
          }
        }
      }
    }

    ... on Questcomplet {
      ballot_expiration_t

      details_title_s
      details_description_s

      details_state_s
      details_ballotQuorum_i
      details_ballotSupply_a
      details_ballotAlignment_i

      votetally {
        docId
        ... on VoteTally {
          docId
          pass_votePower_a
          fail_votePower_a
          abstain_votePower_a
        }
      }

      queststart {
        details_title_s
        system_description_s

        details_pegAmount_a
        details_rewardAmount_a
        details_voiceAmount_a
        start {
          details_startTime_t
        }

        details_periodCount_i
      }

      dao {
        details_daoName_n
      }

      cmntsect {
        docId

        comment {
          id: docId
          author: comment_author_n
          content: comment_content_s
          createdDate
          deletedStatus: comment_deleted_i

          reactions: reaction {
            reactionlnkrAggregate {
              count
            }

            reactionlnkr {
              author: details_member_n
            }
          }

          commentAggregate {
            count
          }
        }
      }
    }
    ... on Policy {
      ballot_expiration_t

      details_title_s
      details_description_s
      details_name_s
      details_purpose_s

      details_state_s
      details_ballotQuorum_i
      details_ballotSupply_a
      details_ballotAlignment_i

      details_url_s

      votetally {
        docId
        ... on VoteTally {
          docId
          pass_votePower_a
          fail_votePower_a
          abstain_votePower_a
        }
      }

      parentcircle {
        ... on Circle {
          id: docId
          name: details_title_s
        }
      }

      masterpolicy {
        details_title_s
      }

      dao {
        details_daoName_n
      }

      cmntsect {
        docId

        comment {
          id: docId
          author: comment_author_n
          content: comment_content_s
          createdDate
          deletedStatus: comment_deleted_i

          reactions: reaction {
            reactionlnkrAggregate {
              count
            }

            reactionlnkr {
              author: details_member_n
            }
          }

          commentAggregate {
            count
          }
        }
      }
    }

    ... on Circle {
      ballot_expiration_t

      details_title_s
      details_description_s
      details_name_s
      details_purpose_s

      details_state_s
      details_ballotQuorum_i
      details_ballotSupply_a
      details_ballotAlignment_i

      votetally {
        docId
        ... on VoteTally {
          docId
          pass_votePower_a
          fail_votePower_a
          abstain_votePower_a
        }
      }

      parentcircle {
        ... on Circle {
          id: docId
          name: details_title_s
          purpose: details_description_s
          budget: details_purpose_s

          applicant {
            username: details_member_n
          }

          members: member {
            username: details_member_n
          }

          subcircles: subcircle {
            id: docId
            name: details_title_s
            purpose: details_description_s
            budget: details_purpose_s
          }
        }
      }

      dao {
        details_daoName_n
      }

      cmntsect {
        docId

        comment {
          id: docId
          author: comment_author_n
          content: comment_content_s
          createdDate
          deletedStatus: comment_deleted_i

          reactions: reaction {
            reactionlnkrAggregate {
              count
            }

            reactionlnkr {
              author: details_member_n
            }
          }

          commentAggregate {
            count
          }
        }
      }
    }

    ... on Payout {
      ballot_expiration_t

      details_title_s
      details_description_s
      details_url_s

      details_usdAmount_a
      details_deferredPercX100_i

      details_pegAmount_a
      details_rewardAmount_a
      details_voiceAmount_a

      details_state_s
      details_ballotQuorum_i
      details_ballotSupply_a
      details_ballotAlignment_i
      details_isCustom_i
      details_owner_n
      details_url_s

      votetally {
        docId
        ... on VoteTally {
          docId
          pass_votePower_a
          fail_votePower_a
          abstain_votePower_a
        }
      }

      dao {
        details_daoName_n
      }

      cmntsect {
        docId

        comment {
          id: docId
          author: comment_author_n
          content: comment_content_s
          createdDate
          deletedStatus: comment_deleted_i

          reactions: reaction {
            reactionlnkrAggregate {
              count
            }

            reactionlnkr {
              author: details_member_n
            }
          }

          commentAggregate {
            count
          }
        }
      }
    }

    ... on Edit {
      ballot_expiration_t
      details_ballotTitle_s
      details_ballotDescription_s
      details_periodCount_i
      details_state_s
      details_url_s
      dao {
        details_daoName_n
      }

      votetally {
        docId
        ... on VoteTally {
          docId
          pass_votePower_a
          fail_votePower_a
          abstain_votePower_a
        }
      }
      original {
        __typename
        ... on Assignment {
          details_usdSalaryValuePerPhase_a
          details_ballotQuorum_i
          details_ballotSupply_a
          details_ballotAlignment_i
          details_title_s
          details_description_s
          details_assignee_n
          details_url_s
          details_periodCount_i
          start {
            details_startTime_t
          }
          details_pegSalaryPerPeriod_a
          details_rewardSalaryPerPeriod_a
          details_voiceSalaryPerPeriod_a
          details_timeShareX100_i
          details_deferredPercX100_i
          details_approvedDeferredPercX100_i
          lastimeshare {
            details_timeShareX100_i
          }
          details_state_s
          role {
            ... on Role {
              details_title_s
              details_annualUsdSalary_a
            }
          }
        }
        ... on Assignbadge {
          details_ballotQuorum_i
          details_ballotSupply_a
          details_ballotAlignment_i
          details_title_s
          details_description_s
          details_assignee_n
          details_periodCount_i
          details_state_s
          creator
          start {
            details_startTime_t
          }
          badge {
            details_title_s
            details_icon_s
            details_pegCoefficientX10000_i
            details_voiceCoefficientX10000_i
            details_rewardCoefficientX10000_i
          }
        }
      }
      cmntsect {
        docId

        comment {
          id: docId
          author: comment_author_n
          content: comment_content_s
          createdDate
          deletedStatus: comment_deleted_i

          reactions: reaction {
            reactionlnkrAggregate {
              count
            }

            reactionlnkr {
              author: details_member_n
            }
          }

          commentAggregate {
            count
          }
        }
      }
    }
    ... on Assignment {
      ballot_expiration_t
      details_assignee_n

      details_title_s
      details_description_s

      details_periodCount_i
      details_usdSalaryValuePerPhase_a
      details_annualUsdSalary_a
      details_pegSalaryPerPeriod_a
      details_rewardSalaryPerPeriod_a
      details_voiceSalaryPerPeriod_a
      details_timeShareX100_i
      details_approvedDeferredPercX100_i

      details_ballotQuorum_i
      details_ballotSupply_a
      details_ballotAlignment_i

      votetally {
        docId
        ... on VoteTally {
          docId
          pass_votePower_a
          fail_votePower_a
          abstain_votePower_a
        }
      }

      role {
        id: docId
        name: details_title_s
      }
      salaryband {
        id: docId
        name: details_name_s
        annualAmount: details_annualUsdSalary_a
        minDeferred: details_minDeferredX100_i

        assignment {
          role {
            system_nodeLabel_s
          }
        }
      }
      details_url_s
      dao {
        details_daoName_n
      }
      start {
        docId
        details_label_s
        details_startTime_t
      }
      claimed {
        docId
      }

      lastimeshare {
        details_timeShareX100_i
      }
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

      cmntsect {
        docId

        comment {
          id: docId
          author: comment_author_n
          content: comment_content_s
          createdDate
          deletedStatus: comment_deleted_i

          reactions: reaction {
            reactionlnkrAggregate {
              count
            }

            reactionlnkr {
              author: details_member_n
            }
          }

          commentAggregate {
            count
          }
        }
      }
    }

    ... on Assignbadge {
      ballot_expiration_t

      details_state_s

      details_title_s
      details_description_s

      details_periodCount_i

      details_ballotQuorum_i
      details_ballotSupply_a
      details_ballotAlignment_i
      creator

      votetally {
        docId
        ... on VoteTally {
          docId
          pass_votePower_a
          fail_votePower_a
          abstain_votePower_a
        }
      }
      start {
        details_startTime_t
      }
      dao {
        details_daoName_n
      }
      badge {
        ... on Badge {
          type
          docId
          details_state_s
          details_title_s
          details_description_s

          details_icon_s
          details_pegCoefficientX10000_i
          details_voiceCoefficientX10000_i
          details_rewardCoefficientX10000_i
        }
      }

      details_startPeriod_i
      details_assignee_n

      cmntsect {
        docId

        comment {
          id: docId
          author: comment_author_n
          content: comment_content_s
          createdDate
          deletedStatus: comment_deleted_i

          reactions: reaction {
            reactionlnkrAggregate {
              count
            }

            reactionlnkr {
              author: details_member_n
            }
          }

          commentAggregate {
            count
          }
        }
      }
    }

    ... on Role {
      ballot_expiration_t
      details_title_s
      details_description_s

      details_annualUsdSalary_a
      details_minDeferredX100_i
      details_fulltimeCapacityX100_i

      details_state_s

      details_ballotQuorum_i
      details_ballotSupply_a
      details_ballotAlignment_i

      details_minTimeShareX100_i
      details_owner_n

      votetally {
        docId
        ... on VoteTally {
          docId
          pass_votePower_a
          fail_votePower_a
          abstain_votePower_a
        }
      }

      details_url_s
      dao {
        details_daoName_n
      }
    }

    ... on Badge {
      ballot_expiration_t
      details_title_s
      details_description_s
      details_pegCoefficientX10000_i
      details_voiceCoefficientX10000_i
      details_rewardCoefficientX10000_i
      details_icon_s
      details_state_s
      details_maxCycles_i
      details_maxPeriodCount_i
      details_ballotQuorum_i
      details_ballotSupply_a
      details_ballotAlignment_i
      details_purpose_s
      system_proposer_n

      votetally {
        docId
        ... on VoteTally {
          docId
          pass_votePower_a
          fail_votePower_a
          abstain_votePower_a
        }
      }
      assignment {
        details_assignee_n
        dao {
          details_daoName_n
        }
      }
      dao {
        details_daoName_n
      }

      cmntsect {
        docId

        comment {
          id: docId
          author: comment_author_n
          content: comment_content_s
          createdDate
          deletedStatus: comment_deleted_i

          reactions: reaction {
            reactionlnkrAggregate {
              count
            }

            reactionlnkr {
              author: details_member_n
            }
          }

          commentAggregate {
            count
          }
        }
      }
    }

    ... on Suspend {
      details_description_s
      details_title_s
      ballot_expiration_t
      details_originalDocument_i
      details_state_s
      details_ballotQuorum_i
      details_ballotSupply_a
      details_ballotAlignment_i
      dao {
        details_daoName_n
      }

      votetally {
        docId
        ... on VoteTally {
          docId
          pass_votePower_a
          fail_votePower_a
          abstain_votePower_a
        }
      }

      suspend {
        ... on Role {
          ballot_expiration_t
          details_title_s
          details_description_s
          details_annualUsdSalary_a
          details_minDeferredX100_i
          details_state_s
        }
        ... on Badge {
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
        }
        ... on Assignbadge {
          details_description_s
          details_title_s
          ballot_expiration_t
          details_state_s
          details_periodCount_i
          creator
          badge {
            details_pegCoefficientX10000_i
            details_voiceCoefficientX10000_i
            details_rewardCoefficientX10000_i
          }
          details_startPeriod_i
          details_ballotQuorum_i
          details_ballotSupply_a
          details_assignee_n
        }
        ... on Assignment {
          ballot_expiration_t
          details_title_s
          details_description_s
          details_assignee_n
          details_periodCount_i
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
          lastimeshare {
            details_timeShareX100_i
          }
          details_deferredPercX100_i
          details_state_s
          role {
            ... on Role {
              details_title_s
              details_annualUsdSalary_a
              details_minDeferredX100_i
            }
          }
          details_ballotQuorum_i
          details_ballotSupply_a
        }
      }
    }
    ... on Votable {
      votetally {
        docId

        ... on VoteTally {
          docId
          pass_votePower_a
          fail_votePower_a
          abstain_votePower_a
        }
      }
      voteAggregate {
        count
      }
      pass: voteAggregate(filter: { vote_vote_s: { regexp: "/.*pass*./" } }) {
        count
      }
      abstain: voteAggregate(
        filter: { vote_vote_s: { regexp: "/.*abstain*./" } }
      ) {
        count
      }
      fail: voteAggregate(filter: { vote_vote_s: { regexp: "/.*fail*./" } }) {
        count
      }
      vote(first: 0, offset: 0, order: { desc: createdDate }) {
        vote_date_t
        vote_voter_n
        vote_vote_s
        vote_votePower_a
      }
    }
  }
`

export default {
  name: 'proposal-detail',
  mixins: [format],
  components: {
    CommentsWidget: () => import('~/components/proposals/comments-widget.vue'),
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue'),
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue'),

    ProposalItem: () => import('~/components/profiles/proposal-item.vue'),
    ProposalView: () => import('~/components/proposals/proposal-view.vue'),

    VoterList: () => import('~/components/proposals/voter-list.vue'),
    Voting: () => import('~/components/proposals/voting.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    docId: String
  },

  data () {
    return {
      optimisticProposal: undefined,
      proposalParsing: proposalParsing,
      pagination: {
        first: 5,
        offset: 0,
        more: true
      },
      commentByIds: {},
      rootCommentIds: [],
      votes: [],
      supplyTokens: undefined,
      coefficientBase: 10000,
      cycleDurationSec: 2629800,

      state: 'WAITING',
      page: 1,
      PROPOSAL_STATE,
      PROPOSAL_TYPE
    }
  },

  apollo: {

    proposal: {
      query: gql`query proposalDetail($docId: String!) { ${PROPOSAL_QUERY} }`,
      update: data => data.getDocument,
      skip () { return !this.docId },
      variables () { return { docId: this.docId } },
      fetchPolicy: 'no-cache',

      // pollInterval: 1000, // TODO: Swap with subscribe once dgraph is ready
      subscribeToMore: {
        document: gql`subscription proposalDetail($docId: String!) { ${PROPOSAL_QUERY} }`,
        skip () { return !this.docId },
        variables () { return { docId: this.docId } },
        updateQuery: (previousResult, { subscriptionData }) => {
          if (!subscriptionData.data) {
            return previousResult
          }
          if (!previousResult) {
            return undefined
          }

          return subscriptionData.data
        }

      },

      result (data) {
        if ((data?.data?.getDocument?.dao[0]?.details_daoName_n !== this?.selectedDao?.name) && !this.isBadge) {
          this.$router.push({ name: '404-not-found' })
        }
      }

    },

    claimPayments: {
      query: require('~/query/quests/dao-quest-complete-info.gql'),
      update: data => data.queryQuestcomplet,
      skip () { return !this.proposal?.docId },
      variables () { return { id: this.proposal?.docId } }
    },

    tiers: {
      query: gql`query TIERS($daoId: Int64!) { ${TIERS_QUERY} }`,
      update: data => data?.querySalaryband?.map(level => ({
        label: level?.name,
        value: { ...level }
      })),
      skip () { return !this.selectedDao?.docId },
      variables () { return { daoId: this.selectedDao.docId } },
      subscribeToMore: {
        document: gql`subscription TIERS($daoId: Int64!) { ${TIERS_QUERY} }`,
        skip () { return !this.selectedDao?.docId },
        variables () { return { daoId: this.selectedDao.docId } },
        updateQuery: (previousResult, { subscriptionData }) => {
          if (!subscriptionData.data) {
            return previousResult
          }
          if (!previousResult) {
            return undefined
          }

          return subscriptionData.data
        }
      }
    },

    archetypes: {
      query: gql`query ROLES($daoId: Int64!) { ${ROLES_QUERY} }`,
      update: data => data?.queryRole?.map(archetype => ({
        label: archetype?.name,
        value: { ...archetype }
      })),
      skip () { return !this.selectedDao?.docId },
      variables () { return { daoId: this.selectedDao.docId } },
      subscribeToMore: {
        document: gql`subscription ROLES($daoId: Int64!) { ${ROLES_QUERY} }`,
        skip () { return !this.selectedDao?.docId },
        variables () { return { daoId: this.selectedDao.docId } },
        updateQuery: (previousResult, { subscriptionData }) => {
          if (!subscriptionData.data) {
            return previousResult
          }
          if (!previousResult) {
            return undefined
          }

          return subscriptionData.data
        }
      }
    }
  },

  computed: {
    // TODO: This needs to be updated:
    // Get global root settings document and get the item 'governance_token_contract'
    // Then search for the actual dao voice token (found in the dao settings document)
    ...mapGetters('accounts', ['account', 'isMember']),
    ...mapGetters('dao', ['daoSettings', 'selectedDao', 'votingPercentages']),

    comments () {
      const mapComment = comment => ({
        ...comment,
        reactions: {
          count: comment.reactions[0]?.reactionlnkrAggregate?.count,
          users: comment.reactions[0]?.reactionlnkr?.map(_ => _.author)
        }
      })

      const comments = this.rootCommentIds.map(id => {
        const comment = this.commentByIds[id]
        return {
          ...mapComment(comment),
          replies: comment && comment.replies && comment.replies.map(comment => mapComment(this.commentByIds[comment.id]))
        }
      })

      return comments.filter(comment => comment.deletedStatus !== 1)
    },

    commentSectionId () { return this?.proposal?.cmntsect[0].docId },

    ownAssignment () {
      return (this?.proposal?.__typename === PROPOSAL_TYPE.ROLE || this?.proposal?.__typename === PROPOSAL_TYPE.ABILITY) &&
        this.proposal.details_assignee_n === this.account &&
        proposalParsing.status(this.proposal) !== PROPOSAL_STATE.PROPOSED &&
        proposalParsing.status(this.proposal) !== PROPOSAL_STATE.REJECTED &&
        proposalParsing.status(this.proposal) !== PROPOSAL_STATE.DRAFTED
    },
    isCreator () {
      return this.account === proposalParsing.creator(this.proposal)
    },
    voteSize () {
      if (this.proposal && this.proposal.voteAggregate) {
        return this.proposal.voteAggregate.count || 0
      }
      return 0
    },

    expired () { return this.timeLeft < 0 },

    timeLeft () {
      const end = new Date(`${this.proposal.ballot_expiration_t}`).getTime()
      const now = Date.now()
      const t = end - now
      return t
    },

    periodsOnCycle () {
      return (this.cycleDurationSec / this.daoSettings.periodDurationSec).toFixed(2)
    },

    isDefaultBadgeMultiplier () {
      return true
    },

    loading () { return this.$apollo.queries.proposal.loading },

    isBadge () { return this.proposal?.__typename === PROPOSAL_TYPE.BADGE },

    badgeHolders () {
      const uniqueHolders = lodash.uniqBy(this.proposal.assignment, 'details_assignee_n')
      return uniqueHolders.filter(holder => holder.dao[0].details_daoName_n === this.selectedDao.name)
    },

    hideVoting () {
      return this.isBadge && proposalParsing.status(this.proposal) === PROPOSAL_STATE.APPROVED
    },

    pages () {
      return Math.ceil(this.badgeHolders?.length / 3)
    },

    paginatedHolders () {
      return this.badgeHolders.slice((this.page - 1) * 3, this.page * 3)
    },
    getPaginationText () {
      if (this.pages === 0) return ''
      return `${this.page} of ${this.pages}`
    },
    isLastPage () {
      if (this.pages === 0) return true
      return this.page === this.pages
    },
    currentElectionIndex () {
      let stepIndex = null
      if (this.upvoteElectionData.upcomingElection?.length) {
        stepIndex = 0
      } else if (!this.upvoteElectionData.nextRound?.length && this.upvoteElectionData?.currentRound !== 'head') {
        stepIndex = 4
      } else {
        switch (this.upvoteElectionData?.currentRound) {
          case ('delegate'):
            stepIndex = 1
            break
          case ('chief'):
            stepIndex = 2
            break
          case ('head'):
            stepIndex = 3
            break
        }
      }
      return stepIndex
    },

    QUEST_STATE () {
      const isApproved = this.proposal.details_state_s === PROPOSAL_STATE.APPROVED
      if (isApproved && this.proposal?.lockedby?.length > 0) { return 'PAYOUT_VOTING' }
      if (isApproved && this.proposal?.completedby?.length > 0) { return 'COMPLETED' }
      return ''
    }
  },

  watch: {
    proposal () {
      this.proposal.cmntsect[0]?.comment.forEach(comment => {
        this.$set(this.commentByIds, comment.id, comment)
        if (this.rootCommentIds.includes(comment.id)) return
        this.rootCommentIds.push(comment.id)
      })
      this.optimisticProposal = JSON.parse(JSON.stringify(this.proposal))
    }

  },

  methods: {
    ...mapActions('proposals', [
      'activeProposal',
      'createProposalComment',
      'createQuestPayout',
      'deleteProposal',
      'deleteProposalComment',
      'publishProposal',
      'reactProposalComment',
      'saveDraft',
      'suspendProposal',
      'unreactProposalComment',
      'updateProposalComment',
      'withdrawProposal'
    ]),

    onVoting () {
    },

    onApply (proposal) {
      if (proposal?.__typename === PROPOSAL_TYPE.BADGE) {
        proposal.type = PROPOSAL_TYPE.BADGE
        // this.$store.commit('proposals/setNext', true)

        this.$store.commit('proposals/setType', CONFIG.options.recurring.options.badge.type)
        this.$store.commit('proposals/setCategory', { key: CONFIG.options.recurring.options.badge.key, title: CONFIG.options.recurring.options.badge.title })
        this.$store.commit('proposals/setBadge', proposal)
        this.$store.commit('proposals/setRewardCoefficientLabel', (proposal.details_rewardCoefficientX10000_i) / this.coefficientBase)
        this.$store.commit('proposals/setRewardCoefficient', proposal.details_rewardCoefficientX10000_i)
        this.$store.commit('proposals/setVoiceCoefficientLabel', (proposal.details_voiceCoefficientX10000_i) / this.coefficientBase)
        this.$store.commit('proposals/setVoiceCoefficient', proposal.details_voiceCoefficientX10000_i)
        this.$store.commit('proposals/setPegCoefficientLabel', (proposal.details_pegCoefficientX10000_i) / this.coefficientBase)
        this.$store.commit('proposals/setPegCoefficient', proposal.details_pegCoefficientX10000_i)
        this.$store.commit('proposals/setIcon', proposal.details_icon_s)

        this.$store.commit('proposals/setStepIndex', 1)
        this.$store.commit('proposals/setPastSteps', ['step-proposal-type', 'step-details'])
        const draftId = Date.now()
        this.$store.commit('proposals/setDraftId', draftId)
        this.saveDraft()
        this.$router.push({ name: 'proposal-create', params: { draftId } })
      }
      if (proposal?.__typename === PROPOSAL_TYPE.ARCHETYPE) {
        proposal.type = PROPOSAL_TYPE.ARCHETYPE
        // this.$store.commit('proposals/setNext', true)
        this.$store.commit('proposals/setType', CONFIG.options.recurring.options.assignment.type)
        this.$store.commit('proposals/setCategory', { key: CONFIG.options.recurring.options.assignment.key, title: CONFIG.options.recurring.options.assignment.title })
        const salary = parseFloat(proposal?.details_annualUsdSalary_a)
        const salaryBucket = this.getSalaryBucket(salary)
        this.$store.commit('proposals/setRole', {
          docId: proposal.docId,
          title: proposal.details_title_s,
          description: proposal.details_description_s,
          salary,
          minDeferred: proposal.details_minDeferredX100_i,
          minCommitment: proposal.details_minTimeShareX100_i,
          type: proposal.type,
          salaryBucket
        })
        this.$store.commit('proposals/setAnnualUsdSalary', salary)
        this.$store.commit('proposals/setMinDeferred', proposal.details_minDeferredX100_i)
        this.$store.commit('proposals/setStepIndex', 1)
        const draftId = Date.now()
        this.$store.commit('proposals/setDraftId', draftId)
        this.saveDraft()
        this.$router.push({ name: 'proposal-create', params: { draftId } })
      }
    },
    async onSuspend (proposal) {
      try {
        await this.suspendProposal(proposal.docId)
        this.$router.push({ name: 'proposals' })
      } catch (e) {
        const message = e.message || e.cause.message
        this.showNotification({
          message,
          color: 'red'
        })
      }
    },
    async onActive (proposal) {
      try {
        await this.activeProposal(proposal.docId)
      } catch (e) {
        const message = e.message || e.cause.message
        this.showNotification({
          message,
          color: 'red'
        })
      }
    },
    async onWithDraw (proposal) {
      try {
        await this.withdrawProposal(proposal.docId)
      } catch (e) {
        const message = e.message || e.cause.message
        this.showNotification({
          message,
          color: 'red'
        })
      }
    },

    async onPublish (proposal) {
      try {
        await this.publishProposal(proposal.docId)
        this.state = 'PUBLISHING'
        this.$router.replace({ params: { data: proposal, isPublishing: true }, query: { refetch: true } })
      } catch (e) {
        this.state = 'WAITING'
        const message = e.message || e.cause.message
        this.showNotification({ message, color: 'red' })
      }
    },

    async onEdit () {
      const category = {
        Payout: { key: 'contribution', title: 'Generic Contribution' },

        Assignment: { key: 'assignment', title: 'Role assignment' },
        Assignbadge: { key: 'badge', title: 'Badge assignment' },

        Role: { key: 'archetype', title: 'Role Archetype' },
        Badge: { key: 'obadge', title: 'Badge Definition' },

        Circle: { key: 'circle', title: 'Circle' },
        Policy: { key: 'policy', title: 'Policy' },
        Quest: { key: 'quest', title: 'Quest' },
        Queststart: { key: 'quest', title: 'Quest' },
        Questcomplet: { key: 'quest', title: 'Quest' },
        Budget: { key: 'circlebudget', title: 'Budget' }
      }[this.proposal.__typename]
      this.$store.commit('proposals/setStepIndex', 1)
      this.$store.commit('proposals/setCategory', category)
      this.$store.commit('proposals/setType', this.proposal?.__typename)

      this.$store.commit('proposals/setState', this.proposal?.details_state_s)
      this.$store.commit('proposals/setProposalId', this.proposal?.docId)

      this.$store.commit('proposals/setTitle', this.proposal?.details_title_s)
      this.$store.commit('proposals/setDescription', this.proposal?.details_description_s)
      // this.$store.commit('proposals/setCircle', this.proposal?.details_description_s)

      this.$store.commit('proposals/setUsdAmount', parseFloat(this?.proposal?.details_usdAmount_a))
      this.$store.commit('proposals/setCommitment', parseFloat(this?.proposal?.details_timeShareX100_i))
      this.$store.commit('proposals/setDeferred', parseFloat(this?.proposal?.details_deferredPercX100_i))

      this.$store.commit('proposals/setUrl', this.proposal?.details_url_s)

      if (this.proposal?.__typename === PROPOSAL_TYPE.CIRCLE) {
        this.$store.commit('proposals/setCircle', {
          label: this.proposal?.parentcircle[0]?.name,
          value: this.proposal?.parentcircle[0]?.id
        })
      }

      if (this.proposal?.__typename === PROPOSAL_TYPE.POLICY) {
        this.$store.commit('proposals/setCircle', {
          label: this.proposal?.parentcircle[0]?.name,
          value: this.proposal?.parentcircle[0]?.id
        })
      }

      if (this.proposal?.__typename === PROPOSAL_TYPE.ROLE) { // Role Assignment
        this.$store.commit('proposals/setStepIndex', 0)
        const tier = this.tiers.find(tier => tier.label === (this.proposal?.salaryband?.[0]?.name || DEFAULT_TIER))
        // const archetype = this.archetypes.find(archetype => archetype.label === this.proposal?.salaryband?.[0]?.assignment?.[0]?.role?.[0]?.system_nodeLabel_s)

        const annualUsdSalary = (tier.label === DEFAULT_TIER
          ? this?.proposal?.details_annualUsdSalary_a
          : tier.value.annualAmount).split(' ')[0]

        this.$store.commit('proposals/setRole', { value: this.proposal?.role[0] })
        this.$store.commit('proposals/setTier', tier)

        this.$store.commit('proposals/setAnnualUsdSalary', annualUsdSalary)
        this.$store.commit('proposals/setMinDeferred', tier?.value?.minDeferred || 0)
        this.$store.commit('proposals/setMinCommitment', 0)

        this.$store.commit('proposals/setCommitment', this.proposal?.details_timeShareX100_i)
        this.$store.commit('proposals/setDeferred', parseFloat(this.proposal?.details_deferredPercX100_i))
        this.$store.commit('proposals/setStartPeriod', this.proposal?.start[0])
        // this.$store.commit('proposals/setStartDate', this.proposal?.start[0]?.details_startTime_t)
        this.$store.commit('proposals/setPeriodCount', this.proposal?.details_periodCount_i)
        // this.$store.commit('proposals/setMinDeferred', this.proposal?.role[0]?.details_minDeferredX100_i)
      }

      if (this.proposal?.__typename === PROPOSAL_TYPE.ABILITY || this.proposal?.__typename === PROPOSAL_TYPE.ASSIGNBADGE) { // Badge Assignment
        this.$store.commit('proposals/setBadge', this?.proposal.badge?.[0])
        this.$store.commit('proposals/setStartPeriod', this.proposal?.start[0])
        this.$store.commit('proposals/setPeriodCount', this.proposal?.details_periodCount_i)
      }

      if (this.proposal?.__typename === PROPOSAL_TYPE.ARCHETYPE) {
        this.$store.commit('proposals/setAnnualUsdSalary', parseInt(this.proposal?.details_annualUsdSalary_a.split(' ').shift()))
        this.$store.commit('proposals/setRoleCapacity', this.proposal?.details_fulltimeCapacityX100_i)
        this.$store.commit('proposals/setMinDeferred', this.proposal?.details_minDeferredX100_i)
      }

      if (this.proposal?.__typename === PROPOSAL_TYPE.BADGE) {
        this.$store.commit('proposals/setBadge', this?.proposal)
        this.$store.commit('proposals/setPurpose', this.proposal?.details_purpose_s)
        this.$store.commit('proposals/setIcon', this.proposal?.details_icon_s)
        this.$store.commit('proposals/setRewardCoefficientLabel', (this?.proposal?.details_rewardCoefficientX10000_i - 10000) / 100)
        this.$store.commit('proposals/setRewardCoefficient', this?.proposal?.details_rewardCoefficientX10000_i)
        this.$store.commit('proposals/setVoiceCoefficientLabel', (this?.proposal?.details_voiceCoefficientX10000_i - 10000) / 100)
        this.$store.commit('proposals/setVoiceCoefficient', this?.proposal?.details_voiceCoefficientX10000_i)
        this.$store.commit('proposals/setPegCoefficientLabel', (this?.proposal?.details_pegCoefficientX10000_i - 10000) / 100)
        this.$store.commit('proposals/setPegCoefficient', this?.proposal?.details_pegCoefficientX10000_i)
      }

      if (this.proposal.__typename === PROPOSAL_TYPE.QUEST_START || this.proposal.__typename === PROPOSAL_TYPE.QUEST_PAYOUT) {
        this.$store.commit('proposals/setUrl', this.proposal?.details_url_s)
        this.$store.commit('proposals/setStartPeriod', this.proposal?.start?.[0])
        this.$store.commit('proposals/setPeriodCount', this.proposal?.details_periodCount_i)
        this.$store.commit('proposals/setPeg', this.proposal?.details_pegAmount_a?.split(' ')[0])
        this.$store.commit('proposals/setReward', this.proposal?.details_rewardAmount_a?.split(' ')[0])
        this.$store.commit('proposals/setVoice', this.proposal?.details_voiceAmount_a?.split(' ')[0])
        this.$store.commit('proposals/setStartPeriod', this.proposal?.start[0])
        this.$store.commit('proposals/setPeriodCount', this.proposal?.details_periodCount_i)
      }

      const draftId = Date.now()
      this.$store.commit('proposals/setDraftId', draftId)
      this.saveDraft()
      this.$router.push({ name: 'proposal-create', params: { draftId } })
    },

    async onDelete (proposal) {
      try {
        this.state = 'DELETING'
        await this.deleteProposal(proposal.docId)
        this.$router.push({ name: 'proposals', params: { data: proposal, isDeleting: true }, query: { refetch: true } })
      } catch (e) {
        this.state = 'WAITING'
        const message = e.message || e.cause.message
        this.showNotification({ message, color: 'red' })
      }
    },

    async onQuestPayout () {
      try {
        await this.createQuestPayout({
          title: `${this.proposal.details_title_s} [COMPLETION]`,
          description: 'test',
          questStartId: this.proposal.docId
        })
        const data = { ...this.$store.state.proposals.draft }

        const draftId = this.$store.state.proposals.draft.draftId || undefined
        if (draftId) {
          this.deleteDraft(this.$store.state.proposals.draft)
        }
        this.$store.commit('proposals/reset')

        this.$router.push({ name: 'proposals', params: { data }, query: { refetch: true } })
      } catch (e) {
        const message = e.message || e.cause.message
        // this.saveDraft()
        this.showNotification({
          message,
          color: 'red'
        })
      }
    },

    async modifyData (changeToSuspension) {
      this.proposal.toSuspend = changeToSuspension
      await this.$forceUpdate()
    },
    toggle (proposal) {
      return proposal?.__typename === PROPOSAL_TYPE.ROLE || proposal?.__typename === PROPOSAL_TYPE.ARCHETYPE || (proposal?.__typename === PROPOSAL_TYPE.EDIT && proposal.original?.[0].role)
    },

    async fetchComment (commentId) {
      try {
        const { data: { getComment: comment } } = await this.$apollo.query({
          query: require('~/query/proposals/dao-proposal-comment.gql'),
          variables: { docId: commentId }
        })

        comment.replies.forEach(comment => {
          this.$set(this.commentByIds, comment.id, comment)
        })
        this.commentByIds[commentId] = { ...comment }
      } catch (e) {}
    },

    async createComment ({ parentId, content }) {
      try {
        await this.createProposalComment({
          parentId: parentId || this.commentSectionId,
          content
        })
      } catch (e) {
        const message = e.message || e.cause.message
        this.showNotification({ message, color: 'red' })
      }
    },
    async updateComment ({ commentId, content }) {
      try {
        await this.updateProposalComment({ commentId, content })
      } catch (e) {
        const message = e.message || e.cause.message
        this.showNotification({ message, color: 'red' })
      }
    },
    async deleteComment (commentId) {
      try {
        await this.deleteProposalComment(commentId)
      } catch (e) {
        const message = e.message || e.cause.message
        this.showNotification({ message, color: 'red' })
      }
    },

    async likeComment (commentId) {
      try {
        await this.reactProposalComment({ commentId, reaction: 'liked' })
      } catch (e) {
        const message = e.message || e.cause.message
        this.showNotification({ message, color: 'red' })
      }
    },
    async unlikeComment (commentId) {
      try {
        await this.unreactProposalComment({ commentId })
      } catch (e) {
        const message = e.message || e.cause.message
        this.showNotification({ message, color: 'red' })
      }
    },
    onPrev () {
      this.page--
    },
    onNext () {
      this.page++
    },
    onCommitUpdate (val) {
      this.optimisticProposal = { ...this.optimisticProposal, ...{ lastimeshare: [{ details_timeShareX100_i: val }] } }
    },
    onDeferredUpdate (val) {
      this.optimisticProposal = { ...this.optimisticProposal, details_deferredPercX100_i: val }
    }
  }

}
</script>

<template lang="pug">
.full-height.full-width.fixed-full.bg-internal-bg(:style="'padding: 15px; overflow-y: scroll; z-index: 7777;'" v-if="$q.screen.lt.md || $q.screen.md")
  .flex.row.justify-between
    .h-h6.text-bold.flex.items-center(:style="'margin: 0 auto;'") {{ $t('pages.proposals.proposaldetail.proposalDetails') }}
    q-btn(unelevated rounded padding="12px" icon="fas fa-times" size="sm" :color="'white'" text-color="'primary'" :to="{ name: 'proposals'}")
    q-card.main-card(:style="'border-radius: 25px; box-shadow: none; margin-top: 15px; width: 100%; margin-bottom: 300px;'")
      .row.justify-center.q-my-md(v-if="loading")
        loading-spinner(color="primary" size="72px")
      .row(v-else-if="proposal")
        .col-12.col-lg-9
          proposal-item.bottom-no-rounded(v-if="ownAssignment" background="white" :proposal="proposal" :clickable="ownAssignment" :expandable="true" :owner="true" :moons="true" @claim-all="$emit('claim-all')" @change-deferred="(val) => $emit('change-deferred', val)" :selectedDao="selectedDao" :daoSettings="daoSettings" :votingPercentages="votingPercentages")
          .separator-container(v-if="ownAssignment")
            q-separator(color="grey-3" inset)
          proposal-view(:proposal="optimisticProposal ? optimisticProposal : proposal" :ownAssignment="ownAssignment" :class="{'top-no-rounded': ownAssignment}" :withToggle="toggle(proposal)" :created="proposalParsing.created(proposal)" :restrictions="proposalParsing.restrictions(proposal)" :status="proposalParsing.status(proposal)" :docId="proposalParsing.docId(proposal)" :creator="proposalParsing.creator(proposal)" :capacity="proposalParsing.capacity(proposal)" :deferred="proposalParsing.deferred(proposal)" :description="proposalParsing.description(proposal)" :periodCount="proposalParsing.periodCount(proposal)" :salary="proposalParsing.salary(proposal)" :start="proposalParsing.start(proposal)" :subtitle="!ownAssignment ? proposalParsing.subtitle(proposal) : undefined" :title="!ownAssignment ? proposalParsing.title(proposal) : undefined" :type="proposal?.__typename === 'Suspend' ? proposal.suspend[0].__typename : proposal?.__typename" :url="proposalParsing.url(proposal)" :icon="proposalParsing.icon(proposal)" :commit="proposalParsing.commit(optimisticProposal ? optimisticProposal : proposal)" :compensation="proposalParsing.compensation(optimisticProposal ? optimisticProposal : proposal, daoSettings)" :tokens="proposalParsing.tokens(optimisticProposal ? optimisticProposal : proposal, periodsOnCycle, daoSettings, isDefaultBadgeMultiplier)" :isBadge="isBadge" :pastQuorum="proposalParsing.pastQuorum(proposal)" :pastUnity="proposalParsing.pastUnity(proposal)" :votingMethod="proposalParsing.votingMethod(proposal)" :parentCircle="proposalParsing.parentCircle(proposal)" @change-deferred="onDeferredUpdate" @change-commit="onCommitUpdate")
          comments-widget(v-if="!isBadge" :comments="comments" :disable="expired" @create="createComment" @update="updateComment" @delete="deleteComment" @like="likeComment" @unlike="unlikeComment" @load-comment="fetchComment")
        .col-12.col-lg-3(v-if="!isBadge" :class="{ 'q-pl-md': $q.screen.gt.md }")
          widget.bg-primary(v-if="proposalParsing.status(proposal) === PROPOSAL_STATE.DRAFTED && isCreator && state === 'WAITING'")
            h2.h-h4.text-white.leading-normal.q-ma-none {{ $t('pages.proposals.proposaldetail.yourProposalIs') }}
            p.h-b2.q-mt-xl.text-disabled {{ $t('pages.proposals.proposaldetail.thatMeansYour') }}
            q-btn.q-mt-xl.text-primary.text-bold.full-width(@click="onPublish(proposal)" color="white" text-color="primary" no-caps rounded) {{ $t('pages.proposals.proposaldetail.publish') }}
            q-btn.q-mt-xs.text-bold.full-width(@click="onEdit(proposal)" flat text-color="white" no-caps rounded) {{ $t('pages.proposals.proposaldetail.editProposal') }}
            q-btn.q-mt-xs.text-bold.full-width(@click="onDelete(proposal)" flat text-color="white" no-caps rounded) {{ $t('pages.proposals.proposaldetail.deleteProposal') }}
          widget.bg-primary(v-else-if="proposalParsing.status(proposal) === PROPOSAL_STATE.DRAFTED && isCreator && state === 'PUBLISHING'")
            h2.h-h4.text-white.leading-normal.q-ma-none {{ $t('pages.proposals.proposaldetail.publishing') }}
            p.h-b2.q-mt-xl.text-disabled {{ $t('pages.proposals.proposaldetail.pleaseWait') }}
          widget.bg-primary(v-else-if="proposalParsing.status(proposal) === PROPOSAL_STATE.DRAFTED && isCreator && state === 'DELETING'")
            h2.h-h4.text-white.leading-normal.q-ma-none {{ $t('pages.proposals.proposaldetail.deleting') }}
            p.h-b2.q-mt-xl.text-disabled {{ $t('pages.proposals.proposaldetail.pleaseWait1') }}
          div(v-else-if="proposalParsing.status(proposal) !== PROPOSAL_STATE.DRAFTED")
            voting.q-mb-sm(
              v-if="$q.screen.gt.md"
              @voting="onVoting"
              @on-apply="onApply(proposal)"
              @on-suspend="onSuspend(proposal)"
              @on-active="onActive(proposal)"
              @change-prop="modifyData"
              @on-withdraw="onWithDraw(proposal)"
              :activeButtons="isMember"
            )
            voter-list.q-my-md(:proposalId="docId")
        widget.full-width(:style="{ 'margin-top': '-40px'}" v-if="isBadge && proposalParsing.status(proposal) !== PROPOSAL_STATE.DRAFTED" :title="$t('pages.proposals.proposaldetail.badgeHolders')")
          template(v-if="paginatedHolders?.length")
            template(v-for="holderName in paginatedHolders")
              profile-picture.q-my-xxxl(:username="holderName" show-name size="40px" limit link)
            q-btn.bg-primary.q-mt-xs.text-bold.full-width(:disable="currentElectionIndex !== 0 && (this.proposal.details_title_s === 'Voter' || this.proposal.details_title_s === 'Delegate')" @click="onApply(proposal)" flat text-color="white" no-caps rounded) {{ $t('pages.proposals.proposaldetail.apply') }}
            .row.justify-between.q-pt-sm.items-center
              q-btn.round-circle(@click="onPrev()" :disable="page === 1" round unelevated icon="fas fa-chevron-left" color="inherit" text-color="primary" size="sm" :ripple="false")
              span {{  getPaginationText }}
              q-btn.round-circle(@click="onNext()" :disable="isLastPage" round unelevated icon="fas fa-chevron-right" color="inherit" text-color="primary" size="sm" :ripple="false")
          template(v-else)
            .q-mt-md {{ $t('pages.proposals.proposaldetail.thereAreNo') }}
      .bottom-rounded.shadow-up-7.fixed-bottom.z-top(v-if="$q.screen.lt.lg")
        voting(v-if="proposalParsing.status(proposal) !== PROPOSAL_STATE.DRAFTED && !hideVoting" :proposal="proposal" :title="null" fixed @voting="onVoting" @on-apply="onApply(proposal)" @on-suspend="onSuspend(proposal)" @on-active="onActive(proposal)" @change-prop="modifyData" @on-withdraw="onWithDraw(proposal)" :activeButtons="isMember")
.proposal-detail.full-width(v-else-if="$q.screen.gt.md")
  .row.justify-center.q-my-md(v-if="loading")
    loading-spinner(color="primary" size="72px")
  .row(v-else-if="proposal")
    .col-12.col-sm-9
      proposal-item.bottom-no-rounded(
        :clickable="ownAssignment"
        :expandable="true"
        :moons="true"
        :owner="true"
        :proposal="proposal"
        @change-deferred="(val) => $emit('change-deferred', val)"
        @claim-all="$emit('claim-all')"
        background="white"
        v-if="ownAssignment"
      )
      .separator-container(v-if="ownAssignment")
        q-separator(color="grey-3" inset)
      proposal-view(:proposal="optimisticProposal ? optimisticProposal : proposal" :ownAssignment="ownAssignment" :class="{'top-no-rounded': ownAssignment}" :withToggle="toggle(proposal)" :created="proposalParsing.created(proposal)" :restrictions="proposalParsing.restrictions(proposal)" :status="proposalParsing.status(proposal)" :docId="proposalParsing.docId(proposal)" :creator="proposalParsing.creator(proposal)" :capacity="proposalParsing.capacity(proposal)" :deferred="proposalParsing.deferred(proposal)" :description="proposalParsing.description(proposal)" :periodCount="proposalParsing.periodCount(proposal)" :salary="proposalParsing.salary(proposal)" :start="proposalParsing.start(proposal)" :subtitle="!ownAssignment ? proposalParsing.subtitle(proposal) : undefined" :title="!ownAssignment ? proposalParsing.title(proposal) : undefined" :type="proposal?.__typename === 'Suspend' ? proposal.suspend[0].__typename : proposal?.__typename" :url="proposalParsing.url(proposal)" :icon="proposalParsing.icon(proposal)" :commit="proposalParsing.commit(optimisticProposal ? optimisticProposal : proposal)" :compensation="proposalParsing.compensation(optimisticProposal ? optimisticProposal : proposal, daoSettings)" :tokens="proposalParsing.tokens(optimisticProposal ? optimisticProposal : proposal, periodsOnCycle, daoSettings, isDefaultBadgeMultiplier)" :isBadge="isBadge" :pastQuorum="proposalParsing.pastQuorum(proposal)" :pastUnity="proposalParsing.pastUnity(proposal)" :purpose="proposalParsing.purpose(proposal)" :votingMethod="proposalParsing.votingMethod(proposal)" :parentCircle="proposalParsing.parentCircle(proposal)" @change-deferred="onDeferredUpdate" @change-commit="onCommitUpdate")
      comments-widget(v-if="!isBadge" :comments="comments" :disable="expired" @create="createComment" @update="updateComment" @delete="deleteComment" @like="likeComment" @unlike="unlikeComment" @load-comment="fetchComment")
    .col-12.col-sm-3(:class="{ 'q-pl-md': $q.screen.gt.sm }")
      widget.q-mb-md.position-relative(v-if="proposalParsing.status(proposal) === PROPOSAL_STATE.APPROVED && proposal?.__typename === PROPOSAL_TYPE.QUEST_START && !claimPayments?.length" :title="$t('pages.proposals.proposaldetail.questCompletion')")
        .text-ellipsis.text-body.q-my-xl {{ $t('pages.proposals.proposaldetail.didYouFinish') }}
        q-btn.full-width.q-mt-xl.q-px-lg(rounded color="primary" no-caps @click="onQuestPayout") {{ $t('pages.proposals.proposaldetail.claimYourPayment') }}
      widget.bg-primary(v-if="proposalParsing.status(proposal) === PROPOSAL_STATE.DRAFTED && isCreator && state === 'WAITING'")
        h2.h-h4.text-white.leading-normal.q-ma-none {{ $t('pages.proposals.proposaldetail.yourProposalIs1') }}
        p.h-b2.q-mt-xl.text-disabled {{ $t('pages.proposals.proposaldetail.thatMeansYour1') }}
        q-btn.q-mt-xl.text-primary.text-bold.full-width(@click="onPublish(proposal)" color="white" text-color="primary" no-caps rounded) {{ $t('pages.proposals.proposaldetail.publish1') }}
        q-btn.q-mt-xs.text-bold.full-width(@click="onEdit(proposal)" flat text-color="white" no-caps rounded) {{ $t('pages.proposals.proposaldetail.editProposal1') }}
        q-btn.q-mt-xs.text-bold.full-width(@click="onDelete(proposal)" flat text-color="white" no-caps rounded) {{ $t('pages.proposals.proposaldetail.deleteProposal1') }}
      widget.bg-primary(v-else-if="proposalParsing.status(proposal) === PROPOSAL_STATE.DRAFTED && isCreator && state === 'PUBLISHING'")
        h2.h-h4.text-white.leading-normal.q-ma-none {{ $t('pages.proposals.proposaldetail.publishing1') }}
        p.h-b2.q-mt-xl.text-disabled {{ $t('pages.proposals.proposaldetail.pleaseWait2') }}
      widget.bg-primary(v-else-if="proposalParsing.status(proposal) === PROPOSAL_STATE.DRAFTED && isCreator && state === 'DELETING'")
        h2.h-h4.text-white.leading-normal.q-ma-none {{ $t('pages.proposals.proposaldetail.deleting1') }}
        p.h-b2.q-mt-xl.text-disabled {{ $t('pages.proposals.proposaldetail.pleaseWait3') }}
      div(v-else-if="(proposalParsing.status(proposal) !== PROPOSAL_STATE.DRAFTED) && !hideVoting")
        voting.q-mb-sm(
          :activeButtons="isMember"
          :isCreator="isCreator"
          :proposal="proposal"
          @change-prop="modifyData"
          @on-active="onActive(proposal)"
          @on-apply="onApply(proposal)"
          @on-edit="onEdit(proposal)"
          @on-suspend="onSuspend(proposal)"
          @on-withdraw="onWithDraw(proposal)"
          @voting="onVoting"
          v-if="$q.screen.gt.sm"
        )
        voter-list.q-my-md(:proposalId="docId")
      widget(v-if="isBadge && proposalParsing.status(proposal) !== PROPOSAL_STATE.DRAFTED" :title="$t('pages.proposals.proposaldetail.badgeHolders1')")
        template(v-if="paginatedHolders?.length")
          template(v-for="holder in paginatedHolders")
            profile-picture.q-my-xxxl(:username="holder.details_assignee_n" show-name size="40px" limit link)
          q-btn.bg-primary.q-mt-xs.text-bold.full-width(:disable="currentElectionIndex !== 0 && (this.proposal.details_title_s === 'Voter' || this.proposal.details_title_s === 'Delegate')" @click="onApply(proposal)" flat text-color="white" no-caps rounded) {{ $t('pages.proposals.proposaldetail.apply1') }}
          .row.justify-between.q-pt-sm.items-center
            q-btn.round-circle(@click="onPrev()" :disable="page === 1" round unelevated icon="fas fa-chevron-left" color="inherit" text-color="primary" size="sm" :ripple="false")
            span {{  getPaginationText }}
            q-btn.round-circle(@click="onNext()" :disable="isLastPage" round unelevated icon="fas fa-chevron-right" color="inherit" text-color="primary" size="sm" :ripple="false")
        template(v-else)
          .q-mt-md {{ $t('pages.proposals.proposaldetail.thereAreNo1') }}
  .bottom-rounded.shadow-up-7.fixed-bottom(v-if="$q.screen.lt.md")
    voting(:proposal="proposal" :title="null" fixed)

</template>

<style lang="stylus" scoped>
.bottom-rounded
  border-top-left-radius 26px
  border-top-right-radius 26px
.bottom-no-rounded
  border-bottom-left-radius 0 !important
  border-bottom-right-radius 0 !important
.top-no-rounded
  border-top-left-radius 0 !important
  border-top-right-radius 0 !important
.separator-container
  background-color white
</style>
