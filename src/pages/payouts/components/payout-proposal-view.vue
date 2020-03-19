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
    amount () {
      const data = this.payout.proposal.assets.find(o => o.key === 'usd_amount')
      return (data && data.value && parseFloat(data.value).toFixed(2)) || ''
    },
    deferred () {
      const obj = this.payout.proposal.ints.find(o => o.key === 'deferred_perc_x100')
      return (obj && obj.value) || 0
    },
    hvoice () {
      const amount = parseFloat(this.amount) || 0
      return (2 * amount).toFixed(2)
    },
    hypha () {
      const amount = parseFloat(this.amount) || 0
      const deferred = parseFloat(this.deferred) / 100 || 0
      return (amount * deferred / 100 * 0.6).toFixed(2)
    },
    seeds () {
      const amount = parseFloat(this.amount) || 0
      const deferred = parseFloat(this.deferred) / 100 || 0
      return (amount * deferred / 100 * (1.3 / 0.01) + (amount * (1 - deferred / 100)) / 0.01).toFixed(4)
    },
    liquid () {
      const amount = parseFloat(this.amount) || 0
      const deferred = parseFloat(this.deferred) / 100 || 0
      return (amount * (1 - deferred / 100)).toFixed(2)
    },
    recipient () {
      const obj = this.payout.proposal.names.find(o => o.key === 'recipient')
      return obj && obj.value
    },
    startPhase () {
      const obj = this.payout.proposal.ints.find(o => o.key === 'start_period')
      if (obj) {
        return this.periods.find(p => p.period_id === obj.value)
      }
      return null
    },
    endPhase () {
      const obj = this.payout.proposal.ints.find(o => o.key === 'end_period')
      if (obj) {
        return this.periods.find(p => p.period_id === obj.value)
      }
      return null
    },
    cycle () {
      return (this.endPhase.period_id - this.startPhase.period_id) / 4
    }
  },
  methods: {
    ...mapActions('proposals', ['closeProposal']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    ...mapActions('trail', ['fetchBallot', 'castVote', 'getSupply']),
    ...mapMutations('proposals', ['removeProposal']),
    getIcon (phase) {
      switch (phase) {
        case 'First Quarter':
          return 'fas fa-adjust'
        case 'Full Moon':
          return 'far fa-circle'
        case 'Last Quarter':
          return 'fas fa-adjust reversed'
        case 'New Moon':
          return 'fas fa-circle'
        default:
          return 'fas fa-circle'
      }
    },
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
          this.countdown = `${days}d `
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
      await this.removeProposal(this.payout.proposal.id)
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
        const supply = parseFloat(await this.getSupply())
        if (supply > 0) {
          this.quorum = parseFloat(this.ballot.total_raw_weight) * 100 / supply
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
        if (!this.ballot || this.ballot.ballot_name !== val.ballot.ballot_name) {
          await this.loadBallot(val.ballot.ballot_name)
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
    legend Payout
    p Below is the payout for this contribution with %deferred. The value in blue is the non-deferred amount of this contribution.
    q-linear-progress.q-my-md(
      rounded
      size="25px"
      :value="deferred / 10000"
      color="grey-4"
      track-color="deferred"
    )
      .absolute-full.flex.flex-center
        .deferred-text.text-black {{ deferred / 100 }}% deferred payout
    .row.q-col-gutter-xs
      .col-6
        q-input.bg-grey-4.text-black(
          v-model="seeds"
          outlined
          dense
          readonly
        )
        .hint Seeds
      .col-6
        q-input.bg-grey-4.text-black(
          v-model="hvoice"
          outlined
          dense
          readonly
        )
        .hint hvoice
      .col-6
        q-input.bg-grey-4.text-black(
          v-model="hypha"
          outlined
          dense
          readonly
        )
        .hint hypha
      .col-6
        q-input.bg-grey-4.text-black(
          v-model="liquid"
          outlined
          dense
          readonly
          bg-color="deferred"
        )
        .hint liquid
  fieldset.q-mt-sm
    legend Lunar cycles
    p This is the  lunar start and re-evaluation date for this role, followed by the number of lunar cycles.
    .row.q-col-gutter-xs
      .col-5(:style="{width:'39%'}")
        q-input.bg-grey-4.text-black(
          v-model="startPhase && new Date(startPhase.start_date).toLocaleDateString()"
          outlined
          dense
          readonly
        )
          template(v-slot:append)
            q-icon(:name="getIcon(startPhase && startPhase.phase)")
      .col-5(:style="{width:'39%'}")
        q-input.bg-grey-4.text-black(
          v-model="endPhase && new Date(endPhase.start_date).toLocaleDateString()"
          outlined
          dense
          readonly
        )
          template(v-slot:append)
            q-icon(:name="getIcon(endPhase && endPhase.phase)")
      .col-2(:style="{width:'22%'}")
        q-input.bg-grey-4.text-black(
          v-model="cycle"
          outlined
          dense
          readonly
        )
          template(v-slot:append)
            q-icon(name="fas fa-hashtag")
  fieldset.q-mt-sm
    legend Vote results
    p This is the current tally for the role proposal. Please vote with the buttons below. Repeat votes allowed until close.
    q-linear-progress.vote-bar(
      rounded
      size="25px"
      :value="percentage / 100"
      color="light-green-6"
      track-color="red"
    )
      .absolute-full.flex.flex-center
        .vote-text.text-white {{ percentage }}% endorsed (80% needed to pass)
    q-linear-progress.q-mt-md.vote-bar(
      rounded
      stripe
      size="25px"
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
        :label="percentage >= 80 && quorum >= 20 ? 'Activate' : 'Deactivate'"
        :color="percentage >= 80 && quorum >= 20 ? 'light-green-6' : 'red'"
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
.deferred-text
  font-weight 500
.proposal-actions
  button
    width 100px
</style>
