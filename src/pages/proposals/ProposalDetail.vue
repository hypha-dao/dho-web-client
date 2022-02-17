<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'proposal-detail',
  components: {
    ProposalView: () => import('~/components/proposals/proposal-view.vue'),
    VoterList: () => import('~/components/proposals/voter-list.vue'),
    Voting: () => import('~/components/proposals/voting.vue')
  },

  props: {
    docId: String
  },

  apollo: {
    proposal: {
      query: require('../../query/proposals/dao-proposal-detail.gql'),
      update: data => data.getDocument,
      variables () {
        return {
          docId: this.docId
        }
      }
    }
  },

  computed: {
    // TODO: This needs to be updated:
    // Get global root settings document and get the item 'governance_token_contract'
    // Then search for the actual dao voice token (found in the dao settings document)
    ...mapGetters('ballots', ['supply']),
    ...mapGetters('accounts', ['account'])
  },

  created () {
    if (!this.supply) {
      this.getSupply()
    }
  },

  methods: {
    ...mapActions('ballots', ['getSupply']),

    // TODO: Move this code somewhere shared
    capacity (proposal) {
      if (proposal) {
        if (proposal.__typename === 'Role') {
          // TODO: Is this gone?
          return 0
        }
      }
    },

    deferred (proposal) {
      if (proposal) {
        if (proposal.__typename === 'Assignment' || proposal.__typename === 'Edit') {
          return {
            value: proposal.details_deferredPercX100_i,
            min: proposal.role[0].details_minDeferredX100_i,
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
      }

      return null
    },

    description (proposal) {
      if (proposal) {
        if (proposal.__typename === 'Edit') {
          return proposal.details_ballotDescription_s
        }
        return proposal.details_description_s
      }
      return null
    },

    periodCount (proposal) {
      if (proposal) {
        if (proposal.__typename === 'Assignment' || proposal.__typename === 'Edit') {
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
      }
      return null
    },

    start (proposal) {
      if (proposal) {
        if (proposal.__typename === 'Edit' && proposal.original) {
          const date = proposal.original[0].details_startPeriod_c_edge.details_startTime_t
          return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        }
        if (proposal.__typename === 'Assignment') {
          const date = proposal.details_startPeriod_c_edge.details_startTime_t
          return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        }
      }
      return null
    },

    subtitle (proposal) {
      if (proposal.__typename === 'Assignment') {
        return proposal.role[0].details_title_s
      }
      return null
    },

    tags (proposal) {
      if (proposal) {
        if (proposal.__typename === 'Payout') {
          return [
            { color: 'primary', label: 'Generic Contribution' }
            // { color: 'primary', outline: true, label: 'Circle One' }
          ]
        }

        if (proposal.__typename === 'Assignment' || proposal.__typename === 'Edit') {
          return [
            { color: 'primary', label: 'Role Assignment' },
            { color: 'primary', outline: true, label: 'Circle One' }
          ]
        }

        if (proposal.__typename === 'Assignbadge') {
          return [
            { color: 'primary', label: 'Badge Assignment' },
            { color: 'primary', outline: true, label: 'Circle One' }
          ]
        }

        if (proposal.__typename === 'Suspend') {
          return [
            { color: 'primary', label: 'Suspension' }
          ]
        }

        if (proposal.__typename === 'Role') {
          return [
            { color: 'primary', label: 'Role Archetype' }
          ]
        }

        if (proposal.__typename === 'Badge') {
          return [
            { color: 'primary', label: 'Badge' }
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
      }
      return null
    },

    voting (proposal) {
      if (proposal && Array.isArray(proposal.votetally) && proposal.votetally.length) {
        const abstain = parseFloat(proposal.votetally[0].abstain_votePower_a)
        const pass = parseFloat(proposal.votetally[0].pass_votePower_a)
        const fail = parseFloat(proposal.votetally[0].fail_votePower_a)
        const unity = (pass + fail > 0) ? pass / (pass + fail) : 0
        const quorum = this.supply > 0 ? (abstain + pass + fail) / this.supply : 0
        const { vote } = this.votes(proposal).find(v => v.username === this.account) || { vote: null }

        return {
          hash: proposal.hash,
          unity,
          quorum,
          expiration: proposal.ballot_expiration_t,
          vote
        }
      }

      return null
    },

    votes (proposal) {
      if (proposal && Array.isArray(proposal.vote) && proposal.vote.length) {
        const result = []
        proposal.vote.forEach((vote) => {
          result.push({
            date: vote.vote_date_t,
            username: vote.vote_voter_n,
            vote: vote.vote_vote_s,
            strength: vote.vote_votePower_a
          })
        })

        return result
      }

      return []
    },
    onVoting () {
      setTimeout(() => {
        this.$apollo.queries.proposal.refetch()
      }, 1000)
    },
    icon (proposal) {
      console.log(proposal)
      return proposal.details_icon_s
    }
  }
}
</script>

<template lang="pug">
.proposal-detail.full-width
  .row(v-if="$apollo.loading") Loading...
  .row(v-else-if="proposal")
    .col-12.col-md-8(:class="{ 'q-pr-sm': $q.screen.gt.sm }")
      proposal-view(
        :creator="proposal.creator"
        :capacity="capacity(proposal)"
        :deferred="deferred(proposal)"
        :description="description(proposal)"
        :periodCount="periodCount(proposal)"
        :salary="salary(proposal)"
        :start="start(proposal)"
        :subtitle="subtitle(proposal)"
        :tags="tags(proposal)"
        :title="title(proposal)"
        :tokens="tokens(proposal)"
        :type="proposal.__typename"
        :url="proposal.details_url_s"
        :icon="icon(proposal)"
      )
    .col-12.col-md-4(:class="{ 'q-pl-sm': $q.screen.gt.sm }")
      voting.q-mb-sm(v-if="$q.screen.gt.sm" v-bind="voting(proposal)" @voting="onVoting")
      voter-list.q-my-md(:votes="votes(proposal)")
  .bottom-rounded.shadow-up-7.fixed-bottom(v-if="$q.screen.lt.md")
    voting(v-bind="voting(proposal)" :title="null" fixed)
</template>

<style lang="stylus" scoped>
.bottom-rounded
  border-top-left-radius 26px
  border-top-right-radius 26px
</style>
