<script>
export default {
  name: 'downgrade-pop-up',

  props: {
    value: Boolean
  }
}
</script>

<template lang="pug">
q-dialog(:value="value" persistent)
  .bg-primary.rounded-full(:style="{'min-width':'680px'}")
    header.q-px-xl.q-py-md.row.h-h4.text-white(:class="{'justify-between h-h5': !$q.screen.gt.sm }" :style="{'border-bottom': '2px solid rgba(255, 255, 255, .2)'}")
        div(:class="{'q-pr-md': $q.screen.gt.sm }") Downgrade Your Plan
    section.q-px-xl.q-py-md
      h3.q-pa-none.q-ma-none.h-h2.text-white.text-weight-700 Are you sure you want to downgrade?
      p.h-b1.text-white.q-my-xxxl.text-weight-300 By downgrading you will no longer be able to access some of the DAO features connected to your active plan. Additionally, keep in mind that the number of available core member positions will be reduced, according to the new plan max capacity.
      p.h-b1.text-white.q-my-lg.text-weight-300 Please check Terms and conditions to learn more.

    nav.q-mt-xxl.q-px-xl.q-pb-xl.full-width.row
      .col-6.q-pr-xs
        q-btn.q-px-xl.rounded-border.full-width(
          @click="$emit('hidePopUp')"
          label="Keep my plan"
          no-caps
          outline
          rounded
          text-color="white"
          unelevated
        )
      .col-6.q-pl-xs
        q-btn.q-px-xl.rounded-border.text-bold.full-width(
          @click="$emit('activatePlan')"
          color="white"
          text-color="primary"
          label="Downgrade"
          no-caps
          rounded
          unelevated
        )
</template>

<style lang="stylus" scoped>
.rounded-full
  border-radius: 25px
</style>
