<script>
import { colors } from 'quasar'
export default {
  name: 'coming-soon-tag',
  props: {
    status: {
      type: String,
      default: 'yellow'
    },
    message: String
  },
  computed: {
    color () {
      switch (this.status) {
        case 'red': return 'negative'
        case 'yellow': return 'warning'
        case 'green': return 'positive'
      }

      return 'primary'
    }
  },
  methods: {
    getPaletteColor (color) {
      return colors.getPaletteColor(color)
    }
  }
}
</script>

<template lang="pug">
.alert.full-width.q-px-md(:style="{ border: `1px solid ${getPaletteColor(color)} `}")
  .row.items-center.justify-between.q-py-sm
    q-icon.on-left(:color="color" size="md" name="fas fa-exclamation-circle")
    .col.text-body2.text-grey-7
      span {{ message }}
</template>

<style lang="stylus" scoped>
.alert
  border-radius 32px
</style>
