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
        .text-body {{ $t('ipfs.demo-ipfs-inputs.ipfsId', { '1': image }) }}
        .cont
          input-file-ipfs(:label="$t('ipfs.demo-ipfs-inputs.previewImage')" ipfsURL="QmZ94baDdRt9VGW8p2cMhk7cJu8VRzoXavvUyFDPL3WsBY:png" preview="preview" image="image" @uploadedFile="ipfsId => image = ipfsId")
    .col
      .text-body {{ $t('ipfs.demo-ipfs-inputs.ipfsId1', { '1': file }) }}
      input-file-ipfs(:label="$t('ipfs.demo-ipfs-inputs.ipfsFile')" @uploadedFile="ipfsId => file = ipfsId")
      .text-body {{ $t('ipfs.demo-ipfs-inputs.ipfsId2', { '1': file2 }) }}
      input-file-ipfs(:label="$t('ipfs.demo-ipfs-inputs.ipfsFileWith')" download="download" @uploadedFile="ipfsId => file2 = ipfsId")

</template>
