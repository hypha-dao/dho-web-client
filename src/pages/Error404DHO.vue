<script>
export default {
  name: '404-dao-not-found'
}
</script>

<template lang="pug">
.fullscreen
  .relative-position.full-height.full-width
    .row.full-height
      .col-md-4.col-sm-5.col-xs-12
        q-card.custom-full-height.q-pa-xl.column.justify-center
          .text-h2.text-bold {{ $t('pages.error404dho.daoIsUnderMaintenance') }}
      .col.full-height.relative-position
        .error-bg.full-height.full-width
        .error-info.absolute-center
          .error-info-title.text-h1.text-white {{ $t('pages.error404dho.7348') }}

</template>

<style lang="stylus" scoped>
.custom-full-height
  height: 100vh
  @media (max-width: $breakpoint-sm-max)
    height: 70vh
.error-bg
  background-image: url('../assets/images/dao-error-bg.jpg')
  background-repeat: no-repeat
  background-size: cover
  position: absolute
.error-info
  z-index 5
.error-info-title
  font-size: 274px;
  opacity: 0.8;
</style>
