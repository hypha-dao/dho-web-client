<script>
import { mapActions, mapGetters } from 'vuex'
import CONFIG from './create/config.json'
import { calcVoicePercentage } from '~/utils/eosio'

export default {
  name: 'proposal-detail',
  components: {
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
      pagination: {
        first: 5,
        offset: 0,
        more: true
      },
      votes: [],
      coefficientBase: 10000,
      supplyTokens: undefined,
      cycleDurationSec: 2629800
    }
  },

  apollo: {
    proposal: {
      query: require('../../query/proposals/dao-proposal-detail.gql'),
      update: data => data.getDocument,
      variables () {
        return {
          docId: this.docId,
          first: 0,
          offset: 0
        }
      },
      fetchPolicy: 'no-cache'
    },
    votesList: {
      query: require('../../query/proposals/dao-proposal-detail.gql'),
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
      }
    }
  },

  computed: {
    // TODO: This needs to be updated:
    // Get global root settings document and get the item 'governance_token_contract'
    // Then search for the actual dao voice token (found in the dao settings document)
    ...mapGetters('ballots', ['supply']),
    ...mapGetters('accounts', ['account', 'isMember']),
    ...mapGetters('dao', ['selectedDao', 'daoSettings']),
    ...mapGetters('dao', ['votingPercentages']),
    ownAssignment () {
      return this.proposal.__typename === 'Assignment' &&
        this.proposal.details_assignee_n === this.account &&
        this.status !== 'proposed' &&
        this.status !== 'rejected'
    },
    voteSize () {
      if (this.proposal && this.proposal.voteAggregate) {
        return this.proposal.voteAggregate.count || 0
      }
      return 0
    },
    restrictions () {
      return this.proposal.details_maxCycles_i || this.proposal.details_maxPeriodCount_i || '0'
    },

    status () { return this.proposal.details_state_s },

    voting () {
      const proposal = this.proposal
      if (proposal) {
        const passCount = proposal.pass ? parseFloat(proposal.pass.count) : 0
        const failCount = proposal.fail ? parseFloat(proposal.fail.count) : 0
        let abstain = 0, pass = 0, fail = 0
        if (Array.isArray(proposal.votetally) && proposal.votetally.length) {
          abstain = parseFloat(proposal.votetally[0].abstain_votePower_a)
          pass = parseFloat(proposal.votetally[0].pass_votePower_a)
          fail = parseFloat(proposal.votetally[0].fail_votePower_a)
        }
        const unity = (passCount + failCount > 0) ? passCount / (passCount + failCount) : 0
        let supply = this.supply
        if (proposal.details_ballotSupply_a) {
          const [amount] = proposal.details_ballotSupply_a.split(' ')
          supply = parseFloat(amount)
        }
        const quorum = supply > 0 ? (abstain + pass + fail) / supply : 0
        const { vote } = this.votes.find(v => v.username === this.account) || { vote: null }
        return {
          docId: proposal.docId,
          unity,
          quorum,
          expiration: proposal.ballot_expiration_t,
          vote,
          status: this.status,
          type: proposal.__typename,
          active: proposal.creator === this.account,
          pastQuorum: proposal?.details_ballotQuorum_i,
          pastUnity: proposal?.details_ballotAlignment_i
        }
      }

      return null
    },
    periodsOnCycle () {
      return (this.cycleDurationSec / this.daoSettings.periodDurationSec).toFixed(2)
    }
  },

  async created () {
    if (!this.supply) {
      this.getSupply()
    }
    this.votes = await this.loadVotes(this.votesList)
  },
  watch: {
    async votesList () {
      this.votes = await this.loadVotes(this.votesList)
    },
    selectedDao () {
      this.getSupply()
    }
  },

  methods: {
    ...mapActions('ballots', ['getSupply']),
    ...mapActions('proposals', ['saveDraft', 'suspendProposal', 'activeProposal', 'withdrawProposal']),
    ...mapActions('proposals', ['publishProposal', 'deleteProposal', 'saveDraft', 'suspendProposal', 'activeProposal', 'withdrawProposal']),
    ...mapActions('profiles', ['getVoiceToken']),
    ...mapActions('treasury', { getTreasurySupply: 'getSupply' }),

    // TODO: Move this code somewhere shared
    capacity (proposal) {
      if (proposal) {
        if (proposal.__typename === 'Role') {
          // TODO: Is this gone?
          return proposal.details_fulltimeCapacityX100_i
        }
        if (proposal.__typename === 'Suspend') {
          const tempProposal = proposal.suspend[0]
          if (tempProposal.__typename === 'Role') {
            return 0
          }
        }
      }
    },

    deferred (proposal) {
      if (proposal) {
        if (proposal.__typename === 'Suspend') proposal = proposal.suspend[0]
        if (proposal.__typename === 'Assignment') {
          return {
            value: proposal.details_deferredPercX100_i,
            min: proposal.details_approvedDeferredPercX100_i,
            max: 100
          }
        }
        if (proposal.__typename === 'Edit') {
          return {
            value: proposal.details_deferredPercX100_i,
            min: proposal.original[0].role[0].details_minDeferredX100_i,
            max: 100
          }
        }
        if (proposal.__typename === 'Role') {
          return {
            value: proposal.details_deferredPercX100_i,
            min: proposal.details_minDeferredX100_i,
            max: 100
          }
        }
        if (proposal.__typename === 'Payout') {
          if (proposal.details_isCustom_i) return

          return {
            value: proposal.details_deferredPercX100_i,
            max: 100
          }
        }
        if (proposal.__typename === 'Suspend') {
          const tempProposal = proposal.suspend[0]
          if (tempProposal.__typename === 'Role') {
            return {
              value: tempProposal.details_deferredPercX100_i,
              min: tempProposal.details_minDeferredX100_i,
              max: 100
            }
          }
        }
      }

      return null
    },

    description (proposal) {
      if (proposal) {
        if (proposal.__typename === 'Edit') {
          return proposal.details_ballotDescription_s
        }
        if (proposal.__typename === 'Suspend') {
          return proposal.suspend[0].details_description_s
        }
        return proposal.details_description_s
      }
      return null
    },

    periodCount (proposal) {
      if (proposal) {
        if (proposal.__typename === 'Suspend') proposal = proposal.suspend[0]
        if (proposal.__typename === 'Assignment' || proposal.__typename === 'Edit') {
          return proposal.details_periodCount_i
        }
        if (proposal.__typename === 'Assignbadge') {
          return proposal.details_periodCount_i
        }
      }
      return null
    },

    salary (proposal) {
      if (proposal) {
        if (proposal.__typename === 'Role') {
          return proposal.details_annualUsdSalary_a
        }
        if (proposal.__typename === 'Suspend') {
          const tempProposal = proposal.suspend[0]
          if (tempProposal.__typename === 'Role') {
            return tempProposal.details_annualUsdSalary_a
          }
        }
      }
      return null
    },

    start (proposal) {
      if (proposal) {
        if (proposal.__typename === 'Suspend') proposal = proposal.suspend[0]
        if (proposal.__typename === 'Edit' && proposal.original) {
          const date = proposal.original[0].start[0].details_startTime_t
          return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        }
        if (proposal.__typename === 'Assignment') {
          if (!proposal.start) return null
          if (proposal.start.length > 0) {
            const date = proposal.start[0].details_startTime_t
            return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
          }
          return null
        }
        if (proposal.__typename === 'Assignbadge') {
          if (!proposal.start) return null
          if (proposal.start.length > 0) {
            const date = proposal.start[0].details_startTime_t
            return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
          }
          return null
        }
      }
      return null
    },

    subtitle (proposal) {
      if (proposal.__typename === 'Suspend') proposal = proposal.suspend[0]
      if (proposal.__typename === 'Assignment' || proposal.__typename === 'Edit') {
        return proposal.role[0].details_title_s
      }
      return null
    },

    tags (proposal) {
      if (proposal) {
        const tags = []
        if (this.status === 'drafted') tags.push({ color: 'secondary', label: 'Staging', text: 'white' })
        if (this.status === 'rejected') tags.push({ color: 'grey-4', label: 'Archived', text: 'grey' })
        if (this.status === 'suspended') tags.push({ color: 'negative', label: 'Suspended', text: 'white' })
        if (this.status === 'withdrawed') tags.push({ color: 'negative', label: 'Withdrawn', text: 'white' })

        if (proposal.__typename === 'Payout') {
          return [
            { color: 'primary', label: 'Generic Contribution' },
            ...tags
          ]
        }

        if (proposal.__typename === 'Assignment' || proposal.__typename === 'Edit') {
          if (proposal.toSuspend) {
            return [
              { color: 'primary', label: 'Role Assignment' },
              { color: 'warning', label: 'Suspension' }
            ]
          }
          return [
            { color: 'primary', label: 'Role Assignment' },
            // { color: 'primary', outline: true, label: 'Circle One' },
            ...tags
          ]
        }

        if (proposal.__typename === 'Assignbadge') {
          if (proposal.toSuspend) {
            return [
              { color: 'primary', label: 'Badge Assignment' },
              { color: 'warning', label: 'Suspension' }
            ]
          }
          return [
            { color: 'primary', label: 'Badge Assignment' },
            // { color: 'primary', outline: true, label: 'Circle One' },
            ...tags
          ]
        }

        if (proposal.__typename === 'Suspend') {
          return [
            { color: 'warning', label: 'Suspension' },
            ...tags
          ]
        }

        if (proposal.__typename === 'Role') {
          if (proposal.toSuspend) {
            return [
              { color: 'primary', label: 'Role Archetype' },
              { color: 'warning', label: 'Suspension' }
            ]
          }
          if (status === 'approved') {
            return [
              { color: 'primary', label: 'Role Archetype' }
              // { color: 'positive', label: 'Active' }
            ]
          }
          return [
            { color: 'primary', label: 'Role Archetype' },
            ...tags
          ]
        }

        if (proposal.__typename === 'Badge') {
          if (proposal.toSuspend) {
            return [
              { color: 'primary', label: 'Badge Type' },
              { color: 'warning', label: 'Suspension' }
            ]
          }
          if (this.status === 'approved') {
            return [
              { color: 'primary', label: 'Badge Type' }
              // { color: 'positive', label: 'Active' }
            ]
          }
          return [
            { color: 'primary', label: 'Badge Type' },
            ...tags
          ]
        }
      }

      return null
    },

    title (proposal) {
      if (proposal) {
        if (proposal.__typename === 'Edit') {
          let extTitle = ''
          if (proposal.original) {
            extTitle = `: ${proposal.original[0].details_title_s}`
          }
          return `${proposal.details_ballotTitle_s}${extTitle}`
        }
        return proposal.details_title_s
      }
      return null
    },

    tokens (proposal) {
      if (proposal.__typename === 'Suspend') proposal = proposal.suspend[0]
      if (proposal.__typename === 'Assignbadge') proposal = proposal.badge[0]

      if (proposal) {
        let utilityValue = 0
        let cashValue = 0
        let voiceValue = 0
        if (proposal.__typename === 'Payout') {
          utilityValue = parseFloat(proposal.details_rewardAmount_a)
          cashValue = parseFloat(proposal.details_pegAmount_a)
          voiceValue = parseFloat(proposal.details_voiceAmount_a)
        }
        if (proposal.__typename === 'Assignment') {
          utilityValue = parseFloat(proposal.details_rewardSalaryPerPeriod_a) * this.periodsOnCycle
          cashValue = parseFloat(proposal.details_pegSalaryPerPeriod_a) * this.periodsOnCycle
          voiceValue = parseFloat(proposal.details_voiceSalaryPerPeriod_a) * this.periodsOnCycle
        }
        if (proposal.__typename === 'Edit' && proposal.original) {
          utilityValue = parseFloat(proposal.original[0].details_rewardSalaryPerPeriod_a)
          cashValue = parseFloat(proposal.original[0].details_pegSalaryPerPeriod_a)
          voiceValue = parseFloat(proposal.original[0].details_voiceSalaryPerPeriod_a)
        }
        if (proposal.__typename === 'Badge') {
          return [
            {
              // label: `Utility Token Multiplier (${this.$store.state.dao.settings.rewardToken})`,
              label: 'Utility Token Multiplier',
              type: 'utility',
              symbol: this.$store.state.dao.settings.rewardToken,
              value: parseFloat(proposal.details_rewardCoefficientX10000_i / this.coefficientBase),
              coefficient: true,
              coefficientPercentage: parseFloat(proposal.details_rewardCoefficientX10000_i / this.coefficientBase)
            },
            {
              label: 'Cash Token Multiplier',
              // label: `Cash Token Multiplier (${this.$store.state.dao.settings.pegToken})`,
              type: 'cash',
              symbol: this.$store.state.dao.settings.pegToken,
              value: parseFloat(proposal.details_pegCoefficientX10000_i / this.coefficientBase),
              coefficient: true,
              coefficientPercentage: parseFloat(proposal.details_pegCoefficientX10000_i / this.coefficientBase)
            },
            {
              // label: `Voice Token Multiplier (${this.$store.state.dao.settings.voiceToken})`,
              label: 'Voice Token Multiplier',
              type: 'voice',
              symbol: this.$store.state.dao.settings.voiceToken,
              value: parseFloat(proposal.details_voiceCoefficientX10000_i) / this.coefficientBase,
              coefficient: true,
              coefficientPercentage: parseFloat(proposal.details_voiceCoefficientX10000_i / this.coefficientBase)
            }
          ]
        }
        if (proposal.__typename === 'Role') {
          const [amount] = proposal.details_annualUsdSalary_a.split(' ')
          const usdAmount = amount ? parseFloat(amount) / 12 : 0
          const deferred = parseFloat(proposal.details_minDeferredX100_i || 0)
          utilityValue = (usdAmount * deferred * 0.01 / this.$store.state.dao.settings.rewardToPegRatio)
          cashValue = (usdAmount * (1 - deferred * 0.01))
          voiceValue = usdAmount
        }
        if (proposal.__typename === 'Suspend') {
          const tempProposal = proposal.suspend[0]
          if (tempProposal.__typename === 'Role') {
            const [amount] = tempProposal.details_annualUsdSalary_a.split(' ')
            const usdAmount = amount ? parseFloat(amount) / 12 : 0
            const deferred = parseFloat(proposal.details_minDeferredX100_i || 0)
            utilityValue = (usdAmount * deferred * 0.01 / this.$store.state.dao.settings.rewardToPegRatio)
            cashValue = (usdAmount * (1 - deferred * 0.01))
            voiceValue = usdAmount
          }
        }
        return [
          {
            label: `Utility Token (${this.$store.state.dao.settings.rewardToken})`,
            type: 'utility',
            value: utilityValue
          },
          {
            label: `Cash Token (${this.$store.state.dao.settings.pegToken})`,
            type: 'cash',
            value: cashValue
          },
          {
            label: 'Voice Token',
            type: 'voice',
            value: voiceValue
          }
        ]
      }
      return null
    },

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
        }
        votePercentages = await Promise.all(promises)
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
    icon (proposal) {
      if (proposal.__typename === 'Suspend') proposal = proposal.suspend[0]
      if (proposal.__typename === 'Assignbadge') return proposal.badge[0].details_icon_s
      return proposal.details_icon_s
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
            return data
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
        let salaryBucket
        if (salary <= 80000) salaryBucket = 'B1'
        if (salary > 80000 && salary <= 100000) salaryBucket = 'B2'
        if (salary > 100000 && salary <= 120000) salaryBucket = 'B3'
        if (salary > 120000 && salary <= 140000) salaryBucket = 'B4'
        if (salary > 140000 && salary <= 160000) salaryBucket = 'B5'
        if (salary > 160000 && salary <= 180000) salaryBucket = 'B6'
        if (salary > 180000) salaryBucket = 'B7'
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
        setTimeout(() => {
          this.$apollo.queries.proposal.refetch()
        }, 300)
      } catch (e) {
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
        this.$store.commit('proposals/setBadgeRestriction', this.proposal?.details_maxPeriodCount_i)
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
    creator (proposal) {
      if (proposal.__typename === 'Assignbadge' || proposal.__typename === 'Assignment') return proposal.details_assignee_n ?? proposal.creator
      if (proposal.__typename === 'Payout' || proposal.__typename === 'Role') return proposal.details_owner_n ?? proposal.creator
      if (proposal.__typename === 'Badge' && proposal.system_proposer_n) return proposal.system_proposer_n
      return proposal.creator
    },
    commit (proposal) {
      if (proposal.lastimeshare?.[0]?.details_timeShareX100_i !== undefined) {
        return {
          value: proposal.lastimeshare[0].details_timeShareX100_i,
          min: 0,
          max: proposal.details_timeShareX100_i
        }
      }
      if (proposal.details_timeShareX100_i) {
        return {
          value: proposal.details_timeShareX100_i
        }
      }
      return undefined
    },
    toggle (proposal) {
      return proposal.__typename === 'Assignment' || proposal.__typename === 'Role'
    }
  }
}
</script>

