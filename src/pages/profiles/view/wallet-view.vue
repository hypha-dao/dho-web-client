<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import PaymentCard from '../../payments/components/payment-card'

export default {
  name: 'wallet-view',
  components: { PaymentCard },
  data () {
    return {
      tokens: {
        hvoice: 0,
        hypha: 0,
        seeds: 0
      }
    }
  },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated', 'account']),
    ...mapGetters('payments', ['payments', 'paymentsLoaded'])
  },
  beforeMount () {
    this.clearData()
    this.loadTokens()
  },
  methods: {
    ...mapActions('payments', ['fetchData']),
    ...mapMutations('payments', ['clearData']),
    ...mapActions('profiles', ['getTokensAmounts']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType', 'setBreadcrumbs']),
    async onLoad (index, done) {
      await this.fetchData(this.account)
      done()
    },
    async loadTokens () {
      this.tokens = await this.getTokensAmounts(this.account)
    },
    displayForm () {
      this.setShowRightSidebar(true)
      this.setRightSidebarType(`${this.$route.params.type}Form`)
    }
  }
}
</script>

<template lang="pug">
q-page.q-pa-lg(:style-fn="breadcrumbsTweak")
  .row
    .tokens-wallet-mobile(v-if="!$q.platform.is.desktop")
      .token-info.row.flex.items-center
        img.icon(src="~assets/icons/seeds.png" style="width: 30px")
        div
          .name SEEDS
          .amount {{ new Intl.NumberFormat().format(tokens.lockedSeeds, { style: 'currency' }) }}
      .token-info.row.flex.items-center
        img.icon(src="~assets/icons/seeds.png" style="width: 30px")
        div
          .name LSEEDS
          .amount {{ new Intl.NumberFormat().format(tokens.seeds, { style: 'currency' }) }}
      .token-info.row.flex.items-center
        img.icon(src="~assets/icons/hypha.svg" style="width: 30px")
        div
          .name HYPHA
          .amount {{ new Intl.NumberFormat().format(tokens.hypha, { style: 'currency' }) }}
      .token-info.row.flex.items-center
        img.icon(src="~assets/icons/hvoice.svg" style="width: 30px")
        div
          .name HVOICE
          .amount {{ new Intl.NumberFormat().format(tokens.hvoice, { style: 'currency' }) }}
    .payments-list(ref="paymentsListRef", :class="{'payment-mobile': !$q.platform.is.desktop }")
      q-infinite-scroll(
        :disable="paymentsLoaded"
        @load="onLoad"
        :offset="250"
        :scroll-target="$refs.paymentsListRef"
      )
        .row.text-center
          payment-card(
            v-for="payment in payments"
            :key="payment.id"
            :payment="payment"
          )
        template(v-slot:loading)
          .row.justify-center.q-my-md
            q-spinner-dots(
              color="primary"
              size="40px"
            )
    .tokens-wallet(v-if="$q.platform.is.desktop")
      .token-info.row.flex.items-center
        img.icon(src="~assets/icons/seeds.png" style="width: 30px")
        div
          .name SEEDS
          .amount {{ new Intl.NumberFormat().format(tokens.lockedSeeds, { style: 'currency' }) }}
      .token-info.row.flex.items-center
        img.icon(src="~assets/icons/seeds.png" style="width: 30px")
        div
          .name LSEEDS
          .amount {{ new Intl.NumberFormat().format(tokens.seeds, { style: 'currency' }) }}
      .token-info.row.flex.items-center
        img.icon(src="~assets/icons/hypha.svg" style="width: 30px")
        div
          .name HYPHA
          .amount {{ new Intl.NumberFormat().format(tokens.hypha, { style: 'currency' }) }}
      .token-info.row.flex.items-center
        img.icon(src="~assets/icons/hvoice.svg" style="width: 30px")
        div
          .name HVOICE
          .amount {{ new Intl.NumberFormat().format(tokens.hvoice, { style: 'currency' }) }}
</template>

<style lang="stylus" scoped>
.payments-list
  width calc(100% - 200px)
.payment-mobile
  width 100%
.tokens-wallet-mobile
  width 100%
.tokens-wallet
  width 250px
  position fixed
  right -40px
.token-info
  background white
  border-radius 50px
  padding 5px 16px
  margin-bottom 10px
  .icon
    margin-right 15px
  .name
    text-transform uppercase
    font-weight 600
    font-size 16px
  .amount
    font-size 16px
</style>
