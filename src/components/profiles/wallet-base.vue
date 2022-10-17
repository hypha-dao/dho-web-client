<script>
import { mapActions } from 'vuex'
import { validation } from '~/mixins/validation'
import { format } from '~/mixins/format'

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
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue')

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
      redeem: false,
      submitting: false
    }
  },

  computed: {
    icon () {
      return this.redeem ? 'fas fa-minus-circle' : 'fas fa-plus-circle'
    }
  },

  methods: {
    ...mapActions('payments', ['redeemToken', 'buySeeds', 'buyHypha']),

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
        } finally {
          this.resetForm()
        }
        this.$emit('buy-hypha', this.form.amount)
      }
    },

    onSetRedemptionAddr () {
      this.resetForm()
      this.$emit('set-redeem')
    }
  }
}
</script>

<template lang="pug">
widget.wallet-base(:more="more" :no-title="noTitle" morePosition="top" title="Wallet" @more-clicked="$router.push({ path: `/${$route.params.dhoname}/wallet` })")
  .row.justify-center(v-if="!wallet || wallet.length === 0")
    loading-spinner(v-if="loading" color="primary" size="40px")
    .h-b2(v-else) No wallet found
  q-list(v-else dense)
    template(v-for="(item, index) in wallet")
      q-item(v-if="item" :key="item.label" :class="index !== wallet.length - 1 ? 'q-mb-sm' : ''").wallet-item
        q-item-section.icon-section(avatar)
          token-logo(size='sm' :type="item.type" :daoLogo="daoLogo" :customIcon="item.icon")
        q-item-section
          q-item-label.h-b2 {{ item.label }}
        q-item-section(side)
          .row
            q-item-label
              .h-b2.text-right.text-bold.value-text {{ getFormatedTokenAmount(item.value) + (item.percentage ? ' (' + item.percentage + '%)' : '') }}
                q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle") {{ getFormatedTokenAmount(item.value, Number.MAX_VALUE) }}
    .redeem-section.q-pt-xs(v-if="canRedeem")
      .row-md.justify-center
        q-input.full-width.rounded-border(
          :rules="[rules.greaterThan(0), rules.lessOrEqualThan(pegToken.amount)]"
          dense
          min="1"
          outlined
          placeholder="HUSD"
          ref="amount"
          type="number"
          v-model.number="form.amount"
        )
      .row.q-pt-xxs
        q-btn.h-btn1.full-width(
          color="primary"
          no-caps
          unelevated
          rounded
          :label= "'Redeem ' + pegToken.token"
          :loading="submitting"
          @click="onRedeemHusd()"
        )
          q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle") Queue HUSD Redemption for Treasury Payout to Configured Wallet
        q-btn.h-btn1.full-width(
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
