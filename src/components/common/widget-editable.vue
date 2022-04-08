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
    editable: Boolean,
    tooltip: String,
    notify: {
      type: Boolean,
      default: true
    }
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
      if (this.notify) {
        Notify.create({
          message: 'Transaction processing',
          type: 'ongoing',
          position: 'bottom',
          timeout: 4000,
          actions: [
            { icon: 'fas fa-times', color: 'white', handler: () => { /* ... */ } }
          ]
        })
      }
      this.submitting = true
      this.$emit('onSave', this.success, this.fail)
    },

    success () {
      if (this.notify) {
        Notify.create({
          message: 'Transaction successful',
          type: 'positive',
          position: 'bottom',
          timeout: 4000,
          actions: [
            { icon: 'fas fa-times', color: 'white', handler: () => { /* ... */ } }
          ]
        })
      }
      this.submitting = false
    },

    fail (message) {
      if (this.notify) {
        Notify.create({
          message: 'Something went wrong',
          color: 'negative',
          icon: 'fas fa-exclamation-circle',
          position: 'bottom',
          timeout: 4000,
          actions: [
            { icon: 'fas fa-times', color: 'white', handler: () => { /* ... */ } }
          ]
        })
      }
      this.$emit('onFail')
      this.submitting = false
    }
  }
}
</script>

<template lang="pug">
q-card.widget(flat :class="{ ...widgetClass, 'q-py-xl': !noPadding, 'q-px-xxl': !noPadding }" )
  q-card-section.q-pa-none(v-if="bar" :class="titleClass" :style="{ height: titleHeight }")
    img(:src="titleImage")
    .text-bold.q-px-sm(:class="textClass") {{ title }}
  q-card-section.q-pa-none.full-height
    .row
      .col
        .h-h4(v-if="title && !bar" :class="textClass")  {{ title }}
          q-icon(name="fas fa-info-circle" size="16px" color="body" class="q-ml-xs" v-if="tooltip")
            q-tooltip {{ tooltip }}
        .h-b3.text-italic.text-body(v-if="subtitle && !bar") {{ subtitle }}
      .col-auto.absolute-top-right(v-if="editable")
        edit-controls(ref="controls" @onEdit="$emit('onEdit')" @onCancel="$emit('onCancel')" @onSave="save" :savable="savable" v-if="!submitting")
    .q-pt-sm(v-if="title || subtitle")
    slot
  q-card-actions(v-if="more" vertical)
    q-separator
    q-btn.q-mx-lg(text-color="primary" flat no-caps @click="$emit('more-clicked')") More

  q-inner-loading.rounded-top(:showing="submitting")
    q-spinner-puff(size="68px" color="primary")
</template>

<style lang="stylus" scoped>
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
