<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'proposal-view',
  data () {
    return {
      loading: true,
      proposal: null,
      percentage: 'pending',
      fail: null,
      pass: null,
      votesOpened: false,
      canCloseProposal: false,
      voting: false
    }
  },
  async mounted () {
    this.proposal = await this.fetchProposal({ id: this.$route.params.id, isHistory: this.$route.params.scope === 'history' })
    if (!this.proposal) {
      this.loading = false
      return
    }
    const startPeriod = this.proposal.ints.find(o => o.key === 'start_period')
    if (startPeriod) {
      this.proposal.startPeriod = this.periods.find(p => p.period_id === startPeriod.value)
    }
    const endPeriod = this.proposal.ints.find(o => o.key === 'end_period')
    if (endPeriod) {
      this.proposal.endPeriod = this.periods.find(p => p.period_id === endPeriod.value)
    }

    await this.onFetchBallot()

    const role = this.proposal.ints.find(o => o.key === 'role_id')
    if (role) {
      this.proposal.role = await this.fetchRole(role.value)
    }
    this.loading = false
  },
  computed: {
    ...mapGetters('periods', ['periods']),
    ...mapGetters('accounts', ['isAuthenticated', 'account']),
    type () {
      const obj = this.proposal.names.find(o => o.key === 'proposal_type')
      return obj.value
    },
    owner () {
      const obj = this.proposal.names.find(o => o.key === 'owner')
      return obj && obj.value
    },
    ballot () {
      const obj = this.proposal.names.find(o => o.key === 'ballot_id')
      return obj && obj.value
    },
    title () {
      const obj = this.proposal.strings.find(o => o.key === 'title')
      return obj && obj.value
    },
    description () {
      const obj = this.proposal.strings.find(o => o.key === 'description')
      return obj && obj.value
    },
    hvoice () {
      const obj = this.proposal.assets.find(o => o.key === 'hvoice_amount')
      return obj && obj.value
    },
    hypha () {
      const obj = this.proposal.assets.find(o => o.key === 'hypha_amount')
      return obj && obj.value
    },
    seeds () {
      const obj = this.proposal.assets.find(o => o.key === 'seeds_amount')
      return obj && obj.value
    },
    assignedTo () {
      const obj = this.proposal.names.find(o => o.key === 'assigned_account')
      return obj && obj.value
    },
    timeShare () {
      const obj = this.proposal.floats.find(o => o.key === 'time_share')
      return obj && obj.value
    },
    recipient () {
      const obj = this.proposal.names.find(o => o.key === 'recipient')
      return obj && obj.value
    },
    contributedAt () {
      const obj = this.proposal.time_points.find(o => o.key === 'contribution_date')
      return obj && obj.value
    },
    payoutType () {
      const obj = this.proposal.ints.find(o => o.key === 'bypass_escrow')
      return (obj && obj.value && 'Instant') || 'Escrow'
    }
  },
  methods: {
    ...mapActions('proposals', ['fetchProposal', 'closeProposal']),
    ...mapActions('trail', ['fetchBallot', 'castVote']),
    ...mapActions('roles', ['fetchRole']),
    async onCastVote (vote) {
      this.voting = true
      await this.castVote({
        id: this.ballot,
        vote
      })
      await this.onFetchBallot()
      this.voting = false
    },
    async onFetchBallot () {
      const ballot = this.proposal.names.find(o => o.key === 'ballot_id')
      if (ballot) {
        const result = await this.fetchBallot(ballot.value)
        if (result) {
          this.proposal.ballot = result
          const now = new Date(Date.now() + new Date().getTimezoneOffset() * 60 * 1000)
          this.votesOpened = now >= new Date(result.begin_time).getTime() && now <= new Date(result.end_time).getTime()
          this.canCloseProposal = now > new Date(result.end_time).getTime()
          this.pass = result.options.find(o => o.key === 'pass').value
          this.fail = result.options.find(o => o.key === 'fail').value
          if (parseFloat(this.pass) + parseFloat(this.fail) > 0) {
            this.percentage = parseFloat((parseFloat(this.pass) / (parseFloat(this.pass) + parseFloat(this.fail))) * 100).toFixed(2)
          } else {
            this.percentage = 0
          }
        }
      }
    },
    async onCloseProposal () {
      this.voting = true
      await this.closeProposal({
        type: this.type,
        id: this.proposal.id
      })
      await this.onFetchBallot()
      this.voting = false
    }
  },
  watch: {
    periods (periods) {
      if (!this.proposal) return
      if (periods && (!this.proposal.startPeriod || !this.proposal.endPeriod)) {
        const startPeriod = this.proposal.ints.find(o => o.key === 'start_period')
        if (startPeriod) {
          this.proposal.startPeriod = this.periods.find(p => p.period_id === startPeriod.value)
        }
        const endPeriod = this.proposal.ints.find(o => o.key === 'end_period')
        if (endPeriod) {
          this.proposal.endPeriod = this.periods.find(p => p.period_id === endPeriod.value)
        }
      }
    }
  }
}
</script>

