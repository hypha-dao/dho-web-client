<script>
import { mapActions } from 'vuex'
import { validation } from '~/mixins/validation'

/**
 * Wallet base component that is responsible for rendering wallet items, triggering redemption actions
 * This is a pure component whose state is entirely determined by props and does not query the backend
 */
export default {
  name: 'wallet-base',
  mixins: [validation],
  components: {
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    canRedeem: Boolean,
    closeDelay: {
      type: Number,
      default: 1000
    },
    loading: Boolean,
    more: Boolean,
    username: String,
    wallet: Array
  },

  data () {
    return {
      form: {
        amount: 0
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
    ...mapActions('payments', ['redeemToken', 'buySeeds']),

    imageUrl (icon) {
      return require('~/assets/icons/' + icon)
    },

    shortNumber (value) {
      if (value < 10000) return value.toFixed(2)
      if (value < 1e6) return +(value / 1e3).toFixed(1) + 'k'
      if (value < 1e9) return +(value / 1e6).toFixed(1) + 'm'
      if (value < 1e12) return +(value / 1e9).toFixed(1) + 'b'
      return +(value / 1e12).toFixed(1) + 't'
    },

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

    onSetRedemptionAddr () {
      // TODO: Show right form for profile edit
      this.resetForm()
    }
  }
}
</script>

<template lang="pug">
widget.wallet-base(:more="more" noPadding title="Wallet" @more-clicked="$router.push({ path: '/wallet' })")
  .row.justify-center.q-py-lg(v-if="!wallet || wallet.length === 0")
    q-spinner-dots(v-if="loading" color="primary" size="40px")
    .text-body2(v-else) No wallet found
  q-list.q-mx-md(v-else)
    template(v-for="(item, index) in wallet")
      q-item(:key="item.label").wallet-item
        q-item-section(avatar)
          q-avatar(size="md")
            img(:src="imageUrl(item.icon)")
        q-item-section
          q-item-label.text-body1 {{ item.label }}
        q-item-section(side)
          .row.items-center
            q-item-label
              .text-body1.text-right {{ shortNumber(item.value) }}
                q-tooltip(
                  anchor="top middle"
                  self="center middle"
                ) {{ new Intl.NumberFormat().format(item.value) }}
              .text-caption.text-right(v-if="item.percentage") {{ '(' + item.percentage + '%)'}}
            q-icon.q-pl-xs(v-if="item.redeem && item.value > 0" :name="icon" size="xs" @click="redeem = !redeem")
  transition(name="expand")
    .redeem-section(v-if="redeem")
      .row.q-pa-lg.justify-center
        q-input.col-12(v-if="canRedeem" dense rounded outlined
          bg-color="white" placeholder="Amount" min="0"
          type="number" v-model.number="form.amount" ref="amount"
          :rules="[rules.greaterThan(0), rules.lessOrEqualThan(wallet[4].value)]"
        )
      .row.q-px-lg.q-pb-lg.justify-between.q-gutter-y-md
        q-btn.bg-white.col-12.col-sm-5.col-md-12.q-py-xs(
          v-if="canRedeem"
          outline
          size="sm"
          :loading="submitting"
          @click="onRedeemHusd()"
        ) Redeem HUSD
        q-btn.bg-white.col-12.q-py-xs.q-mb-md(
          v-else
          outline
          size="sm"
          :loading="submitting"
          @click="onSetRedemptionAddr()"
        ) Set redemption address
        q-btn.col-12.col-sm-5.col-md-12.q-py-xs(
          v-if="canRedeem"
          color="primary"
          size="sm"
          :loading="submitting"
          @click="onBuySeeds()"
        ) Buy Seeds
</template>

<style lang="stylus" scoped>
.wallet-base
  .expand-enter-active
  .expand-leave-active
    -webkit-transition max-height 0.5s ease-out
    -moz-transition max-height 0.5s ease-out
    -o-transition max-height 0.5s ease-out
    transition max-height 0.5s ease-out
    overflow hidden
    max-height 200px

  .expand-enter
  .expand-leave-to
    max-height 0

  .wallet-item
    color #728191

  .redeem-section
    background-color rgba(114, 129, 145, 0.25)
</style>
