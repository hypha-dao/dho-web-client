<script>
export default {
  name: 'welcome-banner',
  components: {
    Widget: () => import('../common/widget.vue')
  }
}
</script>

<template lang="pug">
.welcome-banner.full-width
  .q-py-xxxl.q-px-xxl
    .row
      .col-7.q-pr-xxxl
        .column.justify-between
          .text-white.text-h4
            span.h-h2.q-mb-lg.text-white Welcome to
            span.h-h1.on-right.text-white Hypha
          .h-b1.q-my-xxxl.text-disabled.text-description The DHO is a third generation DAO, a Decentralized Human Organization that rapidly unfolds coordination, payroll, accounting and governance processes for virtual organizations.
          .row.q-gutter-sm
            q-btn.q-px-lg.h-btn1(no-caps rounded unelevated color="secondary" :to="{ name: 'organization' }") Discover More
</template>

<style lang="stylus" scoped>
.welcome-banner
  border-radius 32px
  height 300px
  background-image: url('../../assets/images/bannerBg.png')
  background-repeat: no-repeat
  background-size: cover
  background-color: $primary

  .text-description
    font-weight 300
    line-height: 30px
    letter-spacing: 0
    @media (max-width: $breakpoint-sm-max)
      line-height: 1.2rem
</style>
