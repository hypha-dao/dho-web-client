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
    unity: {
      type: Number,
      default: 0
    },
    /**
     * Percentage [0,1] of total voting power that has voted on this contribution
     */
    quorum: {
      type: Number,
      default: 0
    },
    expired: Boolean,
    colorConfig: Object,
    colorConfigQuorum: Object
  }
}
</script>

<template lang="pug">
.voting-result.full-width
  progress-percentage.q-mb-md(
    icon="fas fa-vote-yea"
    title="Unity"
    :threshold="0.80"
    :value="unity"
    :colorConfig="colorConfig"
    mini
  )
  progress-percentage(
    icon="fas fa-users"
    title="Quorum"
    :threshold="0.20"
    :value="quorum"
    :colorConfig="colorConfigQuorum"
    mini
  )
</template>
