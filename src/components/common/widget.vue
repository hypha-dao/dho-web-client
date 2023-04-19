<script lang="ts">
import { defineComponent } from 'vue'

/**
 * Base component for any card-like element on screen
 * Handles title styling, margins and content padding
 */
export default defineComponent({
  name: 'widget',
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
    titleNoWrap: Boolean,
    titleSize: String,

    morePosition: String,
    tooltip: String,

    noTitle: Boolean,

    scrollList: Boolean
  },

  computed: {
    textClass(): any {
      const clazz = {
        'q-mx-md': this.noPadding
      }
      if (this.textColor) {
        clazz[`text-${this.textColor}`] = true
      }
      if (this.titleNoWrap) {
        clazz['text-no-wrap'] = true
      }
      if (this.titleSize) {
        clazz[`${this.titleSize}`] = true
      }
      return clazz
    },

    titleClass() {
      if (this.bar) {
        const clazz = {}
        clazz[`bg-${this.titleColor}`] = true
        return clazz
      }

      return null
    },

    widgetClass(): any {
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
})
</script>

<template lang="pug">
q-card.widget.relative-position(
  :class="{...widgetClass, 'q-py-xl': !noPadding, 'q-px-xl': !noPadding}"
  flat
)
  q-card-section.q-pa-none.row.items-center(
    :class="titleClass"
    :style="{height: titleHeight}"
    v-if="bar"
  )
    img(:src="titleImage")
    .h-h4.text-bold.q-ml-sm(
      :class="textClass"
      v-if="!noTitle"
    ) {{title}}
  q-card-section.q-pa-none.full-height(
    :class="{'flex row no-wrap items-center': scrollList}"
  )
    .row.justify-between
      .col
        .h-h4(
          :class="textClass"
          v-if="title && !bar && !noTitle"
        ) {{title}}
          q-icon.q-ml-xs(
            color="body"
            name="fas fa-info-circle"
            size="16px"
            v-if="tooltip"
          )
            q-tooltip {{tooltip}}
      slot(name="header")
      .col-auto(v-if="more && morePosition == 'top'")
        q-btn.h-btn2(
          @click="$emit('more-clicked')"
          flat
          no-caps
          rounded
          text-color="primary"
        ) See all
    slot
    .q-mt-lg(
      v-if="more && morePosition != 'top'"
      vertical
    )
      q-btn.h-btn2.q-mx-lg.full-width(
        @click="$emit('more-clicked')"
        no-caps
        outline
        rounded
        text-color="primary"
      ) See all
</template>

<style lang="stylus" scoped>
.widget
  min-width: 0px !important;
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
