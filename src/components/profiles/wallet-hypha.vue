<script>
import SimpleCrypto from 'simple-crypto-js'

export default {
  name: 'wallet-hypha',
  components: {
    TreasuryToken: () => import('~/components/organization/treasury-token.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    account: {
      type: String,
      default: null
    },

    balances: {
      type: Array,
      default: () => []
    },

    isAdmin: {
      type: Boolean,
      default: false
    },

    quantity: Number
  },

  computed: {
    canActivate () { return true },
    hasEnoughTokens () { return Number(this.balances?.[0]?.amount) >= this.quantity }
  },

  methods: {
    async goToHyphaTokenSales () {
      const simpleCrypto = new SimpleCrypto(process.env.HYPHA_TOKEN_SALES_ENCODE_KEY)

      const data = {
        account: this.account,
        amount: this.quantity,
        accountType: 'hypha_telos',
        disableGoBack: true
      }

      const cipher = await simpleCrypto.encrypt(JSON.stringify(data))
      const activationSecret = encodeURIComponent(cipher)

      window.open(`${process.env.HYPHA_TOKEN_SALES_URL}/?daoActivation=${activationSecret}`, '_blank')
    }
  }
}
</script>

<template lang="pug">
widget(:bar='true' noPadding).q-pa-none.full-width
  .row.justify-between.items-center
    .col-12.q-px-xl(:class="{ 'q-py-xl': !$q.screen.gt.md}")
      .row.items-center(:class="{ 'full-width': !$q.screen.gt.md}")
        .col-12.col-sm-12.col-md-12.col-lg-3
          .h-h4 Available Balance
          .h-label.text-negative(v-if="!hasEnoughTokens") Not enough tokens
        .col-12.col-sm-12.col-md-12.col-lg-3(:class="{ 'q-mt-xl': !$q.screen.gt.md}")
          .col.full-width(v-for="token in balances" :key="token.tokenName")
            treasury-token(v-bind="token" :isError="!hasEnoughTokens")
        .col-12.col-sm-12.col-md-12.col-lg-6.row.justify-end
          nav.col-md-12.col-lg-8.q-my-xl.row.q-col-gutter-x-sm(:class="{ 'q-col-gutter-y-sm': !$q.screen.gt.md}")
            .col-12.col-sm-12.col-md-12.col-lg-6
              q-btn.rounded-border.text-bold.q-mr-xs.full-width.full-height(
                :disabled="!isAdmin"
                @click="goToHyphaTokenSales"
                color="primary"
                label="Buy Hypha Token"
                no-caps
                rounded
                unelevated
              )
            .col-12.col-sm-12.col-md-12.col-lg-6
              q-btn.rounded-border.text-bold.q-ml-xs.full-width.full-height(
                :disable="!canActivate || !hasEnoughTokens || !isAdmin"
                @click="$emit('click')"
                color="secondary"
                no-caps
                rounded
                unelevated
              )
                slot(name="cta")

              //- q-btn.rounded-border.text-bold.q-ml-xs.full-width.full-height(
              //-   :label="isDAOPlanActivated ? 'Renew plan ': 'Activate plan'"
              //-   @click="onActivate"
              //-   color="secondary"
              //-   no-caps
              //-   rounded
              //-   unelevated
              //- )
</template>

<style lang="stylus" scoped>
</style>
