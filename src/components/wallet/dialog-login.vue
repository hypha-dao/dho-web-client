<script>
import { mapActions, mapMutations } from 'vuex'
import { validation } from '~/mixins/validation'

export default {
  name: 'dialog-login',
  mixins: [validation],
  data () {
    return {
      form: {
        accountName: null,
        privateKey: null
      },
      submitting: false
    }
  },
  methods: {
    ...mapActions('wallet', ['openWallet']),
    ...mapMutations('wallet', ['setShowLogin']),
    async onSubmit () {
      this.resetValidation(this.form)
      if (!(await this.validate(this.form))) return
      this.submitting = true
      const { accountName, privateKey } = this.form
      const success = await this.openWallet({ accountName, privateKey })
      this.submitting = false
      if (success) {
        this.setShowLogin(false)
      }
    }
  },
  computed: {
    show: {
      get () {
        return this.$store.state.wallet.showLogin
      },
      set (value) {
        this.setShowLogin(value)
      }
    }
  }
}
</script>

<template lang="pug">
  q-dialog(
    v-model="show"
    persistent
    no-backdrop-dismiss
  )
    q-card.login-card
      q-card-section
        q-input(
          ref="accountName"
          v-model="form.accountName"
          label="Account name"
          maxlength="12"
          :rules="[rules.required, rules.accountFormat, rules.accountLength]"
          lazy-rules
          hint="12 symbols [a-z12345.]"
          dense
          autofocus
        )
        q-input(
          ref="privateKey"
          v-model="form.privateKey"
          label="Private key"
          :rules="[rules.required]"
          lazy-rules
          dense
        )
      q-card-actions(align="right")
        q-btn(
          label="Cancel"
          @click="setShowLogin(false)"
          flat
        )
        q-btn(
          label="Login"
          @click="onSubmit"
          :loading="submitting"
          color="primary"
        )
</template>

<style lang="stylus" scoped>
.login-card
  min-width 400px
</style>