<template lang="pug">
.proposal-detail.full-width
  .row(v-if="$apollo.queries.proposal.loading") Loading...
  .row(v-else-if="proposal")
    .col-12.col-md-9
      proposal-item.bottom-no-rounded(
        v-if="ownAssignment"
        background="white"
        :proposal="proposal"
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
        :state="proposal.details_state_s"
        :ownAssignment="ownAssignment"
        :id="proposal.docId"
        :class="{'top-no-rounded': ownAssignment}"
        :creator="creator(proposal)"
        :capacity="capacity(proposal)"
        :deferred="deferred(proposal)"
        :description="description(proposal)"
        :periodCount="periodCount(proposal)"
        :salary="salary(proposal)"
        :start="start(proposal)"
        :subtitle="!ownAssignment ? subtitle(proposal) : undefined"
        :tags="!ownAssignment ? tags(proposal) : undefined"
        :title="!ownAssignment ? title(proposal) : undefined"
        :tokens="tokens(proposal)"
        :type="proposal.__typename === 'Suspend' ? proposal.suspend[0].__typename : proposal.__typename"
        :url="proposal.details_url_s"
        :icon="icon(proposal)"
        :restrictions="restrictions"
        :commit="commit(proposal)"
        :withToggle="toggle(proposal)"
      )
    .col-12.col-md-3(:class="{ 'q-pl-md': $q.screen.gt.sm }")
      widget.bg-primary(v-if="status === 'drafted'")
        h2.h-h4.text-white.leading-normal.q-ma-none Your proposal is on staging
        p.h-b2.q-mt-xl.text-disabled That means your proposal is not published to the blockchain yet. You can still make changes to it, when you feel ready click "Publish" and the voting period will start.
        q-btn.q-mt-xl.text-primary.text-bold.full-width( @click="onPublish(proposal)" color="white" text-color='primary' no-caps rounded) Publish
        q-btn.q-mt-xs.text-bold.full-width( @click="onEdit(proposal)" flat  text-color='white' no-caps rounded) Edit proposal

      div(v-else)
        voting.q-mb-sm(v-if="$q.screen.gt.sm" v-bind="voting" @voting="onVoting" @on-apply="onApply(proposal)" @on-suspend="onSuspend(proposal)" @on-active="onActive(proposal)" @change-prop="modifyData" @on-withdraw="onWithDraw(proposal)" :activeButtons="isMember")
        voter-list.q-my-md(:votes="votes" @onload="onLoad" :size="voteSize")
  .bottom-rounded.shadow-up-7.fixed-bottom(v-if="$q.screen.lt.md")
    voting(v-bind="voting" :title="null" fixed)
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
