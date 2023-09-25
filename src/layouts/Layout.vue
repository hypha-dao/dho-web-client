<script>

export default {
  name: 'layout',
  components: {
    MultiDhoLayout: () => import('./MultiDhoLayout.vue')
  },

  props: {
    dhoname: String
  },

  computed: {
    layout () { return this.$route?.meta?.layout || 'multi-dho-layout' }
  }

}
</script>

<template lang="pug">
component(:is="layout" v-bind="{ dhoname }")
</template>

<style scoped lang="stylus">
</style>
