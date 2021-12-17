<script>
export default {
  name: 'archetype-card',
  components: {
    Widget: () => import('../common/widget.vue')
  },
  props: {
    /**
     * Archetype Title
     */
    title: String,
    /**
     * Icon Icon
     */
    icon: String
  }
}
</script>

<template lang="pug">
  widget.bg-grey-4.q-my-xs.cursor-pointer
    .row.items-center
      .col-3
        .row
          q-btn.q-mr-sm(round unelevated :icon="icon" color="primary" text-color="white" size="sm" :ripple="false")
      .col.text-wrap
        .text-body2.text-weight-bold.q-ml-sm {{title}}
</template>

<style lang="stylus" scoped>
.text-wrap
  overflow: hidden
  display: -webkit-box
  -webkit-line-clamp: 2
  -webkit-box-orient: vertical
</style>
