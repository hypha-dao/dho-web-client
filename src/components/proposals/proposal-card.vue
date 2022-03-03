<script>
/**
 * A widget containing brief details of a single proposal
 */
import { date } from 'quasar'
import { format } from '~/mixins/format'

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
    compensation: String,
    salary: String
  },

  computed: {
    list () {
      return this.view === 'list'
    },

    card () {
      return this.view === 'card'
    },

    accepted () {
      return (this.voting && this.voting.quorum >= 0.20 && this.voting.unity >= 0.80)
    },

    color () {
      if (this.accepted) {
        return 'positive'
      }

      return 'negative'
    },

    expired () {
      return this.timeLeft < 0
    },

    tags () {
      if (this.type === 'Payout') {
        const [usdAmount] = this.compensation.split(' ')
        return [
          { color: 'primary', label: 'Generic Contribution' },
          { color: 'primary', outline: true, label: `${this.shortNumber(usdAmount)} HUSD` }
        ]
      }

      if (this.type === 'Assignment' || this.type === 'Edit') {
        return [
          { color: 'primary', label: 'Role Assignment' }
          // { color: 'primary', outline: true, label: 'Circle One' }
          // { color: 'primary', label: 'B3' },
          // { color: 'grey-4', label: '80%', text: 'grey-7' }
        ]
      }

      if (this.type === 'Assignbadge') {
        return [
          { color: 'primary', label: 'Badge Assignment' },
          { color: 'primary', outline: true, label: 'Assign' }
          // { color: 'primary', outline: true, label: 'Circle One' }
        ]
      }

      if (this.type === 'Suspend') {
        return [
          { color: 'primary', label: 'Suspension' }
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
          { color: 'primary', outline: true, label: `${band} ${this.shortNumber(amount)}` }
        ]
      }

      if (this.type === 'Badge') {
        return [
          { color: 'primary', label: 'Badge' }
        ]
      }

      return null
    },

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
      if (this.timeLeft > 0) {
        const days = Math.floor(this.timeLeft / MS_PER_DAY)
        let lesstime = this.timeLeft - (days * MS_PER_DAY)
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
//-   :background="expired ? 'grey-4' : 'white'"
//-   @click.native="$router.push({ name: 'proposal-detail', params: { hash } })"
//- )
widget.cursor-pointer.q-mb-md(
  :class="{ 'full-width': list, 'q-mr-md': card , 'horizontal-flex': list}"
  :style="{ 'max-width': card ? '320px' : 'inherit' }"
  :color="color"
  noPadding
  :background="background"
  @click.native="$router.push({ name: 'proposal-detail', params: { docId } })"
)
  div(
    :class="{ 'flex': list, 'items-center': list }"
  )
    widget.container-widget(
      background="white"
    )
      q-btn.absolute-top-right.vote-btn(v-if="vote" :color="vote.color" round :icon="vote.icon" size="sm" padding="sm")
        q-tooltip(anchor="top middle" self="bottom middle" :content-style="{ 'font-size': '1em' }"
          ) You voted '{{ vote.vote }}' on this proposal
      .row.items-center.justify-between.q-my-md
        .col-8(:class="{ 'col-12': card, 'q-my-sm': card }" :style="{ height: list ? 'inherit' : '148px' }")
          .row.items-center.q-mb-sm
            chips(v-if="tags" :tags="tags")
          .q-ml-sm.b3.text-italic.text-grey-6(v-if="subtitle") {{ subtitle }}
          .q-ml-sm.h5.one-line.text-limit(v-if="title") {{ title }}
          .q-mt-sm.q-ml-sm
            .row.items-center.q-gutter-md
              profile-picture(
                :username="proposer"
                showUsername
                size="30px"
              )
              .row.items-center(v-if="list")
                q-icon(name="fas fa-hourglass-half")
                .b2.text-center.text-grey-6.q-ml-sm {{ timeLeftString }}
        .col-4(:class="{ 'col-12': card, 'q-my-sm': card, 'q-mt-xl': card }")
          voting-result(v-bind="voting" :expired="expired" v-if="(!expired && !accepted) || (!expired && accepted)")
          .row.status-border.q-my-sm.q-pa-sm.justify-center(
            :class="{ 'text-positive': expired && accepted, 'text-negative': expired && !accepted }"
            v-else
          )
            .col-2.flex.items-center.justify-center
              q-icon(:name="expired && accepted ? 'fas fa-check' : 'fas fa-times'")
            .col
              .b2.text-center(:class="{ 'text-positive': expired && accepted, 'text-negative': expired && !accepted }") {{ proposalStatus }}
        .col-12.q-mt-sm(v-if="card")
          .row.items-center.justify-center
              q-icon(name="fas fa-hourglass-half")
              .b2.text-center.text-grey-6.q-ml-sm {{ timeLeftString }}
      .q-mb-md(v-if="card")
    .b2.text-center.text-white.indicator(v-if="card || list" :class="{ 'rotate-text': list }") {{ voteTitle }}
</template>

<style lang="stylus" scoped>
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
  border-radius: 50px
.text-limit
  max-width: 440px
  overflow: hidden
  text-overflow: ellipsis
  display: -webkit-box
  line-clamp: 2
  -webkit-line-clamp: 2
  -webkit-box-orient: vertical
</style>
