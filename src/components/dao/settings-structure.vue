<script>

export default {
  name: 'settings-structure',
  components: {
    WidgetCircles: () => import('~/components/dao/widget-circles.vue'),
    WidgetRoles: () => import('~/components/dao/widget-roles.vue')
  },

  props: {
    form: {
      type: Object,
      default: () => {}
    },

    isAdmin: {
      type: Boolean,
      default: false
    }
  }

}
</script>

<template lang="pug">
.tab
  widget-roles(v-bind="{ form, isAdmin }" @change="data => $emit('change', data)").q-mt-sm
  widget-circles(v-bind="{ form, isAdmin }" @change="data => $emit('change', data)")
</template>

<style lang="stylus" scoped>
</style>
