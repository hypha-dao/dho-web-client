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
    .text-h6 Product Circle
    .text-subtitle2.text-italic.text-positive 2 open proposals
    .text-subtitle2.text-italic 5 active assignments
    .row.q-mt-sm
      .row.q-mr-sm
        q-avatar(size="sm")
          img(src="avatar-placeholder.png")
        q-avatar(:style="{ 'margin-left': '-8px' }" size="sm")
          img(src="avatar-placeholder.png")
        q-avatar(:style="{ 'margin-left': '-8px' }" size="sm")
          img(src="avatar-placeholder.png")
      .text-subtitle2.text-italic +2 more
  q-card-section.q-pt-none This is the coolest circle. We build the coolest stuff and you probably want to join this circle.
  q-card-section
    .text-bold Last Month
    pre.q-my-none 20.000 HUSD
    pre.q-my-none 1.345 HYPHA
    pre.q-my-none 45.330 HVOICE
  q-card-actions(align="center")
    q-btn(flat color="primary") More
</template>

<style lang="stylus" scoped>
.circle-card
  max-width 480px
</style>
