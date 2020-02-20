<script>
import { mapActions, mapGetters } from 'vuex'
import AssignmentCard from '../assignments/components/assignment-card'
import ProposalCard from '../proposals/components/proposal-card'

export default {
  name: 'dashboard-authenticated',
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
div
  .row
    .col-xs-12.col-md-10
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
    .col-xs-12.col-md-2
      q-card(v-if="account")
        q-card-section.text-center.bg-primary.text-white.q-mb-lg
          .text-h6 Tokens held
        q-card-section.text-right
          | {{ tokens.hypha }} #[strong HYPHA]
        q-card-section.text-right
          | {{ tokens.hvoice }} #[strong HVOICE]
        q-card-section.text-right
          | {{ tokens.seeds }} #[strong SEEDS]
        q-card-section.text-right
          | {{ tokens.lockedSeeds }} #[strong SEEDS] (escrow)
  .row.q-col-gutter-xl.q-mt-sm
    .col-xs-12.col-sm-6.col-md-4
      .item(@click="$router.push({ path: '/proposals/role' })")
        .row.flex.q-col-gutter-xl
          .col-6.column.flex
            .text-h6 Vote on Proposals
            p Review current proposals and decide which ones you like to endorse. New proposals are are open for voting for a period of 2 weeks.
          .col-6
            q-card
              .ribbon
                span.text-white.bg-proposal PROPOSING
              q-card-section.text-center.q-pb-sm
                img.icon(src="~assets/icons/roles.svg")
              q-card-section
                .type Roles
              q-card-actions.q-pa-lg(align="center")
                q-btn(label="Endorse" color="proposal" rounded dense unelevated)
    .col-xs-12.col-sm-6.col-md-4
      .item(@click="$router.push({ path: '/roles' })")
        .row.flex.q-col-gutter-xl
          .col-6.column.flex
            .text-h6 Enroll Applicants
            p Review current applicants and decide which ones you like to endorse. New applications are are open for enrollment for a period of 2 weeks.
          .col-6
            q-card
              .ribbon
                span.text-white.bg-hire APPLYING
              q-card-section.text-center.q-pb-sm
                img.icon(src="~assets/icons/roles.svg")
              q-card-section
                .type Roles
              q-card-actions.q-pa-lg(align="center")
                q-btn(label="Enroll" color="hire" rounded dense unelevated)
    .col-xs-12.col-sm-6.col-md-4
      .item(@click="$router.push({ path: '/roles' })")
        .row.flex.q-col-gutter-xl
          .col-6.column.flex
            .text-h6 Apply for a Role
            p Review open roles and decide if you want to apply (you can always commit to a partial role). Once you are enrolled, claim your salary at the end of a lunar cycle.
          .col-6
            q-card
              .ribbon
                span.text-white.bg-hire NOW  HIRING
              q-card-section.text-center.q-pb-sm
                img.icon(src="~assets/icons/roles.svg")
              q-card-section
                .type Roles
              q-card-actions.q-pa-lg(align="center")
                q-btn(label="Apply" color="hire" rounded dense unelevated)
    .col-xs-12.col-sm-6.col-md-4
      .item
        .row.flex.q-col-gutter-xl
          .col-6.column.flex
            .text-h6 Claim your Salary
            p Claim your salary at the end of a lunar cycle and receive payouts in Seeds, HVoice, Hypha and HUSD.
          .col-6
            q-card
              .ribbon
                span.text-white.bg-assignment NOW PAYING
              q-card-section.text-center.q-pb-sm
                img.icon(src="~assets/icons/assignments.svg")
              q-card-section
                .type Assignments
              q-card-actions.q-pa-lg(align="center")
                q-btn(label="Claim" color="assignment" rounded dense unelevated)
</template>

<style lang="stylus" scoped>
.item
  cursor pointer
  width 100%
  max-width 450px
  background rgba(255, 255, 255, 0.4)
  padding 25px
  border-radius 25px
  .q-card
    border-radius 1rem
  button
    width 70%
.type
  color $grey-7
  cursor pointer
  text-transform capitalize
  text-align center
  font-weight bolder
  font-size 22px
.icon
  margin-top 20px
  width 100%
  max-width 60px

</style>
