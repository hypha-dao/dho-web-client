<template lang="pug">
  #cont
    demo-ipfs-inputs
</template>

<script>
export default {
  name: 'demo-ipfs',
  components: {
    DemoIpfsInputs: () => import('~/components/ipfs/demo-ipfs-inputs.vue')
  }
}
</script>
