<script lang="ts">
import { defineComponent } from 'vue'

/**
 * Shows a spinner with a given size and color
 */
export default defineComponent({
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
      default: 'primary'
    }
  }
})
</script>

<template lang="pug">
q-spinner-tail(:color="color", :size="size")
</template>
