<script>
export default {
  name: 'empty-layout',
  computed: {
    title () {
      if (this.$route.meta) {
        const { title } = this.$route.meta
        return title
      }
      return null
    },
    subtitle () {
      if (this.$route.meta) {
        const { subtitle } = this.$route.meta
        return subtitle
      }
      return null
    },
    link () {
      if (this.$route.meta) {
        const { link } = this.$route.meta
        return link
      }
      return []
    }
  }
}
</script>

<template lang="pug">
q-layout.bg-white(view="lHr LpR fFf" ref="layout")
    q-page-container.window-height.q-py-md(:class="{ 'q-pr-md': $q.screen.gt.sm }")
        q-scroll-area.full-height(:thumb-style=" { 'border-radius': '6px' }" ref="scrollArea")
            .row.justify-center
              .col-md-8.col-sm-10.col-xs-11
                q-card.card-container.bg-internal-bg.q-pa-md
                  .row.items-center.justify-between.q-pl-sm
                    .col-auto
                      .row
                        .h-h3(v-if="title") {{ title }}
                      .row.q-mt-md
                        .h-h5(v-if="subtitle") {{ subtitle }}
                  router-view
</template>

<style lang="sass" scoped>
.card-container
  min-height: 88vh
  border-radius: 20px
</style>
