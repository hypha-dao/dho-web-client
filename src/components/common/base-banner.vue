<script lang="ts">
import { colors } from 'quasar'
import { defineComponent } from 'vue'
import helpers from '~/mixins/helpers'
const { getPaletteColor } = colors

/**
 * Shows a info card with the provided title, subtitle, and style
 */
export default defineComponent({
  name: 'base-banner',
  mixins: [helpers],

  props: {
    /**
     * Title text for the banner
     */
    title: {
      type: String
    },
    /**
     * Subtitle text for the banner
     */
    description: {
      type: String
    },
    /**
     * Color (background) for the banner
     */
    color: {
      type: String,
      default: getPaletteColor('primary')
    },
    /**
     * Text color for the banner
     */
    textColor: {
      type: String,
      default: 'black'
    },
    /**
     * The background image url
     * If undefined, the background will be pattern on a solid color
     */
    background: {
      type: String,
      default: undefined
    },
    /**
     * The pattern image (in svg)
     */
    pattern: {
      type: String,
      default: undefined
    },

    gradient: {
      type: Boolean,
      default: true
    },

    split: Boolean,
    compact: Boolean,
    contentFullWidth: Boolean,
    upvoteBanner: Boolean
  },

  methods: {
    getPaletteColor
  }
})
</script>

<template lang="pug">
.base-banner.full-width.rounded-full.relative-position.overflow-hidden(:class="{'compact-banner': compact}" :style="{background: color}")
  #banner-pattern.absolute(:style="{background: `url('${pattern}') repeat`, 'background-size': '200px'}" v-if="pattern")
  #banner-image.absolute(:style="{background: `url('${background}') no-repeat`, 'background-size': 'cover'}" :class="{ 'upvote-banner': upvoteBanner }" v-if="background")
  #linear-gradient.absolute.z-40(v-if="gradient")
  .content.relative-position.z-50.full-height.q-pa-xl(:class="{'q-pa-xxxl': $q.screen.gt.sm}")
    .absolute-top-right.z-50.q-pa-sm(v-if="hasListener('onClose') || hasSlot('top-right')")
      slot(name="top-right")
      q-btn.absolute-top-right.q-pa-sm.close-btn(@click="$emit('onClose')" color="white" flat icon="fas fa-times" round size="sm" v-show="!hasSlot('top-right')")
    slot(name="header")
    section.row
      div(:class="{'col-6': split || hasSlot('right'), 'full-width': contentFullWidth}" v-if="!compact")
        h3.q-pa-none.q-ma-none.h-h2.text-white.text-weight-700 {{title}}
        p.h-b1.text-white.q-my-lg.text-weight-500.leading-loose {{description}}
        nav.q-mt-xl
          slot(name="buttons")
      .col-6(v-if="!compact")
        slot(name="right")
      nav.full-width(v-if="compact")
        .column.justify-between.flex.full-height
          h3.q-pa-none.q-ma-none.h-h2.text-white {{title}}
          .row.q-gutter-sm.q-mt-md
            slot(name="buttons")
</template>

<style lang="stylus" scoped>
#linear-gradient
  width 100%
  height 100%
  background: linear-gradient(268deg,rgba(0,0,0,0),rgba(0,0,0,0.3))
  opacity 0.7

#banner-pattern, #banner-image
  width: 100%
  height: 100%
  background-repeat: no-repeat
  background-size: cover
  background-position-x right

.upvote-banner
  opacity: .3
</style>
