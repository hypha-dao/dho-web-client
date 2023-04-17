<script>
export default {
  name: 'quest-claim-widget',
  data () {
    return {}
  },
  props: {
    state: String,
    isDisplaying: Boolean
  },
  components: {
    Widget: () => import('~/components/common/widget.vue')
  },
  computed: {
    title () {
      return this.state === 'approved' ? 'Claim your payment!' : 'Try Again!'
    },
    description () {
      return this.state === 'approved' ? 'Congratulation! Your Quest is completed and you can now claim your payment' : 'The voting session has marked your quest as not completed. What to do next? Take your time, complete the quest and simply submit another quest completion proposal.'
    },
    buttonText () {
      return this.state === 'approved' ? 'Claim Payment' : 'Quest Completion proposal'
    }
  },
  methods: {
    clickEvent () {}
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
