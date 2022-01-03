<script>
import { colors } from 'quasar'

export default {
  name: 'alert-message',

  props: {
    status: String,
    link: String
  },

  computed: {
    color () {
      switch (this.status) {
        case 'red': return 'negative'
        case 'yellow': return 'warning'
        case 'green': return 'positive'
      }

      return 'primary'
    },

    statusClass () {
      const clazz = {}
      clazz[`text-${this.color}`] = true
      return clazz
    },

    statusText () {
      if (this.status === 'green') return 'most features should work as expected'
      if (this.status === 'yellow') return 'limited features work as expected'
      return 'little to nothing working'
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
      span This is a
      span.text-bold {{ ' PREVIEW ' }}
      span version of the new Hypha DHO platform. It is a work-in-progress. This page has a
      span(:class="statusClass") {{ ' ' + status + ' '}}
      span rating, meaning {{ statusText }}. It is for preview purposes only.
</template>

<style lang="stylus" scoped>
.alert
  border-radius 32px
</style>
