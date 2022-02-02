<script>
/**
 * Base component for any card-like element on screen
 * Handles title styling, margins and content padding
 */
export default {
  name: 'widget',
  components: {
    EditControls: () => import('~/components/common/edit-controls.vue')
  },
  props: {
    /**
     * Whether to render the title in a separate bar
     */
    bar: Boolean,
    /**
     * The background color of the widget
     */
    background: String,
    /**
     * A color for the border
     */
    color: String,
    flatBottom: Boolean,
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
    outlined: Boolean,
    shadow: Boolean,
    textColor: String,
    /**
     * The title string for this widget
     */
    title: String,
    titleColor: String,
    titleHeight: String,
    titleImage: String
  },

  computed: {
    textClass () {
      const clazz = {
        'q-mx-md': this.noPadding
      }
      if (this.textColor) {
        clazz[`text-${this.textColor}`] = true
      }
      return clazz
    },

    titleClass () {
      if (this.bar) {
        const clazz = {}
        clazz[`bg-${this.titleColor}`] = true
        return clazz
      }

      return null
    },

    widgetClass () {
      const clazz = {
        shadowed: this.shadow,
        'positive-border': this.outlined && this.color === 'positive',
        'negative-border': this.outlined && this.color === 'negative',
        'rounded-top': true,
        'rounded-bottom': !this.flatBottom
      }
      clazz[`bg-${this.background}`] = true
      return clazz
    }
  }
}
</script>

<template lang="pug">
q-card.widget(flat :class="widgetClass")
  q-card-section(v-if="bar" :class="titleClass" :style="{ height: titleHeight }")
    img(:src="titleImage")
    .text-body1.text-bold.q-px-sm(:class="textClass") {{ title }}
  q-card-section(:class="{ 'q-px-none': noPadding }")
    .row.justify-between
      .col
        .text-h6.q-pa-md(v-if="title && !bar" :class="textClass") {{ title }}
    div(:class="{ 'q-mx-md': !noPadding }")
      slot
    .q-mb-md(v-if="!more && title")
  q-card-actions(v-if="more" vertical)
    q-separator.q-mx-lg
    q-btn.q-mx-lg(text-color="primary" flat no-caps @click="$emit('more-clicked')") More
</template>

<style lang="stylus" scoped>
.rounded-top
  border-top-left-radius 26px
  border-top-right-radius 26px
.rounded-bottom
  border-bottom-left-radius 26px
  border-bottom-right-radius 26px

.dashed
  border 2px dashed rgba(0 0 0 0.25)

.shadowed
  box-shadow 0 4px 8px rgba(0 0 0 0.05), 0 1px 16px rgba(0 0 0 0.025) !important

.positive-border
  border 2px solid $positive

.negative-border
  border 2px solid $negative
</style>
