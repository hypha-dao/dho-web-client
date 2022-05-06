<script>
export default {
  name: 'header-view',
  components: {
    IpfsImageViewer: () => import('~/components/ipfs/ipfs-image-viewer.vue')
  },
  props: {
    /**
     * Selected step from Login screen
     */
    step: String,
    /**
     * Dao's logo
     */
    logo: String,
    /**
     * Dao name
     */
    daoName: String,
    /**
     * All possibles steps from Login screens
     */
    steps: Object
  }
}
</script>

<template lang="pug">
.full-width
    .row.justify-between.q-mb-md
      //- .hypha-logo.cursor-pointer(@click="$emit('logoClick')")
      ipfs-image-viewer(
        :ipfsCid="logo"
        showDefault
        :defaultLabel="daoName"
        :size="height/1.5 + 'px'"
      )
      .h-th-subtitle {{ daoName }}
</template>

<style lang="stylus" scoped>
.hypha-logo
    background-image: url('./../../assets/logos/hypha-logo-color-orizontal.svg')
    width: 110px
    height: 33px
    background-repeat: no-repeat
    background-size: contain
.span-text
  font-size: 13px
</style>
