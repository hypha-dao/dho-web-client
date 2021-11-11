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
    vote: String
  },

  computed: {
    accepted () {
      return this.quorum >= 0.20 && this.unity >= 0.80
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
widget(title="Voting" noPadding)
  .q-mx-md.q-px-md
    // .text-subtitle1.text-bold Vote endorsed by HVoice
    voting-result(:unity="unity" :quorum="quorum")
    // component.q-my-lg(:is="'voting-option-' + method")
    .row.justify-center.q-my-lg
      q-btn.q-px-xl(no-caps disable rounded color="primary") Vote now
    .row
      .text-body2.text-italic.text-center(
        :class="{ 'text-grey-6': !expired, 'text-positive': expired && accepted, 'text-negative': expired && !accepted }"
      ) {{ timeLeftString }}
</template>
