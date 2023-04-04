<script>
export default {
  name: 'explore-by-widget',
  props: {
    type: String
  },
  components: {
    Widget: () => import('~/components/common/widget.vue')
  }
}
</script>
<template lang="pug">
widget.sticky.bg-secondary.rounded.full-width.q-pa-md.q-mb-md(:title="'Explore by:'" :textColor="'white'")
  .select-option(@click="$emit('selectDaos')")
    .select-option-label DAOs
    .select-option-dot(:class="{ 'selected': this.type === 'DAOS' }")
  .select-option(@click="$emit('selectEcosystems')")
    .select-option-label Ecosystems
    .select-option-dot(:class="{ 'selected': this.type === 'ECOSYSTEMS' }")
</template>
<styles lang="stylus">
.select-option
  display: flex
  align-items: center
  justify-content: space-between
  margin-top: 15px
  cursor: pointer
  .select-option-label
    color: white
    font-size: 14px
    font-weight: 600
  .select-option-dot
    display: flex
    justify-content: center
    align-items: center
    border-radius: 50%
    width: 22px
    height: 22px
    opacity: 0.18
    background: #fff
  .selected
    opacity: 1
  .selected::before
    content: ''
    background: #3F64EE
    width: 10px
    height: 10px
    border-radius: 50%
</styles>
