<script>
import { format } from '~/mixins/format'

export default {
  name: 'treasury-token',
  components: {
    Widget: () => import('../common/widget.vue'),
    TokenLogo: () => import('../common/token-logo.vue')
  },
  mixins: [
    format
  ],
  props: {
    /**
     * Logo url
     */
    logo: String,
    /**
     * Token Name
     */
    tokenName: String,
    /**
     * Token Amount
     */
    amount: Number,
    /**
     * Token type
     */
    type: String,
    /**
     * IPFS CID of the DAO logo
     */
    daoLogo: String,
    icon: String,
    isError: Boolean
  },
  computed: {
    formattedAmount () {
      return this.getFormatedTokenAmount(this.amount)
    }
  }
}
</script>

<template lang="pug">
  #container
    .row.items-center.justify-around-q-pa-none.q-ma-none
      .col-auto
        token-logo(:type="type" :daoLogo="icon || daoLogo" size="40px").q-mr-xs
      .col
        .row.bg-internal-bg.q-gutter-x-xxs.justify-between.flex.value-container.full-width.q-pa-xs(:class="{'error-border': isError}")
          .h-b2.text-body.text-no-wrap  {{formattedAmount}}
          .h-b2.text-body.text-right.text-wrap.text-weight-bold.q-mr-xxs {{tokenName}}
</template>

<style lang="stylus" scoped>
.value-container
  border-radius: 15px
.text-wrap
  white-space: nowrap
  max-width: 100px
  text-overflow: ellipsis
  overflow: hidden
.error-border
  border: 1px solid var(--q-color-negative);
</style>
