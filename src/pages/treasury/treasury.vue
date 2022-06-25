<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { validation } from '~/mixins/validation'

export default {
  name: 'treasury',
  mixins: [validation],

  meta: {
    title: 'Treasury'
  },
  components: {
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue'),
    InputField: () => import('~/components/common/input-field.vue')
  },
  data () {
    return {
      loading: true,
      filter: 'OPEN', // OPEN, ALL
      columns: [
        { name: 'id', label: 'ID#', field: 'id', align: 'left' },
        { name: 'requestor', label: 'ACCOUNT', field: 'requestor', align: 'left' },
        { name: 'amount_requested', label: 'AMOUNT', field: 'amount_requested', align: 'left' },
        { name: 'requested_date', label: 'DATE', field: 'requested_date', align: 'left' },
        { name: 'amountPaid', label: 'PAID', field: 'amountPaid', align: 'left' },
        { name: 'amountEndorsed', label: 'ENDORSED', field: 'amountEndorsed', align: 'left' },
        { name: 'attestations', label: 'TREASURERS', field: 'attestations', align: 'left' },
        { name: 'actions', label: 'ACTIONS', field: 'actions', align: 'right' }
      ],
      pagination: {
        rowsPerPage: 20,
        sortBy: 'id'
      },
      redemptions: [],
      redemptionsFiltered: [],
      profiles: [],
      treasurers: [],
      tokens: [],
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
    await this.getTokens()
    this.redemptions = await this.getTreasuryData()
    for await (const redemption of this.redemptions) {
      for await (const attestation of redemption.attestations) {
        if (!this.profiles[attestation.key]) {
          this.profiles[attestation.key] = await this.getPublicProfile(attestation.key)
        }
      }
    }
    this.filter = localStorage.getItem('treasury-filter') || 'OPEN'
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
      if (this.filter === 'ALL') {
        this.redemptionsFiltered = [...this.redemptions]
      } else if (this.filter === 'OPEN') {
        this.redemptionsFiltered = [...this.redemptions.filter(r => parseFloat(r.amount_paid) < parseFloat(r.amount_requested))]
      }
      if (this.search) {
        this.redemptionsFiltered = [...this.redemptionsFiltered.filter(r => r.requestor.includes(this.search))]
      }
    },
    async getTokens () {
      let lang
      if (navigator.languages !== undefined) { lang = navigator.languages[0] } else { lang = navigator.language }
      const tokens = await this.getSupply()
      delete tokens.SEEDS
      for (const key in tokens) {
        let amount = 0
        if (tokens[key] > 1000000) {
          amount = (new Intl.NumberFormat(lang, { notation: 'compact', compactDisplay: 'short' }).format(tokens[key]))
        } else {
          amount = (new Intl.NumberFormat(lang, { style: 'currency', currency: 'USD' }).format(tokens[key] || 0)).slice(4)
        }
        let icon
        switch (key.toLowerCase()) {
          case 'husd':
            icon = require('~/assets/icons/husd.svg')
            break
          case 'seeds':
            icon = require('~/assets/icons/seeds.png')
            break
          case 'hypha':
            icon = require('~/assets/icons/hypha.svg')
            break
          case 'hvoice':
            icon = require('~/assets/icons/hvoice.svg')
            break
          case 'dseeds':
            icon = require('~/assets/icons/dSeeds.png')
            break
          case 'voice':
            icon = require('~/assets/icons/voice.png')
            break
          default:
            icon = require('~/assets/icons/usd.png')
            break
        }

        this.tokens.push({
          name: key.toLowerCase(),
          amount,
          icon
        })
      }
    }
  },
  computed: {
    ...mapGetters('accounts', ['account']),
    ...mapGetters('dao', ['dho', 'selectedDao']),
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
    },
    dho: {
      async handler () {
        await this.getTokens()
      },
      deep: true
    },
    async selectedDao () {
      await this.getTokens()
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
        input-field.q-mb-sm(
          ref="amount"
          v-model="endorseForm.amount"
          label="Amount"
          outlined
          disable
          dense
        )
        input-field(
          ref="comment"
          v-model="endorseForm.comment"
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
        input-field(
          ref="amount"
          v-model="newTrxForm.amount"
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
        input-field(
          ref="trxId"
          v-model="newTrxForm.trxId"
          label="Trx ID"
          :rules="[rules.required]"
          lazy-rules
          outlined
          dense
        )
        input-field(
          ref="comment"
          v-model="newTrxForm.comment"
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
  input-field.search(
    v-model="search"
    placeholder="Filter"
    rounded
    outlined
    bg-color="white"
    dense
  )
  .row
    .redemptions-list
      .filters.flex.justify-end.items-center
        q-btn(
          label="OPEN"
          :color="filter === 'OPEN' ? 'primary' : 'white'"
          unelevated
          flat
          @click="filter = 'OPEN'"
          style="font-weight: 700"
        )
        .separator
        q-btn(
          label="ALL"
          :color="filter === 'ALL' ? 'primary' : 'white'"
          unelevated
          flat
          @click="filter = 'ALL'"
          style="font-weight: 700"
        )
      q-table(
        card-class="wallet-table"
        :data="redemptionsFiltered"
        :columns="columns"
        row-key="redemption.id"
        virtual-scroll
        :pagination.sync="pagination"
        :rows-per-page-options="[0]"
        :loading="loading"
      )
        template(v-slot:header="props")
          q-tr(:props="props")
            q-th.table-header
              strong ID
              br
              .subheader #
            q-th.table-header
              strong ACCOUNT
              br
              .subheader REQUESTOR
            q-th.table-header
              strong AMOUNT
              br
              .subheader REQUESTED
            q-th.table-header
              strong DATE
              br
              .subheader REQUESTED
            q-th.table-header
              strong PAYMENTS
              br
              .subheader PENDING SIG
            q-th.table-header
              strong PAYMENTS
              br
              .subheader ENDORSED
            q-th.table-header
              strong TREASURERS
              br
              .subheader SIGNED
            q-th.table-header
              strong ACTIONS
        template(v-slot:body="props")
          q-tr(:props="props")
            q-td(key="id" :props="props")
              | {{ props.row.redemption_id }}
            q-td(key="requestor" :props="props")
              | {{ props.row.requestor }}
            q-td(key="amount_requested" :props="props")
              .flex.items-center
                img.table-icon(v-if="props.row.amount_requested.includes('HYPHA')" src="~assets/icons/hypha.svg")
                img.table-icon(v-if="props.row.amount_requested.includes('HVOICE')" src="~assets/icons/hvoice.svg")
                img.table-icon(v-if="props.row.amount_requested.includes('USD')" src="~assets/icons/husd.svg")
                img.table-icon(v-if="props.row.amount_requested.includes('SEEDS')" src="~assets/icons/seeds.png")
                | &nbsp;{{ new Intl.NumberFormat().format(parseInt(props.row.amount_requested), { style: 'currency' }) }}
            q-td(key="requested_date" :props="props")
             | {{ new Date(props.row.requested_date.slice(0, -4) + 'Z').toLocaleDateString()}}
            q-td(key="amountPaid" :props="props")
              .flex.items-center
                img.table-icon(v-if="props.row.amountPaidCurrency.includes('HYPHA') || props.row.amount_requested.includes('HYPHA')" src="~assets/icons/hypha.svg")
                img.table-icon(v-if="props.row.amountPaidCurrency.includes('HVOICE') || props.row.amount_requested.includes('HVOICE')" src="~assets/icons/hvoice.svg")
                img.table-icon(v-if="props.row.amountPaidCurrency.includes('USD') || props.row.amount_requested.includes('USD')" src="~assets/icons/husd.svg")
                img.table-icon(v-if="props.row.amountPaidCurrency.includes('SEEDS') || props.row.amount_requested.includes('SEEDS')" src="~assets/icons/seeds.png")
                | &nbsp;{{ new Intl.NumberFormat().format(parseInt(props.row.amountPaid), { style: 'currency' }) }}
            q-td(key="amountEndorsed" :props="props")
              span(v-if="props.row.amountPaid === 0") open
              span(v-if="props.row.amountPaid > 0 && props.row.amountPaid < parseFloat(props.row.amount_requested)") pending
              div(v-if="props.row.amountPaid === parseFloat(props.row.amount_requested)")
                .flex.items-center
                  img.table-icon(v-if="props.row.amountPaidCurrency.includes('HYPHA') || props.row.amount_requested.includes('HYPHA')" src="~assets/icons/hypha.svg")
                  img.table-icon(v-if="props.row.amountPaidCurrency.includes('HVOICE') || props.row.amount_requested.includes('HVOICE')" src="~assets/icons/hvoice.svg")
                  img.table-icon(v-if="props.row.amountPaidCurrency.includes('USD') || props.row.amount_requested.includes('USD')" src="~assets/icons/husd.svg")
                  img.table-icon(v-if="props.row.amountPaidCurrency.includes('SEEDS') || props.row.amount_requested.includes('SEEDS')" src="~assets/icons/seeds.png")
                  | &nbsp;{{ new Intl.NumberFormat().format(parseInt(props.row.amountPaid), { style: 'currency' }) }}
            q-td(key="attestations" :props="props")
              q-img.treasurer.q-mr-xs(
                v-for="attestation in props.row.attestations"
                v-if="profiles[attestation.key] && profiles[attestation.key].publicData && profiles[attestation.key].publicData.avatar"
                :key="`${props.row.redemption_id}_${attestation.key}`"
                :src="profiles[attestation.key].publicData.avatar"
                size="25px"
              )
                q-tooltip Signed by {{ attestation.key }} on {{ new Date(attestation.value.slice(0, -4) + 'Z').toLocaleDateString() }}
              q-icon.icon-placeholder.q-mr-xs(
                v-for="(k, i) in treasurersCount - props.row.attestations.length"
                :key="`treasurer${i}_rd_${props.row.redemption_id}`"
                name="fas fa-user-circle"
                size="sm"
                color="white"
              )
            q-td(key="actions" :props="props")
              q-btn.q-mb-xs(
                v-if="isTreasurer && props.row.amountPaid < parseFloat(props.row.amount_requested)"
                icon="fas fa-plus-circle"
                color="green"
                unelevated
                round
                @click="onShowNewTrx(props.row)"
              )
              q-btn.q-mb-xs(
                v-if="isTreasurer && props.row.payments.length && !hasEndorsed(props.row.payments[0])"
                icon="fas fa-check-square"
                color="yellow-10"
                unelevated
                round
                @click="onShowEndorse(props.row.payments[0])"
              )
              div(v-if="props.row.payments.length === 1")
                q-btn(
                  :disabled="!props.row.payments[0].notes.some(n => n.key === 'network')"
                  icon="fas fa-eye"
                  color="blue"
                  unelevated
                  round
                  @click="openTrx(props.row.payments[0].notes)"
                )
              div(v-if="props.row.payments.length > 1")
                q-btn-dropdown(
                  icon="fas fa-eye"
                  color="blue"
                  unelevated
                  rounded
                )
                  q-list
                    q-item(
                      v-for="(payment, i) in props.row.payments"
                      :key="`trx${i}_rd_${props.row.redemption_id}`"
                      clickable
                      :disable="!payment.notes.some(n => n.key === 'network')"
                      v-close-popup
                      @click="openTrx(payment.notes)"
                    )
                      q-item-section
                        q-item-label TRX {{ i + 1}}
    .tokens-wallet
      .token-info.row.flex.items-center(v-for="token in tokens ")
        img.icon(:src="token.icon")
        div
          .name {{ token.name  }}
          loading-spinner(
            v-if="loading"
            color="primary"
            size="30px"
          )
          .amount(v-else) {{ token.amount }}
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
