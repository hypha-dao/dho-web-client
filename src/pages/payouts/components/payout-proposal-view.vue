<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import MarkdownDisplay from '~/components/form/markdown-display'

export default {
  name: 'payout-proposal-view',
  components: { MarkdownDisplay },
  props: {
    payout: { type: Object }
  },
  data () {
    return {
      ballot: null,
      percentage: 0,
      quorum: 0,
      fail: null,
      pass: null,
      votesOpened: false,
      canCloseProposal: false,
      voting: false,
      countdown: '',
      timeout: null
    }
  },
  computed: {
    ...mapGetters('periods', ['periods']),
    ...mapGetters('accounts', ['isAuthenticated', 'account']),
    owner () {
      const data = this.payout.proposal.names.find(o => o.key === 'owner')
      return (data && data.value) || ''
    },
    title () {
      const data = this.payout.proposal.strings.find(o => o.key === 'title')
      return (data && data.value) || ''
    },
    description () {
      const data = this.payout.proposal.strings.find(o => o.key === 'description')
      return (data && data.value) || ''
    },
    hvoice () {
      const obj = this.payout.proposal.assets.find(o => o.key === 'hvoice_amount')
      return obj && obj.value
    },
    hypha () {
      const obj = this.payout.proposal.assets.find(o => o.key === 'hypha_amount')
      return obj && obj.value
    },
    seeds () {
      const obj = this.payout.proposal.assets.find(o => o.key === 'seeds_amount')
      return obj && obj.value
    },
    recipient () {
      const obj = this.payout.proposal.names.find(o => o.key === 'recipient')
      return obj && obj.value
    },
    contributedAt () {
      const obj = this.payout.proposal.time_points.find(o => o.key === 'contribution_date')
      return obj && obj.value
    },
    instantPay () {
      const obj = this.payout.proposal.ints.find(o => o.key === 'bypass_escrow')
      return obj && obj.value === 1
    }
  },
  methods: {
    ...mapActions('proposals', ['closeProposal']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    ...mapActions('trail', ['fetchBallot', 'castVote']),
    ...mapActions('members', ['getTotalMembers']),
    hide () {
      this.setShowRightSidebar(false)
      this.setRightSidebarType(null)
    },
    open (url) {
      window.open(url, '_blank')
    },
    updateCountdown () {
      const end = new Date(this.ballot.end_time).getTime()
      const now = new Date(Date.now() + new Date().getTimezoneOffset() * 60 * 1000)
      const t = end - now
      if (t >= 0) {
        const days = Math.floor(t / (1000 * 60 * 60 * 24))
        const hours = `0${Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}`.slice(-2)
        const mins = `0${Math.floor((t % (1000 * 60 * 60)) / (1000 * 60))}`.slice(-2)
        const secs = `0${Math.floor((t % (1000 * 60)) / 1000)}`.slice(-2)
        if (days) {
          this.countdown = `${days}d`
        } else {
          this.countdown = ''
        }
        this.countdown += `${hours}:${mins}:${secs}`
      } else {
        this.votesOpened = false
        this.canCloseProposal = true
        clearInterval(this.timeout)
      }
    },
    async onCastVote (vote) {
      this.voting = true
      await this.castVote({
        id: this.ballot.ballot_name,
        vote
      })
      await this.loadBallot(this.ballot.ballot_name)
      this.voting = false
    },
    async onCloseProposal () {
      this.voting = true
      await this.closeProposal(this.payout.proposal.id)
      await this.loadBallot(this.ballot.ballot_name)
      this.voting = false
      this.hide()
    },
    async loadBallot (id) {
      const result = await this.fetchBallot(id)
      if (result) {
        this.ballot = result
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
        const members = await this.getTotalMembers()
        if (members > 0) {
          this.quorum = this.ballot.total_voters * 100 / members
        }
        if (this.timeout) {
          clearInterval(this.timeout)
        }
        this.timeout = setInterval(this.updateCountdown, 1000)
      }
    }
  },
  beforeDestroy () {
    clearInterval(this.timeout)
  },
  watch: {
    payout: {
      immediate: true,
      async handler (val) {
        if (!this.ballot || this.ballot.ballot_name !== val.ballot.value) {
          await this.loadBallot(val.ballot.value)
        }
      }
    }
  }
}
</script>

<template lang="pug">
.q-pa-xs
  .text-h6.q-mb-sm.q-ml-md {{ title }}
  .description.relative-position(
    v-if="description"
  )
    markdown-display(:text="description")
  fieldset.q-mt-sm
    legend Payout amounts
    .row.q-col-gutter-xs
      .col-6
        q-input.bg-grey-4.text-black(
          v-model="hypha"
          outlined
          dense
          readonly
        )
      .col-6
        q-input.bg-grey-4.text-black(
          v-model="hvoice"
          outlined
          dense
          readonly
        )
      .col-6
        q-input.bg-grey-4.text-black(
          v-model="seeds"
          outlined
          dense
          readonly
        )
  fieldset.q-mt-sm
    legend Additional information
    q-checkbox(
      v-model="instantPay"
      label="Instant pay"
    )
    q-input.bg-grey-4.text-black(
      v-model="contributedAt && new Date(contributedAt).toLocaleDateString()"
      outlined
      dense
      readonly
    )
    .hint Contributed at
  fieldset.q-mt-sm
    legend Vote results
    p This is the current tally for the role proposal. Please vote with the buttons below. Repeat votes allowed until close.
    q-linear-progress.vote-bar(
      size="40px"
      :value="percentage / 100"
      color="light-green-6"
      track-color="red"
    )
      .absolute-full.flex.flex-center
        .vote-text.text-white {{ percentage }}% endorsed (80% needed to pass)
    q-linear-progress.q-mt-md.vote-bar(
      stripe
      size="40px"
      :value="quorum / 100"
      :color="quorum < 20 ? 'red' : 'light-green-6'"
      track-color="grey-8"
    )
      .absolute-full.flex.flex-center
        .vote-text.text-white {{ parseFloat(quorum).toFixed(2) }}% participated (20% needed to pass)
    p.q-py-sm.text-italic.text-center(v-if="!votesOpened && ballot && ballot.status !== 'closed'") Voting period ended
    p.q-py-sm.text-italic.text-center(v-if="!votesOpened && ballot && ballot.status === 'closed'") Proposal closed
    .countdown.q-mt-sm.text-center(v-if="votesOpened")
      q-icon.q-mr-sm(name="fas fa-exclamation-triangle" size="sm")
      | This vote will close in {{ countdown }}
  .row.flex.justify-between.q-mt-md
    q-btn(
      label="Close"
      rounded
      color="grey"
      unelevated
      @click="hide"
    )
    .row.proposal-actions(v-if="isAuthenticated")
      q-btn(
        v-if="votesOpened"
        label="Endorse"
        color="light-green-6"
        rounded
        :loading="voting"
        @click="onCastVote('pass')"
      )
      q-btn.q-ml-sm(
        v-if="votesOpened"
        label="Reject"
        color="red"
        rounded
        :loading="voting"
        @click="onCastVote('fail')"
      )
      q-btn(
        v-if="canCloseProposal && owner === account && ballot && ballot.status !== 'closed'"
        label="Close proposal"
        color="primary"
        rounded
        :loading="voting"
        @click="onCloseProposal"
        :style="{width: '200px'}"
      )
</template>

<style lang="stylus" scoped>
fieldset
  border-radius 4px
  border 1px solid rgba(0,0,0,.24)
  legend
    text-transform uppercase
    font-size 12px
  p
    font-size 12px
.hint
  margin-top 2px
  text-transform uppercase
  font-size 12px
.vote-bar
  opacity 1
.vote-text
  font-weight 600
.proposal-actions
  button
    width 100px
</style>
