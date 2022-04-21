<script>
export default {
  name: '404-not-found',

  components: {
    Widget: () => import('../components/common/widget.vue')
  },

  meta: {
    title: 'Not Found'
  }

}
</script>

<template lang="pug">
.page-404.full-width
  widget.full-height(title="Ooops")
    .column.justify-center.items-center
      q-btn(round unelevated icon="far fa-times-circle" color="inherit" text-color="disabled" size="xl" :ripple="false" )
      .text-subtitle2.text-disabled.q-mb-lg This page doesn't exist - please try again with a different URL
      .row.justify-between.q-mt-sm
        .col-auto
          q-btn.q-px-lg(color="primary" no-caps unelevated rounded label="Back to dashboard" :to="{ name:'dashboard' }")

</template>

<style lang="stylus" scoped>
</style>
