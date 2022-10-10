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
    titleImage: String,

    morePosition: String,
    tooltip: String,

    noTitle: Boolean
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
q-card.widget(flat :class="{ ...widgetClass, 'q-py-xl': !noPadding, 'q-px-xl': !noPadding }" )
  q-card-section.q-pa-none.row.items-center(v-if="bar" :class="titleClass" :style="{ height: titleHeight }")
    img(:src="titleImage")
    .h-h4.text-bold.q-ml-sm(:class="textClass" v-if="!noTitle") {{ title }}
  q-card-section.q-pa-none.full-height
    .row.justify-between
      .col
        .h-h4(v-if="title && !bar && !noTitle" :class="textClass") {{ title }}
          q-icon(name="fas fa-info-circle" size="16px" color="body" class="q-ml-xs" v-if="tooltip")
            q-tooltip {{ tooltip }}
      slot(name="header")
      .col-auto(v-if="more && morePosition == 'top'")
        q-btn.h-btn2(rounded text-color="primary" flat no-caps @click="$emit('more-clicked')") See all
    slot
    .q-mt-lg(v-if="more && morePosition != 'top'" vertical)
      q-btn.h-btn2.q-mx-lg.full-width(text-color="primary" rounded no-caps outline @click="$emit('more-clicked')") See all
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
