<script>
import BrowserIpfs from '~/ipfs/browser-ipfs.js'

export default {
  name: 'ipfs-image-viewer',
  components: {
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },
  props: {
    ipfsCid: String,
    size: {
      type: String,
      default: '120px'
    },
    showDefault: {
      type: Boolean,
      default: false
    },
    defaultLabel: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: 'primary'
    },

    textColor: {
      type: String,
      default: 'white'
    },
    square: {
      type: Boolean,
      default: false
    },
    originalUploadedFile: File,
    canRemoveFile: Boolean
  },
  data () {
    return {
      imageURI: '',
      isLoading: false
    }
  },
  methods: {
    async loadImage (cid) {
      this.imageURI = undefined
      if (cid) {
        this.isLoading = true
        const file = await BrowserIpfs.retrieve(cid)
        this.$emit('loaded', file.payload)
        this.imageURI = URL.createObjectURL(file.payload)
        this.isLoading = false
      }
    }
  },
  mounted () {
    if (this.ipfsCid) {
      this.loadImage(this.ipfsCid)
    }
  },

  computed: {
    label () {
      return this.defaultLabel ? this.defaultLabel.slice(0, 2).toUpperCase() : ''
    },
    fontSize () {
      return this.size * 0.8
    }
  },
  watch: {
    ipfsCid (cid) {
      if (!cid) return
      this.loadImage(cid)
    }
  }
}
</script>

<template lang="pug">
#avatar-container(v-if="ipfsCid || showDefault")
  q-avatar(:size="size" :color="color" :text-color="textColor" v-if="!square")
    img(:src="imageURI" v-if="imageURI").object-cover
    loading-spinner.loadingSpinner(
        :color="textColor"
        v-else-if="!imageURI && isLoading"
    )
    span(v-else-if="!imageURI && !isLoading && showDefault" size=size font-size=fontSize color="primary" text-color="white") {{ this.label }}
  template(v-else)
    q-card(:style="{ 'max-width': '180px', 'border-radius': '12px', 'box-shadow': '0px 0px 14px #23283C14', 'position': 'relative' }")
      div.bg-white.flex.items-center.justify-center.absolute.cursor-pointer(v-if="canRemoveFile" @click="$emit('removeFile')" :style="{ 'width': '20px', 'height': '20px', 'border-radius': '50%', 'right': '10px', 'top': '10px' }")
        q-icon(name="fas fa-times" color="primary")
      img(:src="imageURI" v-if="imageURI" width="180px" height="98px" :style="{ 'border-radius': '12px 12px 0 0' }").object-cover
      q-card-section(v-if="originalUploadedFile")
        .font-lato.text-bold(:style="{ 'font-size': '11px', 'text-overflow': 'ellipsis', 'white-space': 'nowrap', 'overflow': 'hidden' }") {{ originalUploadedFile.name }}
        .h-b2.text-italic {{ Math.round(originalUploadedFile.size/1000) }} KB
</template>
