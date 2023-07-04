<script>
import I18n from '~/utils/i18n'
export default {
  name: 'tokens',
  components: {
    Widget: () => import('../common/widget.vue'),
    TreasuryToken: () => import('./treasury-token.vue')
  },
  props: {
    /**
     * Circles Array
     */
    title: {
      type: String,
      default: I18n.t('organization.tokens.issuance')
    },
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
widget.q-px-xxl.q-py-lg(noPadding)
  .justify-between.items-center.full-width(v-if="vertical")
    .h-h4 {{ title }}
    .token-row.q-my-md(v-for="token in tokens" :key="token.tokenName" v-bind="token")
      treasury-token(v-bind="token" :daoLogo="daoLogo")
    q-btn.h-btn2.full-width.q-mt-md(rounded text-color="primary" outline no-caps @click="$emit('more-clicked')") {{ $t('organization.tokens.seeMore') }}
  .row.justify-between.items-center(v-else)
    .col-12
      .row.items-center
        .col-auto
          .h-h4 {{ title }}
        .col
          .justify-between.q-col-gutter-x-sm.items-baseline.q-ml-xs.row
            .col(v-for="token in tokens" :key="token.tokenName" v-bind="token")
              treasury-token(v-bind="token" :daoLogo="daoLogo")
        .col-1(v-if="more")
          .row.justify-center.items-center
            q-btn.h-btn2(rounded text-color="primary" flat no-caps @click="$emit('more-clicked')") {{ $t('organization.tokens.seeMore1') }}

</template>
