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
  widget(noPadding).bg-internal-bg.cursor-pointer.q-px-xxl.q-py-sm.content
    .row.items-center.full-height
      //- .col-3
      //-   .row
      //-     q-btn.q-mr-sm(round unelevated :icon="icon" color="primary" text-color="white" size="sm" :ripple="false")
      .col.text-wrap
        .h-h7.text-weight-bold.q-ml-sm {{title}}
      .col-auto
        q-icon(name="fas fa-chevron-right" color="body" size="0.8rem" :ripple="false")
</template>

<style lang="stylus" scoped>
.text-wrap
  overflow: hidden
  display: -webkit-box
  -webkit-line-clamp: 2
  -webkit-box-orient: vertical
.content
  height 71px
</style>
