<script>
export default {
  name: 'demo-ipfs-inputs',
  components: {
    InputFileIpfs: () => import('~/components/ipfs/input-file-ipfs.vue')
  },
  data () {
    return {
      file: undefined,
      file2: undefined,
      image: undefined
    }
  }

}
// QmWxaYs68SqcbhzR5dE8eVxDXQZxNwp1hZnrQEPv4w24j4
</script>

<template lang="pug">
#cont
  .row.q-col-gutter-sm
    .col
      .row.justify-center
        .text-body IPFS ID: {{ image }}
        .cont
            input-file-ipfs(
                label="Preview Image"
                ipfsURL="QmWxaYs68SqcbhzR5dE8eVxDXQZxNwp1hZnrQEPv4w24j4"
                preview
                image
                @uploadedFile="ipfsId => image = ipfsId"
            )
    .col
      .text-body IPFS ID: {{ file }}
      input-file-ipfs(
          label="IPFS File"
          @uploadedFile="ipfsId => file = ipfsId"
      )
      .text-body IPFS ID: {{ file2 }}
      input-file-ipfs(
          label="IPFS File with download button"
          download
          @uploadedFile="ipfsId => file2 = ipfsId"
      )
</template>
