<script lang="ts">
import { defineComponent } from 'vue'

/**
 * A component to display an information icon with a tooltip
 */
export default defineComponent({
  name: 'info-tooltip',

  props: {
    /**
     * The tooltip string, if undefined, the icon will not be displayed
     */
    tooltip: {
      type: String,
      default: undefined
    }
  }
})
</script>

<template lang="pug">
q-icon(name="fas fa-info-circle" size="15px" color="body" class="q-ml-xs" v-if="tooltip")
  q-tooltip {{ tooltip }}
</template>

<style lang="stylus" scoped></style>
