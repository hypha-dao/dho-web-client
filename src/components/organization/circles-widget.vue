<script>
export default {
  name: 'circles-widget',
  components: {
    Widget: () => import('../common/widget.vue'),
    CircleCard: () => import('./circle-card.vue')
  },
  props: {
    circles: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<template lang="pug">
widget(:title="'DAO circles'").full-height.full-width
  .h-h3.text-secondary.absolute(:style="{ 'top': '0', 'right': '0' }") {{ circles.length }}
  template(v-for="circle in circles")
    circle-card(v-bind="circle")
</template>
