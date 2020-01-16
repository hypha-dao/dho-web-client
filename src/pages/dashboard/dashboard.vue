<script>
import { mapActions, mapGetters } from 'vuex'
import AssignmentCard from '../assignments/components/assignment-card'
import ProposalCard from '../proposals/components/proposal-card'

export default {
  name: 'dashboard',
  components: { AssignmentCard, ProposalCard },
  data () {
    return {
      tokens: {
        hvoice: 0,
        hypha: 0,
        seeds: 0
      },
      userAssignments: [],
      userProposals: [],
      roles: []
    }
  },
  computed: {
    ...mapGetters('accounts', ['account'])
  },
  methods: {
    ...mapActions('profiles', ['getTokensAmounts']),
    ...mapActions('assignments', ['getUserAssignments']),
    ...mapActions('proposals', ['getUserProposals']),
    async loadTokens () {
      this.tokens = await this.getTokensAmounts(this.account)
    },
    async loadUserAssignments () {
      this.userAssignments = await this.getUserAssignments(this.account)
    },
    async loadUserProposals () {
      this.userProposals = await this.getUserProposals(this.account)
    }
  },
  watch: {
    account: {
      immediate: true,
      handler: function () {
        this.loadTokens()
        this.loadUserAssignments()
        this.loadUserProposals()
      }
    }
  }
}
</script>

<template lang="pug">
q-page.q-pa-lg
  .row
    .col-10
      .text-h6 My active assignments
      .row(v-if="userAssignments.length")
        assignment-card(
          v-for="assignment in userAssignments"
          :key="assignment.assignment_id"
          :assignment="assignment"
          :readonly="true"
        )
      div(v-else) You don't have any active assignments. Check the Roles tab if you are interested in applying for one.
      .text-h6 My open applications
      .row(v-if="userProposals.length")
        proposal-card(
          v-for="proposal in userProposals"
          :key="proposal.proposal_id"
          :proposal="proposal"
        )
      div(v-else) You don't have any open applications, you can submit some in the proposals page.
    .col-2
      q-card(v-if="account")
        q-card-section.text-center.bg-primary.text-white.q-mb-lg
          .text-h6 Tokens held
        q-card-section.text-right
          | {{ tokens.hypha }} #[strong HYPHA]
        q-card-section.text-right
          | {{ tokens.hvoice }} #[strong HVOICE]
        q-card-section.text-right
          | {{ tokens.seeds }} #[strong SEEDS]
</template>

<style lang="sass" scoped>

</style>
