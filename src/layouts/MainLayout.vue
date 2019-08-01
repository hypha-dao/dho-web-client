  <template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-avatar>
          <img src="~assets/hyphalogo.jpg">
        </q-avatar>

        <q-toolbar-title>
          Hypha DAO
        </q-toolbar-title>

        <div v-if="!walletState">
          <q-btn label="Login with Keycat" @click="connectWallet()" />
        </div>
        <div v-else>
          <q-btn @click="logout" :label="accountName || 'Authenticating...'" no-caps />
        </div>
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/getting-started" label="Getting started" />
        <q-route-tab to="/dashboard" label="Your Dashboard" />
        <q-route-tab to="/users" label="Team Summary" />
        <q-route-tab to="/roles" label="Roles" />
        <q-route-tab to="/assignments" label="Role Assignments" />
        <q-route-tab to="/payouts" label="Contributions" />
      </q-tabs>

    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-dialog>

    </q-dialog>

  </q-layout>
</template>

<script>
import { mapState } from 'vuex'
import wallet from '../wallet'

export default {
  data () {
    return {
      walletId: null,
      walletState: null
    }
  },
  computed: {
    accountName () {
      if (this.walletState && this.walletState.accountInfo && this.walletState.accountInfo.account_name) {
        return this.walletState.accountInfo.account_name
      } else {
        return null
      }
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

      this.walletId = 'Keycat'

      await wallet.connect('Keycat', subscribeCallback)

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
