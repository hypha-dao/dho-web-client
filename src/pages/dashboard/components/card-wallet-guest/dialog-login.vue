<script>
import { mapActions } from 'vuex'
import { validation } from '~/mixins/validation'

export default {
  name: 'dialog-login',
  mixins: [validation],
  props: {
    show: { type: Boolean, required: true }
  },
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
    async onSubmit () {
      if (!this.validate(this.form)) return
      this.submitting = true
      const { accountName, privateKey } = this.form
      const success = await this.openWallet({ accountName, privateKey })
      this.submitting = false
      if (success) {
        this.$emit('close')
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
          @click="$emit('close')"
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
