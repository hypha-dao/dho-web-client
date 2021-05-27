<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { validation } from '~/mixins/validation'
import { documents } from '~/mixins/documents'
import PaymentCard from '../payments/components/payment-card'

export default {
  name: 'page-payments',
  mixins: [documents, validation],
  components: {
    PaymentCard,
    Wallet: () => import('~/components/profiles/wallet.vue')
  },

  data () {
    return {
      displayMode: 'table',
      columns: [
        { name: 'icon', label: '', field: 'amount' },
        { name: 'activity', label: 'ACTIVITY', field: 'memo', sortable: true, align: 'left' },
        { name: 'time', label: 'TIME', field: 'date_created', sortable: true, align: 'left' },
        { name: 'status', label: 'STATUS', field: 'amount', sortable: true, align: 'left' },
        { name: 'amount', label: 'AMOUNT', field: 'amount', sortable: true }
      ],
      payments: [],
      pagination: {
        rowsNumber: 0,
        rowsPerPage: 10,
        descending: false,
        page: 1,
        sortBy: 'created_date'
      },
      loading: true
    }
  },

  computed: {
    ...mapGetters('accounts', ['isAuthenticated', 'isMember', 'account']),
    intl () {
      let lang
      if (navigator.languages !== undefined) { lang = navigator.languages[0] } else { lang = navigator.language }
      return new Intl.RelativeTimeFormat(lang.slice(0, 2), { style: 'narrow' })
    }
  },

  async beforeMount () {
    // TODO: This should probably be done by using vue-router hooks instead
    if (!this.account) {
      this.$router.push({ path: `/login?returnUrl=${this.$route.path}` })
    }
    this.setBreadcrumbs([])
  },

  async mounted () {
    // TODO: The countPayments and fetchRedemptions do very similar queries, might be combinable
    this.pagination.rowsNumber = await this.countPayments()
    await this.fetchRedemptions({ account: this.account })
    await this.onRequest({
      pagination: this.pagination
    })
  },

  methods: {
    ...mapActions('payments', ['loadPayments', 'countPayments', 'redeemToken', 'hasRedeemAddress', 'fetchRedemptions', 'buySeeds']),
    ...mapMutations('payments', ['clearRedemptions']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType', 'setBreadcrumbs']),

    async onRequest (props) {
      this.loading = true
      const { pagination } = props
      this.payments = await this.loadPayments(pagination)
      this.pagination.page = pagination.page
      this.pagination.rowsPerPage = pagination.rowsPerPage
      this.pagination.sortBy = pagination.sortBy

      this.pagination.descending = pagination.descending
      this.loading = false
    },

    getDays (date) {
      return parseInt((new Date(date).getTime() - Date.now() + new Date().getTimezoneOffset() * 60000) / (24 * 60 * 60 * 1000))
    },

    getColor (amount) {
      if (!amount) {
        return '#3d85c6'
      } else if (amount.includes('HYPHA')) {
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
q-page.q-pa-lg
  .row.q-col-gutter-md
    .col-12.col-md-3(:style="{ 'min-width': '292px' }")
      wallet(:username="account")
    .col-12.col-md
      q-table(
        v-if="displayMode === 'table'"
        card-class="wallet-table"
        :data="payments"
        :columns="columns"
        row-key="payment.hash"
        :pagination.sync="pagination"
        @request="onRequest"
        :loading="loading"
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
              img.table-icon(v-if="getValue(props.row, 'details', 'amount') && getValue(props.row, 'details', 'amount').includes('HYPHA')" src="~assets/icons/hypha.svg")
              img.table-icon(v-if="getValue(props.row, 'details', 'amount') && getValue(props.row, 'details', 'amount').includes('HVOICE')" src="~assets/icons/hvoice.svg")
              img.table-icon(v-if="getValue(props.row, 'details', 'amount') && getValue(props.row, 'details', 'amount').includes('USD')" src="~assets/icons/husd.svg")
              img.table-icon(v-if="getValue(props.row, 'details', 'amount') && getValue(props.row, 'details', 'amount').includes('SEEDS')" src="~assets/icons/seeds.png")
            q-td(key="activity" :props="props")
              div(:style="{ 'max-width': '520px', 'white-space': 'normal', 'overflow-wrap': 'break-word' }") {{ getValue(props.row, 'details', 'memo') }}
            q-td(key="time" :props="props")
              div(v-if="getValue(props.row, 'details', 'payment_date')")
                span(v-if="getValue(props.row, 'details', 'payment_date') && getDays(getValue(props.row, 'details', 'payment_date')) === 0 ") Today
                span(v-if="getValue(props.row, 'details', 'payment_date') && getDays(getValue(props.row, 'details', 'payment_date')) !== 0 && getDays(getValue(props.row, 'details', 'payment_date')) > -3") {{ intl.format(getDays(getValue(props.row, 'details', 'payment_date')), 'day').slice(1) }}
                span(v-if="getValue(props.row, 'details', 'payment_date') && getDays(getValue(props.row, 'details', 'payment_date')) <= -3") {{ new Date(getValue(props.row, 'details', 'payment_date')).toLocaleDateString() }}
              div(v-else)
                span(v-if="props.row.created_date && getDays(props.row.created_date) === 0 ") Today
                span(v-if="props.row.created_date && getDays(props.row.created_date) !== 0 && getDays(props.row.created_date) > -3") {{ intl.format(getDays(props.row.created_date), 'day').slice(1) }}
                span(v-if="props.row.created_date && getDays(props.row.created_date) <= -3") {{ new Date(props.row.created_date).toLocaleDateString() }}
            q-td(key="status" :props="props")
              | {{ 'claimed' }}
            q-td(key="amount" :props="props")
              q-chip(
                v-if="getValue(props.row, 'details', 'amount')"
                text-color="white"
                :style="{ background: getColor(getValue(props.row, 'details', 'amount')) }"
              ) {{ new Intl.NumberFormat().format(parseInt(getValue(props.row, 'details', 'amount')), { style: 'currency' }) }} {{ getValue(props.row, 'details', 'amount').split(' ')[1] }}
      .row.text-center(v-if="displayMode === 'card'")
        payment-card(
          v-for="payment in payments"
          :key="payment.id"
          :payment="payment"
        )
</template>

<style lang="stylus" scoped>
.table-icon
  width 40px
  height 40px
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
