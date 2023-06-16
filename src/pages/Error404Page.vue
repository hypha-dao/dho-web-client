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
  widget.full-height(:title="$t('pages.error404page.ooops')")
    .column.justify-center.items-center
      q-btn(round="round" unelevated="unelevated" icon="far fa-times-circle" color="inherit" text-color="disabled" size="xl" :ripple="false")
      .text-subtitle2.text-disabled.q-mb-lg {{ $t('pages.error404page.thisPageDoesnt') }}
      .row.justify-between.q-mt-sm
        .col-auto
          q-btn.q-px-lg(color="primary" no-caps="no-caps" unelevated="unelevated" rounded="rounded" :label="$t('pages.error404page.backToDashboard')" :to="{ name:'dashboard' }")

</template>

<style lang="stylus" scoped>
</style>
