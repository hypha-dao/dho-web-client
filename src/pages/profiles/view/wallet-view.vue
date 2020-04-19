<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { validation } from '~/mixins/validation'
import PaymentCard from '../../payments/components/payment-card'

export default {
  name: 'wallet-view',
  mixins: [validation],
  components: { PaymentCard },
  data () {
    return {
      tokens: {
        husd: 0.00,
        hvoice: 0.00,
        hypha: 0.00,
        liquidSeeds: 0.0000,
        deferredSeeds: 0.0000
      },
      show0: false,
      show1: false,
      show2: false,
      show3: false,
      show4: false,
      redeemForm: false,
      form: {
        amount: 0
      },
      submitting: false
    }
  },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated', 'isMember', 'account']),
    ...mapGetters('payments', ['payments', 'paymentsLoaded'])
  },
  beforeMount () {
    this.clearData()
    this.loadTokens()
    this.setBreadcrumbs([{ title: 'Wallet' }])
  },
  mounted () {
    setTimeout(() => { this.show0 = true }, 1 * 200)
    setTimeout(() => { this.show1 = true }, 2 * 200)
    setTimeout(() => { this.show2 = true }, 3 * 200)
    setTimeout(() => { this.show3 = true }, 4 * 200)
    setTimeout(() => { this.show4 = true }, 5 * 200)
  },
  methods: {
    ...mapActions('payments', ['fetchData', 'redeemToken']),
    ...mapMutations('payments', ['clearData']),
    ...mapActions('profiles', ['getTokensAmounts']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType', 'setBreadcrumbs']),
    async onLoad (index, done) {
      await this.fetchData({ account: this.account })
      done()
    },
    async loadTokens () {
      this.tokens = await this.getTokensAmounts(this.account)
    },
    displayForm () {
      this.setShowRightSidebar(true)
      this.setRightSidebarType(`${this.$route.params.type}Form`)
    },
    async onRedeemToken () {
      await this.resetValidation(this.form)
      if (!(await this.validate(this.form))) return
      this.submitting = true
      const res = await this.redeemToken({ quantity: `${parseFloat(this.form.amount).toFixed(2)} HUSD`, memo: '“redemption”' })
      if (res) {
        this.form.amount = 0
        await this.resetValidation(this.form)
        await this.loadTokens()
        this.redeemForm = false
      }
      this.submitting = false
    }
  }
}
</script>

<template lang="pug">
.q-pa-lg
  .row
    .tokens-wallet-mobile(v-if="!$q.platform.is.desktop")
      .token-info.row.flex.items-center
        img.icon(src="~assets/icons/seeds.png")
        div
          .name DEFERRED SEEDS
          .amount {{ new Intl.NumberFormat().format(parseInt(tokens.deferredSeeds), { style: 'currency' }) }}
      .token-info.row.flex.items-center
        img.icon(src="~assets/icons/seeds.png")
        div
          .name LIQUID SEEDS
          .amount {{ new Intl.NumberFormat().format(parseInt(tokens.liquidSeeds), { style: 'currency' }) }}
      .token-info.row.flex.items-center
        img.icon(src="~assets/icons/hypha.svg")
        div
          .name HYPHA
          .amount {{ new Intl.NumberFormat().format(parseInt(tokens.hypha), { style: 'currency' }) }}
      .token-info.row.flex.items-center
        img.icon(src="~assets/icons/hvoice.svg")
        div
          .name HVOICE
          .amount {{ new Intl.NumberFormat().format(tokens.hvoice, { style: 'currency' }) }}
      .token-info.row.flex.items-center
        img.icon(src="~assets/icons/husd.svg")
        div
          .name HUSD
          .amount {{ new Intl.NumberFormat().format(parseInt(tokens.husd), { style: 'currency' }) }}
        q-icon.redeem-icon(
          name="fas fa-grip-lines-vertical"
          color="orange"
        )
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
      transition(
        appear
        enter-active-class="animated slideInRight"
        leave-active-class="animated slideOutRight"
      )
        .token-info.row.flex.items-center(v-if="show0" style="transition-delay: 0.2s")
          img.icon(src="~assets/icons/seeds.png")
          div
            .name DEFERRED SEEDS
            .amount {{ new Intl.NumberFormat().format(parseInt(tokens.deferredSeeds), { style: 'currency' }) }}
      transition(
        appear
        enter-active-class="animated slideInRight"
        leave-active-class="animated slideOutRight"
      )
        .token-info.row.flex.items-center(v-if="show1" style="transition-delay: 0.2s")
          img.icon(src="~assets/icons/seeds.png")
          div
            .name LIQUID SEEDS
            .amount {{ new Intl.NumberFormat().format(parseInt(tokens.liquidSeeds), { style: 'currency' }) }}
      transition(
        appear
        enter-active-class="animated slideInRight"
        leave-active-class="animated slideOutRight"
      )
        .token-info.row.flex.items-center(v-if="show2" style="transition-delay: 0.2s")
          img.icon(src="~assets/icons/hypha.svg")
          div
            .name HYPHA
            .amount {{ new Intl.NumberFormat().format(parseInt(tokens.hypha), { style: 'currency' }) }}
      transition(
        appear
        enter-active-class="animated slideInRight"
        leave-active-class="animated slideOutRight"
      )
        .token-info.row.flex.items-center(v-if="show3" style="transition-delay: 0.2s")
          img.icon(src="~assets/icons/hvoice.svg")
          div
            .name HVOICE
            .amount {{ new Intl.NumberFormat().format(parseInt(tokens.hvoice), { style: 'currency' }) }}
      transition(
        appear
        enter-active-class="animated slideInRight"
        leave-active-class="animated slideOutRight"
      )
        .token-info.row.flex.justify-between.items-center(
          v-if="show4"
          style="transition-delay: 0.2s"
          :class="{ 'redeem-form': redeemForm }"
        )
          .flex.cursor-pointer(
            style="width:150px"
            @click="redeemForm = !redeemForm"
          )
            img.icon(src="~assets/icons/husd.svg")
            div
              .name HUSD
              .amount {{ new Intl.NumberFormat().format(parseInt(tokens.husd), { style: 'currency' }) }}
          q-btn.redeem-icon(
            v-if="!redeemForm && isMember"
            icon="fas fa-grip-lines-vertical"
            color="deep-orange"
            dense
            unelevated
            @click="redeemForm = !redeemForm"
          )
          .flex.justify-between.items-center(
            v-if="redeemForm && isMember"
            style="flex: 1"
          )
            q-input(
              style="width:90px;"
              ref="amount"
              v-model="form.amount"
              type="number"
              :rules="[rules.greaterThan(0), rules.lessOrEqualThan(parseInt(tokens.husd))]"
              lazy-rules
              outlined
              dense
              hide-bottom-space
            )
            q-btn.q-mr-lg.q-px-md(
              color="deep-orange"
              dense
              unelevated
              rounded
              size="10px"
              @click="onRedeemToken"
              :loading="submitting"
            )
              | Redemption
              br
              | Request
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
  padding 5px 16px 5px 10px
  margin-bottom 10px
  transition margin-left 0.2s ease-in, width 0.2s ease-in
  .icon
    margin-right 15px
    width 40px
  .name
    text-transform uppercase
    font-weight 600
    font-size 16px
  .amount
    font-size 16px
.redeem-icon
  margin-right 20px
.redeem-form
  width 400px
  transition margin-left 0.2s ease-in, width 0.2s ease-in
  margin-left -160px
</style>
