<script>
export default {
  name: 'page-welcome'
}
</script>

<template lang="pug">
q-page.flex.flex-center.column
  .world-bg(style="background: url('statics/bg/world.svg')")
  .title
    span Hypha
    strong EARTH
  .subtitle.q-mb-lg Create the next chapter in Earth's history
  .content.q-pa-md
    .content-title Welcome to Hypha!
    p The DHO (Decentralized Human Organization) is a framework to build your organization from the ground up in an organic and participative way and together with others. We focus on two core functions at this point, decentralized payroll and distribution accounting for organizational and bioregional contexts.
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
      | &nbsp;Just visiting?&nbsp;
      router-link(to="/dashboard") Continue as guest
</template>

<style lang="stylus" scoped>
.title
  font-size 70px
.subtitle
  font-size 22px
.content
  text-align center
  max-width 450px
  border-radius 20px
  background rgba(255, 255, 255, 0.3)
  z-index 100
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
  text-transform none
  font-size 16px
</style>
