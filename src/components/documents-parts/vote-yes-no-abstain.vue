<script>
import { mapActions, mapGetters } from 'vuex'
import VotesDetails from './votes-details'

export default {
  name: 'vote-yes-no-abstain',
  components: { VotesDetails },
  props: {
    ballotId: { type: String },
    proposer: { type: String },
    hash: { type: String },
    countdown: { type: Boolean },
    allowDetails: { type: Boolean, default: false }
  },
  data () {
    return {
      percentage: 0,
      quorum: 0,
      fail: null,
      pass: null,
      votesOpened: false,
      canCloseProposal: false,
      closing: false,
      voting: false,
      countdownText: '',
      timeout: null,
      showVotesDetails: false
    }
  },
  methods: {
    ...mapActions('ballots', ['fetchBallot', 'getUserVote', 'getSupply', 'castVote']),
    ...mapActions('proposals', ['closeDocumentProposal']),
    processBallotVotes () {
      this.pass = parseFloat(this.ballot.options.find(o => o.key === 'pass').value)
      this.fail = parseFloat(this.ballot.options.find(o => o.key === 'fail').value)
      if (this.pass + this.fail > 0) {
        this.percentage = Math.round(this.pass / (this.pass + this.fail) * 10000) / 100
      } else {
        this.percentage = 0
      }
      if (this.supply > 0) {
        this.quorum = Math.floor(parseFloat(this.ballot.total_raw_weight) / this.supply * 10000) / 100
      }
      if (this.countdown) {
        if (this.timeout) {
          clearInterval(this.timeout)
        }
        this.timeout = setInterval(this.updateCountdown, 1000)
      }
    },
    processBallotStatus () {
      const now = Date.now()
      this.votesOpened = now >= new Date(`${this.ballot.begin_time}Z`).getTime() && now <= new Date(`${this.ballot.end_time}Z`).getTime()
      this.canCloseProposal = now > new Date(`${this.ballot.end_time}Z`).getTime() && (this.proposer === this.account || this.isAdmin) && this.ballot.status !== 'closed'
    },
    async onCastVote (vote) {
      this.voting = true
      await this.castVote({
        id: this.ballotId,
        vote
      })
      await this.loadBallot(this.ballotId)
      this.voting = false
    },
    async onCloseProposal () {
      this.closing = true
      await this.closeDocumentProposal(this.hash)
      this.$emit('close-proposal', this.hash)
      this.closing = false
    },
    async loadBallot (id) {
      await this.fetchBallot(id)
      if (this.account) {
        await this.getUserVote({ user: this.account, id })
      }
      if (!this.supply && !this.supplyLoading) {
        await this.getSupply()
      }
    },
    updateCountdown () {
      const end = new Date(`${this.ballot.end_time}Z`).getTime()
      const now = Date.now()
      const t = end - now
      if (t >= 0) {
        const days = Math.floor(t / (1000 * 60 * 60 * 24))
        const hours = `0${Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}`.slice(-2)
        const mins = `0${Math.floor((t % (1000 * 60 * 60)) / (1000 * 60))}`.slice(-2)
        const secs = `0${Math.floor((t % (1000 * 60)) / 1000)}`.slice(-2)
        if (days) {
          this.countdownText = `${days}d `
        } else {
          this.countdownText = ''
        }
        this.countdownText += `${hours}:${mins}:${secs}`
      } else {
        this.processBallotStatus()
        clearInterval(this.timeout)
      }
    }
  },
  computed: {
    ...mapGetters('accounts', ['isMember', 'isAdmin', 'account']),
    ...mapGetters('ballots', ['ballots', 'supply', 'supplyLoading']),
    ballot () {
      return this.ballotId && this.ballots[this.ballotId]
    },
    userVote () {
      return this.ballot && this.ballot.userVote
    }
  },
  watch: {
    ballotId: {
      immediate: true,
      async handler (val) {
        await this.loadBallot(val)
      }
    },
    ballot: {
      immediate: true,
      handler () {
        if (this.ballot && this.supply) {
          this.processBallotVotes()
          this.processBallotStatus()
        }
      }
    },
    supply: {
      immediate: true,
      handler (val) {
        if (this.ballot && val) {
          this.processBallotVotes()
          this.processBallotStatus()
        }
      }
    }
  }
}
</script>

<template lang="pug">
div
  q-dialog(
    v-model="showVotesDetails"
  )
    votes-details(:ballotId="ballotId")
  q-linear-progress.vote-bar.vote-bar-endorsed(
    rounded
    size="25px"
    :value="percentage / 100"
    color="light-green-6"
    track-color="red"
    @click="showVotesDetails = !showVotesDetails && allowDetails"
  )
    .absolute-full.flex.flex-center
      .vote-text.text-white {{ percentage }}% endorsed
  q-linear-progress.vote-bar(
    rounded
    stripe
    size="25px"
    :value="quorum / 100"
    :color="quorum < 20 ? 'red' : 'light-green-6'"
    track-color="grey-8"
    @click="showVotesDetails = !showVotesDetails && allowDetails"
  )
    .absolute-full.flex.flex-center
      .vote-text.text-white {{ quorum }}% voted
  .countdown.q-mt-sm.text-center(v-if="countdown && votesOpened")
    q-icon.q-mr-sm(name="fas fa-exclamation-triangle" size="sm")
    | This vote will close in {{ countdownText }}
  .q-pt-md.flex.justify-around.vote-buttons
    q-btn(
      v-if="votesOpened"
      :disable="!isMember"
      :icon="userVote === 'pass' ? 'fas fa-check-square' : null"
      label="Yes"
      color="light-green-6"
      :loading="voting"
      @click="onCastVote('pass')"
      rounded
      dense
      unelevated
      style="width: 26%"
    )
    q-btn(
      v-if="votesOpened"
      :disable="!isMember"
      :icon="userVote === 'fail' ? 'fas fa-check-square' : null"
      label="No"
      color="red"
      :loading="voting"
      @click="onCastVote('fail')"
      rounded
      dense
      unelevated
      style="width: 26%"
    )
    q-btn(
      v-if="votesOpened"
      :disable="!isMember"
      :icon="userVote === 'abstain' ? 'fas fa-check-square' : null"
      label="Abstain"
      color="orange"
      :loading="voting"
      @click="onCastVote('abstain')"
      rounded
      dense
      unelevated
      style="width: 40%"
    )
    .column
      .vote-info(v-if="!votesOpened && !userVote")
        q-icon.q-mr-sm(name="fas fa-exclamation-triangle" size="sm")
        | Voting period ended
      .vote-info(v-if="!votesOpened && userVote === 'pass'")
        q-icon.q-mr-sm(name="fas fa-exclamation-triangle" size="sm")
        | You endorsed this proposal
      .vote-info(v-if="!votesOpened && userVote === 'fail'")
        q-icon.q-mr-sm(name="fas fa-exclamation-triangle" size="sm")
        | You rejected this proposal
      q-btn.q-mt-sm(
        v-if="canCloseProposal"
        :label="percentage >= 80 && quorum >= 20 ? 'Activate' : 'Archive'"
        :color="percentage >= 80 && quorum >= 20 ? 'light-green-6' : 'red'"
        :loading="closing"
        @click="onCloseProposal"
        :style="{width: '200px'}"
        rounded
        dense
        unelevated
      )
</template>

<style lang="stylus" scoped>
.vote-buttons
  button
    font-weight 700
    /deep/i
      font-size 16px
.vote-bar
  border-radius 14px
  /deep/.q-linear-progress__track
    opacity 1
.vote-bar-endorsed
  margin-bottom 5px
</style>
