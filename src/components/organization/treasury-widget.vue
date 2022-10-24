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
    },
    more: Boolean,
    /**
     * IPFS CID
     */
    daoLogo: String,
    vertical: Boolean
  }
}
</script>

<template lang="pug">
widget(noPadding).q-px-xxl.q-py-lg
  .justify-between.items-center.full-width(v-if="vertical")
    .h-h4 Issuance
    .token-row.q-my-md(v-for="token in tokens" :key="token.tokenName" v-bind="token")
      treasury-token(v-bind="token" :daoLogo="daoLogo")
    q-btn.h-btn2.full-width.q-mt-md(rounded text-color="primary" outline no-caps @click="$emit('more-clicked')") See more
  .row.justify-between.items-center(v-else)
    .col-12
      .row.items-center
        .col-1
          .h-h4 Issuance
        //- .col-3
        //-   .text-body2.q-mt-sm.text-weight-thin.text-grey-7.q-ml-md.q-pl-sm.text-justify.font-size-w-desc  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        .col
          .justify-between.q-col-gutter-x-sm.items-baseline.q-ml-xs(:class="{ 'row':$q.platform.is.desktop }")
            .col(v-for="token in tokens" :key="token.tokenName" v-bind="token")
              treasury-token(v-bind="token" :daoLogo="daoLogo")
        .col-1(v-if="more")
          .row.justify-center.items-center
            q-btn.h-btn2(rounded text-color="primary" flat no-caps @click="$emit('more-clicked')") See more
    //- .col
    //-   q-btn.full-width(
    //-       label="See all"
    //-       flat
    //-       no-caps
    //-       dense
    //-   )
</template>
