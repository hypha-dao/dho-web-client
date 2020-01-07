<script>
import 'vue-croppa/dist/vue-croppa.css'

export default {
  name: 'form-image-processor',
  props: {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    round: { type: Boolean, required: false, default: () => false }
  },
  data () {
    return {
      edited: false,
      image: {}
    }
  },
  updated () {
    const canvas = this.image.getCanvas()
    if (this._getHeight() > this._getWidth()) {
      canvas.style.maxHeight = `${Math.min(this.height || 200, 250)}px`
      canvas.style.width = 'auto'
    } else {
      canvas.style.width = '100%'
    }
  },
  methods: {
    _getHeight () {
      return this.height || 200
    },
    _getWidth () {
      return this.width || 200
    },
    onInit () {
      if (this.round) {
        this.image.addClipPlugin(function (ctx, x, y, w, h) {
          ctx.beginPath()
          ctx.arc(x + w / 2, y + h / 2, w / 2, 0, 2 * Math.PI, true)
          ctx.closePath()
        })
      }
    },
    getBlob () {
      const self = this
      return new Promise(function (resolve, reject) {
        try {
          if (self.image.hasImage()) {
            self.image.generateBlob((blob) => {
              resolve(blob)
            }, 'image/jpg', 0.8)
          } else {
            resolve(null)
          }
        } catch (e) {
          reject(new Error(e))
        }
      })
    }
  }
}
</script>

<template lang="pug">
.image-processor
  .row.flex.image-container
    .col-10.flex.items-center.text-center.justify-center
      .row
        croppa(
          v-model="image"
          :accept="'image/*'"
          :file-size-limit="4e6"
          :width="width || 200"
          :height="height || 200"
          :show-remove-button="false"
          :quality="1"
          :replace-drop="true"
          @file-choose="edited = true"
          placeholder=""
          prevent-white-space
          @init="onInit"
          :class="{ rounded: round }"
        )
    .col-2.column.justify-between.items-end
      q-btn(
        icon="fas fa-redo-alt"
        @click="image.rotate(1)"
        color="accent"
        round
        size="sm"
      )
        q-tooltip Rotate +90
      q-btn(
        icon="fas fa-undo-alt"
        @click="image.rotate(-1)"
        color="accent"
        round
        size="sm"
      )
        q-tooltip Rotate -90
      q-btn(
        icon="fas fa-search-plus"
        @click="image.zoomIn()"
        color="accent"
        round
        size="sm"
      )
        q-tooltip Zoom in
      q-btn(
        icon="fas fa-search-minus"
        @click="image.zoomOut()"
        color="accent"
        round
        size="sm"
      )
        q-tooltip Zoom out
      q-btn(
        icon="fas fa-arrows-alt-h"
        @click="image.flipX()"
        color="accent"
        round
        size="sm"
      )
        q-tooltip Vertical mirror
      q-btn(
        icon="fas fa-arrows-alt-v"
        @click="image.flipY()"
        color="accent"
        round
        size="sm"
      )
        q-tooltip Horizontal mirror
  q-separator.q-mt-md
  .row.flex.justify-end.q-mt-md
    q-btn.q-mr-sm(
      label="Cancel"
      color="primary"
      @click="$emit('cancel')"
      flat
    )
    q-btn(
      label="Reset"
      color="primary"
      @click="image.refresh()"
    )
</template>

<style lang="stylus" scoped>
.image-processor
  .image-container
    min-height 210px
  .rounded
    border-radius 50%
  .croppa-container
    max-width 100%
    height auto
    canvas
      height auto !important
</style>
