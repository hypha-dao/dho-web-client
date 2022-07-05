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
    compact: Boolean
  }
}
</script>

<template lang="pug">
.base-banner.full-width.rounded-corners.relative-position.overflow-hidden(:style="{'background': color}" :class="{'compact-banner' : compact}")
  #banner-image.absolute(:style="{'background': `url('${background}')`}" v-if="background")
  #banner-pattern.absolute(:style="{'background': `url('${pattern}') repeat`, 'background-size': '200px' }" v-if="pattern")
  #linear-gradient.absolute.z-40
  .content.relative-position.z-50.full-height
    .absolute-top-right.z-50.q-pa-xs
      slot(name="top-right")
      q-btn.absolute-top-right.q-pa-xs.close-btn(
        @click="$emit('onClose')"
        color="white"
        flat
        icon="fas fa-times"
        round
        size="sm"
        v-show="!hasSlot('top-right')"
      )
    .row.q-py-xxxl.q-px-xxl.full-height
      .col-6(v-if="!compact")
        .column.justify-between.flex.full-height
          h3.q-pa-none.q-ma-none.h-h2.text-white {{title}}
          p.h-b1.text-white.q-mt-xl.text-weight-300 {{description}}
          .row.q-gutter-sm.q-mt-md
            slot(name="buttons")
      .col-6(v-if="!compact")
        slot(name="right")
      .col-12(v-if="compact")
        .column.justify-between.flex.full-height
          h3.q-pa-none.q-ma-none.h-h2.text-white {{title}}
          .row.q-gutter-sm.q-mt-md
            slot(name="buttons")
</template>

<style lang="stylus" scoped>
.compact-banner
  min-height 277px !important

.base-banner
  min-height 300px

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