<template lang="pug">
q-page.q-pa-lg
  .row(v-if="proposal")
    .col-xs-12.col-md-8.offset-md-2
      .q-pa-lg.text-center.text-white.relative-position.bg-proposal
        .text-h4 {{ title }}
        i.date {{ new Date(proposal.created_date).toDateString() }}
      .row
        .col-xs-12.col-md-8
          q-markdown.fit.q-pa-sm(:src="description")
        q-card.col-xs-12.col-md-4.q-mt-lg.full-height
          q-card-section.text-center
            strong Proposed by&nbsp;
            router-link.link(
              :to="`/@${owner}`"
            ) {{ owner }}
          q-card-section.text-center(v-if="assignedTo")
            strong assigned to&nbsp;
            router-link.link(
              :to="`/@${assignedTo}`"
            ) {{ assignedTo }}
            p.text-italic Time share {{ parseFloat(timeShare * 100).toFixed(0) }}%
            p(v-if="proposal.role") for role&nbsp;
              router-link.link(
                :to="`/roles/${proposal.role.role_id}`"
              ) {{ proposal.role.title }}
          q-card-section.text-center(v-if="recipient")
            strong Recipient:&nbsp;
            router-link.link(
              :to="`/@${recipient}`"
            ) {{ recipient }}
            br
            | Contribution Date: {{ new Date(contributedAt).toLocaleDateString() }}
          q-card-section.text-center(v-if="hypha || seeds || hvoice")
            strong Payout Amounts
          q-card-section(v-if="hypha || seeds || hvoice")
            p(v-if="hypha") {{ hypha }}
            p(v-if="seeds") {{ seeds }}
            p(v-if="hvoice") {{ hvoice }}
            p Payout type: {{ payoutType }}
          q-card-section.text-center(v-if="proposal.startPeriod")
            strong Starting period
          q-card-section(v-if="proposal.startPeriod")
            p From {{ new Date(proposal.startPeriod.start_date).toLocaleDateString() }} {{ new Date(proposal.startPeriod.start_date).toLocaleTimeString() }}
            p To {{ new Date(proposal.startPeriod.end_date).toLocaleDateString() }} {{ new Date(proposal.startPeriod.end_date).toLocaleTimeString() }}
          q-card-section.text-center(v-if="proposal.endPeriod")
            strong Ending period
          q-card-section(v-if="proposal.endPeriod")
            p From {{ new Date(proposal.endPeriod.start_date).toLocaleDateString() }} {{ new Date(proposal.endPeriod.start_date).toLocaleTimeString() }}
            p To {{ new Date(proposal.endPeriod.end_date).toLocaleDateString() }} {{ new Date(proposal.endPeriod.end_date).toLocaleTimeString() }}
          q-card-section.text-center
            .text-h6 Votes
            q-knob(
              v-if="percentage !== 'pending'"
              readonly
              v-model="percentage"
              show-value
              size="130px"
              :thickness="0.22"
              color="green"
              track-color="red"
              :class="percentage > 50 ? 'text-green' : 'text-red'"
            )
              i {{ percentage }}%
              q-tooltip(
                anchor="center middle"
                self="center middle"
              )
                | {{ pass }} for / {{ fail }} against
            p.q-py-sm.text-italic(v-if="percentage === 'pending' && votesOpened") No votes cast yet
            p.q-py-sm.text-italic(v-if="!votesOpened && proposal.ballot && proposal.ballot.status !== 'closed'") Voting period ended
            p.q-py-sm.text-italic(v-if="!votesOpened && proposal.ballot && proposal.ballot.status === 'closed'") Proposal closed
            .row.flex.justify-between.q-pa-md(v-if="isAuthenticated")
              q-btn(
                v-if="votesOpened"
                label="Accept"
                color="green"
                :loading="voting"
                @click="onCastVote('pass')"
              )
              q-btn(
                v-if="votesOpened"
                label="Reject"
                color="red"
                :loading="voting"
                @click="onCastVote('fail')"
              )
              q-btn.full-width(
                v-if="canCloseProposal && owner === account && proposal.ballot && proposal.ballot.status !== 'closed'"
                label="Close proposal"
                color="primary"
                :loading="voting"
                @click="onCloseProposal"
              )
  .flex.flex-center(v-else)
    strong This proposal doesn't exist
  q-inner-loading(:showing="loading")
    q-spinner-dots(
      color="primary"
      size="60px"
    )
</template>

<style lang="stylus" scoped>
.date
  position absolute
  bottom 2px
  right 5px
  font-size 11px
.link
  text-decoration none
  color $accent
/deep/.q-circular-progress__text
  font-size 0.2em
</style>
