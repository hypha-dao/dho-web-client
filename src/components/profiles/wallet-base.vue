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
    wallet: Array,
    pegToken: Object,
    usingSeeds: Boolean
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
    }
  }
}
</script>

<template lang="pug">
widget.wallet-base(:more="more" morePosition="top" title="Wallet" @more-clicked="$router.push({ path: '/wallet' })")
  .row.justify-center(v-if="!wallet || wallet.length === 0")
    q-spinner-dots(v-if="loading" color="primary" size="40px")
    .h-b2(v-else) No wallet found
  q-list.q-pt-lg(v-else dense)
    template(v-for="(item, index) in wallet")
      q-item(:key="item.label").wallet-item.q-mb-sm
        q-item-section.icon-section(avatar)
          q-avatar(size="sm")
            img(:src="imageUrl(item.icon)")
        q-item-section
          q-item-label.h-b2 {{ item.label }}
        q-item-section(side)
          .row
            q-item-label
              .h-b2.text-right.text-bold.value-text {{ shortNumber(item.value) + (item.percentage ? ' (' + item.percentage + '%)' : '') }}
                q-tooltip(
                  anchor="top middle"
                  self="bottom middle"
                  :content-style="{ 'font-size': '1em' }"
                ) {{ new Intl.NumberFormat().format(item.value) }}
    .redeem-section.q-pt-xs(v-if="canRedeem")
      .row-md.justify-center
        q-input.full-width.rounded-border(v-if="canRedeem" dense outlined placeholder="Amount" min="0"
          type="number" v-model.number="form.amount" ref="amount"
          :rules="[rules.greaterThan(0), rules.lessOrEqualThan(pegToken.amount)]"
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
        q-btn.h-btn1.full-width(
          v-if="false"
          color="secondary"
          no-caps
          unelevated
          rounded
          label= "Buy Seeds"
          :loading="submitting"
          @click="onBuySeeds()"
        )
</template>

<style lang="stylus" scoped>
.wallet-item
  padding 0 !important

.value-text
  color: $heading

.icon-section
  min-width: 42px

.rounded-border
  :first-child
    border-radius 15px
</style>
