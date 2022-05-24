<script>
/**
 * A component to display a pop up top change a numeric value
 */
export default {
  name: 'proposal-dynamic-popup',
  components: {
    Widget: () => import('~/components/common/widget.vue')
  },
  props: {
    title: String,
    description: String,
    min: Number,
    max: Number,
    step: Number,
    initialValue: Number
  },
  data () {
    return {
      value: this.initialValue
    }
  },
  methods: {
    onSave () {
      this.$emit('save', this.value)
    },
    onClose () {
      this.$emit('close')
    }
  }
}
</script>

<template lang="pug">
widget( background="white" textColor='header' shadow)
  q-btn.absolute-top-right.q-pa-xxxs.close-btn(
    flat round size="sm"
    icon="fas fa-times"
    color="header"
    @click="onClose"
  )
  .row.items-center.flex.container
    .full-height.justify-between.flex
      .top.full-width
        .h-h5 {{ title}}
        .h-b2.q-mt-sm {{description}}
      .bottom.full-width.flex.items-end
        q-slider(
          v-model="value"
          :min="min"
          :max="max"
          :step="step"
          :label-value="value + '%'"
          label-always
        )
        q-btn.full-width(rounded color="primary" unelevated noCaps :disable="value === initialValue" @click="onSave") Save
</template>

<style lang="stylus" scoped>
.container
  height: 320px - 70px !important
  width: 222px - 70px !important
.close-btn
  top: -25px
  right: -25px
</style>
