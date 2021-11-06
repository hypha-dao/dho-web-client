<script>
import { mapActions } from 'vuex'
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber'
import { validation } from '~/mixins/validation'
import { countriesPhoneCode } from '~/mixins/countries-phone-code'
import { copyToClipboard, generateKeys } from '~/utils/eosio'

export default {
  name: 'register-user-view',
  mixins: [validation, countriesPhoneCode],
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
    const keyPairs = await generateKeys()
    this.formStep2.privateKey = keyPairs.privateKey
    this.formStep2.publicKey = keyPairs.publicKey
  },
  methods: {
    ...mapActions('accounts', ['sendOTP', 'verifyOTP']),
    filterCountry (val, update) {
      update(() => {
        this.phoneOptions = this.countriesPhoneCode.filter(v => v.name.toLowerCase().indexOf(val.toLowerCase()) > -1)
      })
    },
    async onSendOTP () {
      await this.resetValidation(this.formStep1)
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
      await this.resetValidation(this.formStep2)
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
        if (this.$router.currentRoute.path !== '/dashboard') {
          await this.$router.push({ path: '/dashboard' })
        }
      }
    }
  }
}

</script>
<template lang="pug">
.full-width.full-height
    .absolute-center.full-width.q-pa-xl
        .text-h4 Account
        .text-h4.text-bold information
        .text-body2.text-weight-thin.q-mt-lg.q-mb-lg.text-grey Please use your existing SEEDS (e.g. Passport or Light Wallet) or Telos account to login to the DHO. If you don’t have one of these accounts, you can create one here by following the registration steps. Simply add your account information, fill in the reason for your membership application and copy your keys to a safe place. A DHO member will enroll you after reviewing your registration.
        #formPhoneNumber(v-show="step === 'phoneNumber'")
            .text-h5.text-bold.input-label.q-mb-md Account Name
            q-input.q-mb-sm(
              ref="account"
              v-model="formStep1.account"
              color="accent"
              bg-color="white"
              placeholder="12 characters, alphanumeric a-z, 1-5"
              outlined
              maxlength="12"
              :rules="[rules.required, rules.accountFormatBasic, rules.accountLength, rules.isAccountAvailable]"
              lazy-rules
              :debounce="200"
              rounded
              @blur="formStep1.account = (formStep1.account || '').toLowerCase()"
              dense
            )
            .text-h5.text-bold.input-label.q-mb-md Reason for membership
            q-input.q-mb-sm(
              ref="reason"
              v-model="formStep1.reason"
              color="accent"
              bg-color="white"
              counter
              outlined
              maxlength="140"
              :rules="[rules.required]"
              lazy-rules
              placeholder="Max 140 characters"
              rounded
              dense
            )
            .text-h5.text-bold.input-label.q-mb-md Phone number
            .row.flex.phone-input.q-col-gutter-x-sm
              q-select(
                ref="countryCode"
                v-model="formStep1.countryCode"
                :options="phoneOptions"
                :option-value="option => option"
                :option-label="(option) => `${option.name} (${option.dialCode})`"
                :display-value="formStep1.countryCode && formStep1.countryCode.dialCode"
                placeholder="Country"
                bg-color="white"
                emit-value
                map-options
                outlined
                clearable
                :rules="[rules.required]"
                lazy-rules
                :style="{width:'40%'}"
                use-input
                hide-selected
                fill-input
                @filter="filterCountry"
                rounded
                dense
              )
              q-input(
                ref="smsNumber"
                v-model="formStep1.smsNumber"
                color="accent"
                bg-color="white"
                placeholder="Phone number"
                outlined
                :rules="[rules.required, isPhoneValid]"
                lazy-rules
                :style="{width:'60%'}"
                rounded
                dense
              )
            .text-red.bg-white(v-if="error") {{ error }}
        #formPhoneNumber(v-show="step === 'keys'")
            .text-h5.text-bold.input-label.q-mb-md Verification code
            q-input.q-mb-md.full-width(
              ref="code"
              v-model="formStep2.code"
              bg-color="white"
              outlined
              placeholder="12 characters, alphanumeric a-z, 1-5"
              :rules="[rules.required]"
              lazy-rules
              :error="!!error"
              :error-message="error"
              rounded
              dense
            )
            .text-h5.text-bold.input-label.q-mb-md Public Key
            q-input.q-mb-md(
              ref="publicKey"
              v-model="formStep2.publicKey"
              label="Public Key"
              bg-color="white"
              outlined
              @click="$refs['publicKey'].select()"
              readonly
              :loading="generating"
              rounded
              dense
            )
              template(v-slot:append)
                q-btn(
                  flat
                  color="primary"
                  icon="far fa-copy"
                  size="sm"
                  @click="onCopyToClipboard(formStep2.publicKey)"
                )
            .text-h5.text-bold.input-label.q-mb-md Private Key
            q-input.q-mb-md(
                ref="privateKey"
                v-model="formStep2.privateKey"
                placeholder="Private Key"
                bg-color="white"
                outlined
                @click="$refs['privateKey'].select()"
                readonly
                :loading="generating"
                rounded
                dense
            )
                template(v-slot:after)
                    q-btn(
                        flat
                        color="primary"
                        icon="far fa-copy"
                        size="sm"
                        @click="onCopyToClipboard(formStep2.privateKey)"
                    )
            q-checkbox.full-width(
              v-model="formStep2.copy"
              label="I have copied my keys somewhere safe"
              rounded
              round
            )
        #formPhoneNumber(v-show="step === 'finish'")
        #bottom-indicator.row.q-mt-lg.items-center
            .col
                .row.q-gutter-sm
                    .ellipse-border(:class="step === 'phoneNumber' && 'ellipse-filled'")
                    .ellipse-border(:class="step === 'keys' && 'ellipse-filled'")
                    .ellipse-border(:class="step === 'finish' && 'ellipse-filled'")
            .col-4
                q-btn.full-width(
                    :label="step === 'finish' ? 'Done' : 'Next'"
                    color="primary"
                    unelevated
                    @click="next"
                    :disable="step === 'keys' && !formStep2.copy"
                    :loading="submitting"
                    rounded
                    dense
                    no-caps
                )
</template>

<style lang="sass" scoped>
.ellipse-border
 width: 10px
 height: 10px
 border: 1px solid $primary
 border-radius: 10px
.ellipse-filled
 background-color: $primary
.input-label
  font-size: 22px
</style>
