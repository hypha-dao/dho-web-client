<script>
import { mapActions } from 'vuex'
import { validation } from '~/mixins/validation'
import wallet from '~/wallet'

export default {
  name: 'dialog-register',
  mixins: [validation],
  props: {
    show: { type: Boolean, required: true }
  },
  data () {
    return {
      step: 'account',
      stepIndex: {
        account: 1,
        keys: 2,
        welcome: 3
      },
      form: {
        account: {
          accountName: null,
          inviteCode: null
        },
        keys: {
          privateKey: null,
          publicKey: null,
          privateKeySaved: false,
          publicKeySaved: false
        }
      },
      submitting: false
    }
  },
  methods: {
    ...mapActions('wallet', ['generateKeys', 'validateInviteCode', 'createWallet']),
    async onValidateInviteCode (val) {
      return await this.validateInviteCode(val) || 'The code is invalid'
    },
    requiredCopy: cond => () => !!cond || 'You need to copy your key using the button on the right side',
    async next () {
      this.resetValidation(this.form[this.step])
      if (!(await this.validate(this.form[this.step]))) return
      this.submitting = true
      if (this.step === 'account') {
        await this.onGenerateKeys()
      } else if (this.step === 'keys') {
        const data = {
          ...this.form.account,
          ...this.form.keys
        }
        await this.createWallet(data)
      } else if (this.step === 'welcome') {
        this.$emit('close')
      }
      this.submitting = false
      this.$refs.stepper.next()
    },
    async onGenerateKeys () {
      const { privateKey, publicKey } = await wallet.generateKeys()
      this.form.keys = {
        ...this.form.keys,
        privateKey,
        publicKey
      }
    },
    resetForm () {
      this.resetValidation(this.form.account)
      this.resetValidation(this.form.keys)
      this.step = 'account'
      this.form = {
        account: {
          accountName: null,
          inviteCode: null
        },
        keys: {
          privateKey: null,
          publicKey: null,
          privateKeySaved: false,
          publicKeySaved: false
        }
      }
    }
  },
  watch: {
    show (val) {
      // The form is hidden we reset the data
      if (!val) {
        this.resetForm()
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
    q-card.register-card
      q-stepper(
        ref="stepper"
        v-model="step"
        horizontal
        color="primary"
        animated
        :contracted="$q.screen.lt.sm"
      )
        q-step(
          name="account"
          title="Your Invite"
          :done="stepIndex[step] > 1"
        )
          q-input(
            ref="accountName"
            v-model="form.account.accountName"
            label="Account name"
            maxlength="12"
            :rules="[rules.required, rules.accountFormat, rules.accountLength]"
            lazy-rules
            hint="12 lowercase characters, number from 1 to 5"
            dense
            autofocus
          )
          q-input(
            ref="inviteCode"
            v-model="form.account.inviteCode"
            label="Invite code"
            :rules="[rules.required, onValidateInviteCode]"
            lazy-rules
            dense
          )
        q-step(
          name="keys"
          title="New Account"
          id="privateKey"
          :done="stepIndex[step] > 2"
        )
          .text-h6 Save your keys before continuing

          q-input(
            ref="privateKeySaved"
            v-model="form.keys.privateKey"
            label="Private Key"
            color="primary"
            readonly
            :rules="[requiredCopy(form.keys.privateKeySaved)]"
          )
            template(v-slot:append)
              q-btn(
                round
                color="primary"
                icon="file_copy"
                size="sm"
                v-clipboard:copy="form.keys.privateKey"
                @click="form.keys.privateKeySaved = true"
              )
          q-input(
            ref="publicKeySaved"
            v-model="form.keys.publicKey"
            label="Public Key"
            color="primary"
            readonly
            :rules="[requiredCopy(form.keys.publicKeySaved)]"
          )
            template(v-slot:append)
              q-btn(
                round
                color="primary"
                icon="file_copy"
                size="sm"
                v-clipboard:copy="form.keys.publicKey"
                @click="form.keys.publicKeySaved = true"
              )
        q-step(
          name="welcome"
          title="Welcome"
          :done="stepIndex[step] === 3"
        )
          .text-subtitle2 Congratulations! Welcome to Hypha DAO, {{ form.account.accountName }}
        template(v-slot:navigation)
          q-stepper-navigation(align="right")
            q-btn(
              label="Cancel"
              flat
              @click="$emit('close')"
            )
            q-btn(
              :label="step === 'welcome' ? 'Done' : 'Next'"
              color="secondary"
              @click="next"
              :loading="submitting"
            )
</template>

<style lang="stylus" scoped>
.register-card
  min-width 600px
</style>
