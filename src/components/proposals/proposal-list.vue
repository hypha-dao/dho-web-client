<script>
export default {
  name: 'proposal-list',
  components: {
    ProposalCard: () => import('~/components/proposals/proposal-card')
  },

  props: {
    proposals: {
      type: Array,
      default: () => []
    },
    supply: Number,
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

    voting (proposal) {
      if (proposal && proposal.votetally && proposal.votetally.length) {
        const abstain = parseFloat(proposal.votetally[0].abstain_votePower_a)
        const pass = parseFloat(proposal.votetally[0].pass_votePower_a)
        const fail = parseFloat(proposal.votetally[0].fail_votePower_a)
        const unity = (pass + fail > 0) ? pass / (pass + fail) : 0
        const quorum = this.supply > 0 ? (abstain + pass + fail) / this.supply : 0
        return {
          vote: 'pass',
          unity,
          quorum
        }
      }
      return {
        vote: null,
        unity: 0,
        quorum: 0
      }
    }
  }
}
</script>

<template lang="pug">
.proposal-list.row.q-gutter-md
  template(v-for="p in proposals")
    proposal-card(
      :subtitle="subtitle(p)"
      :title="title(p)"
      :hash="p.hash"
      :proposer="p.creator"
      :type="p.__typename"
      :expiration="p.ballot_expiration_t"
      :view="view"
      :voting="voting(p)"
    )
</template>
