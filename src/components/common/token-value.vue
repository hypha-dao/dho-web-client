<script>
/**
 * Displays a token, icon and its value.
 * Optionally can show additional detail string after the value in parentheses.
 */
export default {
  name: 'token-value',

  props: {
    /**
     * Token title, rendered without text transformation
     */
    label: String,
    /**
     * Token value. Large numbers are abbreviated with full value in tooltip
     */
    value: Number,
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
q-item
  q-item-section(avatar)
    q-avatar(size="md")
      img(:src="imageUrl(icon)")
  q-item-section
    q-item-label.text-body2 {{ label }}
  q-item-section(side)
    .row.items-center
      q-item-label
        .text-bold.text-right {{ shortNumber(value * multiplier) }}
          q-tooltip(
            anchor="top middle"
            self="center middle"
          ) {{ new Intl.NumberFormat().format(value * multiplier) }}
        .text-caption.text-right(v-if="detail") {{ '(' + detail + ')'}}
</template>
