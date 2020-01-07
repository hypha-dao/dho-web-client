<script>
export default {
  name: 'page-proposals-add'
}
</script>

<template lang="pug">
q-page.q-pa-lg.flex.column.justify-around
  div
    .text-h4.text-center.q-mb-sm What do you want to propose?
    .text-subtitle1.text-center.q-mb-lg Your idea will be submitted and voted by lorem ipsum...
  .row.flex.justify-around.items-center.full-height
    q-card.proposal-card(
      @click="$router.push({ path: '/proposals/roles/add' })"
    )
      q-card-section.text-center
        img.icon(src="~assets/icons/roles.svg")
        .type Role
      q-card-section.q-mt-lg
        p Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla rhoncus interdum neque in suscipit. Duis rhoncus dignissim varius. Maecenas at libero nec purus rhoncus pulvinar non non risus. Nullam eu sagittis libero, vitae elementum nulla.
    q-card.proposal-card(
      @click="$router.push({ path: '/proposals/assignments/add' })"
    )
      q-card-section.text-center
        img.icon(src="~assets/icons/assignments.svg")
        .type Assignment
      q-card-section.q-mt-lg
        p Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla rhoncus interdum neque in suscipit. Duis rhoncus dignissim varius. Maecenas at libero nec purus rhoncus pulvinar non non risus. Nullam eu sagittis libero, vitae elementum nulla.
    q-card.proposal-card(
      @click="$router.push({ path: '/proposals/payouts/add' })"
    )
      q-card-section.text-center
        img.icon(src="~assets/icons/payouts.svg")
        .type Payout
      q-card-section.q-mt-lg
        p Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla rhoncus interdum neque in suscipit. Duis rhoncus dignissim varius. Maecenas at libero nec purus rhoncus pulvinar non non risus. Nullam eu sagittis libero, vitae elementum nulla.

</template>

<style lang="stylus" scoped>
.proposal-card
  cursor pointer
  width 100%
  max-width 400px
  margin-bottom 20px
.icon
  margin-top 20px
  width 100%
  max-width 100px
.type
  text-transform capitalize
  text-align center
  font-weight bolder
  font-size 28px
</style>
