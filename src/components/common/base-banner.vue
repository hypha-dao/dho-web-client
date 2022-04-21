<script>
export default {
  name: 'base-banner',
  components: {
    Widget: () => import('./widget.vue')
  },
  props: {
    title: String,
    description: String,
    background: String
  },
  computed: {
    backgroundStyle () {
      return {
        backgroundImage: `url('${require('../../assets/images/' + this.background)}')`
      }
    }
  }
}
</script>

<template lang="pug">
.base-banner.full-width(:style="backgroundStyle")
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
.base-banner
  border-radius 32px
  min-height 300px
  background-repeat: no-repeat
  background-size: cover
  background-color: $primary
  background-position-x right

  .text-description
    font-weight 300
    max-width 550px
    line-height: 30px
    letter-spacing: 0
    @media (max-width: $breakpoint-sm-max)
      line-height: 1.2rem
</style>
