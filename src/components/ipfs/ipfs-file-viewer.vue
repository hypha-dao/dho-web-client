<script>
import BrowserIpfs from '~/ipfs/browser-ipfs.js'

export default {
  name: 'ipfs-file-viewer',
  props: {
    ipfsCid: String
  },
  methods: {
    async downloadFile () {
      try {
        const file = await BrowserIpfs.retrieve(this.ipfsCid)
        const urlFile = URL.createObjectURL(file.payload)
        window.open(urlFile, '_blank')
      } catch (e) {
        const message = e.message || e.cause.message
        this.showNotification({
          message,
          color: 'red'
        })
      }
    }
  }
}
</script>

<template lang="pug">
a.on-right.cursor-pointer(@click="downloadFile") See attached document
</template>
