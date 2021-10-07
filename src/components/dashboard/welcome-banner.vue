<script>
export default {
  name: 'welcome-banner',
  components: {
    Widget: () => import('../common/widget.vue')
  }
}
</script>

<template lang="pug">
widget.full-width.bg-primary
  .row
    //- q-icon(name="fas fa-close")
  .text-h3.q-mt-xl.text-white Welcome to Hypha
  .text-body2.q-my-md.q-mb-md.text-white.text-description The DHO is a third generation DAO, a Decentralized Human Organization that rapidly unfolds coordination, payroll, accounting and governance processes for virtual organizations. Our goal is to help organizations that want to move beyond outdated hierarchical structures towards more transparent, participatory and open protocols and tools in line with our networked and interconnected world.
  .row.q-mt-lg.q-mb-xl.q-col-gutter-x-md
    .container-btn
      q-btn.q-px-lg(rounded color="white" :to="{ name: 'organization' }")
        .text-primary Discover More
    .container-btn
      q-btn.q-px-lg.text-white(rounded outline color="primary" type="a" href="https://notepad.hypha.earth/5dC66nNXRVGpb1aTHaRJXw" target="blank") Documentation
</template>

<style lang="stylus" scoped>
.text-description
  line-height: 2rem
  @media (max-width: $breakpoint-sm-max)
    line-height: 1.2rem
.container-btn
  width: auto
  @media (max-width: $breakpoint-sm-max)
    width: 100%
    margin-top: 10px
    margin-bottom: 10px
</style>
