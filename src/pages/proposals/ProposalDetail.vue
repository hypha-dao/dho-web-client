<script>
import { mapActions, mapGetters } from 'vuex'
import CONFIG from './create/config.json'
import { calcVoicePercentage } from '~/utils/eosio'

export default {
  name: 'proposal-detail',
  components: {
    ProposalView: () => import('~/components/proposals/proposal-view.vue'),
    VoterList: () => import('~/components/proposals/voter-list.vue'),
    Voting: () => import('~/components/proposals/voting.vue'),
    ProposalItem: () => import('~/components/profiles/proposal-item.vue')
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
      votes: []
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
    ...mapGetters('dao', ['selectedDao']),
    ownAssignment () {
      return this.proposal.__typename === 'Assignment' &&
        this.proposal.details_assignee_n === this.account &&
        this.proposal.details_state_s !== 'proposed'
    },
    voteSize () {
      if (this.proposal && this.proposal.voteAggregate) {
        return this.proposal.voteAggregate.count || 0
      }
      return 0
    },
    restrictions () {
      return this.proposal.details_maxPeriodCount_i || '0'
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
    ...mapActions('profiles', ['getVoiceToken']),
    ...mapActions('treasury', { getTreasurySupply: 'getSupply' }),

    // TODO: Move this code somewhere shared
    capacity (proposal) {
      if (proposal) {
        if (proposal.__typename === 'Role') {
          // TODO: Is this gone?
          return 0
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
            min: proposal.role[0].details_minDeferredX100_i,
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
          const [amountP] = proposal.details_pegAmount_a?.split(' ') || [0]
          const [amountUsd] = proposal.details_voiceAmount_a?.split(' ') || [0]
          const pegAmount = amountP ? parseFloat(amountP) : 0
          const usdAmount = amountUsd ? parseFloat(amountUsd) : 0

          const value = (pegAmount === 0 && usdAmount === 0) ? Math.floor(1 / 0.01) : Math.floor((1 - (pegAmount / usdAmount)) / 0.01)

          return {
            value: value,
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
          return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        }
        if (proposal.__typename === 'Assignment') {
          if (!proposal.start) return null
          if (proposal.start.length > 0) {
            const date = proposal.start[0].details_startTime_t
            return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
          }
          return null
        }
        if (proposal.__typename === 'Assignbadge') {
          if (!proposal.start) return null
          if (proposal.start.length > 0) {
            const date = proposal.start[0].details_startTime_t
            return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
          }
          return null
        }
      }
      return null
    },

    subtitle (proposal) {
      if (proposal.__typename === 'Suspend') proposal = proposal.suspend[0]
      if (proposal.__typename === 'Assignment') {
        return proposal.role[0].details_title_s
      }
      return null
    },

    tags (proposal) {
      if (proposal) {
        const tags = []
        if (proposal.details_state_s === 'rejected') tags.push({ color: 'grey-4', label: 'Archived', text: 'grey' })
        if (proposal.details_state_s === 'suspended') tags.push({ color: 'negative', label: 'Suspended', text: 'white' })
        if (proposal.details_state_s === 'withdrawed') tags.push({ color: 'negative', label: 'Withdrawn', text: 'white' })

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
          if (proposal.details_state_s === 'approved') {
            return [
              { color: 'primary', label: 'Role Archetype' },
              { color: 'positive', label: 'Active' }
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
              { color: 'primary', label: 'Badge' },
              { color: 'warning', label: 'Suspension' }
            ]
          }
          if (proposal.details_state_s === 'approved') {
            return [
              { color: 'primary', label: 'Badge' },
              { color: 'positive', label: 'Active' }
            ]
          }
          return [
            { color: 'primary', label: 'Badge' },
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
        if (proposal.__typename === 'Payout') {
          return [
            {
              label: 'Peg',
              icon: 'husd.svg',
              value: parseFloat(proposal.details_pegAmount_a)
            },
            {
              label: 'Reward',
              icon: 'hypha.svg',
              value: parseFloat(proposal.details_rewardAmount_a)
            },
            {
              label: 'Voice',
              icon: 'hvoice.svg',
              value: parseFloat(proposal.details_voiceAmount_a)
            }
          ]
        }
        if (proposal.__typename === 'Assignment') {
          return [
            {
              label: 'Peg',
              icon: 'husd.svg',
              value: parseFloat(proposal.details_pegSalaryPerPeriod_a)
            },
            {
              label: 'Reward',
              icon: 'hypha.svg',
              value: parseFloat(proposal.details_rewardSalaryPerPeriod_a)
            },
            {
              label: 'Voice',
              icon: 'hvoice.svg',
              value: parseFloat(proposal.details_voiceSalaryPerPeriod_a)
            }
          ]
        }
        if (proposal.__typename === 'Edit' && proposal.original) {
          return [
            {
              label: 'Peg',
              icon: 'husd.svg',
              value: parseFloat(proposal.original[0].details_pegSalaryPerPeriod_a)
            },
            {
              label: 'Reward',
              icon: 'hypha.svg',
              value: parseFloat(proposal.original[0].details_rewardSalaryPerPeriod_a)
            },
            {
              label: 'Voice',
              icon: 'hvoice.svg',
              value: parseFloat(proposal.original[0].details_voiceSalaryPerPeriod_a)
            }
          ]
        }
        if (proposal.__typename === 'Badge') {
          return [
            {
              label: `Peg Coefficient (${this.$store.state.dao.settings.pegToken})`,
              icon: 'husd.svg',
              symbol: this.$store.state.dao.settings.pegToken,
              value: parseFloat(proposal.details_pegCoefficientX10000_i),
              coefficient: true,
              coefficientPercentage: parseFloat(proposal.details_pegCoefficientX10000_i)
            },
            {
              label: `Reward Coefficient (${this.$store.state.dao.settings.rewardToken})`,
              icon: 'husd.svg',
              symbol: this.$store.state.dao.settings.rewardToken,
              value: parseFloat(proposal.details_rewardCoefficientX10000_i),
              coefficient: true,
              coefficientPercentage: parseFloat(proposal.details_rewardCoefficientX10000_i)
            },
            {
              label: `Voice Coefficient (${this.$store.state.dao.settings.voiceToken})`,
              icon: 'husd.svg',
              symbol: this.$store.state.dao.settings.voiceToken,
              value: parseFloat(proposal.details_voiceCoefficientX10000_i),
              coefficient: true,
              coefficientPercentage: parseFloat(proposal.details_voiceCoefficientX10000_i)
            }
          ]
        }
        if (proposal.__typename === 'Role') {
          const [amount] = proposal.details_annualUsdSalary_a.split(' ')
          const usdAmount = amount ? parseFloat(amount) : 0
          const deferred = parseFloat(proposal.details_minDeferredX100_i || 0)
          return [
            {
              label: 'Peg',
              icon: 'husd.svg',
              value: (usdAmount * (1 - deferred * 0.01))
            },
            {
              label: 'Reward',
              icon: 'hypha.svg',
              value: (usdAmount * deferred * 0.01 / this.$store.state.dao.settings.rewardToPegRatio)
            },
            {
              label: 'Voice',
              icon: 'hvoice.svg',
              value: usdAmount
            }
          ]
        }
        if (proposal.__typename === 'Suspend') {
          const tempProposal = proposal.suspend[0]
          if (tempProposal.__typename === 'Role') {
            const [amount] = tempProposal.details_annualUsdSalary_a.split(' ')
            const usdAmount = amount ? parseFloat(amount) : 0
            const deferred = parseFloat(proposal.details_minDeferredX100_i || 0)
            return [
              {
                label: 'Peg',
                icon: 'husd.svg',
                value: (usdAmount * (1 - deferred * 0.01))
              },
              {
                label: 'Reward',
                icon: 'hypha.svg',
                value: (usdAmount * deferred * 0.01 / this.$store.state.dao.settings.rewardToPegRatio)
              },
              {
                label: 'Voice',
                icon: 'hvoice.svg',
                value: usdAmount
              }
            ]
          }
        }
      }
      return null
    },

    voting (proposal) {
      if (proposal) {
        const passCount = parseFloat(proposal.pass.count)
        const failCount = parseFloat(proposal.fail.count)
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
          status: proposal.details_state_s,
          type: proposal.__typename,
          active: proposal.creator === this.account,
          pastQuorum: proposal?.details_ballotQuorum_i,
          pastUnity: proposal?.details_ballotAlignment_i
        }
      }

      return null
    },

    async loadVotes (votes) {
      if (votes && Array.isArray(votes) && votes.length) {
        const result = []
        for (const vote of votes) {
          let votePercentage
          if (this.proposal && this.proposal.details_ballotSupply_a) {
            const [supplyAmount, token] = this.proposal.details_ballotSupply_a.split(' ')
            const percentage = calcVoicePercentage(vote.vote_votePower_a.split(' ')[0], supplyAmount)
            votePercentage = `${percentage}% ${token}`
          } else {
            votePercentage = await this.loadVoiceTokenPercentage(vote.vote_voter_n, vote.vote_votePower_a.split(' ')[0])
          }
          result.push({
            date: vote.vote_date_t,
            username: vote.vote_voter_n,
            vote: vote.vote_vote_s,
            strength: vote.vote_votePower_a,
            percentage: votePercentage
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
        this.$store.commit('proposals/setRewardCoefficientLabel', (proposal.details_rewardCoefficientX10000_i - 10000) / 100)
        this.$store.commit('proposals/setRewardCoefficient', proposal.details_rewardCoefficientX10000_i)
        this.$store.commit('proposals/setVoiceCoefficientLabel', (proposal.details_voiceCoefficientX10000_i - 10000) / 100)
        this.$store.commit('proposals/setVoiceCoefficient', proposal.details_voiceCoefficientX10000_i)
        this.$store.commit('proposals/setPegCoefficientLabel', (proposal.details_pegCoefficientX10000_i - 10000) / 100)
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
      await this.activeProposal(proposal.docId)
      setTimeout(() => {
        this.$apollo.queries.proposal.refetch()
        this.$apollo.queries.votesList.refetch()
      }, 2000)
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
    async loadVoiceTokenPercentage (username, voice) {
      const voiceToken = await this.getVoiceToken(username)
      const supplyTokens = await this.getTreasurySupply()

      const supplyHVoice = parseFloat(supplyTokens[voiceToken.token])
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
      )
      .separator-container(v-if="ownAssignment")
        q-separator(color="grey-3" inset)
      proposal-view(
        :class="{'top-no-rounded': ownAssignment}"
        :creator="proposal.creator"
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
      )
    .col-12.col-md-3(:class="{ 'q-pl-md': $q.screen.gt.sm }")
      voting.q-mb-sm(v-if="$q.screen.gt.sm" v-bind="voting(proposal)" @voting="onVoting" @on-apply="onApply(proposal)" @on-suspend="onSuspend(proposal)" @on-active="onActive(proposal)" @change-prop="modifyData" @on-withdraw="onWithDraw(proposal)" :activeButtons="isMember")
      voter-list.q-my-md(:votes="votes" @onload="onLoad" :size="voteSize")
  .bottom-rounded.shadow-up-7.fixed-bottom(v-if="$q.screen.lt.md")
    voting(v-bind="voting(proposal)" :title="null" fixed)
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
