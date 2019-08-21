<template>
<div>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-white text-black">
      <q-toolbar>
        <q-toolbar-title class="q-ml-md q-mt-sm">
          <div>
            <img src="~assets/hyphalogo.jpg" width="200px;">
          </div>
        </q-toolbar-title>

        <div class="q-gutter-sm">
          <q-btn color="primary" label="SLACK" flat icon="img:https://img.icons8.com/ultraviolet/40/000000/slack.png" @click="open('slack')" />
          <q-btn color="primary" label="TELEGRAM" flat icon="img:https://img.icons8.com/dusk/32/000000/telegram-app.png" @click="open('telegram')" />
          <q-btn color="primary" label="TELOS" flat icon="img:https://img.icons8.com/dusk/32/000000/info.png" @click="open('more')" />
        </div>
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/dashboard" label="Dashboard" />
        <q-route-tab to="/members" label="Members" />
        <q-route-tab to="/roles" label="Roles" />
        <q-route-tab to="/proposals" label="Proposals" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <q-banner v-if="isTransactionSending" inline-actions rounded class="bg-primary text-white q-ma-md">
        <div class="text-subtitle2">{{ lastTransactionName }} processing, please wait</div>
        <template v-slot:avatar>
          <img
            src="~assets/loader.gif"
          >
        </template>
      </q-banner>
      <q-banner v-if="!isTransactionSending && lastTransactionHash" inline-actions rounded class="bg-positive text-white q-ma-md">
        <div class="text-subtitle2">{{ lastTransactionName }} broadcasted: {{ lastTransactionHash }}</div>
        <template v-slot:avatar>
          <img
            src="~assets/loader-static.png"
          >
        </template>
      </q-banner>
      <q-banner v-if="!isTransactionSending && lastTransactionError" inline-actions rounded class="bg-negative text-white q-ma-md">
        <div class="text-subtitle2">{{ lastTransactionName }} failed with {{ lastTransactionError }}</div>
        <template v-slot:avatar>
          <img
            src="~assets/loader-static.png"
          >
        </template>
      </q-banner>
      <router-view />
    </q-page-container>
  </q-layout>
</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  methods: {
    open (type) {
      switch (type) {
        case 'slack':
          window.open('https://join.slack.com/t/hypha-seeds/shared_invite/enQtMzIzNTAzNDc3OTM3LTFmZjlkYTI3NTQ4NWZmZTcwZDdlYzYwZTNkM2JkMzU4NDJmMmNjZTRlYzk4NjlhNzJkODUyOGI0MjUwZWMzMjg', '_blank')
          break
        case 'telegram':
          window.open('https://t.me/seedscommunity', '_blank')
          break
        case 'more':
          window.open('https://telos.eosx.io/account/hyphadaomain', '_blank')
          break
      }
    }
  },
  computed: {
    ...mapState({
      accountName: state => state.wallet.accountName,
      lastTransactionHash: state => state.wallet.lastTransactionHash,
      lastTransactionName: state => state.wallet.lastTransactionMessage,
      lastTransactionError: state => state.wallet.lastTransactionError,
      isTransactionSending: state => state.wallet.isTransactionSending
    })
  },
  mounted () {
    const privateKey = this.$q.localStorage.getItem('privateKey')
    const accountName = this.$q.localStorage.getItem('accountName')

    if (privateKey && accountName) {
      this.$store.dispatch('wallet/connectWallet', { privateKey, accountName })
    } else {
      this.$store.dispatch('wallet/connectWallet')
    }
  },
  watch: {
    accountName (val) {
      if (val && val.length > 0) {
        this.$q.notify({ color: 'positive', message: `Welcome back, ${val}!`, duration: 3700 })
      } else {
        this.$q.notify({ color: 'positive', message: `Local storage cleaned up`, duration: 3700 })
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
