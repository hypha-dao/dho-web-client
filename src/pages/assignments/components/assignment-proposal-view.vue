<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import MarkdownDisplay from '~/components/form/markdown-display'
import { format } from '~/mixins/format'

export default {
  name: 'assignment-proposal-view',
  mixins: [format],
  components: { MarkdownDisplay },
  props: {
    assignment: { type: Object }
  },
  data () {
    return {
      role: null,
      ballot: null,
      percentage: 0,
      quorum: 0,
      fail: null,
      pass: null,
      votesOpened: false,
      canCloseProposal: false,
      voting: false,
      countdown: '',
      timeout: null,
      display: {
        deferredSeeds: 0,
        liquidSeeds: 0,
        hvoice: 0,
        hypha: 0,
        husd: 0
      }
    }
  },
  computed: {
    ...mapGetters('periods', ['periods']),
    ...mapGetters('accounts', ['isAuthenticated', 'isMember', 'account']),
    ...mapGetters('payouts', ['seedsToUsd']),
    owner () {
      const data = this.assignment.proposal.names.find(o => o.key === 'owner')
      return (data && data.value) || ''
    },
    assignedAccount () {
      const data = this.assignment.proposal.names.find(o => o.key === 'assigned_account')
      return (data && data.value) || ''
    },
    title () {
      const data = this.assignment.proposal.strings.find(o => o.key === 'title')
      return (data && data.value) || ''
    },
    description () {
      const data = this.assignment.proposal.strings.find(o => o.key === 'description')
      return (data && data.value) || ''
    },
    url () {
      const data = this.assignment.proposal.strings.find(o => o.key === 'url')
      return (data && data.value !== 'null' && data.value) || null
    },
    usdEquity () {
      if (!this.role) return ''
      const data = this.role.assets.find(o => o.key === 'annual_usd_salary')
      return (data && data.value && parseFloat(data.value).toFixed(2)) || ''
    },
    salaryCommitted () {
      const data = this.assignment.proposal.ints.find(o => o.key === 'time_share_x100')
      return (data && data.value && `${(data.value).toFixed(2)}%`) || ''
    },
    salaryDeferred () {
      const data = this.assignment.proposal.ints.find(o => o.key === 'deferred_perc_x100')
      return (data && data.value && `${(data.value).toFixed(2)}%`) || ''
    },
    salaryInstantHUsd () {
      const data = this.assignment.proposal.ints.find(o => o.key === 'instant_husd_perc_x100')
      return (data && data.value && `${(data.value).toFixed(2)}%`) || ''
    },
    startPhase () {
      const obj = this.assignment.proposal.ints.find(o => o.key === 'start_period')
      if (obj) {
        return this.periods.find(p => p.period_id === obj.value)
      }
      return null
    },
    endPhase () {
      const obj = this.assignment.proposal.ints.find(o => o.key === 'end_period')
      if (obj) {
        return this.periods.find(p => p.period_id === obj.value)
      }
      return null
    },
    cycle () {
      if (!this.endPhase) return ''
      return (this.endPhase.period_id - this.startPhase.period_id) / 4
    }
  },
  methods: {
    ...mapActions('proposals', ['closeProposal']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    ...mapActions('trail', ['fetchBallot', 'castVote', 'getSupply']),
    ...mapActions('roles', ['fetchRole']),
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
      await this.closeProposal(this.assignment.proposal.id)
      await this.removeProposal(this.assignment.proposal.id)
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
    },
    computeTokens () {
      const committedSan = parseFloat(this.salaryCommitted || 0)
      const deferredSan = parseFloat(this.salaryDeferred || 0)
      const instantSan = parseFloat(this.salaryInstantHUsd || 0)
      const ratioUsdEquity = parseFloat(this.usdEquity) * committedSan / 100

      this.display.hvoice = (2 * ratioUsdEquity).toFixed(2)
      this.display.deferredSeeds = (ratioUsdEquity / this.seedsToUsd * (deferredSan / 100) * 1.3).toFixed(4)
      this.display.hypha = (ratioUsdEquity * deferredSan / 100 * 0.6).toFixed(2)
      this.display.husd = (ratioUsdEquity * (1 - deferredSan / 100) * (instantSan / 100)).toFixed(2)
      this.display.liquidSeeds = (ratioUsdEquity * (1 - deferredSan / 100) * (1 - instantSan / 100) / this.seedsToUsd).toFixed(2)
    }
  },
  beforeDestroy () {
    clearInterval(this.timeout)
  },
  watch: {
    assignment: {
      immediate: true,
      async handler (val) {
        if (!this.ballot || this.ballot.ballot_name !== val.ballot.ballot_name) {
          await this.loadBallot(val.ballot.ballot_name)
        }
        if (!this.role) {
          const data = this.assignment.proposal.ints.find(o => o.key === 'role_id')
          if (data) {
            this.role = await this.fetchRole(data.value)
            this.computeTokens()
          }
        }
      }
    }
  }
}
</script>

