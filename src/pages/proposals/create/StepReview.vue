<script>
export default {
  name: 'step-review',
  components: {
    ProposalView: () => import('~/components/proposals/proposal-view.vue')
  },

  props: {
    config: Object,
    proposal: Object,
    selection: String
  }
}
</script>

<template lang="pug">
widget
  .text-h6 Review
  proposal-view(
    v-bind="proposal"
    preview
  )
</template>
