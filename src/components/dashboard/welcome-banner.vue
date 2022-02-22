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
  .q-pa-xl
    .row
      .col-7.q-pr-lg
        .column.justify-between
          .text-white.text-h4
            span.h2.q-mb-lg.text-white Welcome to
            span.h1.on-right.text-white Hypha
          .text-body2.q-my-lg.text-white.text-description The DHO is a third generation DAO, a Decentralized Human Organization that rapidly unfolds coordination, payroll, accounting and governance processes for virtual organizations.
          .row.q-gutter-sm
            q-btn.q-px-lg(no-caps rounded color="secondary" :to="{ name: 'organization' }") Discover More
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
    line-height: 2rem
    @media (max-width: $breakpoint-sm-max)
      line-height: 1.2rem
</style>
