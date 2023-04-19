<script lang="ts">
import { defineComponent } from 'vue'

/**
 * Display a progress bar representing a percentage.
 * After passing the threshold the progress bar changes from red to green.
 */
export default defineComponent({
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
    threshold: { type: Number, required: true },
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
      default: () => ({
        text: { 'text-disabled': true },
        progress: 'disabled',
        icons: 'disabled',
        track: 'null'
      })
    }
  }
})
</script>

<template lang="pug">
.row.items-center.q-gutter-sm
  .row.items-center.justify-between(:class="{'full-width': !mini}")
    .row.items-center
      q-icon.on-left(
        :color="colorConfig.icons"
        :name="icon"
      )
      .on-right.text-bold(v-if="!mini") {{title}}
    .row.items-center(v-if="!mini")
      .text-bold.q-mr-xs {{(value * 100).toFixed(2) + '%'}}
      .text-grey.q-mx-xs {{'(' + (threshold * 100).toFixed(0) + '% needed)'}}
      q-icon(
        color="positive"
        name="fas fa-check"
        v-if="value >= threshold"
      )
      q-icon(
        color="negative"
        name="fas fa-times"
        v-else
      )
  .col(v-if="mini")
    q-linear-progress(
      :class="{'color-opacity': colorConfig.opacity}"
      :color="colorConfig.progress"
      :track-color="colorConfig.track"
      :value="value"
      rounded
    )
  q-linear-progress(
    :class="{'color-opacity': colorConfig.opacity}"
    :color="colorConfig.progress"
    :track-color="colorConfig.track"
    :value="value"
    rounded
    v-else
  )
  .row.items-center(v-if="mini")
    .on-right.text-bold(:class="colorConfig.text") {{(value * 100).toFixed(2) + '%'}}
</template>

<style lang="stylus" scoped>
.color-opacity
  background: $negative
</style>
