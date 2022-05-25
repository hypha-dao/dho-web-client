<script>
/**
 * A widget containing brief details of a single proposal
 */
import { date } from 'quasar'
import { format } from '~/mixins/format'
import { mapGetters } from 'vuex'

export default {
  name: 'proposal-card',
  components: {
    Chips: () => import('../common/chips.vue'),
    ProfilePicture: () => import('../profiles/profile-picture.vue'),
    Widget: () => import('../common/widget.vue'),
    VotingResult: () => import('./voting-result.vue')
  },
  mixins: [format],

  props: {
    /**
     * The hash of the proposal used to uniquely identify it
     */
    docId: String,
    /**
     * The type of this proposal
     */
    type: String,
    /**
     * The title of this proposal
     */
    title: String,
    /**
     * The subtitle displayed in italics below the title
     */
    subtitle: String,
    /**
     * The subtitle displayed in italics below the title
     */
    status: String,
    /**
     * The username of the individual who created the proposal
     */
    proposer: String,
    /**
     * The vote the user made on this proposal
     */
    vote: Object,
    /**
     * The tally of votes for this proposal
     */
    voting: Object,
    /**
     * The expiration string for this proposal
     */
    expiration: String,
    /**
     * Whether the card is a list style (horizontal orientation)
     * or card style (vertical orientation)
     */
    view: String,
    compensation: Object,
    salary: String,
    pastQuorum: Number,
    pastUnity: Number
  },
  mounted () {
    this.counterdown = setInterval(() => {
      this.timeLeftString()
      this.$forceUpdate()
    }, 1000)
  },
  activated () {
    this.counterdown = setInterval(() => {
      this.timeLeftString()
      this.$forceUpdate()
    }, 1000)
  },
  deactivated () {
    clearInterval(this.counterdown)
  },
  computed: {
    ...mapGetters('dao', ['votingPercentages']),
    list () {
      return this.view === 'list'
    },

    card () {
      return this.view === 'card'
    },

    accepted () {
      let quorum
      let unity

      if (this.pastQuorum && this.pastUnity) {
        quorum = this.pastQuorum / 100
        unity = this.pastUnity / 100
      } else {
        quorum = this.votingPercentages.quorum / 100
        unity = this.votingPercentages.unity / 100
      }
      return (this.voting && this.voting.quorum >= quorum && this.voting.unity >= unity)
    },

    color () {
      if (this.accepted) {
        return 'positive'
      }

      return 'negative'
    },

    expired () {
      return this.timeLeft() < 0
    },

    tags () {
      const tags = []
      if (this.status === 'drafted') tags.push({ color: 'secondary', label: 'Staging', text: 'white' })
      if (this.type.details_state_s === 'withdrawed') tags.push({ color: 'negative', label: 'Withdrawn', text: 'white' })

      if (this.type === 'Payout') {
        const [usdAmount] = this.compensation.amount.split(' ')
        return [
          { color: 'primary', label: 'Generic Contribution' },
          ...tags,
          { color: 'primary', outline: true, label: `${this.shortNumber(usdAmount, undefined, 0, 0)} USD`, tooltip: this.compensation.tooltip }
        ]
      }

      if (this.type === 'Assignment' || this.type === 'Edit') {
        return [
          { color: 'primary', label: 'Role Assignment' },
          ...tags
          // { color: 'primary', outline: true, label: 'Circle One' }
          // { color: 'primary', label: 'B3' },
          // { color: 'internal-bg', label: '80%', text: 'grey-7' }
        ]
      }

      if (this.type === 'Assignbadge') {
        return [
          { color: 'primary', label: 'Badge Assignment' },
          ...tags
          // { color: 'primary', outline: true, label: 'Assign' }
          // { color: 'primary', outline: true, label: 'Circle One' }
        ]
      }

      if (this.type === 'Suspend') {
        return [
          { color: 'warning', label: 'Suspension' }
        ]
      }

      if (this.type === 'Role') {
        const [amount] = this.salary.split(' ')
        let band = ''
        if (amount <= 80000) band = 'B1'
        if (amount > 80000) band = 'B2'
        if (amount > 100000) band = 'B3'
        if (amount > 120000) band = 'B4'
        if (amount > 140000) band = 'B5'
        if (amount > 160000) band = 'B6'
        if (amount > 180000) band = 'B7'
        return [
          { color: 'primary', label: ' Role Archetype' },
          ...tags,
          { color: 'primary', outline: true, label: `${band} ${this.shortNumber(amount, undefined, 0, 0)}` }
        ]
      }

      if (this.type === 'Badge') {
        return [
          ...tags,
          { color: 'primary', label: 'Badge Type' }
        ]
      }

      return null
    },

    voteTitle () {
      if (this.vote === null) return ''
      const { vote } = this.vote
      if (vote === 'pass') return 'Yes'.toUpperCase()
      if (vote === 'abstain') return 'Abstain'.toUpperCase()
      if (vote === 'fail') return 'No'.toUpperCase()
      return ''
    },
    background () {
      if (this.vote === null) return 'white'
      const { vote } = this.vote
      if (vote === 'pass') return 'positive'
      if (vote === 'abstain') return 'grey'
      if (vote === 'fail') return 'negative'
      return 'white'
    },
    proposalStatus () {
      return this.accepted ? 'Proposal accepted' : 'Proposal rejected'
    },
    colorConfig () {
      const config = {
        progress: '',
        icons: '',
        text: {}
      }

      const { unity } = this.voting

      if (this.pastUnity) {
        if (unity >= this.pastUnity / 100) {
          config.progress = config.icons = 'positive'
          config.text['text-positive'] = true
          return config
        }
        return undefined
      }

      if ((unity >= this.votingPercentages.unity / 100)) {
        config.progress = config.icons = 'positive'
        config.text['text-positive'] = true
        return config
      }

      if (unity < (this.votingPercentages.unity / 100) && unity > 0) {
        config.progress = config.icons = 'negative'
        config.text['text-negative'] = true
        return config
      }

      return undefined
    },
    colorConfigQuorum () {
      const config = {
        progress: '',
        icons: '',
        text: {}
      }
      const { quorum } = this.voting

      if (this.pastQuorum) {
        if (quorum >= this.pastQuorum / 100) {
          config.progress = config.icons = 'positive'
          config.text['text-positive'] = true
          return config
        }
        return undefined
      }

      if ((quorum >= this.votingPercentages.quorum / 100)) {
        config.progress = config.icons = 'positive'
        config.text['text-positive'] = true
        return config
      }

      if (quorum < (this.votingPercentages.quorum / 100) && quorum > 0) {
        config.progress = config.icons = 'negative'
        config.text['text-negative'] = true
        return config
      }

      return undefined
    }
  },
  methods: {
    timeLeft () {
      const end = new Date(`${this.expiration}`).getTime()
      const now = Date.now()
      const t = end - now
      return t
    },

    timeLeftString () {
      const MS_PER_DAY = 1000 * 60 * 60 * 24
      const MS_PER_HOUR = 1000 * 60 * 60
      const MS_PER_MIN = 1000 * 60
      const MS = 1000
      const timeRemaining = this.timeLeft()
      if (timeRemaining > 0) {
        const days = Math.floor(timeRemaining / MS_PER_DAY)
        let lesstime = timeRemaining - (days * MS_PER_DAY)
        const hours = Math.floor(lesstime / MS_PER_HOUR)
        lesstime = lesstime - (hours * MS_PER_HOUR)
        const min = Math.floor(lesstime / MS_PER_MIN)
        lesstime = lesstime - (min * MS_PER_MIN)
        const seg = Math.floor(lesstime / MS)

        let dayStr = ''
        if (days > 0) {
          dayStr = days === 1 ? `${days} day, ` : `${days} days, `
        }
        const hourStr = hours > 9 ? hours : `0${hours}`
        const minStr = min > 9 ? min : `0${min}`
        const segStr = seg > 9 ? seg : `0${seg}`
        return `${dayStr}${hourStr}:${minStr}:${segStr}`
      }
      const now = new Date()
      const end = new Date(this.expiration)
      let diff = date.getDateDiff(now, end, 'days')
      if (diff === 0) {
        diff = date.getDateDiff(now, end, 'hours')
        diff += diff === 1 ? ' hour' : ' hours'
      } else {
        diff += diff === 1 ? ' day' : ' days'
      }

      return `Closed ${diff} ago`
    }
  }
}
</script>

