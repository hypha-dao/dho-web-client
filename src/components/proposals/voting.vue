<script>
import { mapActions } from 'vuex'

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
    fixed: Boolean
  },

  data () {
    return {
      voting: false
    }
  },

  computed: {
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

      if (this.timeLeft > 0) {
        const days = Math.floor(this.timeLeft / MS_PER_DAY)
        const hours = Math.floor((this.timeLeft % MS_PER_DAY) / MS_PER_HOUR)
        const dayStr = days ? `${days}d ` : ''
        const hourStr = hours ? `${hours}hr${hours > 1 ? 's ' : ' '}` : ''
        return `The vote will close in ${dayStr}${hourStr}`
      }

      return this.accepted ? 'Proposal accepted' : 'Proposal rejected'
    },

    voteString () {
      if (this.vote !== null) {
        return `You voted '${this.vote}'`
      }

      return 'You did not vote'
    },

    widgetTitle () {
      if (this.staging) return null
      if (this.expired) {
        if (this.accepted) return 'Accepted'
        return 'Rejected'
      }
      return this.title
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
    }
  }
}
</script>

<template lang="pug">
widget(:title="widgetTitle" noPadding :background="background" :textColor="expired || voting ? 'white' : 'primary'" :flatBottom="fixed")
  .q-mx-md.q-px-md
    proposal-staging(v-if="staging")
    .column(v-else-if="voting")
      q-btn.q-mb-sm(unelevated rounded no-caps color="white" text-color="primary" label="Yes" @click="onCastVote('pass')")
      q-btn.q-my-sm(unelevated rounded no-caps color="white" text-color="primary" label="Abstain" @click="onCastVote('abstain')")
      q-btn.q-mt-sm(unelevated rounded no-caps color="white" text-color="primary" label="No" @click="onCastVote('fail')")
    .column(v-else)
      .row.full-width
        voting-result(:unity="unity" :quorum="quorum" :expired="expired")
      .row.justify-center.q-my-lg(v-if="!staging && !expired")
        q-btn.q-px-xl(no-caps rounded color="primary" @click="voting = !voting") Vote now
      .row.justify-center.q-my-lg(v-else)
        q-btn.q-px-xl(no-caps rounded color="white" outline @click="voting = !voting") {{ voteString }}
    .column(v-if="!expired")
      .row.justify-center
        .text-body2.text-italic.text-grey-6 {{ timeLeftString }}
</template>
