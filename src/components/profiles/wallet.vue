<script>
import { mapActions, mapGetters } from 'vuex'

/**
 * Wallet fetching and data packaging
 * This element uses the provided username to retrieve their wallet details
 * Rendering is done by the wallet-base pure component (for testing)
 */
export default {
  name: 'wallet',
  components: {
    WalletBase: () => import('./wallet-base.vue')
  },

  props: {
    more: Boolean,
    username: String
  },

  data () {
    return {
      canRedeem: false,
      loading: true,
      supply: 0,
      wallet: []
    }
  },

  computed: {
    ...mapGetters('accounts', ['account']),

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
    ...mapActions('payments', ['redeemAddress']),
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

    async fetchTokens () {
      try {
        this.wallet = []
        this.supply = parseFloat(await this.getSupply())
        if (this.username) {
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
              percentage: this.supply ? this.calcPercentage(parseFloat(tokens.hvoice)) : false
            },
            {
              label: 'HUSD',
              icon: 'husd.svg',
              value: parseFloat(tokens.husd),
              redeem: this.isOwner
            }
          ]
        }
        if (this.isOwner) {
          const defaultRedeemAddr = await this.redeemAddress()

          // Only EOS redemptions are allowed for now
          this.canRedeem = defaultRedeemAddr === 'eosaccount'
        }
      } finally {
        this.loading = false
      }
    },

    onBuySeeds () {
      this.fetchTokens()
      this.$emit('buy-seeds')
    },

    onRedeemHusd () {
      this.fetchTokens()
      this.$emit('redeem-husd')
    }
  }
}
</script>

<template lang="pug">
wallet-base(
  v-bind="{ canRedeem, loading, more, username, wallet }"
  @buy-seeds="onBuySeeds"
  @redeem-husd="onRedeemHusd"
  @set-redeem="$emit('set-redeem')"
)
</template>