<template lang="pug">
.q-pa-xs
  .text-h6.q-mb-sm.q-ml-md {{ assignedAccount }}
  .description.relative-position(
    v-if="description"
  )
    markdown-display(:text="description")
  fieldset.q-mt-sm(v-if="url")
    legend Supporting documentation
    a.link.q-my-md(:href="url" target="_blank") {{ url | truncate(60) }}
  fieldset.q-mt-sm
    legend Salary
    p Fields below display the payout of this assignment for a single lunar period (ca. 1 week) as well as % committed, % deferred and % HUSD. The payout is shown as USD equivalent and the corresponding amounts in SEEDS, HVOICE, HYPHA and HUSD.
    .row.q-col-gutter-xs
      .col-xs-12.col-md-4
        q-input.bg-grey-4.text-black(
          v-model="salaryCommitted"
          outlined
          dense
          readonly
        )
        .hint Committed
      .col-xs-12.col-md-4
        q-input.bg-grey-4.text-black(
          v-model="salaryDeferred"
          outlined
          dense
          readonly
        )
        .hint Deferred
      .col-xs-12.col-md-4
        q-input.bg-grey-4.text-black(
          v-model="salaryInstantHUsd"
          outlined
          dense
          readonly
        )
        .hint HUSD
    .row.q-col-gutter-xs
      .col-6
        q-input.bg-seeds.text-black(
          v-model="display.deferredSeeds"
          outlined
          dense
          readonly
        )
          template(v-slot:append)
            q-icon(
              name="img:statics/app/icons/seeds.png"
              size="xs"
            )
        .hint Deferred Seeds
      .col-6
        q-input.bg-seeds.text-black(
          v-model="display.liquidSeeds"
          outlined
          dense
          readonly
        )
          template(v-slot:append)
            q-icon(
              name="img:statics/app/icons/seeds.png"
              size="xs"
            )
        .hint Liquid Seeds
      .col-4
        q-input.bg-liquid.text-black(
          v-model="display.hvoice"
          outlined
          dense
          readonly
        )
        .hint hvoice
      .col-4
        q-input.bg-liquid.text-black(
          v-model="display.hypha"
          outlined
          dense
          readonly
        )
        .hint hypha
      .col-4
        q-input.bg-liquid.text-black(
          v-model="display.husd"
          outlined
          dense
          readonly
        )
        .hint husd
  fieldset.q-mt-sm
    legend Lunar cycles
    p This is the  lunar start and re-evaluation date for this assignment, followed by the number of lunar cycles.
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
    p This is the current tally for the assignment proposal. Please vote with the buttons below. Repeat votes allowed until close.
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
        :disable="!isMember"
        :icon="userVote === 'pass' ? 'fas fa-check-square' : null"
        label="Enroll"
        color="light-green-6"
        rounded
        :loading="voting"
        @click="onCastVote('pass')"
      )
      q-btn.q-ml-sm(
        v-if="votesOpened"
        :disable="!isMember"
        :icon="userVote === 'fail' ? 'fas fa-check-square' : null"
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
.proposal-actions
  button
    width 100px
</style>
