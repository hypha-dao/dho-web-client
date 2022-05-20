<script>
import { hexToFilter } from '~/utils/colorToFilter.js'
import { colors } from 'quasar'
const { getPaletteColor } = colors

const patternImageMap = {
  geometric1: 'geometric1.svg',
  geometric2: 'geometric2.svg',
  geometric3: 'geometric3.svg',
  organic1: 'organic1.svg',
  organic2: 'organic2.svg',
  organic3: 'organic3.svg'
}

/**
 * Shows a info card with the provided title, subtitle, and style
 */
export default {
  name: 'base-banner',
  components: {
    Widget: () => import('./widget.vue')
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
        backgroundImage: `url('${require('../../assets/images/' + this.background)}')`
      }
    },
    patternStyle () {
      return {
        backgroundImage: `url('${require('../../assets/images/banner-patterns/' + patternImageMap[this.pattern])}')`,
        filter: hexToFilter(this.patternColor),
        opacity: this.patternAlpha
      }
    }
  }
}
</script>

<template lang="pug">
.base-banner.full-width.rounded-corners.relative
  #banner-image.rounded-corners(:style="backgroundStyle" v-if="background").absolute
  #banner-pattern.rounded-corners(:style="patternStyle" v-if="pattern").absolute
  #linear-gradient.rounded-corners.absolute
  .content
    q-btn.absolute-top-right.q-mt-md.q-mr-md.q-pa-xs.close-btn(
      flat round size="sm"
      icon="fas fa-times"
      color="white"
      @click="$emit('onClose')"
    )
    .row.q-py-xxxl.q-px-xxl.full-height
      .col-6
        .column.justify-between.flex.full-height
          q-markdown(:src="title" content-class="h-h2 text-white")
          .h-b1.text-white.text-description.q-mb-md {{description}}
          .row.q-gutter-sm
            slot(name="buttons")
      .col-6
        slot(name="right")
</template>

<style lang="stylus" scoped>

#linear-gradient
  width 100%
  height 100%
  background: linear-gradient(268deg, rgba(19,34,106, 0) 0%, rgba(24,30,78, 1) 100%)
  opacity 0.7

#banner-pattern, #banner-image
  z-index 0
  width: 100%
  height: 100%
  background-repeat: no-repeat
  background-size: cover
  background-position-x right

#banner-image
  z-index 1

.content >>> div
  z-index 1

.rounded-corners
  border-radius 32px

.close-btn
  z-index 3

.base-banner
  min-height 300px
  background-color: $primary

  .text-description
    font-weight 300
    max-width 550px
    line-height: 30px
    letter-spacing: 0
    @media (max-width: $breakpoint-sm-max)
      line-height: 1.2rem
</style>
