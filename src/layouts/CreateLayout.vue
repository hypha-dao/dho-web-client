<script>
export default {
  name: 'create-layout',
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
  },

  methods: {
    onBack () { this.$EventBus.$emit('global:nav:back') }
  }
}
</script>

<template lang="pug">
q-layout.bg-white(view="lHr LpR fFf" ref="layout")
  q-page-container
    .full-height.full-width.fixed-full.bg-internal-bg(:style="'padding: 15px; padding-bottom: 300px; overflow-y: scroll; z-index: 7777;'")
      header.flex.row.justify-between
        q-btn(unelevated="unelevated" rounded="rounded" padding="12px" icon="fas fa-arrow-left" size="sm" :color="'white'" text-color="'primary'" @click="onBack")
        .h-h6.text-bold.flex.items-center {{title}}
        q-btn(unelevated="unelevated" rounded="rounded" padding="12px" icon="fas fa-times" size="sm" :color="'white'" text-color="'primary'" :to="{ name: 'dashboard'}")
      section.q-mt-md
        router-view

</template>

<style lang="sass" scoped>

</style>
