<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-avatar>
          <img src="~assets/hyphalogo.jpg">
        </q-avatar>

        <q-toolbar-title>
          Hypha DAC
        </q-toolbar-title>

        <div v-if="!walletState && !mobileWallet">
          <q-btn label="Login" @click="connectWallet('scatter')" />
        </div>
        <div v-else>
          <q-btn @click="logout" :disabled="mobileWallet" :label="accountName" no-caps />
        </div>

      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/members" label="Members" />
        <q-route-tab to="/roles" label="Roles" />
        <q-route-tab to="/assignments" label="Assignments" />
        <q-route-tab to="/payouts" label="Payouts" />
      </q-tabs>

    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { mapState } from 'vuex'
import wallet from '../wallet'

export default {
  data () {
    return {
      mobileWallet: false,
      walletId: null,
      walletState: null
    }
  },
  mounted () {
    const userAgent = navigator.userAgent.toLowerCase()

    switch (true) {
      case userAgent.includes('eoslynx') :
        this.walletId = 'EOS Lynx'
        break

      case userAgent.includes('tokenpocket') :
        this.walletId = 'TokenPocket'
        break

      case userAgent.includes('meet.one') :
        this.walletId = 'meetone_provider'
        break

      default:
        this.walletId = 'scatter'
    }

    if (this.walletId !== 'scatter') {
      this.mobileWallet = true
    }

    this.connectWallet(this.walletId)
  },
  computed: {
    accountName () {
      return this.walletState && this.walletState.accountInfo ? this.walletState.accountInfo.account_name : ''
    },
    ...mapState({
      lastTransactionHash: state => state.wallet.lastTransactionHash,
      lastTransactionName: state => state.wallet.lastTransactionMessage,
      lastTransactionError: state => state.wallet.lastTransactionError
    })
  },
  methods: {
    async connectWallet (walletId) {
      const subscribeCallback = (walletState) => {
        this.walletState = walletState
        // this.$store.dispatch('wallet/update', walletState)
      }

      await wallet.connect(walletId, subscribeCallback)

      this.$store.dispatch('wallet/login')

      this.$q.notify({ message: `Logged in successfully as ${this.walletState.accountInfo.account_name}`, timeout: 3000 })
    },
    async logout () {
      this.$q.notify({ message: 'Logging out', timeout: 2500 })

      await wallet.terminate()

      this.$store.dispatch('wallet/logout')

      this.walletState = null

      this.q.notify({
        message: 'You have logged out successfully', duration: 3000
      })
    }
  },
  watch: {
    walletState (val) {
      if (val.connecting) {
        this.$q.notify({ message: `Connecting to ${this.walletId}` })
      } else if (val.authenticating) {
        this.$q.notify({ message: `Logging in to ${this.walletId}` })
      } else if (val.authenticationError) {
        this.$q.notify({ message: val.authenticationErrorMessage, duration: 5000 })
      } else if (val.connectionError) {
        this.$q.notify({ message: val.connectionErrorMessage })
      }
    },
    lastTransactionHash (val) {
      console.log('transaction hash', val)
      this.$q.notify({ message: `Transaction broadcasted: ${val}`, duration: 7000 })
    },
    lastTransactionName (val) {
      console.log('transaction request: ', val)
      this.$q.notify({ message: `Sign transaction: ${val}`, duration: 4000 })
    },
    lastTransactionError (val) {
      console.error('transaction error: ', val)
      this.$q.notify({ message: `Transaction error: ${val}`, duration: 8000 })
    }
  }
}
</script>

<style>
</style>
