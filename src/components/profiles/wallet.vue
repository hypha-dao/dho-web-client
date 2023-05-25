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
    noTitle: Boolean,
    username: String
  },

  data () {
    return {
      canRedeem: true,
      loading: true,
      pegToken: undefined,
      supply: 0,
      usingSeeds: undefined,
      wallet: []
    }
  },

  computed: {
    ...mapGetters('accounts', ['account']),
    ...mapGetters('dao', ['daoSettings']),

    isOwner () { return this.username === this.account }
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
          this.pegToken = tokens.peg
          this.usingSeeds = tokens.seeds !== undefined
          for (const key in tokens) {
            const element = tokens[key]
            this.wallet.push({
              label: element.token,
              icon: key === 'seeds' || key === 'dseeds' ? require('~/assets/icons/seeds.png') : undefined,
              type: (key === 'peg' ? 'cash' : (key === 'voice' ? 'voice' : (key === 'reward' ? 'utility' : undefined))),
              value: parseFloat(element.amount),
              percentage: key === 'voice' ? this.calcPercentage(parseFloat(element.amount)) : false,
              redeem: key === 'peg' && this.isOwner
            })
          }
        }
        // Quick fix, Switch toklen positions, this could be done better later
        if (this.usingSeeds) {
          const temp = this.wallet[2]
          this.wallet[2] = this.wallet[3]
          this.wallet[3] = temp
        } else {
          const temp = this.wallet[0]
          this.wallet[0] = this.wallet[1]
          this.wallet[1] = temp
        }

        if (this.isOwner && this.daoSettings.isHypha) { // TODO: Remove is hypha when treasury gets implemented
          // const defaultRedeemAddr = await this.redeemAddress()

          // Only EOS redemptions are allowed for now
          // this.canRedeem = defaultRedeemAddr === 'eosaccount'
        }
      } finally {
        this.loading = false
      }
    },

    onBuySeeds () {
      this.fetchTokens()
      this.$emit('buy-seeds')
    },

    onBuyHypha () {
      this.fetchTokens()
      this.$emit('buy-hypha')
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
  :daoLogo="daoSettings.logo"
  @buy-seeds="onBuySeeds"
  @buy-hypha="onBuyHypha"
  @redeem-husd="onRedeemHusd"
  @set-redeem="$emit('set-redeem')"
  v-bind="{ canRedeem, loading, more, username, wallet, pegToken, usingSeeds, noTitle }"
)
</template>
