<template>
<div>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-avatar>
          <img src="~assets/hyphalogo.jpg">
        </q-avatar>

        <q-toolbar-title>
          Hypha DAO
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/dashboard" label="Dashboard" />
        <q-route-tab to="/members" label="Members" />
        <q-route-tab to="/roles" label="Roles" />
        <q-route-tab to="/proposals" label="Proposals" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      accountName: state => state.wallet.accountName,
      lastTransactionHash: state => state.wallet.lastTransactionHash,
      lastTransactionName: state => state.wallet.lastTransactionMessage,
      lastTransactionError: state => state.wallet.lastTransactionError
    })
  },
  mounted () {
    const privateKey = this.$q.localStorage.getItem('privateKey')
    const accountName = this.$q.localStorage.getItem('accountName')

    if (privateKey && accountName) {
      this.$store.dispatch('wallet/connect', { privateKey, accountName })
    } else {
      this.$store.dispatch('wallet/connect')
    }
  },
  watch: {
    accountName (val) {
      if (val.length > 0) {
        this.$q.notify({ color: 'positive', message: `Welcome back, ${val}!`, duration: 3700 })
      }
    },
    lastTransactionHash (val) {
      console.log('transaction hash', val)
      this.$q.notify({ color: 'positive', icon: 'done', message: `Transaction broadcasted: ${val}`, duration: 7000 })
    },
    lastTransactionName (val) {
      console.log('transaction request: ', val)
      this.$q.notify({ color: 'positive', message: `Signing transaction: ${val}`, duration: 4000 })
    },
    lastTransactionError (val) {
      console.error('transaction error: ', val)
      this.$q.notify({ color: 'negative', message: `Transaction error: ${val}`, duration: 8000 })
    },
    lastCatchedError (val) {
      console.error('catched error: ', val)
      this.$q.notify({ color: 'negative', message: `Catched error: ${val}`, duration: 8000 })
    }
  }
}
</script>

<style>
  .modal {
    align-items: center;
    justify-content: center;
    display: flex;
    flex-wrap: wrap;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 6000;
    border-radius: 0 !important;
    max-width: 100vw;
    max-height: 100vh;
  }
</style>
