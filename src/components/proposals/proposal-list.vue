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
      if (proposal.__typename === 'Assignment') {
        return proposal.role[0].details_title_s
      }
      return null
    },

    voting (proposal) {
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
  }
}
</script>

<template lang="pug">
.proposal-list.row.q-gutter-md
  template(v-for="p in proposals")
    proposal-card(
      :subtitle="subtitle(p)"
      :title="p.details_title_s"
      :hash="p.hash"
      :proposer="p.creator"
      :type="p.__typename"
      :expiration="p.ballot_expiration_t"
      :view="view"
      :voting="voting(p)"
    )
</template>
