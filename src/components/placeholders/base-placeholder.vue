<script>
export default {
  name: 'base-placeholder',
  components: {
    Widget: () => import('~/components/common/widget.vue')
  },
  props: {
    title: String,
    subtitle: String,
    icon: String,
    iconSize: {
      type: String,
      default: '62px'
    },
    actionButtons: Array,
    compact: Boolean
  }
}

</script>

<template lang="pug">
widget(:title="title")
  .column.justify-center.items-center.q-mt-md
    .q-mt-sm(v-if="compact")
    q-icon(:name="icon" color="disabled" :size="iconSize" ).q-mb-md
    .h-b1.text-disabled.q-mb-md {{subtitle}}
    .row.justify-between.q-mt-xs.q-gutter-sm
      .col-auto(v-for="button in actionButtons")
        q-btn.h-btn1.q-px-lg(:disable="button.disable" :color="button.color || 'primary'" unelevated noCaps rounded :label="button.label" @click="button.onClick" ).action-button
        q-tooltip(v-if="button.disable") {{button.disableTooltip}}

</template>

<style lang="stylus" scoped>
.action-button
  width 232px
</style>
