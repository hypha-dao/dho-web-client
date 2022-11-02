import { mapGetters } from 'vuex'
import * as proposalParsing from '~/utils/proposal-parsing'

export const proposals = {
  props: {
    proposal: undefined
  },
  computed: {
    ...mapGetters('dao', ['votingPercentages', 'daoSettings', 'selectedDao']),
    ...mapGetters('ballots', ['supply']),
    ...mapGetters('accounts', ['account']),
    created () {
      return proposalParsing.created(this.proposal)
    },
    isOwnProposal () {
      return proposalParsing.creator(this.proposal) === this.account
    },
    restrictions () {
      return proposalParsing.restrictions(this.proposal)
    },
    url () {
      return proposalParsing.url(this.proposal)
    },
    docId () {
      return proposalParsing.docId(this.proposal)
    },
    expiration () {
      return proposalParsing.expiration(this.proposal)
    },
    pastQuorum () {
      return proposalParsing.pastQuorum(this.proposal)
    },
    pastUnity () {
      return proposalParsing.pastUnity(this.proposal)
    },
    quorum () {
      return proposalParsing.quorum(this.proposal, this.supply)
    },
    unity () {
      return proposalParsing.unity(this.proposal, this.supply)
    },
    icon () {
      return proposalParsing.icon(this.proposal)
    },
    isVotingExpired () {
      return proposalParsing.isVotingExpired(this.proposal)
    },
    isAccepted () {
      return proposalParsing.isAccepted(this.proposal, this.votingPercentages, this.supply)
    },
    isProposed () {
      return proposalParsing.isProposed(this.proposal)
    },
    canBeSuspended () {
      return proposalParsing.canBeSuspended(this.proposal, this.votingPercentages)
    },
    canBeApply () {
      return proposalParsing.canBeApply(this.proposal)
    },
    isSuspended () {
      return proposalParsing.isSuspended(this.proposal)
    },
    isArchived () {
      return proposalParsing.isArchived(this.proposal)
    },
    canBeWithdraw () {
      return proposalParsing.canBeWithdraw(this.proposal, this.account)
    },
    isApproved () {
      return proposalParsing.isApproved(this.proposal)
    },
    isWithdrawed () {
      return proposalParsing.isWithdrawed(this.proposal)
    },
    isRejected () {
      return proposalParsing.isRejected(this.proposal)
    },
    type () {
      return proposalParsing.type(this.proposal)
    },
    originalType () {
      return proposalParsing.type(this.proposal.original?.[0].__typename)
    },
    suspendType () {
      return proposalParsing.suspendType(this.proposal)
    },
    title () {
      return proposalParsing.title(this.proposal)
    },
    subtitle () {
      return proposalParsing.subtitle(this.proposal)
    },
    description () {
      return proposalParsing.description(this.proposal)
    },
    periodCount () {
      return proposalParsing.periodCount(this.proposal)
    },
    status () {
      return proposalParsing.status(this.proposal)
    },
    creator () {
      return proposalParsing.creator(this.proposal)
    },
    colorConfig () {
      return proposalParsing.colorConfig(this.proposal, this.votingPercentages, this.supply)
    },
    colorConfigQuorum () {
      return proposalParsing.colorConfigQuorum(this.proposal, this.votingPercentages, this.supply)
    },
    voteConfig () {
      return proposalParsing.voteConfig(this.proposal, this.account)
    },
    voting () {
      return proposalParsing.voting(this.proposal, this.supply)
    },
    salary () {
      return proposalParsing.salary(this.proposal)
    },
    compensation () {
      return proposalParsing.compensation(this.proposal, this.daoSettings)
    },
    capacity () {
      return proposalParsing.capacity(this.proposal)
    },
    deferred () {
      return proposalParsing.deferred(this.proposal)
    },
    commit () {
      return proposalParsing.commit(this.proposal)
    },
    start () {
      return proposalParsing.start(this.proposal)
    },
    tokens () {
      return proposalParsing.tokens(this.proposal, 1, this.daoSettings)
    }
  },
  methods: {
    votingTimeLeft () {
      return proposalParsing.votingTimeLeft(this.proposal)
    },
    timeLeftString (long = false) {
      return proposalParsing.timeLeftString(this.proposal, long)
    },
    async getPeriods () {
      return proposalParsing.getPeriods(this.proposal, this.selectedDao, this.daoSettings, this.$apollo)
    }
  }
}
