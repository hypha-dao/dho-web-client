<template lang="pug">
#containers
  #avatar-container(v-if="image")
    q-avatar(:size="previewSize")
        img(:src="imageURI" v-if="imageURI")
        q-icon(name="fas fa-edit" v-else-if="!imageURI && !isUploading" size="sm" color="primary")
    q-btn.btnf(:disable="isUploading" round icon="fa fa-edit" color="primary" size="md" @click="$refs.qFile.pickFiles()")
      q-tooltip Upload a File
    //- .row.container-spinner.justify-center(v-if="isUploading && image")
    .row.container-spinner.justify-center(v-if="isUploading && image")
      loading-spinner.loadingSpinner(
        color="primary"
        size="3rem"
      )
  q-file(
    ref="qFile"
    v-show="!image"
    @input=" e => updateModel(e)"
    :accept="acceptedFiles"
    counter
    outlined
    flat
    rounded
    v-model="file"
    :max-total-size="maxSize"
    @rejected="e => showError(e)"
    :label="label"
  )
    template(v-slot:append v-if="isUploading")
        loading-spinner(
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
      file: undefined,
      maxSize: 5000000
    }
  },
  props: {
    cid: {
      type: String,
      default: undefined
    },
    image: Boolean,
    preview: Boolean,
    download: Boolean,
    label: String,
    previewSize: {
      type: String,
      default: '120px'
    }
  },
  mounted () {
    if (this.cid !== '' && this.cid) this.loadFile(this.cid)
  },
  watch: {
    cid (v) {
      this.loadFile(v)
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
        await this.$nextTick()
        this.typeCid = undefined
        this.isUploading = true
        await this.$nextTick()
        this.$emit('uploading')
        this.typeCid = await BrowserIpfs.store(e)
        this.$emit('uploadedFile', this.typeCid)
        await this.loadFile(this.typeCid)
        this.$emit('finished')
      } catch (e) {
        this.isUploading = false
      }
      this.isUploading = false
    },
    async loadFile (v) {
      this.typeCid = v
      this.$emit('uploadedFile', this.typeCid)
      const file = await BrowserIpfs.retrieve(this.typeCid)
      this.file = file.payload
      this.imageURI = URL.createObjectURL(file.payload)
    },
    chooseFile () {
      this.$refs.qFile.pickFiles()
    },
    showError (e) {
      if (e[0].failedPropValidation === 'max-total-size') {
        this.showNotification({
          message: `File size exceeds the maximum limit (${this.bytesToSize(this.maxSize)})`,
          color: 'red'
        })
      }
    },
    bytesToSize (bytes) {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      if (bytes === 0) return '0 Byte'
      const size = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
      return Math.round(bytes / Math.pow(1024, size), 2) + ' ' + sizes[size]
    }
  },
  computed: {
    ...mapGetters('accounts', ['getAvatar', 'account', 'searchByAccount']),
    acceptedFiles () {
      return this.image ? '.jpg, image/*' : undefined
    }
  },
  components: {
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue')
  }
}
</script>

<style lang="stylus" scoped>
#avatar-container
  position: relative
.btnf
  position: absolute
  left: 75px
  bottom: -5px
.loadingSpinner
  text-align: center
.container-spinner
 position: absolute
 bottom: 30px
 left: 30px
</style>
