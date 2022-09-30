<script>
export default {
  name: 'filter-widget-mobile',
  components: {
    FilterWidget: () => import('~/components/filters/filter-widget.vue'),
    Widget: () => import('../common/widget.vue')
  },

  props: {

  }
}
</script>

<template lang="pug">
.container
  .top-buttons.q-ma-md
    q-btn(color="internal-bg" text-color="primary" rounded unelevated size="sm" padding="12px" icon="fas fa-times" @click="$emit('close')")
  filter-widget(v-bind="{ ...$props, ...$attrs, ...$slots }" v-on = "$listeners" :showViewSelector="false").full-height
  .bottom-buttons
</template>

<style lang="stylus" scoped>
.container
  position: fixed
  z-index: 5000
  width: 100%
  height: 100%
  top: 0
  left:0
  background-color: white
.top-buttons
  display: flex
  align-items: center
  justify-content: flex-end
.bottom-buttons
  display: flex
  align-items: center
  justify-content: center

</style>
