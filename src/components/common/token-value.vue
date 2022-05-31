<script>
/**
 * Displays a token, icon and its value.
 * Optionally can show additional detail string after the value in parentheses.
 */
export default {
  name: 'token-value',
  components: {
    IpfsImageViewer: () => import('~/components/ipfs/ipfs-image-viewer.vue'),
    TokenLogo: () => import('./token-logo.vue')
  },

  props: {
    /**
     * Token title, rendered without text transformation
     */
    label: String,
    /**
     * Token tooltip
     */
    tooltip: String,
    /**
     * Token value. Large numbers are abbreviated with full value in tooltip
     */
    value: [Number, String],
    /**
     * Icon path, from src/assets/icons folder
     */
    icon: String,
    /**
     * Additional detail rendered following token value if present
     */
    detail: String,
    /**
     * Amount to multiply the token values by
     */
    multiplier: {
      type: Number,
      default: 1
    },
    /**
     * Flag to know if this token is a coefficient type to change the view
     */
    coefficient: {
      type: Boolean,
      default: false
    },
    /**
     * Flag to know if this token is a coefficient type to change the view
     */
    coefficientPercentage: {
      type: Number || String
    },
    /**
     * utility | cash | voice
     * Determines the icon that will be shown if no icon is provided
     */
    type: {
      type: String,
      default: 'utility'
    },
    /**
     * IPFS CID of the logo
     */
    daoLogo: {
      type: String,
      default: undefined
    }
  },

  methods: {
    imageUrl (icon) {
      return require('~/assets/icons/' + icon)
    },

    shortNumber (value) {
      if (value < 10000) return value.toFixed(2)
      if (value < 1e6) return +(value / 1e3).toFixed(1) + 'k'
      if (value < 1e9) return +(value / 1e6).toFixed(1) + 'm'
      if (value < 1e12) return +(value / 1e9).toFixed(1) + 'b'
      return +(value / 1e12).toFixed(1) + 't'
    }
  }
}
</script>

<template lang="pug">
.row.items-center.justify-start.q-px-sm
  .col
    .row.q-mb-sm
      .col
        .text-body2.text-bold {{ label }}
    .row.items-center
      token-logo(
        :customIcon="icon"
        :type="type"
        :daoLogo="daoLogo"
      )
      .col
        .text-left.inline-block
          span(v-if="!coefficient") {{ shortNumber(value * multiplier) }}
          span(v-if="!coefficient")  total
          span.text-bold.q-mx-sm(v-else-if="coefficient && (coefficientPercentage !== undefined || coefficientPercentage !== null )" :class="coefficientPercentage >= 0 ? 'text-positive' : 'text-negative'") x  {{ coefficientPercentage }}%
          q-tooltip(
            anchor="top right"
            self="top right"
            :content-style="{ 'font-size': '1em' }"
          ) {{ tooltip }}
        .text-caption.text-left.inline-block.q-ml-sm.text-italic(v-if="detail") {{ '(' + detail + ')'}}
</template>
<style scoped lang="stylus">
.token-overlay
  color white
  font-family: 'Source Sans Pro', sans-serif
  font-size: 145%
  font-style: italic
  font-weight: bold
  background-color: var(--q-color-primary)
  width: 100%
  height: 100%
  display: flex
  align-items: center
  justify-content: center
  border-radius: 50%

</style>
