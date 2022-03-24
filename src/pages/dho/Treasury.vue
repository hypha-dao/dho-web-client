<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { validation } from '~/mixins/validation'

export default {
  name: 'treasury-new',
  components: {
    FilterWidget: () => import('~/components/filters/filter-widget.vue'),
    TreasuryList: () => import('~/components/treasury/treasury-list.vue'),
    CurrentBalance: () => import('~/components/profiles/current-balance.vue')
  },
  mixins: [validation],

  meta: {
    title: 'Treasury'
  },

  data () {
    return {
      loading: true,
      filter: false, // OPEN, ALL
      columns: [
        { name: 'id', label: 'ID', field: 'id', align: 'left' },
        { name: 'requestor', label: 'Account', field: 'requestor', align: 'left' },
        { name: 'amount_requested', label: 'Amount', field: 'amount_requested', align: 'left' },
        { name: 'requested_date', label: 'Date', field: 'requested_date', align: 'left' },
        { name: 'amountPending', label: 'Payment', subtitle: 'Pending', field: 'amountPending', align: 'left' },
        { name: 'amountEndorsed', label: 'Payment', subtitle: 'Endorse', field: 'amountEndorsed', align: 'left' },
        { name: 'treasurers', label: 'Treasurers', field: 'attestations', align: 'left' },
        { name: 'actions', label: 'Actions', field: 'actions', align: 'left' }
      ],
      pagination: {
        rowsPerPage: 20,
        sortBy: 'id'
      },
      redemptions: [],
      redemptionsFiltered: [],
      profiles: [],
      treasurers: [],
      tokens: {
        husd: 0,
        hypha: 0,
        seeds: 0
      },
      networkOptions: [
        { value: 'BTC', label: 'BTC' },
        { value: 'ETH', label: 'ETH' },
        { value: 'EOS', label: 'EOS' }
      ],
      paymentRequestor: null,
      newTrxForm: {
        id: null,
        amount: null,
        network: null,
        trxId: null,
        comment: ''
      },
      submittingNewTrx: false,
      showNewTrx: false,
      endorseForm: {
        redemptionId: null,
        paymentId: null,
        amount: null,
        comment: ''
      },
      submittingEndorse: false,
      showEndorse: false,
      search: ''
    }
  },
  async beforeMount () {
    this.setBreadcrumbs([{ title: 'Treasury' }])
    let lang
    if (navigator.languages !== undefined) { lang = navigator.languages[0] } else { lang = navigator.language }
    this.tokens = await this.getSupply()
    this.loading = false
    if (this.tokens.husd > 1000000) {
      this.tokens.husd = (new Intl.NumberFormat(lang, { notation: 'compact', compactDisplay: 'short' }).format(this.tokens.husd)).slice(1)
    } else {
      this.tokens.husd = (new Intl.NumberFormat(lang, { style: 'currency', currency: 'USD' }).format(this.tokens.husd)).slice(1)
    }
    if (this.tokens.hypha > 1000000) {
      this.tokens.hypha = (new Intl.NumberFormat(lang, { notation: 'compact', compactDisplay: 'short' }).format(this.tokens.hypha))
    } else {
      this.tokens.hypha = (new Intl.NumberFormat(lang, { style: 'currency', currency: 'USD' }).format(this.tokens.hypha)).slice(1)
    }
    if (this.tokens.seeds > 1000000) {
      this.tokens.seeds = (new Intl.NumberFormat(lang, { notation: 'compact', compactDisplay: 'short' }).format(this.tokens.seeds))
    } else {
      this.tokens.seeds = (new Intl.NumberFormat(lang, { style: 'currency', currency: 'USD' }).format(this.tokens.seeds)).slice(1)
    }
    this.redemptions = await this.getTreasuryData()
    for await (const redemption of this.redemptions) {
      for await (const attestation of redemption.attestations) {
        if (!this.profiles[attestation.key]) {
          this.profiles[attestation.key] = await this.getPublicProfile(attestation.key)
        }
      }
    }
    this.filter = Boolean(localStorage.getItem('treasury-filter')) || false
    this.filterRedemptions()
    this.treasurers = await this.getTreasurers()
    this.loading = false
  },
  methods: {
    ...mapMutations('layout', ['setBreadcrumbs']),
    ...mapActions('profiles', ['getPublicProfile']),
    ...mapActions('treasury', ['getSupply', 'getTreasuryData', 'getTreasurers', 'sendNewPayment', 'endorsePayment']),
    openTrx (notes) {
      const network = notes.find(n => n.key === 'network')
      const trx = notes.find(n => n.key === 'trx_id' || n.key === 'trxid')
      if (!network || !trx) return
      window.open(process.env[`BLOCKCHAIN_EXPLORER_${network.value}`] + trx.value, '_blank')
    },
    async onShowNewTrx (redemption) {
      this.resetNewTrxForm()
      const user = await this.getPublicProfile(redemption.requestor)
      if (user && user.publicData && user.publicData.defaultAddress) {
        this.newTrxForm.network = user.publicData.defaultAddress.replace('address', '').toUpperCase()
      }
      this.paymentRequestor = redemption.requestor
      this.newTrxForm.amount = redemption.amount_requested
      this.newTrxForm.id = redemption.redemption_id
      this.showNewTrx = true
    },
    onCancelNewTrx () {
      this.resetNewTrxForm()
      this.showNewTrx = false
    },
    resetNewTrxForm () {
      this.newTrxForm.id = null
      this.newTrxForm.amount = null
      this.newTrxForm.network = null
      this.newTrxForm.trxId = null
      this.newTrxForm.comment = ''
      this.paymentRequestor = null
    },
    async onNewTrx () {
      await this.resetValidation(this.newTrxForm)
      if (!(await this.validate(this.newTrxForm))) return
      this.submittingNewTrx = true
      await this.sendNewPayment(this.newTrxForm)
      this.submittingNewTrx = false
      this.showNewTrx = false
      this.resetNewTrxForm()
    },
    hasEndorsed (payment) {
      if (!payment) return true
      return payment.attestations.some(a => a.key === this.account)
    },
    onShowEndorse (payment) {
      this.showEndorse = true
      this.endorseForm.redemptionId = payment.redemption_id
      this.endorseForm.paymentId = payment.payment_id
      this.endorseForm.amount = payment.amount_paid
    },
    onCancelEndorse () {
      this.resetEndorseForm()
      this.showEndorse = false
    },
    async onEndorse () {
      await this.resetValidation(this.endorseForm)
      if (!(await this.validate(this.endorseForm))) return
      this.submittingEndorse = true
      await this.endorsePayment(this.endorseForm)
      this.submittingEndorse = false
      this.showEndorse = false
      this.resetEndorseForm()
    },
    resetEndorseForm () {
      this.endorseForm.redemptionId = null
      this.endorseForm.paymentId = null
      this.endorseForm.amount = null
      this.endorseForm.comment = ''
    },
    filterRedemptions () {
      if (this.filter === true) {
        this.redemptionsFiltered = [...this.redemptions]
      } else if (this.filter === false) {
        this.redemptionsFiltered = [...this.redemptions.filter(r => parseFloat(r.amount_paid) < parseFloat(r.amount_requested))]
      }
      if (this.search) {
        this.redemptionsFiltered = [...this.redemptionsFiltered.filter(r => r.requestor.includes(this.search))]
      }
    }
  },
  computed: {
    ...mapGetters('accounts', ['account']),
    treasurersCount () {
      return this.treasurers.length || 5
    },
    isTreasurer () {
      if (!this.account) return false
      return this.treasurers.some(t => t.treasurer === this.account)
    }
  },
  watch: {
    filter (val) {
      localStorage.setItem('treasury-filter', val)
      this.filterRedemptions()
    },
    search () {
      this.filterRedemptions()
    }
  }
}
</script>

