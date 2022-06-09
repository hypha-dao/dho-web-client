import { mapGetters } from 'vuex'
import * as proposalParsing from '~/utils/proposal-parsing'

const PERIOD_NAMES = ['First Quarter', 'Full Moon', 'New Moon', 'Last Quarter']
export const proposals = {
  props: {
    proposal: undefined
  },
  computed: {
    ...mapGetters('dao', ['votingPercentages', 'daoSettings']),
    ...mapGetters('ballots', ['supply']),
    ...mapGetters('accounts', ['account']),
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
    parseContribution (data) {
      return {
        owner: this.account,
        created: new Date(data.createdDate),
        recipient: this.creator,
        title: this.title,
        state: this.status,
        docId: this.docId,
        compensation: this.compensation
      }
    },
    async parseAssignment (data) {
      const { start, end, periods } = await this.getPeriods(data)
      let deferred = { value: 0, min: 0, max: 0 }
      let commit = { value: 0, min: 0, max: 0 }
      if ((data.details_state_s === 'approved' || data.details_state_s === 'archived') && data.details_periodCount_i) {
        // Add the assignment
        commit = { value: 0, min: 0, max: data.details_timeShareX100_i }
        if (data.lastimeshare?.[0]) {
          commit.value = data.lastimeshare[0].details_timeShareX100_i
        }
        deferred = {
          value: data.details_deferredPercX100_i,
          min: data.details_approvedDeferredPercX100_i || data.details_deferredPercX100_i,
          max: 100
        }
      }

      return {
        state: this.status,
        owner: this.account,
        docId: this.docId,
        start,
        end: end,
        active: start < Date.now() && end > Date.now(),
        past: end < Date.now(),
        future: start > Date.now(),
        periods,
        extend: this.getExtendObject(end),
        title: this.title,
        description: data.details_description_s,
        commit,
        deferred,
        salary: data.role[0].details_annualUsdSalary_a,

        // Needed for 'extend' functionality
        minDeferred: data.role[0].details_minDeferredX100_i,
        roleTitle: data.role[0].details_title_s,
        url: undefined
      }
    },
    async parseAssignbadge (data) {
      const { start, end, periods } = await this.getPeriods(data)

      return {
        title: data.details_title_s || data.badge[0].details_title_s,
        // badgeTitle: data.badge[0].details_title_s,
        created: new Date(data.createdDate),
        description: data.details_description_s,
        state: this.status,
        owner: this.account,
        start,
        end: end,
        active: start < Date.now() && end > Date.now(),
        past: end < Date.now(),
        future: start > Date.now(),
        periods,
        extend: this.getExtendObject(end)
      }
    },

    async getPeriods (data) {
      let periodCount = 0
      let periodResponse = []
      let periods = []
      let start
      let end
      if ((data.details_state_s === 'approved' || data.details_state_s === 'archived') && data.details_periodCount_i) {
        periodCount = data.details_periodCount_i
        periodResponse = await this.$apollo.query({
          query: require('~/query/periods/dao-periods-range.gql'),
          variables: {
            daoId: this.selectedDao.docId,
            min: data.start[0]?.details_startTime_t,
            max: data.start[0] && new Date(new Date(data.start[0]?.details_startTime_t).getTime() +
              (data.details_periodCount_i * this.daoSettings.periodDurationSec * 1000)).toISOString()
          }
        })
        this.firstPeriod = periodResponse.data.getDao.period[0]
        periodResponse = periodResponse.data.getDao.period.map((value, index) => {
          return {
            docId: value.docId,
            label: value.details_startTime_t,
            phase: value.details_label_s,
            startDate: value.details_startTime_t,
            endDate: new Date(value.details_startTime_t).getTime() + this.daoSettings.periodDurationSec * 1000
          }
        })
        // Calculate start and end time for all periods
        start = new Date(periodResponse[0].startDate)

        // Add the periods
        periods = []
        for (let i = 0; i < periodCount; i += 1) {
          const claimed = data.claimed
            ? data.claimed.some(c => c.docId === periodResponse[i].docId)
            : false
          periods.push({
            start: new Date(periodResponse[i].startDate),
            end: new Date(periodResponse[i].endDate),
            title: PERIOD_NAMES.includes(periodResponse[i].phase)
              ? periodResponse[i].phase
              : 'First Quarter',
            claimed: claimed,
            claimable: new Date(periodResponse[i].endDate) < Date.now() && !claimed
          })
        }
        end = periods[periods.length - 1].end
      }
      return { start, end, periods }
    },

    getExtendObject (endDate) {
      // To ensure no disruption in assignment, an extension must be
      // created more than 1 voting period before it expires
      const VOTE_DURATION = this.daoSettings.votingDurationSec * 1000
      const PERIOD_DURATION = this.daoSettings.periodDurationSec * 1000
      return {
        start: new Date(endDate - 3 * PERIOD_DURATION),
        end: new Date(endDate - (VOTE_DURATION * 1))
      }
    }
  }
}
