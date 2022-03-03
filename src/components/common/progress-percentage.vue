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
    },
    mini: Boolean,
    colorConfig: {
      type: Object,
      default: () => ({ text: { 'text-disabled': true }, progress: 'disabled', icons: 'disabled' })
    }
  }
}
</script>

<template lang="pug">
.row.items-center.q-gutter-sm
  .row.items-center.justify-between(:class="{ 'full-width': !mini }")
    .row.items-center
      q-icon.on-left(:name="icon" :color="colorConfig.progress")
      .on-right.text-bold(v-if="!mini") {{ title }}
    .row.items-center(v-if="!mini")
      .text-bold.q-mr-xs {{ Math.round(value * 100) + '%'}}
      .text-grey.q-mx-xs {{ '(' + (threshold * 100).toFixed(0) + '% needed)' }}
      q-icon(v-if="value >= threshold" color="positive" name="fas fa-check")
      q-icon(v-else color="negative" name="fas fa-times")
  .col(v-if="mini")
    q-linear-progress(rounded :color="colorConfig.progress" :value="value")
  q-linear-progress(v-else rounded :color="colorConfig.progress" :value="value")
  .row.items-center(v-if="mini")
    .on-right.text-bold(:class="colorConfig.text") {{ Math.round(value * 100) + '%'}}
</template>
