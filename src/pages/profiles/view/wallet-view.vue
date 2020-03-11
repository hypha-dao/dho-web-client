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
    .col-xs-12.col-md-2.offset-md-10
      q-card
        q-card-section.text-center.bg-primary.text-white.q-mb-lg
          .text-h6 Tokens held
        q-card-section.text-right
          | {{ tokens.hypha }} #[strong HYPHA]
        q-card-section.text-right
          | {{ tokens.hvoice }} #[strong HVOICE]
        q-card-section.text-right
          | {{ tokens.seeds }} #[strong SEEDS]
        q-card-section.text-right
          | {{ tokens.lockedSeeds }} #[strong SEEDS] (escrow)
  .payments-list(ref="paymentsListRef")
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
</template>

<style lang="stylus" scoped>

</style>
