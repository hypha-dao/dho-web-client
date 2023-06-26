<script>
export default {
  name: 'circle-card',

  props: {
    title: String,
    assignments: Array,
    members: Array
  }
}
</script>

<template lang="pug">
q-card.circle-card
  img(src="circle-example.png")
  q-card-section
    .text-h6 {{ $t('circles.circle-card.productCircle') }}
    .text-subtitle2.text-italic.text-positive {{ $t('circles.circle-card.openProposals') }}
    .text-subtitle2.text-italic {{ $t('circles.circle-card.activeAssignments') }}
    .row.q-mt-sm
      .row.q-mr-sm
        q-avatar(size="sm")
          img(src="avatar-placeholder.png")
        q-avatar(:style="{ 'margin-left': '-8px' }" size="sm")
          img(src="avatar-placeholder.png")
        q-avatar(:style="{ 'margin-left': '-8px' }" size="sm")
          img(src="avatar-placeholder.png")
      .text-subtitle2.text-italic {{ $t('circles.circle-card.more') }}
  q-card-section.q-pt-none {{ $t('circles.circle-card.thisIsThe') }}
  q-card-section
    .text-bold {{ $t('circles.circle-card.lastMonth') }}
    pre.q-my-none {{ $t('circles.circle-card.husd') }}
    pre.q-my-none {{ $t('circles.circle-card.hypha') }}
    pre.q-my-none {{ $t('circles.circle-card.hvoice') }}
  q-card-actions(align="center")
    q-btn(flat="flat" color="primary") {{ $t('circles.circle-card.more1') }}
</template>

<style lang="stylus" scoped>
.circle-card
  max-width 480px
</style>
