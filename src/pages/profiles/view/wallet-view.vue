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
      canRedeem: false,
      displayMode: 'table',
      columns: [
        { name: 'icon', label: '', field: 'amount' },
        { name: 'activity', label: 'ACTIVITY', field: 'memo', sortable: true, align: 'left' },
        { name: 'time', label: 'TIME', field: 'date_created', sortable: true, align: 'left' },
        { name: 'status', label: 'STATUS', field: 'amount', sortable: true, align: 'left' },
        { name: 'amount', label: 'AMOUNT', field: 'amount', sortable: true }
      ],
      pagination: {
        rowsPerPage: 10,
        sortBy: 'time'
      },
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
      loading: true,
      submitting: false
    }
  },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated', 'isMember', 'account']),
    ...mapGetters('payments', ['payments', 'paymentsLoaded']),
    intl () {
      let lang
      if (navigator.languages !== undefined) { lang = navigator.languages[0] } else { lang = navigator.language }
      return new Intl.RelativeTimeFormat(lang.slice(0, 2), { style: 'narrow' })
    }
  },
  async beforeMount () {
    this.clearData()
    this.setBreadcrumbs([{ title: 'Wallet' }])
    this.canRedeem = await this.hasRedeemAddress()
  },
  async mounted () {
    setTimeout(() => { this.show0 = true }, 1 * 200)
    setTimeout(() => { this.show1 = true }, 2 * 200)
    setTimeout(() => { this.show2 = true }, 3 * 200)
    setTimeout(() => { this.show3 = true }, 4 * 200)
    setTimeout(() => { this.show4 = true }, 5 * 200)
    await this.fetchRedemptions({ account: this.account })
    await this.fetchData({ account: this.account })
    await this.loadTokens()
  },
  methods: {
    ...mapActions('payments', ['fetchData', 'redeemToken', 'hasRedeemAddress', 'fetchRedemptions']),
    ...mapMutations('payments', ['clearData', 'clearRedemptions']),
    ...mapActions('profiles', ['getTokensAmounts']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType', 'setBreadcrumbs']),
    async loadTokens () {
      this.tokens = await this.getTokensAmounts(this.account)
      this.loading = false
    },
    displayForm () {
      this.setShowRightSidebar(true)
      this.setRightSidebarType(`${this.$route.params.type}Form`)
    },
    async onRedeemToken () {
      await this.resetValidation(this.form)
      if (!(await this.validate(this.form))) return
      this.submitting = true
      const res = await this.redeemToken({ quantity: `${parseFloat(this.form.amount).toFixed(2)} HUSD`, memo: 'redeem' })
      if (res) {
        this.form.amount = 0
        await this.resetValidation(this.form)
        await this.loadTokens()
        this.clearRedemptions()
        await this.fetchRedemptions({ account: this.account })
        this.redeemForm = false
      }
      this.submitting = false
    },
    getColor (amount) {
      if (amount.includes('HYPHA')) {
        return '#434343'
      } else if (amount.includes('HVOICE')) {
        return '#e69138'
      } else if (amount.includes('SEEDS')) {
        return '#589A46'
      } else if (amount.includes('USD')) {
        return '#3d85c6'
      }
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
      q-table(
        v-if="displayMode === 'table'"
        card-class="wallet-table"
        :data="payments"
        :columns="columns"
        row-key="payment.id"
        virtual-scroll
        :pagination.sync="pagination"
        :rows-per-page-options="[0]"
      )
        template(v-slot:header="props")
          q-tr(:props="props")
            q-th(
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="table-header"
            )
              strong {{ col.label }}
        template(v-slot:body="props")
          q-tr(:props="props")
            q-td(key="icon" :props="props")
              img.table-icon(v-if="props.row.amount.includes('HYPHA')" src="~assets/icons/hypha.svg")
              img.table-icon(v-if="props.row.amount.includes('HVOICE')" src="~assets/icons/hvoice.svg")
              img.table-icon(v-if="props.row.amount.includes('USD')" src="~assets/icons/husd.svg")
              img.table-icon(v-if="props.row.amount.includes('SEEDS')" src="~assets/icons/seeds.png")
            q-td(key="activity" :props="props")
              | {{ props.row.memo }}
            q-td(key="time" :props="props")
              span(v-if="props.row.payment_date") {{ intl.format(parseInt((new Date(props.row.payment_date).getTime() - Date.now()) / (24 * 60 * 60 * 1000)), 'day') }}
            q-td(key="status" :props="props")
              | {{ props.row.status || 'claimed' }}
            q-td(key="amount" :props="props")
              q-chip(
                text-color="white"
                :style="{ background: getColor(props.row.amount) }"
              ) {{ new Intl.NumberFormat().format(parseInt(props.row.amount), { style: 'currency' }) }} {{ props.row.amount.split(' ')[1] }}
      .row.text-center(v-if="displayMode === 'card'")
        payment-card(
          v-for="payment in payments"
          :key="payment.id"
          :payment="payment"
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
            q-spinner-dots(
              v-if="loading"
              color="primary"
              size="30px"
            )
            .amount(v-else) {{ new Intl.NumberFormat().format(parseInt(tokens.deferredSeeds), { style: 'currency' }) }}
      transition(
        appear
        enter-active-class="animated slideInRight"
        leave-active-class="animated slideOutRight"
      )
        .token-info.row.flex.items-center(v-if="show1" style="transition-delay: 0.2s")
          img.icon(src="~assets/icons/seeds.png")
          div
            .name LIQUID SEEDS
            q-spinner-dots(
              v-if="loading"
              color="primary"
              size="30px"
            )
            .amount(v-else) {{ new Intl.NumberFormat().format(parseInt(tokens.liquidSeeds), { style: 'currency' }) }}
      transition(
        appear
        enter-active-class="animated slideInRight"
        leave-active-class="animated slideOutRight"
      )
        .token-info.row.flex.items-center(v-if="show2" style="transition-delay: 0.2s")
          img.icon(src="~assets/icons/hypha.svg")
          div
            .name HYPHA
            q-spinner-dots(
              v-if="loading"
              color="primary"
              size="30px"
            )
            .amount(v-else) {{ new Intl.NumberFormat().format(parseInt(tokens.hypha), { style: 'currency' }) }}
      transition(
        appear
        enter-active-class="animated slideInRight"
        leave-active-class="animated slideOutRight"
      )
        .token-info.row.flex.items-center(v-if="show3" style="transition-delay: 0.2s")
          img.icon(src="~assets/icons/hvoice.svg")
          div
            .name HVOICE
            q-spinner-dots(
              v-if="loading"
              color="primary"
              size="30px"
            )
            .amount(v-else) {{ new Intl.NumberFormat().format(parseInt(tokens.hvoice), { style: 'currency' }) }}
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
              q-spinner-dots(
                v-if="loading"
                color="primary"
                size="30px"
              )
              .amount(v-else) {{ new Intl.NumberFormat().format(parseInt(tokens.husd), { style: 'currency' }) }}
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
            span(v-if="!canRedeem" style="width: 200px")
              | Please set a redeem
              br
              | address in your profile.
            q-input(
              v-if="canRedeem"
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
              v-if="canRedeem"
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
      .toggle-display.flex.justify-center
        q-btn(
          icon="fas fa-th"
          color="white"
          unelevated
          flat
          @click="displayMode = 'card'"
        )
        .button-sep
        q-btn(
          icon="fas fa-list"
          color="white"
          unelevated
          flat
          @click="displayMode = 'table'"
        )
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
.table-icon
  width auto
  max-width 40px
  max-height 40px
.table-header
  font-size 16px
.button-sep
  border-right 1px solid white
.wallet-table
  background rgba(227,242,253,0.4)
  .q-table
    tbody
      td
        font-size 16px !important
</style>