<template lang="pug">
q-page.q-pa-lg
  q-dialog(
    v-model="showEndorse"
  )
    q-card(style="width:450px")
      q-card-section.text-center
        .text-h6 Endorse payment {{ `#${endorseForm.paymentId}` }}
      q-card-section
        q-input.q-mb-sm(
          ref="amount"
          v-model="endorseForm.amount"
          color="accent"
          label="Amount"
          outlined
          disable
          dense
        )
        q-input(
          ref="comment"
          v-model="endorseForm.comment"
          color="accent"
          label="Comment"
          outlined
          dense
        )
      q-card-actions(align="right")
        q-btn(
          label="Cancel"
          flat
          @click="onCancelEndorse"
        )
        q-btn(
          label="Endorse"
          color="primary"
          unelevated
          @click="onEndorse"
          :loading="submittingEndorse"
        )
  q-dialog(
    v-model="showNewTrx"
  )
    q-card(style="width:450px")
      q-card-section.text-center
        .text-h6 New payment for #[strong {{ paymentRequestor }}]
      q-card-section
        q-input(
          ref="amount"
          v-model="newTrxForm.amount"
          color="accent"
          label="Amount"
          :rules="[rules.required]"
          lazy-rules
          outlined
          dense
        )
        q-select(
          ref="network"
          v-model="newTrxForm.network"
          :options="networkOptions"
          label="Network"
          map-options
          emit-value
          :rules="[rules.required]"
          lazy-rules
        )
        q-input(
          ref="trxId"
          v-model="newTrxForm.trxId"
          color="accent"
          label="Trx ID"
          :rules="[rules.required]"
          lazy-rules
          outlined
          dense
        )
        q-input(
          ref="comment"
          v-model="newTrxForm.comment"
          color="accent"
          label="Comment"
          outlined
          dense
        )
      q-card-actions(align="right")
        q-btn(
          label="Cancel"
          flat
          @click="onCancelNewTrx"
        )
        q-btn(
          label="Save"
          color="primary"
          unelevated
          @click="onNewTrx"
          :loading="submittingNewTrx"
        )
  .full-width
    .row.q-mt-sm
      .col-9
        treasury-list(:columns="columns" :treasury="redemptionsFiltered" :size="redemptionsFiltered.length" :loading="loading")
      .col-3
        filter-widget(
        :sort.sync="sort",
        :optionArray.sync="optionArray",
        :textFilter.sync="search",
        :showCircle="true",
        :circle.sync="circle",
        :circleArray.sync="circleArray"
        :showViewSelector="false"
        :showToggle="true"
        :toggle.sync="filter",
        toggleLabel="Show completed transactions"
        ).q-mb-md
        current-balance(:tokens="tokens" :loading="loading")
</template>

<style lang="stylus" scoped>
.redemptions-list
  width calc(100% - 200px)
.tokens-wallet
  width 250px
  position fixed
  right -40px
  margin-top: 35px;
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
  max-width 25px
  max-height 25px
.table-header
  font-size 16px
  text-align left
.subheader
  font-size 12px
.button-sep
  border-right 1px solid white
.wallet-table
  background rgba(227,242,253,0.4)
  .q-table
    tbody
      td
        font-size 16px !important
.treasurer
  width 25px
.separator
  z-index 10
  border-right 2px solid white
  height 25px
</style>
