<script>
import { mapActions, mapGetters } from 'vuex'
import { validation } from '~/mixins/validation'

export default {
  name: 'wallet',
  mixins: [validation],
  components: {
    Widget: () => import('~/components/widget.vue')
  },

  props: {
    more: Boolean,
    username: String
  },

  data () {
    return {
      wallet: Array,
      amount: '',
      canRedeem: false,
      redeem: false,
      form: {
        amount: 0
      },
      loading: true,
      submitting: false,
      supply: 0
    }
  },

  computed: {
    ...mapGetters('accounts', ['account']),

    icon () {
      return this.redeem ? 'fas fa-minus-circle' : 'fas fa-plus-circle'
    },

    isOwner () {
      return this.username === this.account
    }
  },

  created () {
    this.fetchTokens()
  },

  watch: {
    username: 'fetchTokens'
  },

  methods: {
    ...mapActions('ballots', ['getSupply']),
    ...mapActions('payments', ['redeemToken', 'hasRedeemAddress', 'buySeeds']),
    ...mapActions('profiles', ['getTokensAmounts']),

    calcPercentage (hvoice) {
      if (this.supply) {
        const percent = (hvoice / this.supply) * 100
        if (percent < 0.1) {
          return '<0.1'
        }
        return percent.toFixed(1)
      }
      return undefined
    },

    shortNumber (value) {
      if (value < 100000) return value.toFixed(1)
      if (value < 1e6) return +(value / 1e3).toFixed(1) + 'k'
      if (value < 1e9) return +(value / 1e6).toFixed(1) + 'm'
      if (value < 1e12) return +(value / 1e9).toFixed(1) + 'b'
      return +(value / 1e12).toFixed(1) + 't'
    },

    async fetchTokens () {
      this.supply = parseFloat(await this.getSupply())
      const tokens = await this.getTokensAmounts(this.username)
      this.wallet = [
        {
          label: 'dSEEDS',
          icon: 'seeds.png',
          value: parseFloat(tokens.deferredSeeds)
        },
        {
          label: 'Liquid SEEDS',
          icon: 'seeds.png',
          value: parseFloat(tokens.liquidSeeds)
        },
        {
          label: 'HYPHA',
          icon: 'hypha.svg',
          value: parseFloat(tokens.hypha)
        },
        {
          label: 'HVoice',
          icon: 'hvoice.svg',
          value: parseFloat(tokens.hvoice),
          percentage: this.calcPercentage(parseFloat(tokens.hvoice))
        },
        {
          label: 'HUSD',
          icon: 'husd.svg',
          value: parseFloat(tokens.husd),
          redeem: this.isOwner
        }
      ]
      this.canRedeem = await this.hasRedeemAddress()
    },

    async onRedeemToken () {
      await this.resetValidation(this.form)
      if (!(await this.validate(this.form))) return
      this.submitting = true
      const res = await this.redeemToken({ quantity: `${parseFloat(this.form.amount).toFixed(2)} HUSD`, memo: 'redeem' })
      if (res) {
        this.redeem = false
        this.form.amount = 0
        this.resetValidation(this.form)
        await this.fetchTokens()
      }
      this.submitting = false
    },

    async onBuySeeds () {
      await this.resetValidation(this.form)
      if (!(await this.validate(this.form))) return
      this.submitting = true
      const res = await this.buySeeds(`${parseFloat(this.form.amount).toFixed(2)} HUSD`)
      if (res) {
        this.redeem = false
        this.form.amount = 0
        this.resetValidation(this.form)
        await this.fetchTokens()
      }
      this.submitting = false
    },

    getImgUrl (icon) {
      return require('~/assets/icons/' + icon)
    }
  }
}
</script>

<template lang="pug">
Widget(bar :more="more" @more-clicked="$router.push({ path: '/wallet' })" noPadding title="Wallet").wallet
  q-list.q-mx-md
    template(v-for="(item, index) in wallet")
      q-item(:key="item.label").wallet-item
        q-item-section(avatar)
          q-avatar(size="md")
            img(:src="getImgUrl(item.icon)")
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
      .row.justify-center.q-pa-lg
        q-input.col-12(dense rounded outlined bg-color="white" placeholder="Amount"
          type="number" v-model.number="form.amount" min="0"
          :rules="[rules.greaterThan(0), rules.lessOrEqualThan(wallet[4].value)]"
        )
        q-btn.col-12(v-if="canRedeem" outline size="sm" @click="onRedeemToken" :loading="submitting").bg-white Redeem USD
        q-btn.col-12(v-else outline size="sm" :to="`/@${username}`" :loading="submitting").bg-white Set redemption address
        q-btn.col-12.q-mt-sm(color="primary" size="sm" @click="onBuySeeds" :loading="submitting") Buy Seeds
  .q-mb-md(v-if="!more")
</template>

<style lang="stylus" scoped>
.wallet
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

    .input-width
      width 200px
</style>
