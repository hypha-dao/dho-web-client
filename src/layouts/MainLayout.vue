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

        <div v-if="!state.accountInfo && !mobileWallet">
          <q-btn label="Login" @click="connectWallet('scatter')" />
        </div>
        <div v-else>
          <q-btn @click="logout" :disabled="mobileWallet" :label="wallet.accountInfo.account_name" no-caps />
        </div>

      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/roles" label="Roles" />
        <q-route-tab to="/members" label="Members" />
        <q-route-tab to="/assignments" label="Assignments" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import { initAccessContext } from 'eos-transit'
import scatter from 'eos-transit-scatter-provider'
import lynx from 'eos-transit-lynx-provider'
import tp from 'eos-transit-tokenpocket-provider'
import meetone from 'eos-transit-meetone-provider'

export default {
  data () {
    return {
      // drawer: true,
      // menuList,
      // approveraccounts: approvers.accounts,
      // left: true,
      mobileWallet: false,
      accountsModal: false,
      // finishedVoting: false,
      message: {},
      accessContext: null,
      wallet: null,
      state: {},
      walletId: 'scatter',
      discoveryData: []
    }
  },
  mounted () {
    // if client is using mobile wallet
    if (navigator.userAgent.toLowerCase().includes('eoslynx')) {
      this.mobileWallet = true
      this.walletId = 'EOS Lynx'
      // if lynxMobile is already loaded, initialize transit
      if (window.lynxMobile) {
        this.initTransit()
      } else { // otherwise wait for lynxMobile to load first
        window.addEventListener('lynxMobileLoaded', () => this.initTransit())
      }
    } else if (navigator.userAgent.toLowerCase().includes('tokenpocket')) {
      this.mobileWallet = true
      this.walletId = 'TokenPocket'
      // if TokenPocket is already loaded, initialize transit
      if (window.scatter) {
        this.initTransit()
      } else { // otherwise wait 1s for TokenPocket to load}
        window.addEventListener('scatterLoaded', () => this.initTransit())
      }
    } else if (navigator.userAgent.toLowerCase().includes('meet.one')) {
      this.mobileWallet = true
      this.walletId = 'meetone_provider'
      // if Meet.One is already loaded, initialize transit
      if (window.scatter) this.initTransit()
      // otherwise wait for Meet.One to load
      else window.addEventListener('scatterLoaded', () => this.initTransit())
    } else {
      this.initTransit()
    }
  },

  computed: {
    // reactive accounts list of all discovered public keys
    accounts () {
      var list = []
      if (this.discoveryData.keyToAccountMap) {
        for (var key of this.discoveryData.keyToAccountMap) {
          if (key.accounts && key.accounts[0]) {
            list.push(key)
          }
        }
      }
      return list
    },
    progress () { return this.state.connecting || this.state.authenticating || this.state.fetchingAccount || false },
    voting () {
      if (this.state.accountInfo.voter_info && (this.state.accountInfo.voter_info.proxy.length > 0 || this.state.accountInfo.voter_info.producers.length > 0)) {
        return true
      } else return false
    },
    ...mapGetters({
      // wallet: 'getWallet',
      sending: 'getSending',
      result: 'getLastResult'
    })
  },

  methods: {
    initTransit () {
      var options = {
        appName: 'transit-vue-test',
        network: {
          blockchain: 'eos',
          protocol: 'http',
          host: 'testnet.telosusa.io',
          // port: 443,
          chainId: 'e17615decaecd202a365f4c029f206eee98511979de8a5756317e2469f2289e3'
          // blockchain: 'eos',
          // protocol: 'https',
          // host: 'public.eosinfra.io',
          // port: 443,
          // chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
        }
      }
      // set desired wallet providers
      if (this.mobileWallet) options.walletProviders = [lynx(), tp(), meetone()]
      else options.walletProviders = [scatter()]

      // initialize Transit with the options object
      this.accessContext = initAccessContext(options)
      // Auto connect and login if user is on a mobile wallet
      if (this.mobileWallet) {
        this.connectWallet(this.walletId)
      } else if (localStorage.autoLogin) this.connectWallet(localStorage.autoLogin)
      // auto login to last wallet if user never logged out
    },
    async discoverMore (n) {
      for (var i = 1; i < n; i++) { this.discoveryData = await this.wallet.discover({ pathIndexList: [i] }) }
    },
    connectWallet (walletId) {
      this.walletId = walletId

      // initialize Transit wallet instance with your desired signature provider
      this.wallet = this.accessContext.initWallet(this.accessContext.getWalletProviders().find(r => { return r.id === walletId }))

      // Subscrible to Transit wallet changes and bind it to a vue variable
      // eslint-disable-next-line no-return-assign
      this.wallet.subscribe(walletState => this.state = walletState)

      this.startLogin(walletId)
    },
    async startLogin () {
      // Connect to wallet provider
      await this.wallet.connect()

      try {
        // start public key discovery for first index
        this.discoveryData = await this.wallet.discover({ pathIndexList: [0] })

        // if wallet does not provide public keys (eg. scatter), proceed to login
        if (this.discoveryData.keyToAccountMap.length === 0) {
          await this.wallet.login()
        } else {
          // if wallet provides one or more public keys (eg. ledger), allow user to choose desired account
          this.accountsModal = true
          this.message.connecting.close()
          this.message.authenticating = this.$q.notify({
            title: 'Authenticating', message: `Choose account on ${this.walletId}`, timeout: 0
          })
          // start async discovery on additional indices
          this.discoverMore(10)
        }
      } catch (ex) {
        this.message.connecting.close()
      }
    },
    async accountLogin (index = 0, accountIndex = 0) {
      var keyObj = this.discoveryData.keyToAccountMap[index]
      await this.wallet.login(keyObj.accounts[accountIndex].account, keyObj.accounts[accountIndex].authorization)
      this.message.authenticating.close()
    },
    async logout () {
      this.message.logout = this.$q.notify({ message: 'Logging out', timeout: 2500 })
      localStorage.removeItem('autoLogin')
      await this.wallet.terminate()
      this.message.logout.close()
      this.message.logout = this.$notify.success({
        title: 'You have logged out successfully', duration: 3000
      })
    }
  },
  watch: {
    state (val) {
      // watching state variable to provide custom notifications to user
      // if (!val.connecting && this.message.connecting && this.walletId !== 'ledger') { this.message.connecting.close() }
      // if (this.message.authenticating) { this.message.authenticating.close() }
      if (val.connecting) { this.message.connecting = this.$q.notify({ message: `Connecting to ${this.walletId}` }) } else if (val.authenticating) { this.message.authenticating = this.$q.notify({ message: `Logging in to ${this.walletId}` }) } else if (val.authenticationError) { this.$q.notify({ message: val.authenticationErrorMessage, duration: 5000 }) } else if (val.connectionError) { this.$q.notify({ message: val.connectionErrorMessage }) } else if (val.accountInfo) {
        // if (this.message.accountInfo) this.message.accountInfo.close()
        this.message.accountInfo = this.$q.notify({ message: `Logged in successfully as ${val.accountInfo.account_name}`, timeout: 3000 })
        this.accountsModal = false
        localStorage.autoLogin = this.walletId
        this.$store.dispatch('setWallet', {
          wallet: this.wallet
        })
        this.$store.dispatch('init')
      }
    }
  }
}
</script>

<style>
</style>
