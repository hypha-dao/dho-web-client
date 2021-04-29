<script>
/**
 * Base component for any card-like element on screen
 * Handles title styling, margins and content padding
 */
export default {
  name: 'widget',
  props: {
    bar: Boolean,
    more: Boolean,
    noPadding: Boolean,
    title: String
  }
}
</script>

<template lang="pug">
q-card.widget
  q-card-section(v-if="bar" :class="{ 'title-section': bar }")
    .text-body1.text-bold.q-px-sm {{ title }}
  q-card-section.q-mt-md(:class="{ 'q-px-none': noPadding }")
    .text-subtitle1.text-bold.text-primary.q-mb-md(v-if="title && !bar") {{ title }}
    slot
    .q-mb-md(v-if="!more")
  q-card-actions(v-if="more" vertical)
    q-separator.q-mx-lg
    q-btn.q-mx-lg(text-color="primary" flat no-caps @click="$emit('more-clicked')") More
</template>

<style lang="stylus" scoped>
.widget
  border-radius 43px
  box-shadow 0 3px 5px -1px rgba(0 0 0 0.1), 0 6px 10px rgba(0 0 0 0.07), 0 1px 18px rgba(0 0 0 0.04)

  .title-section
    color #756F86
    background-color #DAE8EE
</style>
