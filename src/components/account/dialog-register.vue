<script>
import { mapActions } from 'vuex'

import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber'
import { countriesPhoneCode } from '~/mixins/countries-phone-code'
import { validation } from '~/mixins/validation'
import { copyToClipboard, generateKeys } from '~/utils/eosio'

export default {
  name: 'dialog-register',
  mixins: [validation, countriesPhoneCode],
  props: {
    show: { type: Boolean, required: true }
  },
  data () {
    return {
      step: 'phoneNumber',
      stepIndex: {
        phoneNumber: 1,
        keys: 2,
        finish: 3
      },
      phoneOptions: [],
      formStep1: {
        account: null,
        reason: null,
        smsNumber: null,
        countryCode: null,
        internationalPhone: null
      },
      formStep2: {
        code: null,
        copy: false,
        privateKey: null,
        publicKey: null
      },
      error: null,
      generating: false,
      submitting: false
    }
  },
  async mounted () {
    this.phoneOptions = this.countriesPhoneCode
  },
  methods: {
    ...mapActions('accounts', ['sendOTP', 'verifyOTP']),
    async onSendOTP () {
      this.resetValidation(this.formStep1)
      this.error = null
      if (!(await this.validate(this.formStep1))) return
      const phoneUtil = PhoneNumberUtil.getInstance()
      const number = phoneUtil.parseAndKeepRawInput(`${this.formStep1.countryCode.dialCode}${this.formStep1.smsNumber}`, this.formStep1.countryCode.code)
      this.formStep1.internationalPhone = phoneUtil.format(number, PhoneNumberFormat.INTERNATIONAL)
      this.submitting = true
      const { success, error } = await this.sendOTP(this.formStep1)
      if (success) {
        this.step = 'keys'
      } else {
        this.error = error
      }
      this.submitting = false
    },
    async onVerifyOTP () {
      this.resetValidation(this.formStep2)
      this.error = null
      if (!(await this.validate(this.formStep2))) return
      this.submitting = true
      const { success, error } = await this.verifyOTP({
        smsOtp: this.formStep2.code,
        smsNumber: this.formStep1.internationalPhone,
        telosAccount: this.formStep1.account,
        publicKey: this.formStep2.publicKey,
        privateKey: this.formStep2.privateKey,
        reason: this.formStep1.reason
      })
      if (success) {
        this.step = 'finish'
      } else {
        this.error = error
      }
      this.submitting = false
    },
    isPhoneValid () {
      try {
        const phoneUtil = PhoneNumberUtil.getInstance()
        const number = phoneUtil.parseAndKeepRawInput(`${this.formStep1.countryCode.dialCode}${this.formStep1.smsNumber}`, this.formStep1.countryCode.code)
        return phoneUtil.isValidNumber(number) || 'Please type a valid phone'
      } catch (e) {
        return 'Please type a valid phone'
      }
    },
    onCopyToClipboard (str) {
      copyToClipboard(str)
    },
    async next () {
      if (this.step === 'phoneNumber') {
        await this.onSendOTP()
      } else if (this.step === 'keys') {
        await this.onVerifyOTP()
      } else if (this.step === 'finish') {
        this.onCloseDialog()
      }
    },
    onCloseDialog () {
      this.step = 'phoneNumber'
      this.formStep1.account = null
      this.formStep1.smsNumber = null
      this.formStep1.countryCode = null
      this.formStep1.internationalPhone = null

      this.formStep2.code = null
      this.formStep2.copy = false
      this.formStep2.privateKey = null
      this.formStep2.publicKey = null

      this.$emit('update:show', false)
    }
  },
  watch: {
    show: {
      immediate: true,
      handler: async function (val) {
        if (val) {
          this.generating = true
          const keyPairs = await generateKeys()
          this.formStep2.privateKey = keyPairs.privateKey
          this.formStep2.publicKey = keyPairs.publicKey
          this.generating = false
        }
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
        name="phoneNumber"
        title="Account information"
        :done="stepIndex[step] > 1"
      )
        q-input.q-mb-lg(
          ref="account"
          v-model="formStep1.account"
          color="accent"
          label="Account name"
          hint="12 characters, alphanumeric a-z, 1-5"
          outlined
          maxlength="12"
          :rules="[rules.required, rules.accountFormatBasic, rules.accountLength, rules.isAccountAvailable]"
          lazy-rules
          :debounce="200"
          @blur="formStep1.account = (formStep1.account || '').toLowerCase()"
        )
        q-input.q-mb-lg(
          ref="reason"
          v-model="formStep1.reason"
          color="accent"
          label="Reason for membership"
          counter
          outlined
          maxlength="140"
          :rules="[rules.required]"
          lazy-rules
        )
        .row.flex.phone-input
          q-select(
            ref="countryCode"
            v-model="formStep1.countryCode"
            :options="phoneOptions"
            :option-label="(option) => `${option.name} (${option.dialCode})`"
            :display-value="formStep1.countryCode && formStep1.countryCode.dialCode"
            label="Country"
            map-options
            outlined
            :rules="[rules.required]"
            lazy-rules
            :style="{width:'25%'}"
          )
          q-input(
            ref="smsNumber"
            v-model="formStep1.smsNumber"
            color="accent"
            label="Phone number"
            outlined
            :rules="[rules.required, isPhoneValid]"
            lazy-rules
            :style="{width:'75%'}"
          )
        .text-red(v-if="error") {{ error }}
      q-step(
        name="keys"
        title="Keys"
        :done="stepIndex[step] > 2"
      )
        q-input.full-width(
          ref="code"
          v-model="formStep2.code"
          label="Verification code"
          :rules="[rules.required]"
          lazy-rules
          :error="!!error"
          :error-message="error"
        )
        q-input(
          ref="publicKey"
          v-model="formStep2.publicKey"
          label="Public Key"
          @click="$refs['publicKey'].select()"
          readonly
          :loading="generating"
        )
          template(v-slot:after)
            q-btn(
              round
              color="primary"
              icon="fas fa-clipboard"
              size="sm"
              @click="onCopyToClipboard(formStep2.publicKey)"
            )
        q-input(
          ref="privateKey"
          v-model="formStep2.privateKey"
          label="Private Key"
          @click="$refs['privateKey'].select()"
          readonly
          :loading="generating"
        )
          template(v-slot:after)
            q-btn(
              round
              color="primary"
              icon="fas fa-clipboard"
              size="sm"
              @click="onCopyToClipboard(formStep2.privateKey)"
            )
        q-checkbox.full-width(
          v-model="formStep2.copy"
          label="I have copied my keys somewhere safe"
        )
      q-step.text-center(
        name="finish"
        title="Welcome"
        :done="stepIndex[step] === 3"
      )
        .text-subtitle1 Congratulations #[strong {{ formStep1.account }}!]
        .text-subtitle2 Welcome to Hypha DAO, you can now log in using your private key
      template(v-slot:navigation)
        q-stepper-navigation(align="right")
          q-btn(
            label="Cancel"
            flat
            @click="onCloseDialog"
          )
          q-btn(
            :label="step === 'finish' ? 'Done' : 'Next'"
            color="secondary"
            @click="next"
            :disable="step === 'keys' && !formStep2.copy"
            :loading="submitting"
          )
</template>

<style lang="stylus" scoped>
.register-card
  min-width 600px
.phone-input
  /deep/.q-select
    .q-field__inner
      .q-field__control
        border-radius: 4px 0 0 4px
        &:before
          border-right: none
  /deep/.q-input
    .q-field__inner
      .q-field__control
        border-radius: 0 4px 4px 0
        &:before
          border-left: none
</style>
