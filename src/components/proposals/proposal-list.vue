<script>
/**
 * A view containing a set of proposals
 */
export default {
  name: 'proposal-list',
  components: {
    ProposalCard: () => import('~/components/proposals/proposal-card')
  },

  props: {
    /**
     * An array of the proposals to display
     */
    proposals: {
      type: Array,
      default: () => []
    },
    /**
     * The total vote supply, needed to calculate the voting results
     */
    supply: Number,
    /**
     * The user to display the voted of on the proposal
     */
    username: String,
    /**
     * Whether the card is a list style or card style
     */
    view: String
  },

  methods: {
    subtitle (proposal) {
      if (proposal) {
        if (proposal.__typename === 'Assignment') {
          return proposal.role[0].details_title_s
        } else if (proposal.__typename === 'Edit') {
          if (proposal.original && proposal.original[0].role) {
            return proposal.original[0].role[0].details_title_s
          }
        } else {
          return null
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

    vote (proposal) {
      if (proposal.vote && proposal.vote.length) {
        const vote = proposal.vote.find(v => v.vote_voter_n === this.username)
        if (vote) {
          if (vote.vote_vote_s === 'pass') {
            return {
              color: 'positive',
              icon: 'far fa-thumbs-up',
              vote: 'pass'
            }
          } else if (vote.vote_vote_s === 'fail') {
            return {
              color: 'negative',
              icon: 'far fa-thumbs-down',
              vote: 'fail'
            }
          } else if (vote.vote_vote_s === 'abstain') {
            return {
              color: 'body',
              icon: 'fas fa-ban',
              vote: 'abstain'
            }
          }
        }
      }

      return null
    },

    voting (proposal) {
      if (proposal && proposal.votetally && proposal.votetally.length) {
        const passCount = parseFloat(proposal.pass.count)
        const failCount = parseFloat(proposal.fail.count)
        const abstain = parseFloat(proposal.votetally[0].abstain_votePower_a)
        const pass = parseFloat(proposal.votetally[0].pass_votePower_a)
        const fail = parseFloat(proposal.votetally[0].fail_votePower_a)
        const unity = (passCount + failCount > 0) ? passCount / (passCount + failCount) : 0
        let supply = this.supply
        if (proposal.details_ballotSupply_a) {
          const [amount] = proposal.details_ballotSupply_a.split(' ')
          supply = parseFloat(amount)
        }
        const quorum = supply > 0 ? (abstain + pass + fail) / supply : 0
        return {
          unity,
          quorum
        }
      }
      return {
        unity: 0,
        quorum: 0
      }
    }
  }
}
</script>

<template lang="pug">
.proposal-list.row
  .template(v-for="p in proposals" :class="(view === 'card') ? 'col-4' : 'col-12'")
    proposal-card(
      :subtitle="subtitle(p)"
      :title="title(p)"
      :docId="p.docId"
      :proposer="p.creator"
      :type="p.__typename"
      :expiration="p.ballot_expiration_t"
      :view="view"
      :voting="voting(p)"
      :vote="vote(p)"
      :key="p.hash"
      :compensation="p.details_voiceAmount_a"
      :salary="p.details_annualUsdSalary_a"
    )
</template>
