<script>
// Converts a string of form `rgb(r, g, b)` to a hex string
function rgbToHex (color) {
  const groups = /(.*?)rgb\((\d+),\s*(\d+),\s*(\d+)\)/i.exec(color)
  const r = parseInt(groups[2], 10).toString(16)
  const g = parseInt(groups[3], 10).toString(16)
  const b = parseInt(groups[4], 10).toString(16)

  return `#${r.length === 1 ? '0' : ''}${r}${g.length === 1 ? '0' : ''}${g}${b.length === 1 ? '0' : ''}${b}`
}

/**
 * This component is only used by storybook to document the custom colors used.
 */
export default {
  name: 'color-palette',

  data () {
    return {
      isMounted: false,
      colors: [
        'primary',
        'secondary',
        'accent',
        'positive',
        'negative',
        'info',
        'warning',
        'hire',
        'proposal',
        'liquid',
        'seeds',
        'draft'

        // UNUSED COLORS
        // 'assignment',
        // 'hire-light',
        // 'proposal-light',
        // 'payment',
        // 'deferred',
      ]
    }
  },

  computed: {
    colorValues () {
      const result = []
      if (this.isMounted) {
        this.colors.forEach(c => {
          const rgb = getComputedStyle(this.$refs[c][0])['background-color']
          result.push({
            rgb,
            hex: rgbToHex(rgb)
          })
        })
      }
      return result
    }
  },

  mounted () {
    this.isMounted = true
  }
}
</script>

<template lang="pug">
.q-gutter-sm
  template(v-for="(color, i) in colors")
    .row.items-center.q-gutter-sm
      .label {{ color }}
      .box(:class="'bg-' + color" :ref="color")
      .label(v-if="colorValues.length") {{ colorValues[i].hex }}
      div(v-if="colorValues.length") {{ colorValues[i].rgb }}
</template>

<style lang="stylus" scoped>
.label
  width 80px

.box
  width 40px
  height 40px
</style>
