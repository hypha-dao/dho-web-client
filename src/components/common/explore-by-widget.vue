<script>
import { EXPLORE_BY } from '~/const'

export default {
  name: 'explore-by-widget',
  props: {
    type: String
  },
  components: {
    Widget: () => import('~/components/common/widget.vue')
  },

  data() {
    return {
      EXPLORE_BY
    }
  }
}
</script>

<template lang="pug">
widget.sticky.bg-white.rounded.full-width.q-pa-md.q-mb-md(:textColor="'black'" :title="$t('common.explore-by-widget.exploreBy')")
  .select-option(@click="$emit('change', EXPLORE_BY.DAOS)")
    .select-option-label {{ $t('common.explore-by-widget.daos') }}
    .select-option-dot(:class="{selected: this.type === EXPLORE_BY.DAOS}")
  .select-option(@click="$emit('change', EXPLORE_BY.ECOSYSTEMS)")
    .select-option-label {{ $t('common.explore-by-widget.ecosystems') }}
    .select-option-dot(:class="{selected: this.type === EXPLORE_BY.ECOSYSTEMS}")

</template>

<styles lang="stylus">
.select-option
  display: flex
  align-items: center
  justify-content: space-between
  margin-top: 15px
  cursor: pointer
  .select-option-label
    color: black
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
    background: #252F5D
  .selected
    opacity: 1
  .selected::before
    content: ''
    background: #FFF
    width: 10px
    height: 10px
    border-radius: 50%
</styles>
