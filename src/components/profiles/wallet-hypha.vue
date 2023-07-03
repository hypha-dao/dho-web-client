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
    hasEnoughTokens () { return this.token >= this.quantity },
    token () { return Number(this.balances?.[0]?.amount) }
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

<template>

<widget class="q-pa-none full-width" :bar="true" noPadding>
  <div class="row justify-between items-center">
    <div class="col-12 q-px-xl" :class="{ 'q-py-xl': !$q.screen.gt.md}">
      <div class="row items-center" :class="{ 'full-width': !$q.screen.gt.md}">
        <div class="col-12 col-sm-12 col-md-12 col-lg-3">
          <div class="h-h4">{{ $t('profiles.wallet-hypha.availableBalance') }}</div>
          <div class="h-label text-negative" v-if="!hasEnoughTokens">{{ $t('profiles.wallet-hypha.notEnoughTokens') }}</div>
        </div>
        <div class="col-12 col-sm-12 col-md-12 col-lg-3" :class="{ 'q-mt-xl': !$q.screen.gt.md}">
          <div class="col full-width" v-for="token in balances" :key="token.tokenName">
            <treasury-token v-bind="token" :isError="!hasEnoughTokens"></treasury-token>
          </div>
        </div>
        <div class="col-12 col-sm-12 col-md-12 col-lg-6 row justify-end">
          <nav class="col-md-12 col-lg-8 q-my-xl row q-col-gutter-x-sm" :class="{ 'q-col-gutter-y-sm': !$q.screen.gt.md}">
            <div class="col-12 col-sm-12 col-md-12 col-lg-6">
              <q-btn class="rounded-border text-bold q-mr-xs full-width full-height" :disabled="!isAdmin" @click="goToHyphaTokenSales" color="primary" :label="$t('profiles.wallet-hypha.buyHyphaToken')" no-caps rounded unelevated></q-btn>
            </div>
            <div class="col-12 col-sm-12 col-md-12 col-lg-6">
              <q-btn class="rounded-border text-bold q-ml-xs full-width full-height" :disable="!canActivate || !hasEnoughTokens || !isAdmin" @click="$emit('click')" color="secondary" no-caps rounded unelevated>
                <slot name="cta"></slot>
              </q-btn>
            </div>
          </nav>
        </div>
      </div>
    </div>
  </div>
</widget>
</template>

<style lang="stylus" scoped>
</style>
