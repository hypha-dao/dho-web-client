<script>
export default {
  name: 'page-welcome'
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
    .content.q-pa-md.bg-white
      .content-title Welcome to Hypha!
      p The DAO is a framework to build your organization from the ground up in an organic and participative way and together with others. We focus on two core functions at this point, decentralized payroll and distribution accounting for organizational and bioregional contexts.
      q-btn.begin-journey(
        icon="far fa-compass"
        label="Begin your journey"
        to="/register"
        color="deep-orange-8"
        unelevated
        rounded
      )
      .content-bottom.q-mt-md
        | Already have an account?&nbsp;
        router-link(to="/login") Login here.
        br
        | &nbsp;Just visiting?&nbsp;
        router-link(to="/dashboard") Continue as guest
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
  p
    @media (max-width: $breakpoint-xs-max)
      font-size 18px
      line-height 1.2em
  .content-bottom
    font-size 12px
    a
      color black

@keyframes shadow-pulse {
  0% { box-shadow: 0 0 0 0px rgba(0, 0, 0, 0.2) }
  100% { box-shadow: 0 0 0 20px rgba(0, 0, 0, 0) }
}

.begin-journey
  animation: shadow-pulse 1s infinite
  font-size 1.2em
</style>
