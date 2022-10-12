<script>
import { colors } from 'quasar'
const { getPaletteColor } = colors
import helpers from '~/mixins/helpers'
/**
 * Shows a info card with the provided title, subtitle, and style
 */
export default {
  name: 'base-banner',
  mixins: [helpers],

  props: {
    /**
     * Title text for the banner
     */
    title: String,
    /**
     * Subtitle text for the banner
     */
    description: String,
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

    compact: Boolean
  },

  methods: {
    getPaletteColor
  }
}
</script>

<template lang="pug">
.base-banner.full-width.rounded-corners.relative-position.overflow-hidden(:style="{'background': getPaletteColor(color)}" :class="{'compact-banner' : compact}")
  #banner-pattern.absolute(:style="{'background': `url('${pattern}') repeat`, 'background-size': '200px' }" v-if="pattern")
  #banner-image.absolute(:style="{'background': `url('${background}') no-repeat`, 'background-size': 'cover' }" v-if="background")
  #linear-gradient.absolute.z-40(v-if="gradient")
  .content.relative-position.z-50.full-height.q-pa-xl(:class="{'q-pa-xxxl': $q.screen.gt.sm }")
    .absolute-top-right.z-50.q-pa-sm(v-if="hasListener('onClose') || hasSlot('top-right')")
      slot(name="top-right")
      q-btn.absolute-top-right.q-pa-sm.close-btn(
        @click="$emit('onClose')"
        color="white"
        flat
        icon="fas fa-times"
        round
        size="sm"
        v-show="!hasSlot('top-right')"
      )

    slot(name="header")
    section.row
      div(v-if="!compact" :class="{'col-6': hasSlot('right')}")
        h3.q-pa-none.q-ma-none.h-h2.text-white.text-weight-700 {{title}}
        p.h-b1.text-white.q-my-lg.text-weight-300 {{description}}
        nav
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
  background: linear-gradient(268deg, rgba(19,34,106, 0) 0%, rgba(24,30,78, 1) 100%)
  opacity 0.7

#banner-pattern, #banner-image
  width: 100%
  height: 100%
  background-repeat: no-repeat
  background-size: cover
  background-position-x right

.rounded-corners
  border-radius 32px

</style>
