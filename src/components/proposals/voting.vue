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
    }
  }
}
</script>

<template lang="pug">
widget(title="Voting" noPadding)
  .q-mx-md.q-px-md
    // .text-subtitle1.text-bold Vote endorsed by HVoice
    voting-result
    // component.q-my-lg(:is="'voting-option-' + method")
    .row.justify-center.q-mt-lg
      q-btn(rounded color="primary").q-px-xl Vote
</template>
