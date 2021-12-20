<script>
/**
 * Base component for any card-like element on screen
 * Handles title styling, margins and content padding
 */
export default {
  name: 'widget',
  props: {
    /**
     * Whether to render the title in a separate bar
     */
    bar: Boolean,
    /**
     * Whether to render a more button
     * When clicked, the more button emits a 'more-clicked' event
     */
    more: Boolean,
    /**
     * Whether to remove the horizontal content padding
     * Use this when you want content to go to the very edge
     */
    noPadding: Boolean,
    shadow: Boolean,
    /**
     * The title string for this widget
     */
    title: String
  }
}
</script>

<template lang="pug">
q-card.widget(flat :class="{ 'shadowed': shadow }")
  q-card-section(v-if="bar" :class="{ 'title-section': bar }")
    .text-body1.text-bold.q-px-sm {{ title }}
  q-card-section(:class="{ 'q-px-none': noPadding }")
    .text-h6.q-pa-md(v-if="title && !bar" :class="{ 'q-mx-md': noPadding }") {{ title }}
    div(:class="{ 'q-mx-md': !noPadding }")
      slot
    .q-mb-md(v-if="!more && title")
  q-card-actions(v-if="more" vertical)
    q-separator.q-mx-lg
    q-btn.q-mx-lg(text-color="primary" flat no-caps @click="$emit('more-clicked')") More
</template>

<style lang="stylus" scoped>
.widget
  border-radius 32px

  .shadowed
    box-shadow 0 4px 8px rgba(0 0 0 0.05), 0 1px 16px rgba(0 0 0 0.025) !important

  .title-section
    color #756F86
    background-color #DAE8EE
</style>
