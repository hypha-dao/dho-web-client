<script>
export default {
  name: 'organization-banner',

  methods: {
    imageUrl (url) {
      return require('~/assets/logos/' + url)
    }
  }
}
</script>

<template lang="pug">
.organization-banner.full-width.bg-primary
  .q-pa-xl
    .row
      .col-6
        .column.justify-between
          .text-white.text-h4
            span.text-weight-thin.q-mb-lg The purpose of
            span.text-bold.on-right Hypha
          .text-white.text-body2.q-my-lg Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          .row.q-gutter-sm
            q-btn.q-px-lg(color="secondary" no-caps unelevated rounded label="Documentation")
      .col-5.q-ml-lg
        img(:src="imageUrl('hypha-logo-full.svg')")
</template>

<style lang="stylus" scoped>
.organization-banner
  border-radius 32px
  height 300px
</style>
