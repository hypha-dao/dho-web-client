<script>
export default {
  name: 'page-down'
}
</script>

<template lang="pug">
.fullscreen.bg-primary
  .column.flex-center.fixed-center
    .world-bg(v-if="$q.platform.is.desktop" style="background: url('bg/world.svg')")
    transition(
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    )
      .text-white
        .title
          span Hypha
          strong EARTH
        .subtitle.q-mb-lg Create the next chapter in Earth's history
    .content.q-pa-lg.bg-white
      .text-subtitle1.text-bold.q-ma-lg Oops, something went wrong!
      .text-body2.q-px-xl.q-py-lg We are working on bringing the DHO back. Please try again in a bit.
</template>

<style lang="stylus" scoped>
.title
  font-size 70px
  @media (max-width: $breakpoint-xs-max)
    letter-spacing -3px
    font-size 3.5em
    line-height 1.2
.subtitle
  font-size 22px
  @media (max-width: $breakpoint-xs-max)
    font-size 1em
    line-height 0.8
    padding-bottom 20px
.content
  text-align center
  max-width calc(100vw - 8px)
  width 450px
  border-radius 20px
  z-index 100
  .content-title
    font-weight 600
    font-size 1.2em
    line-height 2em
</style>
