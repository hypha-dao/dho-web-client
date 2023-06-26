<script>
export default {
  name: 'downgrade-pop-up',

  props: {
    value: Boolean
  }
}
</script>

<template lang="pug">
q-dialog(:value="value" persistent="persistent")
  .bg-primary.rounded-full(:style="{'min-width':'680px'}")
    header.q-px-xl.q-py-md.row.h-h4.text-white(:class="{'justify-between h-h5': !$q.screen.gt.sm }" :style="{'border-bottom': '2px solid rgba(255, 255, 255, .2)'}")
      div(:class="{'q-pr-md': $q.screen.gt.sm }") {{ $t('plan.downgrade-pop-up.downgradeYourPlan') }}
    section.q-px-xl.q-py-md
      h3.q-pa-none.q-ma-none.h-h2.text-white.text-weight-700 {{ $t('plan.downgrade-pop-up.areYouSure') }}
      p.h-b1.text-white.q-my-xxxl.text-weight-300 {{ $t('plan.downgrade-pop-up.byDowngradingYou') }}
      p.h-b1.text-white.q-my-lg.text-weight-300 {{ $t('plan.downgrade-pop-up.pleaseCheckTerms') }}
    nav.q-mt-xxl.q-px-xl.q-pb-xl.full-width.row
      .col-6.q-pr-xs
        q-btn.q-px-xl.rounded-border.full-width(@click="$emit('hidePopUp')" :label="$t('plan.downgrade-pop-up.keepMyPlan')" no-caps="no-caps" outline="outline" rounded="rounded" text-color="white" unelevated="unelevated")
      .col-6.q-pl-xs
        q-btn.q-px-xl.rounded-border.text-bold.full-width(@click="$emit('activatePlan')" color="white" text-color="primary" :label="$t('plan.downgrade-pop-up.downgrade')" no-caps="no-caps" rounded="rounded" unelevated="unelevated")

</template>

<style lang="stylus" scoped>
.rounded-full
  border-radius: 25px
</style>
