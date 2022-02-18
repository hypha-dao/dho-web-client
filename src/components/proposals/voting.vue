<script>
import { mapActions, mapGetters } from 'vuex'
import { date } from 'quasar'

/**
 * Widget that allows voting on a contribution.
 */
export default {
  name: 'voting',
  components: {
    ProposalStaging: () => import('./proposal-staging.vue'),
    VotingOption5Scale: () => import('./voting-option-5-scale.vue'),
    VotingOptionYesNo: () => import('./voting-option-yes-no.vue'),
    VotingResult: () => import('./voting-result.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    /**
     * String that determines the voting option to display.
     * Valid options: `yes-no` | `5-scale`
     */
    method: {
      type: String,
      default: '5-scale',
      validator: (val) => ['yes-no', '5-scale'].includes(val)
    },
    hash: String,
    unity: Number,
    quorum: Number,
    expiration: String,
    staging: Boolean,
    submitting: Boolean,
    title: {
      type: String,
      default: 'Vote'
    },
    vote: {
      type: String,
      default: null
    },
    fixed: Boolean,
    active: Boolean
  },

  data () {
    return {
      voting: false
    }
  },

  computed: {
    ...mapGetters('accounts', ['isMember']),

    accepted () {
      return this.quorum >= 0.20 && this.unity >= 0.80
    },

    background () {
      if (this.voting || this.staging) return 'primary'
      if (this.expired && this.accepted) return 'positive'
      if (this.suspended) return 'grey'
      if (this.expired) return 'negative'
      return 'white'
    },

    expired () {
      return this.timeLeft < 0
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
        const hours = Math.floor((this.timeLeft % MS_PER_DAY) / MS_PER_HOUR)
        const min = Math.floor(((this.timeLeft % MS_PER_DAY) / MS_PER_HOUR) / MS_PER_MIN)
        const seg = Math.floor((((this.timeLeft % MS_PER_DAY) / MS_PER_HOUR)) / MS)

        let dayStr = ''
        if (days > 0) {
          dayStr = days === 1 ? `${days} day, ` : `${days} days, `
        }
        const hourStr = hours > 9 ? hours : `0${hours}`
        const minStr = min > 9 ? min : `0${min}`
        const segStr = seg > 9 ? seg : `0${seg}`

        return `This vote will close in ${dayStr}${hourStr}:${minStr}:${segStr}`
      }
      const end = new Date(this.expiration)
      const format = date.formatDate(end, 'MMM D,YYYY')

      return `On ${format}`
    },

    voteString () {
      const title = 'You voted '
      if (this.vote === 'pass') return `${title} yes`
      if (this.vote === 'abstain') return `${title} abstain`
      if (this.vote === 'fail') return `${title} no`

      return 'You did not vote'
    },
    backgroundButton () {
      if (this.expired) return { 'bg-negative': true }
      if (this.vote === 'pass') return { 'bg-positive': true }
      if (this.vote === 'fail') return { 'bg-negative': true }
      if (this.vote === 'abstain') return { 'bg-grey': true }

      return null
    },

    widgetTitle () {
      if (this.staging) return null
      if (this.expired) {
        if (this.accepted) return 'Accepted'
        return 'Rejected'
      }
      return this.title
    },
    colorConfig () {
      const config = {
        progress: '',
        icons: '',
        text: {}
      }

      if (this.expired) {
        config.progress = config.icons = 'white'
        config.text['text-white'] = true
        return config
      }

      if (this.unity > 0) {
        config.progress = config.icons = 'positive'
        config.text['text-positive'] = true
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

      if (this.expired) {
        config.progress = config.icons = 'white'
        config.text['text-white'] = true
        return config
      }

      return undefined
    }
  },

  methods: {
    ...mapActions('ballots', ['castVote']),

    async onCastVote (vote) {
      await this.castVote({
        hash: this.hash,
        vote
      })
      this.voting = false
      this.$emit('voting')
    },
    onActive () {
    }
  }
}
</script>

<template lang="pug">
widget(:title="widgetTitle" noPadding :background="background" :textColor="expired || voting ? 'white' : 'primary'" :flatBottom="fixed" :class="{'q-pb-md': expired}")
  template(v-slot:header)
    .col.flex.justify-end.items-center.q-mr-lg
      q-icon.cursor-pointer(name="fas fa-times" color="white" @click="voting = !voting" size="sm" v-if="voting")
      .text-primary(:class="{ 'text-white': (expired || voting) }" v-if="expired") {{ timeLeftString }}
  .q-mx-md.q-px-md
    proposal-staging(v-if="staging")
    .column(v-else-if="voting")
      q-btn.q-mb-sm(unelevated rounded no-caps color="white" text-color="primary" label="Yes" @click="onCastVote('pass')")
      q-btn.q-my-sm(unelevated rounded no-caps color="white" text-color="primary" label="Abstain" @click="onCastVote('abstain')")
      q-btn.q-mt-sm(unelevated rounded no-caps color="white" text-color="primary" label="No" @click="onCastVote('fail')")
    .column(v-else)
      .row.full-width
        voting-result(:unity="unity" :quorum="quorum" :expired="expired" :colorConfig="colorConfig" :colorConfigQuorum="colorConfigQuorum")
      .row.justify-center.q-my-lg(v-if="!staging && !expired && !vote && isMember")
        q-btn.q-px-xl(no-caps rounded color="primary" @click="voting = !voting") Vote now
      .row.justify-center.q-my-lg(v-else-if="!expired")
        q-btn.full-width(no-caps rounded color="white" outline disable @click="voting = !voting" :class="backgroundButton") {{ voteString }}
        q-btn.q-mt-md.full-width(v-if="accepted && active" no-caps rounded color="white" text-color="positive" @click="onActive") Active
    .column(v-if="!expired")
      .row.justify-center
        .text-body2.text-italic.text-grey-6.q-my-md {{ timeLeftString }}
</template>
