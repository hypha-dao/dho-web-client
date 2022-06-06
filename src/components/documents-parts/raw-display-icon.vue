<script>
export default {
  name: 'raw-display-icon',
  props: {
    document: { type: Object }
  },
  data () {
    return {
      show: false
    }
  }
}
</script>

<template lang="pug">
.raw-display-icon
  q-btn(
    icon="fas fa-cog"
    @click="show = true"
    flat
  )
  q-dialog(
    v-model="show"
    full-height
    full-width
  )
    q-card TODO
</template>

<style lang="stylus" scoped>
.raw-display-icon
  position: absolute
  right: 0
  top: 0
</style>
