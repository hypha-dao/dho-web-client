<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { validation } from '~/mixins/validation'
import { dateToString } from '~/utils/TimeUtils'
import { MULTISIG_TABS } from '~/const'

export default {
  name: 'treasury',
  mixins: [validation],

  components: {
    FilterWidget: () => import('~/components/filters/filter-widget.vue'),
    FilterWidgetMobile: () => import('~/components/filters/filter-widget-mobile.vue'),
    FilterOpenButton: () => import('~/components/filters/filter-open-button.vue'),
    Widget: () => import('~/components/common/widget.vue'),
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue'),
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue')
  },
  data () {
    return {
      MULTISIG_TABS,
      totalRedemptions: 0,
      mobileFilterOpen: false,
      loading: true,
      filter: false, // OPEN, ALL
      tabsConfig: {
        history: {
          columns: [
            { name: 'requestor', label: 'account', field: 'requestor', align: 'left' },
            { name: 'id', label: 'Request ID', field: 'id', align: 'left' },
            { name: 'amountRequested', label: 'requested', field: 'amountRequested', align: 'left' },
            { name: 'requestedDate', label: 'date', field: 'requestedDate', align: 'left' },
            { name: 'amountPaid', label: 'paid', field: 'amountPaid', align: 'left' },
            { name: 'amountEndorsed', label: 'endorsed', field: 'amountEndorsed', align: 'left' },
            { name: 'attestations', label: 'treasurers', field: 'attestations', align: 'left' },
            { name: 'actions', label: 'details', field: 'actions', align: 'right' }
          ]
        },
        payoutRequests: {
          columns: [
            { name: 'requestor', label: 'account', field: 'requestor', align: 'left' },
            { name: 'id', label: 'Request ID', field: 'id', align: 'left' },
            { name: 'amountRequested', label: 'amount', field: 'amountRequested', align: 'left' },
            { name: 'requestedDate', label: 'date', field: 'requestedDate', align: 'left' }
          ]
        },
        multisig: {
          columns: [
            { name: 'treasurer', label: 'treasurer account', field: 'treasurer', align: 'left' },
            { name: 'id', label: 'Multisig ID', field: 'id', align: 'left' },
            { name: 'amountRequested', label: 'total amount', field: 'amountRequested', align: 'left' },
            { name: 'tokenAmount', label: 'total [token] amount', field: 'tokenAmount', align: 'left' },
            { name: 'signers', label: 'signers', field: 'signers', align: 'left' }
          ]
        }
      },
      pagination: {
        rowsNumber: this.totalRedemptions,
        rowsPerPage: 5,
        descending: false,
        page: 1,
        sortBy: 'requestedDate'
      },
      profiles: {},
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
      circleArray: ['All circles', 'Circle One'],
      tab: MULTISIG_TABS.PAYOUT,
      selected: [],
      transactionReviewOpen: false,
      successfullMultisigTransaction: null,
      formattedExecRequests: []
    }
  },
  apollo: {
    treasuryId: {
      query: require('~/query/treasury/dao-treasury-id.gql'),
      update: data => data?.queryDao?.[0].treasury?.[0].id,
      variables () {
        return {
          daoId: this.selectedDao.docId
        }
      },
      skip () { return !this.selectedDao?.docId }
    },
    treasuryAccount: {
      query: require('~/query/treasury/dao-treasury-account.gql'),
      update: data => data?.queryDao?.[0].settings?.[0].treasuryAccount,
      variables () {
        return {
          daoId: this.selectedDao.docId
        }
      },
      skip () { return !this.selectedDao?.docId }
    },
    redemptions: {
      query: require('~/query/treasury/dao-redemptions.gql'),
      update: function (data) {
        const treasury = data?.getDao?.treasury[0]
        const redemptions = treasury?.redemption || []
        const totalRedemptions = treasury?.redemptionAggregate?.count || 0
        const totalTreasurers = treasury?.treasurerAggregate?.count || 5
        const treasurers = []

        const formattedRedemptions = redemptions.map((redemption) => {
          const amountPaid = this.getAmount(redemption.details_amountPaid_a)
          const paidBy = redemption?.paidby[0]
          const trxDetails = paidBy?.details_notes_s && JSON.parse(paidBy.details_notes_s)

          if (paidBy) treasurers.push(paidBy.details_creator_n)

          const amountRequested = redemption.details_amountRequested_a

          return {
            id: redemption.docId,
            redemption_id: redemption.docId,
            requestor: redemption.details_requestor_n,
            amountPaid,
            amountRequested,
            requestedDate: redemption.createdDate,
            docId: redemption.docId,
            payments: [],
            amountPaidCurrency: redemption.details_amountPaid_a,
            paidBy,
            trxDetails
          }
        })

        this.pagination.rowsNumber = totalRedemptions
        this.loading = false
        this.treasurersCount = totalTreasurers

        const uniqueTreasurers = [...new Set(treasurers)]

        this.treasurers = uniqueTreasurers

        return formattedRedemptions
      },
      skip () {
        return !this.selectedDao || !this.selectedDao.docId
      },
      variables () {
        const rowsPerPage = this.pagination.rowsPerPage || 10
        return {
          daoId: this.selectedDao.docId,
          offset: (this.pagination.page - 1) * rowsPerPage,
          order: {
            desc: 'docId'
          },
          filter: this.tab === MULTISIG_TABS.PAYOUT ? { not: { has: 'paidby' } } : {}
        }
      },
      pollInterval: 1000 // THIS IS JUST TEMPORARY UNTIL GRAPHQL SUBSCRIPTION IS READY
    },
    daoMultisigSignRequestsQuery: {
      query: require('~/query/treasury/dao-multisig-sign-requests.gql'),
      update: function (data) {
        const unformattedRedemptions = data?.getDao?.treasury?.[0].redemption.filter(el => el?.paidby?.[0])
        const formattedRedemptions = unformattedRedemptions.map(redemption => {
          return {
            treasurer: redemption.paidby[0].details_creator_n,
            id: redemption.docId,
            proposalName: redemption.paidby[0].msiginfo[0].details_proposalName_n,
            amountRequested: redemption.details_amountPaid_a,
            tokenAmount: redemption?.paidby?.[0].details_nativeAmountPaid_a,
            signers: redemption.paidby[0].msiginfo[0].signer.map(signer => signer.details_member_n),
            approvedby: redemption.paidby[0].msiginfo[0].approvedby.map(signer => signer.details_member_n),
            msigProposalName: redemption.paidby[0].msiginfo[0].details_proposalName_n,
            msigId: redemption.paidby[0].msiginfo[0].docId
          }
        }).filter(redemption => redemption?.approvedby?.length === 0 && redemption.approvedby?.length === 0)
        return formattedRedemptions
      },
      variables () {
        return {
          daoId: this.selectedDao.docId
        }
      },
      skip () { return !this.selectedDao?.docId },
      pollInterval: 1000 // THIS IS JUST TEMPORARY UNTIL GRAPHQL SUBSCRIPTION IS READY
    },
    daoMultisigReadyExecRequestsQuery: {
      query: require('~/query/treasury/dao-multisig-sign-requests.gql'),
      update: function (data) {
        const unformattedRedemptions = data?.getDao?.treasury?.[0].redemption.filter(el => el?.paidby?.[0])
        const formattedRedemptions = unformattedRedemptions.map(redemption => {
          return {
            treasurer: redemption.paidby[0].details_creator_n,
            id: redemption.docId,
            proposalName: redemption.paidby[0].msiginfo[0].details_proposalName_n,
            amountRequested: redemption.details_amountPaid_a,
            tokenAmount: redemption?.paidby?.[0].details_nativeAmountPaid_a,
            signers: redemption.paidby[0].msiginfo[0].signer.map(signer => signer.details_member_n),
            state: redemption.paidby[0].msiginfo[0].details_state_s,
            approvedby: redemption.paidby[0].msiginfo[0].approvedby.map(signer => signer.details_member_n),
            msigProposalName: redemption.paidby[0].msiginfo[0].details_proposalName_n,
            msigId: redemption.paidby[0].msiginfo[0].docId
          }
        }).filter(redemption => redemption?.signers?.length > 1 && redemption.state !== 'executed' && redemption?.approvedby?.length !== 0)
        return formattedRedemptions
      },
      variables () {
        return {
          daoId: this.selectedDao.docId
        }
      },
      skip () { return !this.selectedDao?.docId },
      result: async function () {
        await this.formatExecReuqests()
      },
      pollInterval: 1000 // THIS IS JUST TEMPORARY UNTIL GRAPHQL SUBSCRIPTION IS READY
    }
  },
  async beforeMount () {
    await this.getTokens()
    await this.loadTreasurerProfiles()
  },
  methods: {
    ...mapActions('profiles', ['getPublicProfile']),
    ...mapActions('treasury', ['getSupply', 'sendNewPayment', 'endorsePayment']),
    ...mapActions('dao', ['createMultisigPay', 'approveMultisigPay', 'getTreasuryOptions', 'executeMultisigPay']),
    ...mapMutations('layout', ['setBreadcrumbs']),

    formatDate (date) { return dateToString(date) },
    getAmount (val) { return val && Number.parseFloat(this.formatCurrency(val)) },
    formatCurrency (value) {
      if (typeof value === 'string') {
        return Number(value.split(' ')[0]).toFixed(3)
      } else {
        return value.toFixed(3)
      }
    },

    isToken (value, name) { return value && value.includes(name) },

    openTrx (trxDetails) {
      const { network } = trxDetails

      const url = process.env.BLOCKCHAIN_EXPLORER_EOS // Hard code to EOS
      if (!network || !trxDetails) return
      window.open(url + trxDetails.trx_id, '_blank')
    },
    async getProfileCached (account) {
      if (this.profiles && this.profiles[account]) return this.profiles[account]
      const profile = await this.getPublicProfile(account)

      this.profiles[account] = profile?.publicData
      return profile?.publicData || {}
    },
    async onShowNewTrx (redemption) {
      this.resetNewTrxForm()
      const user = await this.getPublicProfile(redemption.requestor)

      if (user && user.defaultAddress) {
        this.newTrxForm.network = user.defaultAddress.replace('address', '').toUpperCase()
      }
      this.paymentRequestor = redemption.requestor
      this.newTrxForm.amount = redemption.amountRequested
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
    async loadTreasurerProfiles () {
      if (this.treasurers?.length > 0) {
        const { getProfileCached } = this
        const profiles = await Promise.all(this.treasurers?.map(async function (treasurer) {
          const profile = await getProfileCached(treasurer)
          return { account: treasurer, profile }
        }))

        const profilesMap = profiles.reduce((profileMap, { account, profile }) => ({ ...profileMap, [account]: profile }), {})

        this.profiles = profilesMap
      }
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
      if (!payment || !payment.paidBy) return false
      return payment.paidBy.details_creator_n === this.account
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
        this.redemptions = [...this.redemptions].reverse()
      } else if (this.filter === false) {
        this.redemptions = [...this.redemptions.filter(r => parseFloat(r.amount_paid) < parseFloat(r.amountRequested))].reverse()
      }
      if (this.search) {
        this.redemptions = [...this.redemptions.filter(r => r.requestor.includes(this.search))]
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
      this.pagination.page--
    },
    onNext () {
      this.pagination.page++
    },
    onRequest (props) {
      const { pagination } = props
      this.pagination = pagination
    },
    async createMultisig () {
      try {
        await this.createMultisigPay({ treasuryId: this.treasuryId, payments: this.selected, treasuryAccount: this.treasuryAccount })
        this.successfullMultisigTransaction = true
        this.selected = []
        await this.$apollo.queries.redemptions.refetch()
        await this.$apollo.queries.daoMultisigSignRequestsQuery.refetch()
        this.tab = MULTISIG_TABS.MULTISIG
      } catch (err) {
        this.successfullMultisigTransaction = false
      }
    },
    async approveMultisig () {
      await this.approveMultisigPay({ data: this.selected })
      this.selected = []
      await this.$apollo.queries.redemptions.refetch()
      await this.$apollo.queries.daoMultisigSignRequestsQuery.refetch()
      this.tab = MULTISIG_TABS.READY
    },

    async executeMultisig () {
      await this.executeMultisigPay({ data: this.selected })
      await this.$apollo.queries.redemptions.refetch()
      await this.$apollo.queries.daoMultisigSignRequestsQuery.refetch()
      this.tab = MULTISIG_TABS.HISTORY
    },

    async formatExecReuqests () {
      const treasuryOptions = await this.getTreasuryOptions({ treasuryAccount: this.treasuryAccount })
      let treshold = 0
      this.daoMultisigReadyExecRequestsQuery.forEach((request) => {
        for (const key in treasuryOptions.signerWeightsMap) {
          if (request.approvedby.includes(key)) {
            treshold += treasuryOptions.signerWeightsMap[key]
          }
        }
        if (!this.formattedExecRequests.find(el => el.id === request.id)) {
          if (treshold >= treasuryOptions.treshold) {
            this.formattedExecRequests.push(request)
            treshold = 0
          }
        }
      })
    }
  },

  computed: {
    ...mapGetters('accounts', ['account']),
    ...mapGetters('dao', ['selectedDao']),
    isTreasurer () {
      if (!this.account) return false
      const isTreasurer = this.treasurers.some(t => t === this.account)

      return isTreasurer
    },
    pages () {
      return Math.ceil(this.pagination.rowsNumber / this.pagination.rowsPerPage)
    },
    getPaginationText () {
      if (this.pages === 0) return ''
      return `${this.pagination.page} of ${this.pages}`
    },
    isLastPage () {
      if (this.pages === 0) return true
      return this.pagination.page === this.pages
    }
  },
  watch: {
    treasurers () {
      this.loadTreasurerProfiles()
    },
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
    },
    tab (val) {
      this.selected = []
    }
  }
}
</script>

