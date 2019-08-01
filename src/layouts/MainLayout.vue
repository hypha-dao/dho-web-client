<template>
<div>
  <q-dialog class="modal" v-model="loginForm.open" persistent no-backdrop-dismiss>
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">Account Name</div>
      </q-card-section>

      <q-card-section>
        <q-input dense v-model="loginForm.accountName" autofocus />
      </q-card-section>

      <q-card-section>
        <div class="text-h6">Private Key</div>
      </q-card-section>

      <q-card-section>
        <q-input dense v-model="loginForm.privateKey" autofocus />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-item>
          <q-item-section>
            <q-btn flat label="Cancel" @click="loginForm.open = false" />
          </q-item-section>
          <q-item-section>
            <q-btn flat label="Save account" @click="login(); loginForm.open = false" />
          </q-item-section>
        </q-item>
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog class="modal" v-model="registerForm.open" persistent no-backdrop-dismiss>
    <q-stepper v-model="registerForm.step" horizontal color="primary" animated :contracted="$q.screen.lt.md">
      <q-step name="chooseAccountName" title="1. Choose account name">
        <q-input
          maxlength="12"
          :rules="[
            val => !/[^a-z1-5]/.test(val) || '12 symbols (a-z and only 1-5)',
            val => val.length === 12 || '12 symbols (a-z and only 1-5)'
          ]"
          v-model="registerForm.accountName" type="text" label="Account name" hint="12 symbols [a-z12345.]">
          </q-input>

        <q-stepper-navigation>
          <q-btn @click="registerForm.step = 'generateKeys'" color="primary" label="Continue" />
        </q-stepper-navigation>
      </q-step>

      <q-step name="generateKeys" title="2. Generate keys" id="privateKey">
        <div class="text-h6">
          Save your keys before you can create account
          There are your keys, ensure to save it and then continue
        </div>

        <q-input v-model="registerForm.privateKey" color="primary" readonly hint="Private Key">
          <template v-slot:before>
            <q-btn round color="primary" icon="file_copy" v-clipboard:copy="registerForm.privateKey" />
          </template>
        </q-input>
        <q-input v-model="registerForm.publicKey" color="primary" readonly hint="Public Key">
          <template v-slot:before>
            <q-btn round color="primary" icon="file_copy" v-clipboard:copy="registerForm.publicKey" />
          </template>
        </q-input>

        <q-stepper-navigation>
          <q-btn @click="registerForm.step = 'createAccount'" label="Continue" />
        </q-stepper-navigation>
      </q-step>

      <q-step name="createAccount" title="3. Create account">
        <div class="text-subtitle2">
          Congratulations! Welcome to Hypha DAO, {{ registerForm.accountName }}!
        </div>

        <q-stepper-navigation>
          <q-btn @click="register()" label="Done" color="primary" />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>

  </q-dialog>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-avatar>
          <img src="~assets/hyphalogo.jpg">
        </q-avatar>

        <q-toolbar-title>
          Hypha DAO
        </q-toolbar-title>

        <q-btn v-if="!accountName" label="Register" @click="registerForm.open = true " />
        <q-btn v-if="!accountName" label="Login" @click="loginForm.open = true" />
        <q-btn v-if="accountName" :label="accountName" disabled />
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/dashboard" label="Your Dashboard" />
        <q-route-tab to="/team" label="Team Summary" />
        <q-route-tab to="/proposals" label="Current Proposals" />
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
import wallet from '../wallet'

export default {
  data () {
    return {
      loginForm: {
        open: false,
        privateKey: '',
        accountName: ''
      },
      registerForm: {
        open: false,
        step: 'chooseAccountName',
        privateKey: '5KgtSt476rUprrvJ2uC1nkJJwQc4pMJY3VMEPGefq6i92WbKiyw',
        publicKey: 'TLOS5jsYDSiYt3WHbTUL8bELK3LXJAnfSaxs9sJmyJw7Tmo5pNbkBG',
        accountName: ''
      }
    }
  },
  computed: {
    ...mapState({
      accountName: state => state.wallet.accountName,
      lastTransactionHash: state => state.wallet.lastTransactionHash,
      lastTransactionName: state => state.wallet.lastTransactionMessage,
      lastTransactionError: state => state.wallet.lastTransactionError
    })
  },
  methods: {
    async login () {
      const { accountName, privateKey } = this.loginForm

      try {
        await wallet.login({ accountName, privateKey })

        this.$store.dispatch('wallet/login')

        this.$q.notify({ message: `Welcome back, ${accountName}!`, duration: 3700 })
      } catch (err) {
        this.$q.notify({ message: err, duration: 30000 })
        console.error('authorization error', err)
      }
    },
    async register () {
      const { accountName, privateKey } = this.registerForm

      try {
        await wallet.createAccount({ accountName, privateKey })

        this.$q.notify({ message: `Account created: ${accountName}`, duration: 8200 })

        await wallet.login({ accountName, privateKey })

        this.$q.notify({ message: `Welcome to Hypha, ${accountName}!` })

        this.$store.dispatch('wallet/login')
      } catch (err) {
        this.$q.notify({ message: err, duration: 30000 })
        console.error('register error', err)
      }
    }
  },
  watch: {
    lastTransactionHash (val) {
      console.log('transaction hash', val)
      this.$q.notify({ message: `Transaction broadcasted: ${val}`, duration: 7000 })
    },
    lastTransactionName (val) {
      console.log('transaction request: ', val)
      this.$q.notify({ message: `Signing transaction: ${val}`, duration: 4000 })
    },
    lastTransactionError (val) {
      console.error('transaction error: ', val)
      this.$q.notify({ message: `Transaction error: ${val}`, duration: 8000 })
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
