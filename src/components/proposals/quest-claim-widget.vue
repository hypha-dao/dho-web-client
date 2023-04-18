<script>
import { PROPOSAL_STATE } from '~/const'

export default {
  name: 'quest-claim-widget',
  components: {
    Widget: () => import('~/components/common/widget.vue')
  },
  props: {
    isDisplaying: Boolean,
    state: String
  },
  computed: {
    title () { return this.state === PROPOSAL_STATE.APPROVED ? 'Claim your payment!' : 'Try Again!' },
    description () { return this.state === PROPOSAL_STATE.APPROVED ? 'Congratulation! Your Quest is completed and you can now claim your payment' : 'The voting session has marked your quest as not completed. What to do next? Take your time, complete the quest and simply submit another quest completion proposal.' },
    buttonText () { return this.state === PROPOSAL_STATE.APPROVED ? 'Claim Payment' : 'Quest Completion proposal' }
  }
}
</script>

<template lang="pug">
.quest-claim-widget(v-if="isDisplaying")
  widget
    .h-h5.q-mb-md {{ title }}
    .description.q-mt-md {{ description }}
    q-btn.q-mt-md.q-px-sm.text-white.full-width(noCaps rounded color="primary" @click="clickEvent") {{ buttonText }}
</template>

<styles lang="stylus"></styles>
