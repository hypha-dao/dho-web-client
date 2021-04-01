<script>
import { mapActions, mapGetters } from 'vuex'
import { documents } from '~/mixins/documents'
import VotesDetails from './votes-details'

export default {
  name: 'vote-yes-no-abstain',
  components: { VotesDetails },
  mixins: [documents],
  props: {
    initProposal: { type: Object },
    proposer: { type: String },
    hash: { type: String },
    countdown: { type: Boolean },
    allowDetails: { type: Boolean, default: false }
  },
  data () {
    return {
      proposal: null,
      percentage: 0,
      quorum: 0,
      abstain: 0,
      fail: 0,
      pass: 0,
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
    ...mapActions('ballots', ['getSupply', 'castVote']),
    ...mapActions('documentsProposal', ['closeDocumentProposal', 'fetchProposal']),
    processBallotVotes () {
      if (this.proposal.votetally && this.proposal.votetally.length) {
        this.abstain = parseFloat(this.getValue(this.proposal.votetally[0], 'abstain', 'vote_power'))
        this.pass = parseFloat(this.getValue(this.proposal.votetally[0], 'pass', 'vote_power'))
        this.fail = parseFloat(this.getValue(this.proposal.votetally[0], 'fail', 'vote_power'))
      }
      if (this.pass + this.fail > 0) {
        this.percentage = Math.round(this.pass / (this.pass + this.fail) * 10000) / 100
      } else {
        this.percentage = 0
      }
      if (this.supply > 0) {
        this.quorum = Math.floor(parseFloat(this.abstain + this.pass + this.fail) / this.supply * 10000) / 100
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
      const expiration = new Date(`${this.getValue(this.proposal, 'ballot', 'expiration')}Z`)
      this.votesOpened = now <= expiration.getTime()
      this.canCloseProposal = now > expiration.getTime() && (this.proposer === this.account || this.isAdmin)
    },
    async onCastVote (vote) {
      this.voting = true
      await this.castVote({
        hash: this.proposal.hash,
        vote
      })
      await this.sleep(2000) // Leave time to dgraph to update
      this.proposal = await this.fetchProposal(this.proposal.hash)
      this.voting = false
    },
    async onCloseProposal () {
      this.closing = true
      await this.closeDocumentProposal(this.hash)
      this.$emit('close-proposal', this.hash)
      this.closing = false
    },
    updateCountdown () {
      const end = new Date(`${this.getValue(this.proposal, 'ballot', 'expiration')}Z`).getTime()
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
    userVote () {
      if (this.account && this.proposal.vote) {
        for (const vote of this.proposal.vote) {
          const value = this.getValueFilters(vote, { label: 'content_group_label', value: 'vote' }, { label: 'voter', value: this.account }, 'vote')
          if (value) {
            return value
          }
        }
      }
      return null
    }
  },
  watch: {
    initProposal: {
      immediate: true,
      handler (val) {
        this.proposal = val
      }
    },
    proposal: {
      immediate: true,
      async handler () {
        if (!this.supply) {
          await this.getSupply()
        }
        this.processBallotVotes()
        this.processBallotStatus()
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
    votes-details(v-if="proposal.vote" :votes-data="proposal.vote")
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
