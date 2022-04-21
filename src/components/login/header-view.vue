<script>
export default {
  name: 'header-view',
  props: {
    /**
     * Selected step from Login screen
     */
    step: String,
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
        .hypha-logo.cursor-pointer(@click="$emit('logoClick')")
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
