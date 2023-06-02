<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { validation } from '~/mixins/validation'
import { format } from '~/mixins/format'
import { dateToStringShort } from '~/utils/TimeUtils'

/**
 * Wallet base component that is responsible for rendering wallet items, triggering redemption actions
 * This is a pure component whose state is entirely determined by props and does not query the backend
 */
export default {
  name: 'wallet-base',
  mixins: [validation, format],
  components: {
    Widget: () => import('~/components/common/widget.vue'),
    TokenLogo: () => import('~/components/common/token-logo.vue'),
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue'),
    WalletAdresses: () => import('~/components/profiles/wallet-adresses.vue')

  },

  props: {
    noTitle: Boolean,
    canRedeem: Boolean,
    closeDelay: {
      type: Number,
      default: 1000
    },
    loading: Boolean,
    more: Boolean,
    username: String,
    wallet: Array,
    pegToken: Object,
    usingSeeds: Boolean,
    daoLogo: {
      type: String,
      default: undefined
    }
  },

  data () {
    return {
      form: {
        amount: null
      },
      walletForm: {
        eosAccount: null,
        eosMemo: null
      },
      redeem: false,
      submitting: false,
      showPayoutModal: false,
      editable: false,
      successRedeem: false,
      showMoreTokens: false,
      walletAddressForm: {
        btcAddress: null,
        ethAddress: null,
        eosAccount: null,
        eosMemo: null,
        defaultAddress: null
      },
      currentDetailsObject: {},
      showDetailsModal: false
    }
  },

  apollo: {
    redemptions: {
      query: require('~/query/treasury/dao-redemptions-payout-modal.gql'),
      update: data => {
        return data?.getDao?.treasury?.[0].redemption.map(redemption => {
          return {
            date: redemption.createdDate,
            docId: redemption.docId,
            requestor: redemption.details_requestor_n,
            amount: redemption.details_amountRequested_a
          }
        })
      },
      variables () {
        return {
          daoId: this.selectedDao.docId,
          username: this.account
        }
      },
      skip () { return !this.selectedDao?.docId }
    }
  },

  computed: {
    ...mapGetters('dao', ['daoSettings']),
    ...mapGetters('accounts', ['account']),
    ...mapGetters('dao', ['selectedDao']),
    icon () {
      return this.redeem ? 'fas fa-minus-circle' : 'fas fa-plus-circle'
    },
    isOwner () {
      return this.username === this.account
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
    }
  },

  methods: {
    dateToStringShort,
    ...mapActions('payments', ['redeemToken', 'buySeeds', 'buyHypha']),
    ...mapActions('profiles', ['getProfile', 'getPublicProfile', 'getWalletAdresses', 'saveAddresses']),
    ...mapMutations('profiles', ['setView']),

    async validateForm () {
      await this.resetValidation(this.form)
      return await this.validate(this.form)
    },

    resetForm () {
      this.redeem = false
      this.form.amount = 0
      this.resetValidation(this.form)
      this.submitting = false
    },

    async onRedeemHusd () {
      if (await this.validateForm()) {
        this.submitting = true
        try {
          await this.redeemToken(
            {
              quantity: `${parseFloat(this.form.amount).toFixed(2)} HUSD`,
              memo: 'redeem'
            }
          )
          this.successRedeem = true
        } catch (e) {
          const message = e.message || e.cause.message
          this.showNotification({
            message,
            color: 'red'
          })
        } finally {
          this.resetForm()
        }
        this.$emit('redeem-husd', this.form.amount)
      }
    },

    async onBuySeeds () {
      if (await this.validateForm()) {
        this.submitting = true
        try {
          await this.buySeeds(`${parseFloat(this.form.amount).toFixed(2)} HUSD`)
        } catch (e) {
          const message = e.message || e.cause.message
          this.showNotification({
            message,
            color: 'red'
          })
        } finally {
          this.resetForm()
        }
        this.$emit('buy-seeds', this.form.amount)
      }
    },

    async onBuyHypha () {
      if (await this.validateForm()) {
        this.submitting = true
        try {
          await this.buyHypha(`${parseFloat(this.form.amount).toFixed(2)} HUSD`)
        } catch (e) {
          const message = e.message || e.cause.message
          this.showNotification({
            message,
            color: 'red'
          })
        } finally {
          this.resetForm()
        }
        this.$emit('buy-hypha', this.form.amount)
      }
    },

    onSetRedemptionAddr () {
      this.resetForm()
      this.$emit('set-redeem')
    },

    formatCurrency(amount) {
      return new Intl.NumberFormat('en-US').format(parseInt(amount), { style: 'currency' })
    },

    async saveWalletAddresses (data, success, fail) {
      try {
        await this.saveAddresses({ newData: data, oldData: this.walletAddressForm })
        this.walletAddressForm = data
        await this.getProfile(this.account)
      } catch (error) {
      }
    },

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

    async loadProfile () {
      const profile = await this.getProfile(this.account)
      this.setView(null)
      if (profile) {
        this.setView(profile)
        this.smsInfo = profile.smsInfo
        this.emailInfo = profile.emailInfo
        this.commPref = profile.commPref
      }
      this.walletAddressForm = await this.getWalletAdresses(this.account)
    },

    async loadPublicProfile () {
      await this.getPublicProfile(this.username)
    }
    // TODO: Find a way to get the last transaction
    // openTrx (trxDetails) {
    //   const { network } = trxDetails

    //   const url = process.env.BLOCKCHAIN_EXPLORER_EOS // Hard code to EOS
    //   if (!network || !trxDetails) return
    //   window.open(url + trxDetails.trx_id, '_blank')
    // },
  }
}
</script>

