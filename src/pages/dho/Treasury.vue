<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { validation } from '~/mixins/validation'
import { dateToString } from '~/utils/TimeUtils'

export default {
  name: 'treasury',
  mixins: [validation],

  components: {
    FilterWidget: () => import('~/components/filters/filter-widget.vue'),
    FilterWidgetMobile: () => import('~/components/filters/filter-widget-mobile.vue'),
    FilterOpenButton: () => import('~/components/filters/filter-open-button.vue'),
    Widget: () => import('~/components/common/widget.vue'),
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue')
  },
  data () {
    return {
      page: 1,
      mobileFilterOpen: false,
      loading: true,
      filter: false, // OPEN, ALL
      columns: [
        { name: 'id', label: '#', field: 'id', align: 'left' },
        { name: 'requestor', label: 'account', field: 'requestor', align: 'left' },
        { name: 'amount_requested', label: 'amount', field: 'amount_requested', align: 'left' },
        { name: 'requested_date', label: 'date', field: 'requested_date', align: 'left' },
        { name: 'amountPaid', label: 'paid', field: 'amountPaid', align: 'left' },
        { name: 'amountEndorsed', label: 'endorsed', field: 'amountEndorsed', align: 'left' },
        { name: 'attestations', label: 'treasurers', field: 'attestations', align: 'left' },
        { name: 'actions', label: 'actions', field: 'actions', align: 'right' }
      ],
      pagination: {
        rowsPerPage: 20
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
      search: '',

      sort: 'Sort by last added',
      circle: 'All circles',
      optionArray: ['Sort by last added'],
      circleArray: ['All circles', 'Circle One']
    }
  },
  async beforeMount () {
    await this.getTokens()
    this.redemptions = await this.getTreasuryData()
    for await (const redemption of this.redemptions) {
      for await (const attestation of redemption.attestations) {
        if (!this.profiles[attestation.key]) {
          this.profiles[attestation.key] = await this.getPublicProfile(attestation.key)
        }
      }
    }
    // this.filter = Boolean(localStorage.getItem('treasury-filter')) || false

    this.filterRedemptions()
    this.treasurers = await this.getTreasurers()
    this.loading = false
  },
  methods: {
    ...mapActions('profiles', ['getPublicProfile']),
    ...mapActions('treasury', ['getSupply', 'getTreasuryData', 'getTreasurers', 'sendNewPayment', 'endorsePayment']),
    ...mapMutations('layout', ['setBreadcrumbs']),

    formatDate (date) { return dateToString(date) },
    formatCurrency (value) { return new Intl.NumberFormat().format(parseInt(value), { style: 'currency' }) },

    isToken (value, name) { return value && value.includes(name) },

    openTrx (notes) {
      const network = notes.find(n => n.key === 'network')
      const trx = notes.find(n => n.key === 'trx_id' || n.key === 'trxid')
      // const networkName = network.value.replace('ACCOUNT', '')
      const url = process.env.BLOCKCHAIN_EXPLORER_EOS // Hard code to EOS
      if (!network || !trx) return
      window.open(url + trx.value, '_blank')
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
        this.redemptionsFiltered = [...this.redemptions].reverse()
      } else if (this.filter === false) {
        this.redemptionsFiltered = [...this.redemptions.filter(r => parseFloat(r.amount_paid) < parseFloat(r.amount_requested))].reverse()
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
            icon = require('~/assets/icons/usd.svg')
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
    },
    onPrev () {
      this.page--
    },
    onNext () {
      this.page++
    }
  },
  computed: {
    ...mapGetters('accounts', ['account']),
    ...mapGetters('dao', ['selectedDao']),
    treasurersCount () {
      return this.treasurers.length || 5
    },
    isTreasurer () {
      if (!this.account) return false
      return this.treasurers.some(t => t.treasurer === this.account)
    },
    pages () {
      return Math.ceil(this.redemptionsFiltered.length / 5)
    },
    paginatedRedemptions () {
      return this.redemptionsFiltered.slice((this.page - 1) * 5, this.page * 5)
    },
    getPaginationText () {
      if (this.pages === 0) return ''
      return `${this.page} of ${this.pages}`
    },
    isLastPage () {
      if (this.pages === 0) return true
      return this.page === this.pages
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
q-page.page-treasury
  .row.full-width(v-if="$q.screen.gt.md")
    .col-9.q-pr-md
      widget(no-padding).q-px-xl
        q-table.treasury-table(
          :columns="columns"
          :data="redemptionsFiltered"
          :loading="loading"
          :pagination.sync="pagination"
          row-key="redemption.id"
          virtual-scroll
        )
          template(v-slot:body="props")
            q-tr(:props="props").q-tr--no-hover
              q-td(key="id" :props="props")
                p.q-py-md.q-ma-none {{ props.row.redemption_id }}
              q-td(key="requestor" :props="props")
                p.q-py-md.q-ma-none {{ props.row.requestor }}
              q-td(key="amount_requested" :props="props")
                .row.q-py-md.items-center
                  img.table-icon(size="10px" v-if="isToken(props.row.amount_requested, 'HYPHA')" src="~assets/icons/hypha.svg")
                  img.table-icon(size="10px" v-if="isToken(props.row.amount_requested, 'HVOICE')" src="~assets/icons/hvoice.png")
                  img.table-icon(size="10px" v-if="isToken(props.row.amount_requested, 'USD')" src="~assets/icons/husd.png")
                  img.table-icon(size="10px" v-if="isToken(props.row.amount_requested, 'SEEDS')" src="~assets/icons/seeds.png")
                  | &nbsp;{{ formatCurrency(props.row.amount_requested) }}
              q-td(key="requested_date" :props="props")
                p.q-py-md.q-ma-none.text-italic {{ formatDate(props.row.requested_date) }}
              q-td(key="amountPaid" :props="props")
                .row.q-py-md.items-center
                  img.table-icon(size="10px" v-if="isToken(props.row.amount_requested, 'HYPHA')" src="~assets/icons/hypha.svg")
                  img.table-icon(size="10px" v-if="isToken(props.row.amount_requested, 'HVOICE')" src="~assets/icons/hvoice.png")
                  img.table-icon(size="10px" v-if="isToken(props.row.amount_requested, 'USD')" src="~assets/icons/husd.png")
                  img.table-icon(size="10px" v-if="isToken(props.row.amount_requested, 'SEEDS')" src="~assets/icons/seeds.png")
                  | &nbsp;{{ formatCurrency(props.row.amountPaid) }}
              q-td(key="amountEndorsed" :props="props")
                span(v-if="props.row.amountPaid === 0") open
                span(v-if="props.row.amountPaid > 0 && props.row.amountPaid < parseFloat(props.row.amount_requested)") pending
                div(v-if="props.row.amountPaid === parseFloat(props.row.amount_requested)")
                  .row.q-py-md.items-center
                    img.table-icon(size="10px" v-if="isToken(props.row.amount_requested, 'HYPHA')" src="~assets/icons/hypha.svg")
                    img.table-icon(size="10px" v-if="isToken(props.row.amount_requested, 'HVOICE')" src="~assets/icons/hvoice.png")
                    img.table-icon(size="10px" v-if="isToken(props.row.amount_requested, 'USD')" src="~assets/icons/husd.png")
                    img.table-icon(size="10px" v-if="isToken(props.row.amount_requested, 'SEEDS')" src="~assets/icons/seeds.png")
                    | &nbsp;{{ formatCurrency(props.row.amountPaid) }}
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
                    size="10px"
                    :disabled="!props.row.payments[0].notes.some(n => n.key === 'network')"
                    icon="fas fa-eye"
                    color="primary"
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

    .col-3
      filter-widget(
        :circle.sync="circle",
        :circleArray.sync="circleArray"
        :optionArray.sync="optionArray",
        :showCircle="true",
        :showToggle="true"
        :showViewSelector="false"
        :sort.sync="sort",
        :textFilter.sync="search",
        :toggle.sync="filter",
        toggleLabel="Show completed transactions"
      )
  .row.full-width(v-else)
    widget(:title="'Account & payment status'" :titleSize="'h-h7'").full-width
      template(v-if="(redemptionsFiltered.length === 0)")
        div(class="row justify-center q-my-md")
          loading-spinner(color="primary" size="40px")
      template(v-for="item in paginatedRedemptions")
        .row.bg-internal-bg.q-mt-xs(:style="'border-radius: 20px;'")
          .row.full-width.q-py-md.q-px-xl
            .col.flex.justify-start.column
              .h-h7 {{item.requestor}}
              div {{item.redemption_id}}
            .col.flex.column
              .flex.justify-end
                img.mobile-coin-icon(v-if="isToken(item.amount_requested, 'HYPHA')" src="~assets/icons/hypha.svg")
                img.mobile-coin-icon(v-if="isToken(item.amount_requested, 'HVOICE')" src="~assets/icons/hvoice.png")
                img.mobile-coin-icon(v-if="isToken(item.amount_requested, 'USD')" src="~assets/icons/husd.png")
                img.mobile-coin-icon(v-if="isToken(item.amount_requested, 'SEEDS')" src="~assets/icons/seeds.png")
                .h-h7.q-pl-xxs| &nbsp;{{ formatCurrency(item.amount_requested) }}
              .flex.justify-end.text-italic
                span(v-if="item.amountPaid === 0") open
                span(v-if="item.amountPaid > 0 && item.amountPaid < parseFloat(item.amount_requested)") pending
                div.endorsed-text(v-if="item.amountPaid === parseFloat(item.amount_requested)") endorsed
      .row.justify-between.q-pt-sm.items-center
        q-btn(@click="onPrev()" :disable="page === 1" round unelevated class="round-circle" icon="fas fa-chevron-left" color="inherit" text-color="primary" size="sm" :ripple="false")
        span {{  getPaginationText }}
        q-btn(@click="onNext()" :disable="isLastPage" round unelevated class="round-circle" icon="fas fa-chevron-right" color="inherit" text-color="primary" size="sm" :ripple="false")
    filter-open-button(
      @open="mobileFilterOpen = true"
    )
    filter-widget-mobile(
      v-show="mobileFilterOpen"
      @close="mobileFilterOpen = false"
      :circle.sync="circle",
      :circleArray.sync="circleArray"
      :optionArray.sync="optionArray",
      :showCircle="true",
      :showToggle="true"
      :showViewSelector="false"
      :sort.sync="sort",
      :textFilter.sync="search",
      :toggle.sync="filter",
      toggleLabel="Show completed transactions"
    )
</template>

<style lang="stylus" scoped>
.treasury-table
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
.mobile-coin-icon
  min-width: 17px
  max-width: 20px
  object-fit: contain
.endorsed-text
  color: $positive
.treasurer
  width 25px

</style>
