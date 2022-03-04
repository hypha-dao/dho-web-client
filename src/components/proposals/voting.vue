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
    docId: String,
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
    active: Boolean,
    status: String,
    type: String
  },

  data () {
    return {
      voting: false
    }
  },

  computed: {
    ...mapGetters('accounts', ['isMember']),

    accepted () {
      return (this.quorum >= 0.20 && this.unity >= 0.80) || this.status === 'approved'
    },

    background () {
      if (this.voting || this.staging) return 'primary'
      if (this.expired && this.accepted) return 'positive'
      if (this.suspended) return 'grey'
      if (this.expired || this.archived) return 'negative'
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
      if (this.expired) return 'You did not vote'

      return null
    },
    backgroundButton () {
      if (this.accepted) return { 'bg-transparent': true }
      if (this.expired) return { 'bg-negative': true }
      if (this.vote === 'pass') return { 'bg-positive': true }
      if (this.vote === 'fail') return { 'bg-negative': true }
      if (this.vote === 'abstain') return { 'bg-grey': true }

      return null
    },

    widgetTitle () {
      if (this.staging) return null
      if (this.suspended) return 'Suspended'
      if (this.archived) return 'Archived'
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
    },
    canBeSuspended () {
      return this.status === 'approved' && ['assignment', 'role'].includes(this.type.toLowerCase())
    },
    suspended () {
      return this.status === 'suspended'
    },
    archived () {
      return this.status === 'rejected'
    }
  },

  methods: {
    ...mapActions('ballots', ['castVote']),

    async onCastVote (vote) {
      await this.castVote({
        docId: this.docId,
        vote
      })
      this.voting = false
      this.$emit('voting')
    },
    onActive () {
    },
    onApply () {
      this.$emit('on-apply')
    },
    onSuspend () {
      this.$emit('on-suspend')
    }
  }
}
</script>

<template lang="pug">
widget(:title="widgetTitle" noPadding :background="background" :textColor="expired || voting ? 'white' : 'primary'" :flatBottom="fixed")
  template(v-slot:header)
    .col.flex.justify-end.q-pt-md.q-px-md.q-mx-md
      .text-primary(:class="{ 'text-white': (expired || voting) }" v-if="expired") {{ timeLeftString }}
      q-icon.cursor-pointer.q-mb-xs.q-my-auto(name="fas fa-times" color="white" @click="voting = !voting" size="sm" v-if="voting")
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
      .row.justify-center.q-my-lg(v-if="(vote || expired) && status === 'proposed'")
        q-btn.full-width(no-caps rounded color="white" outline :class="backgroundButton") {{ voteString }}
        q-btn.q-mt-md.full-width(v-if="accepted && active" no-caps rounded color="white" text-color="positive" @click="onActive") Active
      .row.justify-center.q-my-lg(v-if="status === 'approved'")
        q-btn.q-mt-md.full-width.text-bold(no-caps rounded color="white" text-color="positive" @click="onSuspend") Suspend
        q-btn.q-mt-md.full-width.text-bold(no-caps rounded color="white" text-color="positive" @click="onApply") Apply
    .column(v-if="!expired")
      .row.justify-center
        .text-body2.text-italic.text-body.q-my-md {{ timeLeftString }}
</template>
