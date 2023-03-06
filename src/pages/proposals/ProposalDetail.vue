<script>
import { mapActions, mapGetters } from 'vuex'
import CONFIG from './create/config.json'
import { calcVoicePercentage } from '~/utils/eosio'
import { format } from '~/mixins/format'
import lodash from 'lodash'

// eslint-disable-next-line no-unused-vars
import * as proposalParsing from '~/utils/proposal-parsing'
export default {
  name: 'proposal-detail',
  mixins: [format],
  components: {
    CommentsWidget: () => import('~/components/proposals/comments-widget.vue'),
    ProposalItem: () => import('~/components/profiles/proposal-item.vue'),
    ProposalView: () => import('~/components/proposals/proposal-view.vue'),
    VoterList: () => import('~/components/proposals/voter-list.vue'),
    Voting: () => import('~/components/proposals/voting.vue'),
    Widget: () => import('~/components/common/widget.vue'),
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue'),
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue')
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
      page: 1
    }
  },

  apollo: {
    upvoteElectionQuery: {
      query: require('~/query/upvote-election-data.gql'),
      update: data => {
        return {
          currentRound: data.getDao.ongoingelct[0]?.currentround[0].details_type_s,
          nextRound: data.getDao.ongoingelct[0]?.currentround[0].nextround,
          upcomingElection: data.getDao.upcomingelct
        }
      },
      variables () {
        return {
          daoName: this.selectedDao.name
        }
      },
      result (data) {
        this.upvoteElectionData = {
          currentRound: data.data.getDao.ongoingelct[0]?.currentround[0].details_type_s,
          nextRound: data.data.getDao.ongoingelct[0]?.currentround[0].nextround,
          upcomingElection: data.data.getDao.upcomingelct
        }
      }
    },
    proposal: {
      query: require('~/query/proposals/dao-proposal-detail.gql'),
      update: data => data.getDocument,
      variables () {
        return {
          docId: this.docId,
          first: 0,
          offset: 0
        }
      },
      fetchPolicy: 'no-cache',
      subscribeToMore: {
        document: require('~/query/proposals/dao-proposal-detail-subs.gql'),
        variables () {
          return {
            docId: this.docId
          }
        },
        skip () { return !this.docId },
        updateQuery: (previousResult, { subscriptionData }) => {
          if (!subscriptionData.data) {
            return previousResult
          }
          if (!previousResult) {
            return undefined
          }
          // Here, return the new result from the previous with the new data
          return {
            ...previousResult,
            ...subscriptionData
          }
        }
      },
      result (data) {
        if ((data.data.getDocument.dao[0].details_daoName_n !== this.selectedDao.name) && !this.isBadge) {
          this.$router.push({ name: '404-not-found' })
        }
      }
    },
    votesList: {
      query: require('~/query/proposals/dao-proposal-detail.gql'),
      update (data) {
        if (!data.getDocument.vote) {
          this.pagination.more = false
          return []
        }
        if (data.getDocument.vote.length < this.pagination.first) this.pagination.more = false
        return data.getDocument.vote
      },
      variables () {
        return {
          docId: this.docId,
          first: this.pagination.first,
          offset: 0
        }
      },
      fetchPolicy: 'no-cache'

    }
  },

  computed: {
    // TODO: This needs to be updated:
    // Get global root settings document and get the item 'governance_token_contract'
    // Then search for the actual dao voice token (found in the dao settings document)
    ...mapGetters('accounts', ['account', 'isMember']),
    ...mapGetters('ballots', ['supply']),
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
      return (this.proposal.__typename === 'Assignment' || this.proposal.__typename === 'Assignbadge') &&
        this.proposal.details_assignee_n === this.account &&
        proposalParsing.status(this.proposal) !== 'proposed' &&
        proposalParsing.status(this.proposal) !== 'rejected' &&
        proposalParsing.status(this.proposal) !== 'drafted'
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

    isBadge () { return this.proposal.__typename === 'Badge' },

    badgeHolders () {
      const uniqueHolders = lodash.uniqBy(this.proposal.assignment, 'details_assignee_n')
      return uniqueHolders.filter(holder => holder.dao[0].details_daoName_n === this.selectedDao.name)
    },

    hideVoting () {
      return this.isBadge && proposalParsing.status(this.proposal) === 'approved'
    },

    pages () {
      return Math.ceil(this.badgeHolders.length / 3)
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
    }
  },

  async created () {
    if (!this.supply) {
      this.getSupply()
    }
    this.votes = await this.loadVotes(this.votesList)
  },

  watch: {
    proposal () {
      this.proposal.cmntsect[0]?.comment.forEach(comment => {
        this.$set(this.commentByIds, comment.id, comment)
        if (this.rootCommentIds.includes(comment.id)) return
        this.rootCommentIds.push(comment.id)
      })
      this.optimisticProposal = JSON.parse(JSON.stringify(this.proposal))
    },

    state: {
      handler: function (state) {
        if (state === 'PUBLISHING') {
          const pull = setInterval(() => {
            if (this.proposal.details_state_s !== 'drafted') {
              this.state = 'PUBLISHED'
              clearInterval(pull)
            }

            this.$apollo.queries.proposal.refetch()
          }, 2000)
        }
      },
      deep: true,
      immediate: true
    },

    async votesList () {
      this.votes = await this.loadVotes(this.votesList)
    },
    selectedDao () {
      this.getSupply()
    }
  },

  methods: {
    ...mapActions('ballots', ['getSupply']),
    ...mapActions('profiles', ['getVoiceToken']),
    ...mapActions('proposals', ['activeProposal', 'createProposalComment', 'updateProposalComment', 'deleteProposalComment', 'reactProposalComment', 'unreactProposalComment', 'deleteProposal', 'publishProposal', 'saveDraft', 'suspendProposal', 'withdrawProposal']),
    ...mapActions('treasury', { getTreasurySupply: 'getSupply' }),

    async loadVotes (votes) {
      if (votes && Array.isArray(votes) && votes.length) {
        const promises = []
        const result = []
        let votePercentages = []
        this.supplyTokens = await this.getTreasurySupply()
        if (this.proposal && this.proposal.details_ballotSupply_a) {
          for (const vote of votes) {
            const [supplyAmount, token] = this.proposal.details_ballotSupply_a.split(' ')
            const percentage = calcVoicePercentage(vote.vote_votePower_a.split(' ')[0], supplyAmount)
            votePercentages.push(`${percentage}% ${token}`)
          }
        } else {
          for (const vote of votes) {
            promises.push(this.loadVoiceTokenPercentage(vote.vote_voter_n, vote.vote_votePower_a.split(' ')[0]))
          }
          votePercentages = await Promise.all(promises)
        }
        for (const [i, vote] of votes.entries()) {
          result.push({
            date: vote.vote_date_t,
            username: vote.vote_voter_n,
            vote: vote.vote_vote_s,
            strength: vote.vote_votePower_a,
            percentage: votePercentages[i]
          })
        }

        return result
      }

      return []
    },
    onVoting () {
      setTimeout(() => {
        this.$apollo.queries.proposal.refetch()
        this.$apollo.queries.votesList.refetch()
      }, 1000)
    },
    onLoad () {
      if (this.pagination.more && this.votes.length < this.voteSize) {
        this.pagination.offset += this.pagination.first
        this.$apollo.queries.votesList.fetchMore({
          variables: {
            docId: this.docId,
            first: this.pagination.first,
            offset: this.pagination.offset
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (fetchMoreResult.getDocument.vote.length === 0) {
              this.pagination.more = false
              return previousResult
            }
            const data = {
              getDocument: {
                ...previousResult.getDocument,
                vote: [
                  ...previousResult.getDocument.vote,
                  ...fetchMoreResult.getDocument.vote
                ]
              }
            }
            this.votesList = data.getDocument.vote
          }
        })
      }
    },
    onApply (proposal) {
      if (proposal.__typename === 'Badge') {
        proposal.type = 'Badge'
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
        this.$store.commit('proposals/setPastSteps', ['step-proposal-type', 'step-description'])
        const draftId = Date.now()
        this.$store.commit('proposals/setDraftId', draftId)
        this.saveDraft()
        this.$router.push({ name: 'proposal-create', params: { draftId } })
      }
      if (proposal.__typename === 'Role') {
        proposal.type = 'Role'
        // this.$store.commit('proposals/setNext', true)
        this.$store.commit('proposals/setType', CONFIG.options.recurring.options.assignment.type)
        this.$store.commit('proposals/setCategory', { key: CONFIG.options.recurring.options.assignment.key, title: CONFIG.options.recurring.options.assignment.title })
        const salary = parseFloat(proposal.details_annualUsdSalary_a)
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
        setTimeout(() => {
          this.$apollo.queries.proposal.refetch()
          this.$apollo.queries.votesList.refetch()
        }, 2000)
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
        setTimeout(() => {
          this.$apollo.queries.proposal.refetch()
          this.$apollo.queries.votesList.refetch()
        }, 2000)
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
        Badge: { key: 'obadge', title: 'Badge Definition' }
      }[this.proposal.__typename]

      this.$store.commit('proposals/setStepIndex', 1)
      this.$store.commit('proposals/setCategory', category)
      this.$store.commit('proposals/setType', this.proposal.__typename)

      this.$store.commit('proposals/setState', this.proposal?.details_state_s)
      this.$store.commit('proposals/setProposalId', this.proposal?.docId)

      this.$store.commit('proposals/setTitle', this.proposal?.details_title_s)
      this.$store.commit('proposals/setDescription', this.proposal?.details_description_s)

      // console.table(
      //   JSON.parse(JSON.stringify(this?.proposal))
      // )
      this.$store.commit('proposals/setUsdAmount', parseFloat(this?.proposal?.details_usdAmount_a))
      this.$store.commit('proposals/setCommitment', parseFloat(this?.proposal?.details_timeShareX100_i))
      this.$store.commit('proposals/setDeferred', parseFloat(this?.proposal?.details_deferredPercX100_i))

      if (this.proposal.__typename === 'Payout') {
        this.$store.commit('proposals/setUrl', this.proposal?.details_url_s)
      }

      if (this.proposal.__typename === 'Assignment') { // Role Assignment
        this.$store.commit('proposals/setRole', {
          ...this.proposal?.role[0],
          minCommitment: this.proposal?.role[0].details_minTimeShareX100_i,
          minDeferred: this.proposal?.role[0].details_minDeferredX100_i
        })
        this.$store.commit('proposals/setStartPeriod', this.proposal?.start[0])
        this.$store.commit('proposals/setPeriodCount', this.proposal?.details_periodCount_i)
        this.$store.commit('proposals/setAnnualUsdSalary', parseInt(this.proposal?.role[0]?.details_annualUsdSalary_a.split(' ').shift()))
        // this.$store.commit('proposals/setMinDeferred', this.proposal?.role[0]?.details_minDeferredX100_i)
      }

      if (this.proposal.__typename === 'Assignbadge') { // Badge Assignment
        this.$store.commit('proposals/setBadge', this?.proposal.badge)
        this.$store.commit('proposals/setStartPeriod', this.proposal?.start[0])
        this.$store.commit('proposals/setPeriodCount', this.proposal?.details_periodCount_i)
      }

      if (this.proposal.__typename === 'Role') {
        this.$store.commit('proposals/setAnnualUsdSalary', parseInt(this.proposal?.details_annualUsdSalary_a.split(' ').shift()))
        this.$store.commit('proposals/setRoleCapacity', this.proposal?.details_fulltimeCapacityX100_i)
        this.$store.commit('proposals/setMinDeferred', this.proposal?.details_minDeferredX100_i)
      }

      if (this.proposal.__typename === 'Badge') {
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

    async loadVoiceTokenPercentage (username, voice) {
      const voiceToken = await this.getVoiceToken(username)
      const supplyHVoice = parseFloat(this.supplyTokens[voiceToken.token])
      let percentage
      if (parseFloat(voiceToken.amount) === parseFloat(voice)) {
        percentage = supplyHVoice ? calcVoicePercentage(parseFloat(voiceToken.amount), supplyHVoice) : '0.0'
      } else {
        percentage = supplyHVoice ? calcVoicePercentage(parseFloat(voice), supplyHVoice) : '0.0'
      }

      return `${percentage}% ${voiceToken.token}`
    },
    async modifyData (changeToSuspension) {
      this.proposal.toSuspend = changeToSuspension
      await this.$forceUpdate()
    },
    toggle (proposal) {
      return proposal.__typename === 'Assignment' || proposal.__typename === 'Role' || (proposal.__typename === 'Edit' && proposal.original?.[0].role)
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

        setTimeout(() => {
          this.$apollo.queries.proposal.refetch()
        }, 700)
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
        setTimeout(() => {
          this.$apollo.queries.proposal.refetch()
        }, 700)
      } catch (e) {
        const message = e.message || e.cause.message
        this.showNotification({ message, color: 'red' })
      }
    },

    async likeComment (commentId) {
      try {
        await this.reactProposalComment({ commentId, reaction: 'liked' })
        setTimeout(() => {
          this.$apollo.queries.proposal.refetch()
        }, 700)
      } catch (e) {
        const message = e.message || e.cause.message
        this.showNotification({ message, color: 'red' })
      }
    },
    async unlikeComment (commentId) {
      try {
        await this.unreactProposalComment({ commentId })
        setTimeout(() => {
          this.$apollo.queries.proposal.refetch()
        }, 700)
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
    .h-h6.text-bold.flex.items-center(:style="'margin: 0 auto;'") Proposal details
    q-btn(unelevated rounded padding="12px" icon="fas fa-times"  size="sm" :color="'white'" text-color="'primary'" :to="{ name: 'proposals'}")
    q-card.main-card(:style="'border-radius: 25px; box-shadow: none; margin-top: 15px; width: 100%; margin-bottom: 300px;'")
      div(v-if="loading" class="row justify-center q-my-md")
        loading-spinner(color="primary" size="72px")
      .row(v-else-if="proposal")
        .col-12.col-lg-9
          proposal-item.bottom-no-rounded(
            v-if="ownAssignment"
            background="white"
            :proposal="proposal"
            :clickable="ownAssignment"
            :expandable="true"
            :owner="true"
            :moons="true"
            @claim-all="$emit('claim-all')"
            @change-deferred="(val) => $emit('change-deferred', val)"
            :selectedDao="selectedDao"
            :daoSettings="daoSettings"
            :supply="supply"
            :votingPercentages="votingPercentages"
          )
          .separator-container(v-if="ownAssignment")
            q-separator(color="grey-3" inset)
          proposal-view(
            :proposal="optimisticProposal"
            :ownAssignment="ownAssignment"
            :class="{'top-no-rounded': ownAssignment}"
            :withToggle="toggle(proposal)"

            :created="proposalParsing.created(proposal)"
            :restrictions="proposalParsing.restrictions(proposal)"
            :status="proposalParsing.status(proposal)"
            :docId="proposalParsing.docId(proposal)"
            :creator="proposalParsing.creator(proposal)"
            :capacity="proposalParsing.capacity(proposal)"
            :deferred="proposalParsing.deferred(proposal)"
            :description="proposalParsing.description(proposal)"
            :periodCount="proposalParsing.periodCount(proposal)"
            :salary="proposalParsing.salary(proposal)"
            :start="proposalParsing.start(proposal)"
            :subtitle="!ownAssignment ? proposalParsing.subtitle(proposal) : undefined"
            :title="!ownAssignment ? proposalParsing.title(proposal) : undefined"
            :type="proposal.__typename === 'Suspend' ? proposal.suspend[0].__typename : proposal.__typename"
            :url="proposalParsing.url(proposal)"
            :icon="proposalParsing.icon(proposal)"
            :commit="proposalParsing.commit(optimisticProposal)"
            :compensation="proposalParsing.compensation(optimisticProposal, daoSettings)"
            :tokens="proposalParsing.tokens(optimisticProposal, periodsOnCycle, daoSettings, isDefaultBadgeMultiplier)"
            :isBadge="isBadge"
            :pastQuorum="proposalParsing.pastQuorum(proposal)"
            :pastUnity="proposalParsing.pastUnity(proposal)"
            @change-deferred="onDeferredUpdate"
            @change-commit="onCommitUpdate"
          )
          comments-widget(
            v-if="!isBadge"
            :comments="comments"
            :disable="expired"
            @create="createComment"
            @update="updateComment"
            @delete="deleteComment"
            @like="likeComment"
            @unlike="unlikeComment"
            @load-comment="fetchComment"
          )
        .col-12.col-lg-3(v-if="!isBadge" :class="{ 'q-pl-md': $q.screen.gt.md }")
          widget.bg-primary(v-if="proposalParsing.status(proposal) === 'drafted' && isCreator && state === 'WAITING'")
            h2.h-h4.text-white.leading-normal.q-ma-none Your proposal is on staging
            p.h-b2.q-mt-xl.text-disabled That means your proposal is not published to the blockchain yet. You can still make changes to it, when you feel ready click "Publish" and the voting period will start.
            q-btn.q-mt-xl.text-primary.text-bold.full-width( @click="onPublish(proposal)" color="white" text-color='primary' no-caps rounded) Publish
            q-btn.q-mt-xs.text-bold.full-width( @click="onEdit(proposal)" flat  text-color='white' no-caps rounded) Edit proposal
            q-btn.q-mt-xs.text-bold.full-width( @click="onDelete(proposal)" flat  text-color='white' no-caps rounded) Delete proposal

          widget.bg-primary(v-else-if="proposalParsing.status(proposal) === 'drafted' && isCreator && state === 'PUBLISHING'")
            h2.h-h4.text-white.leading-normal.q-ma-none Publishing
            p.h-b2.q-mt-xl.text-disabled ...Please wait...

          widget.bg-primary(v-else-if="proposalParsing.status(proposal) === 'drafted' && isCreator && state === 'DELETING'")
            h2.h-h4.text-white.leading-normal.q-ma-none Deleting
            p.h-b2.q-mt-xl.text-disabled ...Please wait...
          div(v-else-if="proposalParsing.status(proposal) !== 'drafted'")
            voting.q-mb-sm(v-if="$q.screen.gt.md" @voting="onVoting" @on-apply="onApply(proposal)" @on-suspend="onSuspend(proposal)" @on-active="onActive(proposal)" @change-prop="modifyData" @on-withdraw="onWithDraw(proposal)" :activeButtons="isMember")
            voter-list.q-my-md(:votes="votes" @onload="onLoad" :size="voteSize")
        widget.full-width(:style="{ 'margin-top': '-40px'}" v-if="isBadge && proposalParsing.status(proposal) !== 'drafted'" title="Badge holders")
          template(v-if="paginatedHolders.length")
            template(v-for="holderName in paginatedHolders")
              profile-picture.q-my-xxxl(:username="holderName" show-name size="40px" limit link)
            q-btn.bg-primary.q-mt-xs.text-bold.full-width(:disable="currentElectionIndex !== 0 && (this.proposal.details_title_s === 'Voter' || this.proposal.details_title_s === 'Delegate')" @click="onApply(proposal)" flat text-color='white' no-caps rounded) Apply
            .row.justify-between.q-pt-sm.items-center
              q-btn(@click="onPrev()" :disable="page === 1" round unelevated class="round-circle" icon="fas fa-chevron-left" color="inherit" text-color="primary" size="sm" :ripple="false")
              span {{  getPaginationText }}
              q-btn(@click="onNext()" :disable="isLastPage" round unelevated class="round-circle" icon="fas fa-chevron-right" color="inherit" text-color="primary" size="sm" :ripple="false")
          template(v-else)
            .q-mt-md There are no holders yet
      .bottom-rounded.shadow-up-7.fixed-bottom.z-top(v-if="$q.screen.lt.lg")
        voting(v-if="proposalParsing.status(proposal) !== 'drafted' && !hideVoting" :proposal="proposal" :title="null" fixed @voting="onVoting" @on-apply="onApply(proposal)" @on-suspend="onSuspend(proposal)" @on-active="onActive(proposal)" @change-prop="modifyData" @on-withdraw="onWithDraw(proposal)" :activeButtons="isMember")
.proposal-detail.full-width(v-else-if="$q.screen.gt.md")
  div(v-if="loading" class="row justify-center q-my-md")
    loading-spinner(color="primary" size="72px")
  .row(v-else-if="proposal")
    .col-12.col-sm-9
      proposal-item.bottom-no-rounded(
        v-if="ownAssignment"
        background="white"
        :proposal="proposal"
        :clickable="ownAssignment"
        :expandable="true"
        :owner="true"
        :moons="true"
        @claim-all="$emit('claim-all')"
        @change-deferred="(val) => $emit('change-deferred', val)"
        :selectedDao="selectedDao"
        :daoSettings="daoSettings"
        :supply="supply"
        :votingPercentages="votingPercentages"
      )
      .separator-container(v-if="ownAssignment")
        q-separator(color="grey-3" inset)
      proposal-view(
        :proposal="optimisticProposal"
        :ownAssignment="ownAssignment"
        :class="{'top-no-rounded': ownAssignment}"
        :withToggle="toggle(proposal)"

        :created="proposalParsing.created(proposal)"
        :restrictions="proposalParsing.restrictions(proposal)"
        :status="proposalParsing.status(proposal)"
        :docId="proposalParsing.docId(proposal)"
        :creator="proposalParsing.creator(proposal)"
        :capacity="proposalParsing.capacity(proposal)"
        :deferred="proposalParsing.deferred(proposal)"
        :description="proposalParsing.description(proposal)"
        :periodCount="proposalParsing.periodCount(proposal)"
        :salary="proposalParsing.salary(proposal)"
        :start="proposalParsing.start(proposal)"
        :subtitle="!ownAssignment ? proposalParsing.subtitle(proposal) : undefined"
        :title="!ownAssignment ? proposalParsing.title(proposal) : undefined"
        :type="proposal.__typename === 'Suspend' ? proposal.suspend[0].__typename : proposal.__typename"
        :url="proposalParsing.url(proposal)"
        :icon="proposalParsing.icon(proposal)"
        :commit="proposalParsing.commit(optimisticProposal)"
        :compensation="proposalParsing.compensation(optimisticProposal, daoSettings)"
        :tokens="proposalParsing.tokens(optimisticProposal, periodsOnCycle, daoSettings, isDefaultBadgeMultiplier)"
        :isBadge="isBadge"
        :pastQuorum="proposalParsing.pastQuorum(proposal)"
        :pastUnity="proposalParsing.pastUnity(proposal)"
        :purpose="proposalParsing.purpose(proposal)"
        @change-deferred="onDeferredUpdate"
        @change-commit="onCommitUpdate"
      )
      comments-widget(
        v-if="!isBadge"
        :comments="comments"
        :disable="expired"
        @create="createComment"
        @update="updateComment"
        @delete="deleteComment"
        @like="likeComment"
        @unlike="unlikeComment"
        @load-comment="fetchComment"
      )
    .col-12.col-sm-3(:class="{ 'q-pl-md': $q.screen.gt.sm }")
      widget.bg-primary(v-if="proposalParsing.status(proposal) === 'drafted' && isCreator && state === 'WAITING'")
        h2.h-h4.text-white.leading-normal.q-ma-none Your proposal is on staging
        p.h-b2.q-mt-xl.text-disabled That means your proposal is not published to the blockchain yet. You can still make changes to it, when you feel ready click "Publish" and the voting period will start.
        q-btn.q-mt-xl.text-primary.text-bold.full-width( @click="onPublish(proposal)" color="white" text-color='primary' no-caps rounded) Publish
        q-btn.q-mt-xs.text-bold.full-width( @click="onEdit(proposal)" flat  text-color='white' no-caps rounded) Edit proposal
        q-btn.q-mt-xs.text-bold.full-width( @click="onDelete(proposal)" flat  text-color='white' no-caps rounded) Delete proposal

      widget.bg-primary(v-else-if="proposalParsing.status(proposal) === 'drafted' && isCreator && state === 'PUBLISHING'")
        h2.h-h4.text-white.leading-normal.q-ma-none Publishing
        p.h-b2.q-mt-xl.text-disabled ...Please wait...

      widget.bg-primary(v-else-if="proposalParsing.status(proposal) === 'drafted' && isCreator && state === 'DELETING'")
        h2.h-h4.text-white.leading-normal.q-ma-none Deleting
        p.h-b2.q-mt-xl.text-disabled ...Please wait...
      div(v-else-if="(proposalParsing.status(proposal) !== 'drafted') && !hideVoting")
        voting.q-mb-sm(v-if="$q.screen.gt.sm" :proposal="proposal" :isCreator="isCreator" @on-edit="onEdit(proposal)" @voting="onVoting" @on-apply="onApply(proposal)" @on-suspend="onSuspend(proposal)" @on-active="onActive(proposal)" @change-prop="modifyData" @on-withdraw="onWithDraw(proposal)" :activeButtons="isMember")
        voter-list.q-my-md(:votes="votes" @onload="onLoad" :size="voteSize")
      widget(v-if="isBadge && proposalParsing.status(proposal) !== 'drafted'" title="Badge holders")
        template(v-if="paginatedHolders.length")
          template(v-for="holder in paginatedHolders")
            profile-picture.q-my-xxxl(:username="holder.details_assignee_n" show-name size="40px" limit link)
          q-btn.bg-primary.q-mt-xs.text-bold.full-width(:disable="currentElectionIndex !== 0 && (this.proposal.details_title_s === 'Voter' || this.proposal.details_title_s === 'Delegate')" @click="onApply(proposal)" flat text-color='white' no-caps rounded) Apply
          .row.justify-between.q-pt-sm.items-center
            q-btn(@click="onPrev()" :disable="page === 1" round unelevated class="round-circle" icon="fas fa-chevron-left" color="inherit" text-color="primary" size="sm" :ripple="false")
            span {{  getPaginationText }}
            q-btn(@click="onNext()" :disable="isLastPage" round unelevated class="round-circle" icon="fas fa-chevron-right" color="inherit" text-color="primary" size="sm" :ripple="false")
        template(v-else)
          .q-mt-md There are no holders yet
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