<template lang="pug">
q-page.page-treasury
  q-dialog(:value="transactionReviewOpen" :full-width="successfullMultisigTransaction === null" @hide="transactionReviewOpen = false, successfullMultisigTransaction = null")
    widget.full-width(title="Transaction Review")
      div(v-if="successfullMultisigTransaction === true")
        .row.q-mt-xxl
          .col.h-h3 Well Done! Multisig transaction successfully created!
          .col-1.items-center.flex
            q-icon(color="positive" name="fas fa-check" size="42px")
        .row.q-mt-sm.q-pb-md
          .text-grey.h-b2 You can now find the multisig transaction request on the "Multisig Sign Request".
          .text-bold.h-b2 Other 2 treasurers needs to sign-it,
          .text-grey.h-b2.q-ml-xxs then the transaction is ready to be executed!
      div(v-if="successfullMultisigTransaction === false")
        .row.q-mt-xxl
          .col.h-h3 An Error occurred please try again clicking the button below
          .col-1.items-center.flex
            q-icon(color="negative" name="fa fa-exclamation-circle" size="42px")
        .row.q-mt-sm.q-pb-md
          .text-grey.h-b2 It would be cool if we could provide info about the eventual error here
        .row.justify-end
          q-btn.q-px-lg.h-btn1.q-mt-md(
            color="primary"
            label="Try again"
            no-caps
            rounded
            unelevated
            @click="successfullMultisigTransaction = null"
          )
      template(v-else-if="successfullMultisigTransaction === null")
        q-table.treasury-table(
          :columns="tabsConfig.payoutRequests.columns"
          :data="selected"
          :loading="loading"
          @request="onRequest"
        )
          template(v-slot:body="props")
            q-tr(:props="props").q-tr--no-hover
              q-td(key="requestor" :props="props")
                .row
                  profile-picture.q-mr-xs(:username="props.row.requestor" size="24px")
                  p.q-py-md.q-ma-none {{ props.row.requestor }}
              q-td(key="id" :props="props")
                p.q-py-md.q-ma-none {{ props.row.redemption_id }}
              q-td(key="amountRequested" :props="props")
                .row.q-py-md.items-center
                  img.table-icon(size="10px" v-if="isToken(props.row.amountRequested, 'HYPHA')" src="~assets/icons/hypha.svg")
                  img.table-icon(size="10px" v-if="isToken(props.row.amountRequested, 'HVOICE')" src="~assets/icons/hvoice.png")
                  img.table-icon(size="10px" v-if="isToken(props.row.amountRequested, 'USD')" src="~assets/icons/husd.png")
                  img.table-icon(size="10px" v-if="isToken(props.row.amountRequested, 'SEEDS')" src="~assets/icons/seeds.png")
                  | &nbsp;{{ formatCurrency(props.row.amountRequested) }}
              q-td(key="requestedDate" :props="props")
                p.q-py-md.q-ma-none.text-italic {{ formatDate(props.row.requestedDate) }}
        .row.justify-end
          q-btn.col-3.q-px-lg.h-btn1.q-mt-md(
            color="primary"
            label="All good, create Multisig"
            no-caps
            rounded
            unelevated
            @click="createMultisig"
          )
  .row.full-width(v-if="$q.screen.gt.md")
    .col-9.q-pr-md
      widget(no-padding).q-px-xl
        q-tabs(
          active-color="primary"
          indicator-color="primary"
          no-caps
          v-model="tab"
        )
          q-tab(v-if="treasuryAccount" :name="MULTISIG_TABS.PAYOUT" label="Payout Requests" :ripple="false")
          q-tab(v-if="treasuryAccount" :name="MULTISIG_TABS.MULTISIG" label="Multisig Sign Request" :ripple="false")
          q-tab(v-if="treasuryAccount" :name="MULTISIG_TABS.READY" label="Ready to Execute" :ripple="false")
          q-tab(:name="MULTISIG_TABS.HISTORY" label="History" :ripple="false")
        div(v-if="tab === MULTISIG_TABS.READY && treasuryAccount")
          q-table.treasury-table(
            v-if="formattedExecRequests.length"
            :columns="tabsConfig.multisig.columns"
            :data="formattedExecRequests"
            :loading="loading"
            selection="single"
            :selected.sync="selected"
          )
            template(v-slot:body="formattedExecRequests")
              q-tr(:props="formattedExecRequests").q-tr--no-hover
                q-td(key="selected")
                  q-checkbox(v-model="formattedExecRequests.selected")
                q-td(key="treasurer" :props="formattedExecRequests")
                  .row
                    profile-picture.q-mr-xs(:username="formattedExecRequests.row.treasurer" size="24px")
                    p.q-py-md.q-ma-none {{ formattedExecRequests.row.treasurer }}
                q-td(key="id" :props="formattedExecRequests")
                  p.q-py-md.q-ma-none {{ formattedExecRequests.row.id }}
                q-td(key="amountRequested" :props="formattedExecRequests")
                  .row.q-py-md.items-center
                    img.table-icon(size="10px" v-if="isToken(formattedExecRequests.row.amountRequested, 'USD')" src="~assets/icons/husd.png")
                    | &nbsp;{{ formatCurrency(formattedExecRequests.row.amountRequested) }}
                q-td(key="tokenAmount" :props="formattedExecRequests")
                  .row.q-py-md.items-center
                    img.table-icon(size="10px" v-if="isToken(formattedExecRequests.row.tokenAmount, 'HYPHA')" src="~assets/icons/hypha.svg")
                    img.table-icon(size="10px" v-if="isToken(formattedExecRequests.row.tokenAmount, 'HVOICE')" src="~assets/icons/hvoice.png")
                    img.table-icon(size="10px" v-if="isToken(formattedExecRequests.row.tokenAmount, 'USD')" src="~assets/icons/husd.png")
                    img.table-icon(size="10px" v-if="isToken(formattedExecRequests.row.tokenAmount, 'SEEDS')" src="~assets/icons/seeds.png")
                    img.table-icon(size="10px" v-if="isToken(formattedExecRequests.row.tokenAmount, 'TLOS')" src="~assets/icons/tlos.png")
                    template(v-if="formattedExecRequests.row.tokenAmount !== null")
                      | &nbsp;{{ formatCurrency(formattedExecRequests.row.tokenAmount) }}
                q-td(key="signers" :props="formattedExecRequests")
                  .row.flex.profile-container
                    .profile-item-wrapper(v-for="user, index in formattedExecRequests.row.approvedby" v-if="index <= 0")
                      .profile-item
                        profile-picture(:username="user" size="26px" :key="user")
                        q-tooltip @{{ user }}
                    .profile-counter.bg-internal-bg(v-if="formattedExecRequests.row.approvedby.length > 1") +{{ formattedExecRequests.row.approvedby.length - 1 }}
                    .profile-counter.bg-internal-bg(v-else-if="!formattedExecRequests.row.approvedby.length") n/a
          div.q-mt-xl.q-pb-xxl.row(v-else)
            .col
              .h-h5 All Done here
              .text-grey.h-b2.q-mt-sm All Multisig. transaction has been successfully created, signed and executed. Bravo team!
              q-icon(color="positive" name="fas fa-check" size="42px")
        div(v-if="tab === MULTISIG_TABS.MULTISIG && treasuryAccount")
          q-table.treasury-table(
            v-if="daoMultisigSignRequestsQuery.length"
            :columns="tabsConfig.multisig.columns"
            :data="daoMultisigSignRequestsQuery"
            :loading="loading"
            selection="single"
            :selected.sync="selected"
          )
            template(v-slot:body="daoMultisigSignRequestsQuery")
              q-tr(:props="daoMultisigSignRequestsQuery").q-tr--no-hover
                q-td(key="selected")
                  q-checkbox(v-model="daoMultisigSignRequestsQuery.selected")
                q-td(key="treasurer" :props="daoMultisigSignRequestsQuery")
                  .row
                    profile-picture.q-mr-xs(:username="daoMultisigSignRequestsQuery.row.treasurer" size="24px")
                    p.q-py-md.q-ma-none {{ daoMultisigSignRequestsQuery.row.treasurer }}
                q-td(key="id" :props="daoMultisigSignRequestsQuery")
                  p.q-py-md.q-ma-none {{ daoMultisigSignRequestsQuery.row.id }}
                q-td(key="amountRequested" :props="daoMultisigSignRequestsQuery")
                  .row.q-py-md.items-center
                    img.table-icon(size="10px" v-if="isToken(daoMultisigSignRequestsQuery.row.amountRequested, 'USD')" src="~assets/icons/husd.png")
                    | &nbsp;{{ formatCurrency(daoMultisigSignRequestsQuery.row.amountRequested) }}
                q-td(key="tokenAmount" :props="daoMultisigSignRequestsQuery")
                  .row.q-py-md.items-center
                    img.table-icon(size="10px" v-if="isToken(daoMultisigSignRequestsQuery.row.tokenAmount, 'HYPHA')" src="~assets/icons/hypha.svg")
                    img.table-icon(size="10px" v-if="isToken(daoMultisigSignRequestsQuery.row.tokenAmount, 'HVOICE')" src="~assets/icons/hvoice.png")
                    img.table-icon(size="10px" v-if="isToken(daoMultisigSignRequestsQuery.row.tokenAmount, 'USD')" src="~assets/icons/husd.png")
                    img.table-icon(size="10px" v-if="isToken(daoMultisigSignRequestsQuery.row.tokenAmount, 'SEEDS')" src="~assets/icons/seeds.png")
                    img.table-icon(size="10px" v-if="isToken(daoMultisigSignRequestsQuery.row.tokenAmount, 'TLOS')" src="~assets/icons/tlos.png")
                    template(v-if="daoMultisigSignRequestsQuery.row.tokenAmount !== null")
                      | &nbsp;{{ formatCurrency(daoMultisigSignRequestsQuery.row.tokenAmount) }}
                q-td(key="signers" :props="daoMultisigSignRequestsQuery")
                  .row.flex.profile-container
                    .profile-item-wrapper(v-for="user, index in daoMultisigSignRequestsQuery.row.approvedby" v-if="index <= 0")
                      .profile-item
                        profile-picture(:username="user" size="26px" :key="user")
                        q-tooltip @{{ user }}
                    .profile-counter.bg-internal-bg(v-if="daoMultisigSignRequestsQuery.row.approvedby.length > 1") +{{ daoMultisigSignRequestsQuery.row.approvedby.length - 1 }}
                    .profile-counter.bg-internal-bg(v-else-if="!daoMultisigSignRequestsQuery.row.approvedby.length") n/a
          div.q-mt-xl.q-pb-xxl.row(v-else)
            .col
              .h-h5 All Done here
              .text-grey.h-b2.q-mt-sm No pending Multisig transaction at the moment. All multisig transactions request have been signed by at least 2 different treasurers and are now ready to be executed
              q-icon(color="positive" name="fas fa-check" size="42px")
        div(v-if="tab === MULTISIG_TABS.PAYOUT && treasuryAccount")
          q-table.treasury-table(
            v-if="redemptions.length"
            :columns="tabsConfig.payoutRequests.columns"
            :data="redemptions"
            :loading="loading"
            @request="onRequest"
            selection="multiple"
            :selected.sync="selected"
          )
            template(v-slot:body="props")
              q-tr(:props="props").q-tr--no-hover
                q-td(key="selected")
                  q-checkbox(v-model="props.selected")
                q-td(key="requestor" :props="props")
                  .row
                    profile-picture.q-mr-xs(:username="props.row.requestor" size="24px")
                    p.q-py-md.q-ma-none {{ props.row.requestor }}
                q-td(key="id" :props="props")
                  p.q-py-md.q-ma-none {{ props.row.redemption_id }}
                q-td(key="amountRequested" :props="props")
                  .row.q-py-md.items-center
                    img.table-icon(size="10px" v-if="isToken(props.row.amountRequested, 'HYPHA')" src="~assets/icons/hypha.svg")
                    img.table-icon(size="10px" v-if="isToken(props.row.amountRequested, 'HVOICE')" src="~assets/icons/hvoice.png")
                    img.table-icon(size="10px" v-if="isToken(props.row.amountRequested, 'USD')" src="~assets/icons/husd.png")
                    img.table-icon(size="10px" v-if="isToken(props.row.amountRequested, 'SEEDS')" src="~assets/icons/seeds.png")
                    | &nbsp;{{ formatCurrency(props.row.amountRequested) }}
                q-td(key="requestedDate" :props="props")
                  p.q-py-md.q-ma-none.text-italic {{ formatDate(props.row.requestedDate) }}
          div.q-mt-xl.q-pb-xxl.row(v-else)
            .col
              .h-h5 All Done here
              .text-grey.h-b2.q-mt-sm No pending Payout request at the moment. All payout requests are inside the Multisig request
            .col-1.items-center.flex
              q-icon(color="positive" name="fas fa-check" size="42px")
        div(v-if="tab === MULTISIG_TABS.HISTORY")
          q-table.treasury-table(
            :columns="tabsConfig.history.columns"
            :data="redemptions.filter(redemption => redemption.paidBy?.details_creator_n)"
            :loading="loading"
            @request="onRequest"
            row-key="redemption.id"
            virtual-scroll
          )
            template(v-slot:body="props")
              q-tr(:props="props").q-tr--no-hover
                q-td(key="requestor" :props="props")
                  p.q-py-md.q-ma-none {{ props.row.requestor }}
                q-td(key="id" :props="props")
                  p.q-py-md.q-ma-none {{ props.row.redemption_id }}
                q-td(key="amountRequested" :props="props")
                  .row.q-py-md.items-center
                    img.table-icon(size="10px" v-if="isToken(props.row.amountRequested, 'HYPHA')" src="~assets/icons/hypha.svg")
                    img.table-icon(size="10px" v-if="isToken(props.row.amountRequested, 'HVOICE')" src="~assets/icons/hvoice.png")
                    img.table-icon(size="10px" v-if="isToken(props.row.amountRequested, 'USD')" src="~assets/icons/husd.png")
                    img.table-icon(size="10px" v-if="isToken(props.row.amountRequested, 'SEEDS')" src="~assets/icons/seeds.png")
                    | &nbsp;{{ formatCurrency(props.row.amountRequested) }}
                q-td(key="requestedDate" :props="props")
                  p.q-py-md.q-ma-none.text-italic {{ formatDate(props.row.requestedDate) }}
                q-td(key="amountPaid" :props="props")
                  .row.q-py-md.items-center
                    img.table-icon(size="10px" v-if="isToken(props.row.amountRequested, 'HYPHA')" src="~assets/icons/hypha.svg")
                    img.table-icon(size="10px" v-if="isToken(props.row.amountRequested, 'HVOICE')" src="~assets/icons/hvoice.png")
                    img.table-icon(size="10px" v-if="isToken(props.row.amountRequested, 'USD')" src="~assets/icons/husd.png")
                    img.table-icon(size="10px" v-if="isToken(props.row.amountRequested, 'SEEDS')" src="~assets/icons/seeds.png")
                    | &nbsp;{{ formatCurrency(props.row.amountPaidCurrency) }}
                q-td(key="amountEndorsed" :props="props")
                  span(v-if="props.row.amountPaid === 0") open
                  span(v-if="props.row.amountPaid > 0 && props.row.amountPaid < getAmount(props.row.amountRequested)") pending
                  div(v-if="props.row.amountPaid === getAmount(props.row.amountRequested)")
                    .row.q-py-md.items-center
                      img.table-icon(size="10px" v-if="isToken(props.row.amountRequested, 'HYPHA')" src="~assets/icons/hypha.svg")
                      img.table-icon(size="10px" v-if="isToken(props.row.amountRequested, 'HVOICE')" src="~assets/icons/hvoice.png")
                      img.table-icon(size="10px" v-if="isToken(props.row.amountRequested, 'USD')" src="~assets/icons/husd.png")
                      img.table-icon(size="10px" v-if="isToken(props.row.amountRequested, 'SEEDS')" src="~assets/icons/seeds.png")
                      | &nbsp;{{ formatCurrency(props.row.amountPaid) }}
                q-td(key="attestations" :props="props")
                  q-img.treasurer.q-mr-xs(
                    v-if="props.row.paidBy && props.row.paidBy.details_creator_n && profiles[props.row.paidBy.details_creator_n]"
                    :src="profiles[props.row.paidBy.details_creator_n].avatar"
                    size="25px"
                  )
                    q-tooltip Signed by {{ props.row.paidBy.details_creator_n }}
                  q-icon.icon-placeholder.q-mr-xs(
                    v-if="props.row.paidBy && (!props.row.paidBy.details_creator_n || !profiles[props.row.paidBy.details_creator_n])"
                    :key="`treasurer1_rd_${props.row.redemption_id}`"
                    name="fas fa-user-circle"
                    size="sm"
                    color="white"
                  )
                    q-tooltip Signed by {{ props.row.paidBy.details_creator_n }}
                  q-icon.icon-placeholder.q-mr-xs(
                    v-if="!props.row.trxDetails"
                    :key="`treasurer1_rd_${props.row.redemption_id}`"
                    name="fas fa-user-circle"
                    size="sm"
                    color="white"
                  )
                q-td(key="actions" :props="props")
                  q-btn.q-mb-xs(
                    v-if="isTreasurer && props.row.amountPaid < parseFloat(props.row.amountRequested)"
                    icon="fas fa-plus-circle"
                    color="green"
                    unelevated
                    round
                    @click="onShowNewTrx(props.row)"
                  )
                  q-btn.q-mb-xs(
                    v-if="isTreasurer && props.row.trxDetails && !hasEndorsed(props.row.trxDetails)"
                    icon="fas fa-check-square"
                    color="yellow-10"
                    unelevated
                    round
                    @click="onShowEndorse(props.row.trxDetails)"
                  )
                  div(v-if="props.row.trxDetails")
                    q-btn(
                      size="10px"
                      :disabled="!props.row.trxDetails.network"
                      icon="fas fa-eye"
                      color="primary"
                      unelevated
                      round
                      @click="openTrx(props.row.trxDetails)"
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
      .row.q-mt-md.text-no-wrap
        .text-italic.h-b2.text-bold *Real token conversion will happen when treasurers will execute the payout transactions:
        .text-italic.h-b2 Here you see the conversion for [TOKEN] current market just as a reference. The conversion calculation updates every X minutes.
    .col-3
      widget.q-mb-md(v-if="tab === MULTISIG_TABS.READY" title="Execute a Multisig. Transaction")
        .row.q-mt-sm
          .text-grey.h-b2 Hello Treasurer! This multisig transactions has been successfully signed by 2 treasures and is now ready to be Executed
        q-btn.q-px-lg.h-btn1.full-width.q-mt-md(
          color="primary"
          label="Execute Multisig. Transaction"
          no-caps
          rounded
          unelevated
          :disable="!selected.length"
          @click="executeMultisig"
        )
      widget.q-mb-md(v-if="tab === MULTISIG_TABS.MULTISIG" title="Sign a Multisig. Transaction")
        .row.q-mt-sm
          .text-grey.h-b2 Hello Treasurer! Select the Multisig transaction you want to sign. After this a transaction has been signed by 2 treasurers, it can be executed
        q-btn.q-px-lg.h-btn1.full-width.q-mt-md(
          color="primary"
          label="Sign Multisig. Transaction"
          no-caps
          rounded
          unelevated
          :disable="!selected.length"
          @click="approveMultisig"
        )
      widget.q-mb-md(v-if="tab === MULTISIG_TABS.PAYOUT" title="Generate Miltisig. Transaction")
        .text-grey.h-b2.q-mt-sm Hello Treasurer! Start a Multisig. transaction by selecting the payout requests you want to include, then click the button below
        q-btn.q-px-lg.h-btn1.full-width.q-mt-md(
          color="primary"
          label="Generate"
          no-caps
          rounded
          unelevated
          :disable="!selected.length"
          @click="transactionReviewOpen = true"
        )
      filter-widget(
        :circle.sync="circle",
        :circleArray.sync="circleArray"
        :optionArray.sync="optionArray",
        :showCircle="false",
        :showToggle="true"
        :showViewSelector="false"
        :sort.sync="sort",
        :textFilter.sync="search",
        :toggle.sync="filter",
        toggleLabel="Show completed transactions"
      )
  .row.full-width(v-else)
    widget(:title="'Account & payment status'" :titleSize="'h-h7'").full-width
      q-tabs(
        active-color="primary"
        align="start"
        indicator-color="primary"
        no-caps
        v-model="tab"
      )
        q-tab(:name="MULTISIG_TABS.PAYOUT" label="Payout Requests" :ripple="false")
        q-tab(:name="MULTISIG_TABS.MULTISIG" label="Multisig Sign Request" :ripple="false")
        q-tab(:name="MULTISIG_TABS.READY" label="Ready to Execute" :ripple="false")
        q-tab(:name="MULTISIG_TABS.HISTORY" label="History" :ripple="false")
      div(v-if="tab === MULTISIG_TABS.HISTORY")
        template(v-if="(redemptions.length === 0)")
          div(class="row justify-center q-my-md")
            loading-spinner(color="primary" size="40px")
        template(v-for="item in redemptions")
          .row.bg-internal-bg.q-mt-xs(:style="'border-radius: 20px;'")
            .row.full-width.q-py-md.q-px-xl
              .col.flex.justify-start.column
                .h-h7 {{item.requestor}}
                div {{item.redemption_id}}
              .col.flex.column
                .flex.justify-end
                  img.mobile-coin-icon(v-if="isToken(item.amountRequested, 'HYPHA')" src="~assets/icons/hypha.svg")
                  img.mobile-coin-icon(v-if="isToken(item.amountRequested, 'HVOICE')" src="~assets/icons/hvoice.png")
                  img.mobile-coin-icon(v-if="isToken(item.amountRequested, 'USD')" src="~assets/icons/husd.png")
                  img.mobile-coin-icon(v-if="isToken(item.amountRequested, 'SEEDS')" src="~assets/icons/seeds.png")
                  .h-h7.q-pl-xxs| &nbsp;{{ formatCurrency(item.amountRequested) }}
                .flex.justify-end.text-italic
                  span(v-if="item.amountPaid === 0") open
                  span(v-if="item.amountPaid > 0 && item.amountPaid < parseFloat(item.amountRequested)") pending
                  div.endorsed-text(v-if="item.amountPaid === parseFloat(item.amountRequested)") endorsed
        .row.justify-between.q-pt-sm.items-center
          q-btn(@click="onPrev()" :disable="pagination.page === 1" round unelevated class="round-circle" icon="fas fa-chevron-left" color="inherit" text-color="primary" size="sm" :ripple="false")
          span {{  getPaginationText }}
          q-btn(@click="onNext()" :disable="isLastPage" round unelevated class="round-circle" icon="fas fa-chevron-right" color="inherit" text-color="primary" size="sm" :ripple="false")
    .row.q-mt-md
      .text-italic.h-b2.text-bold *Real token conversion will happen when treasurers will execute the payout transactions:
      .text-italic.h-b2 Here you see the conversion for [TOKEN] current market just as a reference. The conversion calculation updates every X minutes.
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
.selected
  td:first-of-type::after
    content: ''
    border-radius: 20px 0 0 20px !important
  td:last-of-type::after
    content: ''
    border-radius: 0 20px 20px 0 !important
.profile-container
  margin-left 15px
  position: absolute
  bottom: 21px
  right: 20px
.profile-item-wrapper
  display: flex
  align-items: center
  justify-content: center
  background: #FFFFFF
  width: 30px
  height: 30px
  border-radius: 50%
  z-index: 100
  margin-left: -10px
  .profile-item
    width 26px
.profile-counter
  display: flex
  align-items: center
  justify-content: center
  border-radius: 50%
  height: 30px
  width: 30px
  position: relative
  font-size: 10px
  font-weight: 600
  font-family: 'Source Sans Pro', sans-serif
  color: #242F5D
  margin-left: -10px
  z-index: 100
</style>
