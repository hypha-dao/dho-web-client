<script>
export default {
  name: 'voting-result',
  components: {
    ProgressPercentage: () => import('~/components/common/progress-percentage.vue')
  },

  props: {
    /**
     * Percentage [0,1] of voters who approve of this contribution
     */
    approval: {
      type: Number,
      default: 0
    },
    /**
     * Percentage [0,1] of total voting power that has voted on this contribution
     */
    quorum: {
      type: Number,
      default: 0
    }
  }
}
</script>

<template lang="pug">
.q-gutter-sm
  progress-percentage(
    icon="far fa-thumbs-up"
    title="Unity"
    :threshold="0.80"
    :value="approval"
  )
  progress-percentage(
    icon="fas fa-users"
    title="Quorum"
    :threshold="0.20"
    :value="quorum"
  )
</template>
