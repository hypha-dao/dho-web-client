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
q-card(flat).widget
  q-card-section(v-if="bar" :class="{ 'title-section': bar }")
    .text-body1.text-bold.q-px-sm {{ title }}
  q-card-section.q-mt-sm(:class="{ 'q-px-none': noPadding }")
    .text-h5.text-bold.q-pa-md(v-if="title && !bar" :class="{ 'q-mx-md': noPadding }") {{ title }}
    slot
  q-card-actions(v-if="more" vertical)
    q-btn(flat @click="$emit('more-clicked')").more-button MORE
</template>

<style lang="stylus" scoped>
.widget
  border-radius 25px

  .title-section
    color #756F86
    background-color #DAE8EE

  .more-button
    color #0880AE
</style>
