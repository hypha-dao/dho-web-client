<script>
/**
 * Widget that allows voting on a contribution.
 */
export default {
  name: 'voting',
  components: {
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
    unity: Number,
    quorum: Number,
    expiration: String,
    title: {
      type: String,
      default: 'Voting'
    },
    vote: String,
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
      if (this.voting) return 'primary'
      if (this.expired) {
        if (this.accepted) return 'positive'
        return 'negative'
      }
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
    }
  }
}
</script>

<template lang="pug">
widget(:title="title" noPadding :background="background" :flatBottom="fixed")
  .q-mx-md.q-px-md.q-mt-md
    .row.full-width
      voting-result(:unity="unity" :quorum="quorum")
    .row.justify-center.q-my-lg
      q-btn.q-px-xl(no-caps rounded color="primary" @click="voting = !voting") Vote now
    .row.justify-center
      .text-body2.text-italic(
        :class="{ 'text-grey-6': !expired, 'text-positive': expired && accepted, 'text-negative': expired && !accepted }"
      ) {{ timeLeftString }}
</template>
