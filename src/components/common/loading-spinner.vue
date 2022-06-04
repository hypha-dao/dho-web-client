<script>
import { colors } from 'quasar'
const { getPaletteColor } = colors

/**
 * Shows a spinner with a given size and color
 */
export default {
  name: 'loading-spinner',
  props: {
    /**
     * Size for the spinner
     */
    size: {
      type: String,
      default: '40px'
    },
    /**
     * Color for the spinner
     */
    color: {
      type: String,
      default: getPaletteColor('primary')
    }
  },
  methods: {
    getPaletteColor (color) {
      return colors.getPaletteColor(color)
    }
  }
}
</script>

<template lang="pug">
q-spinner-tail(
    :color = "getPaletteColor(color)"
    :size = "size"
)
</template>
