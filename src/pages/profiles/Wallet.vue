<script>
import { mapActions, mapGetters } from 'vuex'
import { documents } from '~/mixins/documents'
import { truncate } from '~/mixins/truncate'
import { validation } from '~/mixins/validation'

export default {
  name: 'page-wallet',
  mixins: [documents, truncate, validation],
  components: {
    Wallet: () => import('~/components/profiles/wallet.vue'),
    WalletAdresses: () => import('~/components/profiles/wallet-adresses.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    username: String
  },

  data () {
    return {
      payments: [],
      loading: true,

      columns: [
        { name: 'activity', label: 'activity', field: 'memo', sortable: true, align: 'left' },
        { name: 'date', label: 'date', field: 'date_created', sortable: true, align: 'left' },
        { name: 'status', label: 'status', field: 'amount', sortable: true, align: 'left' },
        { name: 'amount', label: 'amount', field: 'amount', sortable: true, align: 'left' }
      ],
      pagination: {
        rowsNumber: 0,
        rowsPerPage: 10,
        descending: false,
        page: 1,
        sortBy: 'created_date'
      },
      walletAddressForm: {
        btcAddress: null,
        ethAddress: null,
        eosAccount: null,
        eosMemo: null,
        defaultAddress: null
      }
    }
  },

  computed: {
    ...mapGetters('accounts', ['account', 'isAuthenticated', 'isMember']),
    ...mapGetters('dao', ['daoSettings']),

    isOwner () { return this.username === this.account }
  },

  watch: {
    $route: 'fetchProfile',
    isOwner: 'fetchProfile',

    account: {
      immediate: true,
      async handler (account) {
        if (!account) return
        console.log('GOT ACCOUNT')
        this.init()
      }
    }

  },

  async mounted () {
    await this.init()
  },

  methods: {
    ...mapActions('payments', ['countPayments', 'loadPayments']),
    ...mapActions('profiles', ['getProfile', 'getPublicProfile', 'getWalletAdresses', 'saveAddresses']),

    formatDate (date) { return new Date(date).toLocaleDateString('en-GB').replace(/\//g, '-') },

    async init () {
      const [total] = await Promise.all([
        this.countPayments(),
        this.fetchPayments({ pagination: this.pagination }),
        this.fetchProfile()
      ])

      this.pagination.rowsNumber = total
    },

    async fetchPayments ({ pagination }) {
      this.loading = true

      this.pagination.page = pagination.page
      this.pagination.descending = pagination.descending
      this.pagination.rowsPerPage = pagination.rowsPerPage
      this.pagination.sortBy = pagination.sortBy

      this.payments = await this.loadPayments(pagination)

      this.loading = false
    },

    async fetchProfile () {
      if (this.username) {
        this.loading = true
        if (this.isOwner) {
          await this.loadProfile()
        } else {
          await this.loadPublicProfile()
        }
        this.loading = false
      }
    },

    async loadPublicProfile () {
      await this.getPublicProfile(this.username)
    },

    async loadProfile () {
      const [, walletAdresses] = await Promise.all([
        this.getProfile(this.account),
        this.getWalletAdresses(this.account)
      ])

      this.walletAddressForm = walletAdresses
    },

    async onSaveWalletAddresses (data, success, fail) {
      try {
        await this.saveAddresses({ newData: data, oldData: this.walletAddressForm })
        this.walletAddressForm = data
        await this.getProfile(this.account)
      } catch (error) {
        console.error(error) // eslint-disable-line no-console
      }
    }
  }
}
</script>

<template lang="pug">
q-page.page-wallet
  .row
    .col-9.q-pr-md
      widget(no-padding).q-px-xl
        q-table.wallet-table(
          :columns="columns"
          :data="payments"
          :loading="loading"
          :pagination.sync="pagination"
          :rows-per-page-options="[0]"
          @request="fetchPayments"
          row-key="payment.hash"
        )
          template(v-slot:body="props")
            q-tr(:props="props").q-tr--no-hover
              q-td(key="activity" :props="props")
                p.q-py-md.q-ma-none {{ truncate (getValue(props.row, 'details', 'memo'), 40) }}
              q-td(key="date" :props="props")
                p.q-py-md.q-ma-none.text-italic {{ formatDate(props.row.created_date) }}
              q-td(key="status" :props="props")
                q-chip.q-ma-none.text-uppercase(color='positive' text-color="white" size='10px') {{ 'claimed' }}
              q-td(key="amount" :props="props")
                .row.q-py-md.items-center
                  q-img.table-icon(size="10px" v-if="getValue(props.row, 'details', 'amount') && getValue(props.row, 'details', 'amount').includes('HYPHA')" src="~assets/icons/hypha.svg")
                  q-img.table-icon(size="10px" v-if="getValue(props.row, 'details', 'amount') && getValue(props.row, 'details', 'amount').includes('HVOICE')" src="~assets/icons/hvoice.png")
                  q-img.table-icon(size="10px" v-if="getValue(props.row, 'details', 'amount') && getValue(props.row, 'details', 'amount').includes('USD')" src="~assets/icons/husd.png")
                  q-img.table-icon(size="10px" v-if="getValue(props.row, 'details', 'amount') && getValue(props.row, 'details', 'amount').includes('SEEDS')" src="~assets/icons/seeds.png")
                  p.q-px-xs.q-ma-none {{ new Intl.NumberFormat().format(parseInt(getValue(props.row, 'details', 'amount')), { style: 'currency' }) }}

    .col-12.col-md-3(:style="{ 'min-width': '292px' }")
      wallet(:username="account" no-title)
      wallet-adresses.q-mt-md(
        :isHypha="daoSettings.isHypha"
        :walletAdresses="walletAddressForm"
        @onSave="onSaveWalletAddresses"
        v-if="isOwner"
      )

</template>

<style lang="stylus" scoped>
.table-icon
  max-width: 20px
  max-height: 20px;
  object-fit: contain

/deep/table
  border-collapse: separate;
  border-spacing: 0 10px;

/deep/th
  font-size: 13px;
  font-weight: bold;
  text-transform: capitalize;
  letter-spacing: 0px;
  color: #3E3B46;
  border: none;
  &:first-child, &:last-child
    padding-left: 30px;

.wallet-table
  box-shadow: none;
  border: none;
  tr
    padding: 30px;
  thead

  tbody
    td
      border: none;
      background: $internal-bg;
    td:first-child
      border-radius: 20px 0 0 20px;
      padding-left: 30px;
    td:last-child
      border-radius: 0 20px 20px 0;
      padding-left: 30px;

</style>
