<script>
import fullscreenMixin from '~/mixins/fullscreen.js'

export default {
  name: 'markdown-display',
  mixins: [ fullscreenMixin ],
  props: {
    text: { type: String, required: true }
  }
}
</script>

<template lang="pug">
.markdown-content(:class="{fullscreen: inFullscreen}")
  .relative-position
    q-markdown.q-pa-sm(:src="text")
  q-btn.absolute-top-right.q-ma-xs(
    color="grey-8"
    flat
    dense
    icon="far fa-square"
    @click="toggleFullscreen"
    size="sm"
  )
</template>

<style lang="stylus">
.markdown-content
  background #fff
  max-height 200px
  overflow auto
  padding 6px
  border-radius 4px
  border 1px solid rgba(0,0,0,.24)
</style>
