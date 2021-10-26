<script>
export default {
  name: 'welcome-banner',
  components: {
    Widget: () => import('../common/widget.vue')
  }
}
</script>

<template lang="pug">
widget.full-width.custom-bg
  .row
    .col-7
      .text-h4.q-mt-xl.text-white Welcome to Hypha
      .text-body2.q-my-md.q-mb-md.text-white.text-description The DHO is a third generation DAO, a Decentralized Human Organization that rapidly unfolds coordination, payroll, accounting and governance processes for virtual organizations.
  .row.q-mt-lg.q-mb-lg
    .q-pa-xs
      q-btn.q-px-lg(rounded color="secondary" :to="{ name: 'organization' }") Discover More
</template>

<style lang="stylus" scoped>
.text-description
  line-height: 2rem
  @media (max-width: $breakpoint-sm-max)
    line-height: 1.2rem
.custom-bg
  background-image: url('../../assets/images/bannerBg.png')
  background-repeat: no-repeat
  background-size: cover
  background-color: $primary
</style>