<template lang="pug">
//- widget.cursor-pointer.q-mb-md(
//-   :class="{ 'full-width': list, 'q-mr-md': card }"
//-   :style="{ 'max-width': card ? '320px' : 'inherit' }"
//-   :outlined="expired"
//-   :color="color"
//-   :background="expired ? 'internal-bg' : 'white'"
//-   @click.native="$router.push({ name: 'proposal-detail', params: { hash } })"
//- )
widget.cursor-pointer.card(
  :color="color"
  noPadding
  :background="background"
  :class="{ 'full-width': list}"
  @click.native="$router.push({ name: 'proposal-detail', params: { docId } })"
)
  .row.justify-center.items-center
    div(
      :style="{ 'min-height': card ? '344px': '145px', 'max-width': card ? '302px' : '940px', 'full-width': list, 'background': 'white' }"
      :class="{'q-px-lg': card, 'q-py-xl': card, 'q-px-xl': list, 'col': list}"
      ).row.items-center.justify-between.round-corners
      //- q-btn.absolute-top-right.vote-btn(v-if="vote" :color="vote.color" round :icon="vote.icon" size="sm" padding="sm")
        q-tooltip(anchor="top middle" self="bottom middle" :content-style="{ 'font-size': '1em' }"
          ) You voted '{{ vote.vote }}' on this proposal
      .col-8(:class="{ 'col-12': card}" :style="{ height: list ? 'inherit' : '145px' }")
        .row.items-center
          chips(v-if="tags" :tags="tags" chipSize="sm")
          .q-my-auto.h-b3.text-italic.text-body(v-if="subtitle && list") {{ subtitle }}
        //- .row.two-lines
        .q-mb-xxs.h-b3.text-italic.text-body(v-if="subtitle && card") {{ subtitle }}
        .h-h5.two-lines(v-if="title" :class="{ 'one-line': list }") {{ title }}
        .row.items-center
          .row
            profile-picture(
              :username="proposer"
              showName
              lightName
              size="20px"
            )
          .row.items-center.q-ml-sm(v-if="list")
            q-icon(name="fas fa-hourglass-half")
            .h-b2.text-center.text-body.q-ml-xs {{ timeLeftString() }}
      .col-4(:class="{ 'col-12': card }")
        voting-result(v-bind="voting" :expired="expired" v-if="(!expired && !accepted) || (!expired && accepted)" :colorConfig="colorConfig" :colorConfigQuorum="colorConfigQuorum").q-my-xl
        .row.status-border.q-pa-xs.justify-center.q-my-xxxl(
          :class="{ 'text-positive': expired && accepted, 'text-negative': expired && !accepted }"
          v-else
        )
          .col-1.flex.items-center.justify-center
            q-icon(:name="expired && accepted ? 'fas fa-check' : 'fas fa-times'").q-ml-xs
          .col
            .h-b2.text-center(:class="{ 'text-positive': expired && accepted, 'text-negative': expired && !accepted }") {{ proposalStatus }}
          .col-1
      .col-12(v-if="card")
        .row.items-center.justify-center(v-show="status !== 'drafted'")
            q-icon(name="fas fa-hourglass-half" size="11px")
            .h-b2.text-center.text-body.q-ml-xs {{ timeLeftString() }}
    .h-b2.text-center.text-white.indicator(v-if="card || list" :class="{ 'rotate-text': list }") {{ voteTitle }}
</template>

<style lang="stylus" scoped>
.round-corners
  border-radius: 25px

.two-lines,
.one-line
  overflow: hidden
  display: -webkit-box
  -webkit-line-clamp: 2
  -webkit-box-orient: vertical
  height: 57px
.one-line
  -webkit-line-clamp: 1
  max-width: 439px
  height: auto
.vote-btn
  margin-right -8px
  margin-top -8px
.horizontal-flex
  flex-direction: 'row'
.indicator
  flex: 0.1
.container-widget
  flex: 1 0 auto
.rotate-text
  writing-mode: vertical-rl
  transform: rotate(-180deg)
  display: flex
  align-items: center
  max-width 25px
.status-border
  border: 2px solid currentColor
  border-radius: $button-rounded-border-radius
.text-limit
  max-width: 440px
  overflow: hidden
  text-overflow: ellipsis
  display: -webkit-box
  line-clamp: 2
  -webkit-line-clamp: 2
  -webkit-box-orient: vertical
</style>
