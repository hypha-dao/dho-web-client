<script>
// import { hexToFilter } from '~/utils/colorToFilter.js'
import { colors } from 'quasar'
const { getPaletteColor } = colors

/**
 * Shows a info card with the provided title, subtitle, and style
 */
export default {
  name: 'base-banner',
  components: {
  },
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
     * Color text for the banner
     */
    color: {
      type: String,
      default: getPaletteColor('primary')
    },
    /**
     * The background image file
     * If undefined, the background will be a solid color
     * TODO: This should be a URL
     */
    background: String,
    /**
     * The background pattern id
     * Can be one of : geometric1, geometric2, geometric3, organic1, organic2, organic3
     * If undefined, the background will be a solid color
     */
    pattern: {
      type: String,
      default: undefined
    },
    /**
     * The pattern color
     */
    patternColor: {
      type: String,
      default: getPaletteColor('secondary')
    },
    /**
     * The pattern opacity
     */
    patternAlpha: {
      type: Number,
      default: 0.3
    }
  },
  computed: {
    backgroundStyle () {
      return {
        backgroundImage: `url('${this.background}')`
      }
    },
    patternStyle () {
      return {
        backgroundImage: `url('/patterns/${this.pattern}.svg')`,
        // filter: hexToFilter(this.patternColor),
        opacity: this.patternAlpha / 100
      }
    }
  }

}
</script>

<template lang="pug">
.base-banner.full-width.rounded-corners.relative-position.overflow-hidden(:style="{'background': color}")
  #banner-image.absolute(:style="backgroundStyle" v-if="background")
  #banner-pattern.absolute(:style="patternStyle" v-if="!background && pattern")
  #linear-gradient.absolute.z-40
  .content.relative-position.z-50.full-height
    q-btn.absolute-top-right.q-mt-md.q-mr-md.q-pa-xs.close-btn(
      flat round size="sm"
      icon="fas fa-times"
      color="white"
      @click="$emit('onClose')"
    )
    .row.q-py-xxxl.q-px-xxl.full-height
      .col-6
        .column.justify-between.flex.full-height
          h3.q-pa-none.q-ma-none.h-h2.text-white {{title}}
          p.h-b1.text-white.q-mt-xl.text-weight-300 {{description}}
          .row.q-gutter-sm.q-mt-md
            slot(name="buttons")
      .col-6
        slot(name="right")
</template>

<style lang="stylus" scoped>

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
