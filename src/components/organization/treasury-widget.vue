<script>
export default {
  name: 'treasury-widget',
  components: {
    Widget: () => import('../common/widget.vue'),
    TreasuryToken: () => import('./treasury-token.vue')
  },
  props: {
    /**
     * Circles Array
     */
    tokens: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<template lang="pug">
widget.full-height.full-width
  .row.justify-between.q-my-md.items-center
    .col-11
      .row.items-center
        .col-1
          .headline-widget Treasury
        //- .col-3
        //-   .text-body2.q-mt-sm.text-weight-thin.text-grey-7.q-ml-md.q-pl-sm.text-justify.font-size-w-desc  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        .col
          .row.justify-between.q-col-gutter-x-sm.items-baseline.q-ml-xs
            .col(v-for="token in tokens" :key="token.tokenName" v-bind="token")
              treasury-token(v-bind="token")
    //- .col
    //-   q-btn.full-width(
    //-       label="See all"
    //-       flat
    //-       no-caps
    //-       dense
    //-   )
</template>
