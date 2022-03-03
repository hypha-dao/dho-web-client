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
    actionButtons: Array
  }
}

</script>

<template lang="pug">
widget(:title="title" noPadding).q-py-md
  .column.justify-center.items-center.q-mt-md.q-px-lg
    q-icon(:name="icon" color="grey-5" :size="iconSize" ).q-mb-md
    .b1.text-grey-5.q-mb-lg {{subtitle}}
    .row.justify-between.q-mt-sm.q-gutter-sm
      .col-auto(v-for="button in actionButtons")
        q-btn.btn2.q-px-lg(:disable="button.disable" :color="button.color || 'primary'" unelevated noCaps rounded :label="button.label" @click="button.onClick" ).action-button
        q-tooltip(v-if="button.disable") {{button.disableTooltip}}

</template>

<style lang="stylus" scoped>
.action-button
  width 232px
</style>