<template lang="pug">
widget.wallet-base(:more="more" :no-title="noTitle" morePosition="top" title="Wallet" @more-clicked="$router.push({ path: `/${$route.params.dhoname}/@${username}/wallet` })")
  q-dialog(:value="showDetailsModal" @hide="showDetailsModal = false, currentDetailsObject = {}")
    widget.full-width.q-pa-md(title="Redeem HUSD")
      .h-b2.text-bold.text-black.q-mb-sm Redemption pending
      .row.q-mt-sm
        .col-9.q-pr-sm
          .flex.full-width(:style="{ 'background': '#F1F1F3', 'border-radius': '15px', 'padding': '12px 15px' }")
            .row.justify-between.h-b2.text-bold.text-black.q-mb-sm.full-width
              div Id
              div {{ currentDetailsObject.docId }}
            .row.justify-between.h-b2.text-bold.text-black.q-mb-sm.full-width
              div Requestor
              div {{ currentDetailsObject.requestor }}
            .row.justify-between.h-b2.text-bold.text-black.full-width
              div Amount
              div {{ `${formatCurrency(currentDetailsObject.amount)} HUSD` }}
        .col-3
          div.flex.items-center.justify-center(:style="{ 'width': '112px', 'height': '112px', 'border-radius': '20px', 'background': '#f99f17' }")
            q-icon(name="far fa-clock" color="white" size="60px")
      .row.full-width.q-mt-xl.no-wrap
        .col
        .col.q-mr-sm
          q-btn.h-btn1.full-width(
            color="primary"
            outline
            no-caps
            unelevated
            rounded
            :label= "'Close'"
            :loading="submitting"
            @click="showDetailsModal = false"
          )
  q-dialog(:value="showPayoutModal" @hide="showPayoutModal = false")
    widget.full-width.q-pa-md(title="Redeem HUSD")
      .row.q-mt-md
        .col-6
          .h-b2.text-bold.text-black.q-mb-sm HUSD available
          .row.no-wrap.items-center
            q-avatar.q-mr-sm(size="40px")
              img(:style="{ 'width': '40px', 'height': '40px' }" src="~/assets/icons/usd.png")
            div.flex.items-center.full-width(:style="{ 'background': '#F1F1F3', 'border-radius': '15px', 'padding': '12px 15px' }")
              div {{ formatCurrency(pegToken.amount) }}
        .col-6.full-width
      template(v-if="!successRedeem")
        .row.q-mt-md
          .h-b2.text-bold.text-black.q-mb-sm Amount to redeem
          q-input.text-black.full-width(
            :rules="[rules.greaterThan(0), rules.lessOrEqualThan(pegToken.amount)]"
            v-model.number="form.amount"
            type="number"
            rounded
            outlined
            dense
            placeholder="Type Amount"
          )
          .row.justify-end.full-width.q-mt-xs
            .h-b2.text-primary.text-bold.text-underline.cursor-pointer(@click="form.amount = 500.00") 500.00
            .h-b2.text-primary.text-bold.text-underline.q-ml-sm.cursor-pointer(@click="form.amount = 1000.00") 1000.00
            .h-b2.text-primary.text-bold.text-underline.q-ml-sm.cursor-pointer(@click="form.amount = pegToken.amount") Max Available
        .row.q-mt-md
          .h-b2.text-bold.text-black.q-mb-sm Redeem to Address
        wallet-adresses.q-mt-xxs(
          modalState
          :isHypha="daoSettings.isHypha"
          :walletAdresses="walletAddressForm"
          @onSave="saveWalletAddresses"
          v-if="isOwner"
        )
      template(v-else)
        .row.q-mt-sm
          .h-b2.text-bold.text-black.q-mb-sm Redemption Successful!
          .col-9.q-pr-sm
            .flex.full-width(:style="{ 'background': '#F1F1F3', 'border-radius': '15px', 'padding': '12px 15px' }")
              .row.justify-between.h-b2.text-bold.text-black.q-mb-sm.full-width
                div DAO_id
                div {{ selectedDao.docId }}
              .row.justify-between.h-b2.text-bold.text-black.q-mb-sm.full-width
                div Requestor
                div {{ account }}
              .row.justify-between.h-b2.text-bold.text-black.full-width
                div Amount
                div {{ `${formatCurrency(form.amount)} HUSD` }}
          .col-3
            div.flex.items-center.justify-center(:style="{ 'width': '112px', 'height': '112px', 'border-radius': '20px', 'background': '#1CB59B' }")
              q-icon(name="fas fa-check" color="white" size="60px")
        //- TODO: Find a way to get the last transaction
        //- .row.items-center.justify-end.full-width.q-mt-md
          .h-b2.text-primary.text-bold.text-underline.q-mr-xs See transaction on block explorer
          q-btn(
            size="10px"
            icon="fas fa-eye"
            color="primary"
            unelevated
            round
            @click="openTrx()"
          )
        .row.q-my-xl.text-grey.text-italic.h-b2 As soon as the treasurers will create a multisig transaction and execute this request, you will receive your funds directly on your HUSD address indicated in the previews step
      .row.full-width.q-mt-xl.no-wrap
        .col.q-mr-sm
          q-btn.h-btn1.full-width(
            color="primary"
            outline
            no-caps
            unelevated
            rounded
            :label= "'Close'"
            :loading="submitting"
            @click="showPayoutModal = false"
          )
        .col
          q-btn.h-btn1.full-width(
            v-if="successRedeem"
            :disable="!form.amount"
            color="primary"
            no-caps
            unelevated
            rounded
            :label= "'Make another Redemption'"
            :loading="submitting"
            @click="successRedeem = false"
          )
          q-btn.h-btn1.full-width(
            v-else
            :disable="!form.amount || form.amount <= 0 || form.amount > pegToken.amount"
            color="primary"
            no-caps
            unelevated
            rounded
            :label= "'Redeem HUSD'"
            :loading="submitting"
            @click="onRedeemHusd()"
          )
  .row.justify-center.q-mb-md(v-if="!wallet || wallet.length === 0")
    loading-spinner(v-if="loading" color="primary" size="40px")
    .h-b2(v-else) No wallet found
  q-list.q-mt-md(v-else dense)
    template(v-for="(item, index) in wallet")
      q-item(v-if="item && item.value && !(item.label === 'dSEEDS' || item.label === 'SEEDS')" :key="item.label" :class="index !== wallet.length - 1 ? 'q-mb-sm' : ''").wallet-item
        q-item-section.icon-section(avatar)
          token-logo(size='sm' :type="item.type" :daoLogo="daoLogo" :customIcon="item.icon")
        q-item-section
          q-item-label.h-b2 {{ item.label }}
        q-item-section(side)
          .row
            q-item-label
              .h-b2.text-right.text-bold.value-text {{ getFormatedTokenAmount(item.value) + (item.percentage ? ' (' + item.percentage + '%)' : '') }}
                q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle") {{ getFormatedTokenAmount(item.value, Number.MAX_VALUE) }}
    .row.full-width.justify-end.flex.items-center.q-mt-sm.no-wrap(v-if="wallet.filter(token => (token.label === 'dSEEDS' || token.label === 'SEEDS') && token.value != 0).length")
      div.flex.items-center.justify-center(:style="{ 'height': '1px', 'background': '#84878E', 'opacity': '50%', 'width': '100%' }")
      .h-b2.text-primary.text-bold.text-underline.text-no-wrap.q-ml-sm(@click="showMoreTokens = !showMoreTokens") {{ showMoreTokens ? 'Hide' : 'Show more' }}
    template(v-if="showMoreTokens" v-for="(item, index) in wallet")
      q-item(v-if="item && (item.label === 'dSEEDS' || item.label === 'SEEDS')" :key="item.label" :class="index !== wallet.length - 1 ? 'q-mb-sm' : ''").wallet-item
        q-item-section.icon-section(avatar)
          token-logo(size='sm' :type="item.type" :daoLogo="daoLogo" :customIcon="item.icon")
        q-item-section
          q-item-label.h-b2 {{ item.label }}
        q-item-section(side)
          .row
            q-item-label
              .h-b2.text-right.text-bold.value-text {{ getFormatedTokenAmount(item.value) + (item.percentage ? ' (' + item.percentage + '%)' : '') }}
                q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle") {{ getFormatedTokenAmount(item.value, Number.MAX_VALUE) }}
  div.flex.items-center.full-width.q-mt-md(v-if="isOwner && redemptions.length" :style="{ 'background': '#F1F1F3', 'border-radius': '15px', 'padding': '20px' }")
    .row.full-width.no-wrap.justify-between.items-center.q-mb-xxs
      .h-b2.text-bold.text-black Pending redemptions
      q-icon(name="fas fa-hourglass-half" size="12px" color="black")
    template(v-for="redemption in redemptions")
      .row.full-width.q-mt-xs.justify-between.cursor-pointer.items-center
        .h-b2 {{ dateToStringShort(redemption.date) }}
        .h-b2.text-primary.text-bold.text-underline(@click="showDetailsModal = true, currentDetailsObject = redemption") Details
  .row.q-pt-xxs.q-mt-md(v-if="canRedeem && isOwner")
    q-btn.h-btn1.full-width(
      color="primary"
      no-caps
      unelevated
      rounded
      :label= "'Redeem '"
      @click="showPayoutModal = true"
    )
      q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle") Queue HUSD Redemption for Treasury Payout to Configured Wallet
    //- .redeem-section.q-pt-xs(v-if="canRedeem")
      //- TODO: do we need it?
      .row.q-pt-xxsq-btn.h-btn1.full-width(
          v-if="false"
          color="secondary"
          no-caps
          unelevated
          rounded
          label= "Convert to Seeds"
          :loading="submitting"
          @click="onBuySeeds()"
        )
        q-btn.h-btn1.full-width.q-mt-xs(
          v-if="true"
          color="secondary"
          no-caps
          unelevated
          rounded
          :loading="submitting"
          @click="onBuyHypha()"
          label="Convert to Hypha"
        )
          q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle") Immediate Exchange HUSD for HYPHA tokens in costak.hypha
</template>

<style lang="stylus" scoped>
.wallet-item
  padding 0 !important

.value-text
  color: $heading

.icon-section
  min-width: 42px

</style>
