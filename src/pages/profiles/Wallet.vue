<script>
import { mapActions, mapGetters } from 'vuex'
import { documents } from '~/mixins/documents'
import { truncate } from '~/mixins/truncate'
import { validation } from '~/mixins/validation'
import { format } from '~/mixins/format'
import { dateToString } from '~/utils/TimeUtils'

export default {
  name: 'page-wallet',
  mixins: [documents, truncate, validation, format],
  components: {
    Wallet: () => import('~/components/profiles/wallet.vue'),
    WalletAdresses: () => import('~/components/profiles/wallet-adresses.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  apollo: {
    payments: {
      query: () => require('~/query/payments/payment-list.gql'),
      update: data => data.queryPayment,
      variables () {
        return {
          filter: { details_recipient_n: { eq: this.username }, details_dao_i: { eq: this.selectedDao.docId } },
          first: this.pagination.rowsPerPage,
          offset: this.pagination.rowsPerPage * this.pagination.page,
          order: { desc: 'createdDate' }
        }
      },
      skip () {
        return !this.username && !this.selectedDao.docId
      }
    },
    paymentsCount: {
      query: () => require('~/query/payments/payment-count.gql'),
      update: data => data.aggregatePayment.count,
      skip () {
        return !this.username
      },
      variables () {
        return {
          user: this.username
        }
      }
    }
  },

  props: {
    username: String
  },

  data () {
    return {
      pagination: {
        rowsNumber: 0,
        rowsPerPage: 10,
        descending: false,
        page: 1,
        sortBy: 'createdDate'
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
    ...mapGetters('dao', ['daoSettings', 'selectedDao']),

    isOwner () { return this.username === this.account },

    loading () { return this.$apollo.queries.payments.loading },

    columns () {
      return this.$q.screen.gt.sm
        ? [
            { name: 'activity', label: this.$t('pages.profiles.wallet.activity'), field: 'memo', sortable: true, align: 'left' },
            { name: 'date', label: this.$t('pages.profiles.wallet.date'), field: 'createdDate', sortable: true, align: 'left' },
            { name: 'status', label: this.$t('pages.profiles.wallet.status'), field: 'amount', sortable: true, align: 'left' },
            { name: 'amount', label: this.$t('pages.profiles.wallet.amount'), field: 'amount', sortable: true, align: 'left' }
          ]
        : [
            { name: 'amount', label: this.$t('pages.profiles.wallet.amount'), field: 'amount', sortable: true, align: 'left' },
            { name: 'status', label: this.$t('pages.profiles.wallet.status'), field: 'amount', sortable: true, align: 'left' }
          ]
    }
  },

  watch: {
    $route: 'fetchProfile',
    isOwner: 'fetchProfile',

    account: {
      immediate: true,
      async handler (account) {
        if (!account) return
        this.init()
      }
    },

    paymentsCount: {
      immediate: true,
      async handler (value) {
        if (!value) return
        this.pagination.rowsNumber = value
      }
    }

  },

  methods: {
    ...mapActions('profiles', ['getProfile', 'getPublicProfile', 'getWalletAdresses', 'saveAddresses']),

    formatDate (date) { return dateToString(date) },
    formatCurrency (value) { return this.getFormatedTokenAmount(value.split(' ')[0]) },

    isToken (value, name) { return value && value.includes(name) },

    async init () {
      this.fetchProfile()
    },

    async fetchProfile () {
      if (this.username) {
        if (this.isOwner) {
          await this.loadProfile()
        } else {
          await this.loadPublicProfile()
        }
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

    async saveWalletAddresses (data, success, fail) {
      try {
        await this.saveAddresses({ newData: data, oldData: this.walletAddressForm })
        this.walletAddressForm = data
        await this.getProfile(this.account)
      } catch (error) {
      }
    },

    async loadMorePayments ({ pagination }) {
      this.pagination.page = pagination.page
      this.pagination.descending = pagination.descending
      this.pagination.rowsPerPage = pagination.rowsPerPage
      this.pagination.sortBy = pagination.sortBy
    }

  },

  async mounted () {
    await this.init()
  }

}
</script>

<template lang="pug">
q-page.page-wallet
  wallet.q-mb-md(:username="account" no-title v-if="!$q.screen.gt.sm")
  .row
    .col-9(:class="{'col-12': !$q.screen.gt.sm, 'q-pr-md': $q.screen.gt.sm}")
      widget.q-px-xl(no-padding="no-padding")
        q-table.wallet-table(:columns="columns" :data="payments" :loading="loading" :pagination.sync="pagination" :rows-per-page-options="[0]" @request="loadMorePayments" row-key="payment.hash")
          template(v-slot:body="props")
            q-tr.q-tr--no-hover(:props="props")
              q-td(key="activity" :props="props" v-if="$q.screen.gt.sm")
                p.q-py-md.q-ma-none(:style="'overflow:hidden; white-space:nowrap; text-overflow: ellipsis;'") {{ props.row.memo }}
              q-td(key="date" :props="props" v-if="$q.screen.gt.sm")
                p.q-py-md.q-ma-none.text-italic {{ formatDate(props.row.createdDate) }}
              q-td(key="status" :props="props" v-if="$q.screen.gt.sm")
                q-chip.q-ma-none.text-uppercase(color="positive" text-color="white" size="10px") {{ $t('pages.profiles.wallet.claimed') }}
              q-td(key="amount" :props="props")
                .row.q-py-md.items-center
                  q-img.table-icon(size="10px" v-if="isToken(props.row.amount, 'HYPHA')" src="~assets/icons/hypha.svg")
                  q-img.table-icon(size="10px" v-if="isToken(props.row.amount, 'HVOICE')" src="~assets/icons/hvoice.png")
                  q-img.table-icon(size="10px" v-if="isToken(props.row.amount, 'USD')" src="~assets/icons/husd.png")
                  q-img.table-icon(size="10px" v-if="isToken(props.row.amount, 'SEEDS')" src="~assets/icons/seeds.png")
                  p.q-px-xs.q-ma-none {{ formatCurrency(props.row.amount)}}
              q-td(key="status" :props="props" v-if="!$q.screen.gt.sm")
                q-chip.q-ma-none.text-uppercase(color="positive" text-color="white" size="10px") {{ $t('pages.profiles.wallet.claimed') }}
    .col-12.col-md-3
      wallet(:username="account" no-title v-if="$q.screen.gt.sm")
      wallet-adresses.q-mt-md(:isHypha="daoSettings.isHypha" :walletAdresses="walletAddressForm" @onSave="saveWalletAddresses" v-if="isOwner")
</template>

<style lang="stylus" scoped>

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

.table-icon
  max-width: 20px
  max-height: 20px;
  object-fit: contain

</style>
