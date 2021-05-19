<script>
/**
 * Display a progress bar representing a percentage.
 * After passing the threshold the progress bar changes from red to green.
 */
export default {
  name: 'progress-percentage',
  props: {
    /**
     * Fontawesome string for icon to left of title
     */
    icon: String,
    /**
     * Title string for label above progress bar
     */
    title: String,
    /**
     * Percentage [0,1] where the progress bar changes from red to green
     */
    threshold: Number,
    /**
     * Percentage [0,1] of progress bar that is filled
     */
    value: {
      type: Number,
      default: 0
    }
  }
}
</script>

<template lang="pug">
.q-gutter-sm
  .row.justify-between(v-if="title")
    .row.items-center.q-gutter-sm
      q-icon(:name="icon")
      .text-bold {{ title }}
    .row.items-center.q-gutter-xs
      .text-bold {{ Math.round(value * 10000) / 100 + '%'}}
      .text-grey {{ '(' + (threshold * 100).toFixed(0) + '% needed)' }}
      q-icon(v-if="value >= threshold" color="positive" name="fas fa-check")
      q-icon(v-else color="negative" name="fas fa-times")
  q-linear-progress(rounded :color="value >= threshold ? 'positive' : 'negative'" :value="value")
</template>
