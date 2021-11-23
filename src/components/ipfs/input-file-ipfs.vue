<template lang="pug">
#containers
  #avatar-container(v-if="image")
    q-avatar(size="120px")
        img(:src="imageURI")
    q-btn.btnf(:disable="isUploading" round icon="fa fa-edit" color="primary" size="md" @click="$refs.qFile.pickFiles()")
      q-tooltip Change File
  .row.container-spinner.justify-center(v-if="isUploading && image")
    q-spinner-gears.loadingSpinner(
        color="primary"
        size="4em"
    )
  q-file(
    ref="qFile"
    v-show="!image"
    @input=" e => updateModel(e)"
    :accept="acceptedFiles"
    counter
    :label="label"
    filled
    v-model="file"
  )
    template(v-slot:append v-if="isUploading")
        q-spinner-hourglass(
          color="primary"
          size="2em"
        )
    template(v-slot:append v-else-if="!isUploading && typeCid && download")
      q-icon.cursor-pointer(
        name="fas fa-download"
        @click="downloadFile"
      )
</template>

<script>
import { mapGetters } from 'vuex'
import BrowserIpfs from '~/ipfs/browser-ipfs.js'
// import defaultImage from './icons/default-user-image.png'
export default {
  name: 'input-file-ipfs',
  data () {
    return {
      imageURI: '',
      isUploading: false,
      typeCid: undefined,
      file: undefined
    }
  },
  props: {
    ipfsURL: {
      type: String,
      default: undefined
    },
    image: Boolean,
    preview: Boolean,
    download: Boolean,
    label: String
  },
  mounted () {
    if (this.ipfsURL !== '' && this.ipfsURL && this.image) this.loadImage(this.ipfsURL)
  },
  watch: {
    value (v) {
      this.loadImage(v)
    }
  },
  methods: {
    async downloadFile () {
      const file = await BrowserIpfs.retrieve(this.typeCid)
      const urlFile = URL.createObjectURL(file.payload)
      window.open(urlFile, '_blank')
    },
    async updateModel (e) {
      try {
        console.log('updateModel', e)
        await this.$nextTick()
        this.typeCid = undefined
        this.isUploading = true
        await this.$nextTick()
        this.typeCid = await BrowserIpfs.store(e)
        console.log('File uploaded', this.typeCid)
        this.$emit('uploadedFile', this.typeCid)
        this.loadImage(this.typeCid)
      } catch (e) {
        console.error(e)
        this.isUploading = false
      }
      this.isUploading = false
    },
    async loadImage (v) {
      this.typeCid = v
      this.$emit('uploadedFile', this.typeCid)
      const file = await BrowserIpfs.retrieve(this.typeCid)
      this.imageURI = URL.createObjectURL(file.payload)
    }
  },
  computed: {
    ...mapGetters('accounts', ['getAvatar', 'account', 'searchByAccount']),
    acceptedFiles () {
      return this.image ? '.jpg, image/*' : undefined
    }
  }
}
</script>

<style lang="sass" scoped>
#avatar-container
  position: relative
.btnf
  position: absolute
  left: 90px
  bottom: -5px
.loadingSpinner
  text-align: center
.container-spinner
 position: absolute
 bottom: 30px
 left: 30px
</style>
