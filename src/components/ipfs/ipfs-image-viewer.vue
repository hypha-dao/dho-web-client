<script>
import BrowserIpfs from '~/ipfs/browser-ipfs.js'

export default {
  name: 'ipfs-image-viewer',
  props: {
    ipfsCid: String,
    size: {
      type: String,
      default: '120px'
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
      this.isLoading = true
      //   this.$emit('uploadedFile', this.typeCid)
      const file = await BrowserIpfs.retrieve(cid)
      this.imageURI = URL.createObjectURL(file.payload)
      this.isLoading = false
    }
  },
  mounted () {
    this.loadImage(this.ipfsCid)
  },
  watch: {
    ipfsCid (cid) {
      this.loadImage(cid)
    }
  }
}
</script>

<template lang="pug">
#avatar-container(v-if="ipfsCid")
  q-avatar(:size="size")
    img(:src="imageURI" v-if="imageURI")
    q-spinner-gears.loadingSpinner(
        color="primary"
        v-else
    )
        //- q-icon(name="fas fa-edit" v-else-if="!imageURI && !isUploading" size="sm" color="primary")
</template>
