<script lang="ts">
import widget from '~/components/common/widget.vue'
import { Notify } from 'quasar'
import { defineComponent } from 'vue'
import EditControls from '~/components/common/edit-controls.vue'
import LoadingSpinner from '~/components/common/loading-spinner.vue'

/**
 * Base component for any card-like element on screen
 * with editable options.
 * Handles title styling, margins and content padding
 */
export default defineComponent({
  name: 'widget-editable',
  extends: widget,
  components: {
    EditControls,
    LoadingSpinner
  },
  props: {
    /**
     * Subtitle string
     */
    subtitle: String,
    /**
     * If true, the save button will be enabled
     */
    savable: Boolean,
    /**
     * If true, the edit controls will be enabled
     */
    editable: Boolean,
    /**
     * If true a notification will be displayed when saving
     */
    notify: {
      type: Boolean,
      default: true
    },

    modalState: Boolean
  },
  data() {
    return {
      submitting: false
    }
  },

  methods: {
    openEdit() {
      if (this.$refs.controls) {
        ;(this.$refs.controls as InstanceType<typeof EditControls>).editing =
          true
      }
    },
    async save() {
      if (this.notify) {
        Notify.create({
          message: 'Transaction processing',
          type: 'ongoing',
          position: 'bottom',
          timeout: 4000,
          actions: [
            {
              icon: 'fas fa-times',
              color: 'white',
              handler: () => {
                /* ... */
              }
            }
          ]
        })
      }
      this.submitting = true
      this.$emit('onSave', this.success, this.fail)
    },

    success() {
      if (this.notify) {
        Notify.create({
          message: 'Transaction successful',
          type: 'positive',
          position: 'bottom',
          timeout: 4000,
          actions: [
            {
              icon: 'fas fa-times',
              color: 'white',
              handler: () => {
                /* ... */
              }
            }
          ]
        })
      }
      this.submitting = false
    },

    fail(message) {
      if (this.notify) {
        Notify.create({
          message: message || 'Something went wrong',
          color: 'negative',
          icon: 'fas fa-exclamation-circle',
          position: 'bottom',
          timeout: 4000,
          actions: [
            {
              icon: 'fas fa-times',
              color: 'white',
              handler: () => {
                /* ... */
              }
            }
          ]
        })
      }
      this.$emit('onFail')
      this.submitting = false
    }
  }
})
</script>

<template lang="pug">
q-card.widget(:class="{...widgetClass, 'q-py-xl': !noPadding, 'q-px-xxl': !noPadding}" flat)
  q-card-section.q-pa-none(:class="titleClass" :style="{height: titleHeight}" v-if="bar")
    img(:src="titleImage")
    .text-bold.q-px-sm(:class="textClass") {{title}}
  q-card-section.q-pa-none.full-height
    .row.items-center
      .col
        .h-h4(:class="textClass" v-if="title && !bar") {{title}}
      .col-auto(v-if="editable && !modalState")
        edit-controls(:savable="savable" @onCancel="$emit('onCancel')" @onEdit="$emit('onEdit')" @onSave="save" ref="controls" v-if="!submitting")
    .row
      .h-b3.text-italic.text-body(v-if="subtitle && !bar") {{subtitle}}
    .q-pt-sm(v-if="title || subtitle")
    slot
  q-card-actions(v-if="more" vertical="vertical")
    q-separator
    q-btn.q-mx-lg(@click="$emit('more-clicked')" flat no-caps text-color="primary") {{ $t('common.widget-editable.more') }}
  q-inner-loading.rounded-top(:showing="submitting")
    loading-spinner(color="primary" size="68px")
  .row.full-width.justify-end.q-mt-xxs(v-if="modalState")
    edit-controls(:savable="savable" @onCancel="$emit('onCancel')" @onEdit="$emit('onEdit')" @onSave="save" ref="controls" v-if="!submitting")
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
