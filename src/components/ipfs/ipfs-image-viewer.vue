<script>
import BrowserIpfs from '~/ipfs/browser-ipfs.js'

export default {
  name: 'ipfs-image-viewer',
  components: {
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue')
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
    }
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
    label () { return this.defaultLabel ? this.defaultLabel.slice(0, 2).toUpperCase() : '' }

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
  q-avatar(:size="size" :color="color" :text-color="textColor")
    img(:src="imageURI" v-if="imageURI").object-cover
    loading-spinner.loadingSpinner(
        :color="textColor"
        v-else-if="!imageURI && isLoading"
    )
    slot(name="def" v-else-if="!imageURI && !isLoading && showDefault")
      span {{ this.label }}
        //- q-icon(name="fas fa-edit" v-else-if="!imageURI && !isUploading" size="sm" color="primary")
</template>
