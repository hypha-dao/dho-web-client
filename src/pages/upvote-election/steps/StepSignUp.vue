<script>
import badges from '../temp-badges.js'
export default {
  name: 'step-sign-up',
  components: {
    AssetList: () => import('~/components/organization-asset/asset-list.vue')
  },

  props: {
    step: Object
  },
  data () {
    return {
      badges: badges
    }
  },
  computed: {
  }
}
</script>

<template lang="pug">
.step-sign-up
  .h-b2.q-mb-xxl {{ step.description }}
  asset-list(:assetList="badges" bordered)
</template>

<style lang="stylus" scoped>
</style>
