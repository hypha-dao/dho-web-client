<script>
import widget from '~/components/common/widget.vue'
import { Notify } from 'quasar'

/**
 * Base component for any card-like element on screen
 * with editable options.
 * Handles title styling, margins and content padding
 */
export default {
  name: 'widget-editable',
  extends: widget,
  components: {
    EditControls: () => import('~/components/common/edit-controls.vue')
  },
  props: {
    subtitle: String,
    savable: Boolean,
    editable: Boolean
  },
  data () {
    return {
      submitting: false
    }
  },

  methods: {
    openEdit () {
      this.$refs.controls.editing = true
    },
    async save () {
      Notify.create({
        message: 'Saving...',
        type: 'ongoing',
        position: 'bottom',
        timeout: 5000
      })
      this.submitting = true
      this.$emit('onSave', this.success, this.fail)
    },

    success () {
      Notify.create({
        message: 'Successfully saved',
        type: 'positive',
        position: 'bottom',
        timeout: 5000
      })
      this.submitting = false
    },

    fail (message) {
      Notify.create({
        message: 'Something went wrong',
        type: 'negative',
        position: 'bottom',
        timeout: 5000
      })
      this.$emit('onFail')
      this.submitting = false
    }
  }
}
</script>

<template lang="pug">
q-card.widget(flat :class="widgetClass")
  q-card-section(v-if="bar" :class="titleClass" :style="{ height: titleHeight }")
    img(:src="titleImage")
    .text-bold.q-px-sm(:class="textClass") {{ title }}
  q-card-section(:class="{ 'q-px-none': noPadding }")
    .row.justify-between
      .col
        .h-h4.q-pa-md(v-if="title && !bar && !subtitle" :class="textClass") {{ title }}
        .h-h4.q-pl-md.q-pt-md(v-if="title && !bar && subtitle" :class="textClass") {{ title }}
        .h-b3.text-italic.text-grey-6.q-pl-md.q-pb-md(v-if="subtitle && !bar") {{ subtitle }}
      .col-auto.q-ma-md.absolute-top-right.q-py-md.q-px-xs(v-if="editable")
        edit-controls(ref="controls" @onEdit="$emit('onEdit')" @onCancel="$emit('onCancel')" @onSave="save" :savable="savable" v-if="!submitting")
    div(:class="{ 'q-mx-md': !noPadding }")
      slot
    .q-mb-md(v-if="!more && title")
  q-card-actions(v-if="more" vertical)
    q-separator.q-mx-lg
    q-btn.q-mx-lg(text-color="primary" flat no-caps @click="$emit('more-clicked')") More

  q-inner-loading.rounded-top(:showing="submitting")
    q-spinner-puff(size="68px" color="primary")
</template>

<style lang="stylus" scoped>
.q-card__section--vert
  padding 15px
.rounded-top
  border-top-left-radius 26px !important
  border-top-right-radius 26px !important
.rounded-bottom
  border-bottom-left-radius 26px
  border-bottom-right-radius 26px

.dashed
  border 2px dashed rgba(0 0 0 0.25)

.shadowed
  box-shadow 0 4px 8px rgba(0 0 0 0.05), 0 1px 16px rgba(0 0 0 0.025) !important

.positive-border
  border 2px solid $positive

.negative-border
  border 2px solid $negative
</style>
