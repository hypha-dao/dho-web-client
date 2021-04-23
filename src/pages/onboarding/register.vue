<script>
import { mapActions } from 'vuex'
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber'
import { copyToClipboard, generateKeys } from '~/utils/eosio'
import { validation } from '~/mixins/validation'
import { countriesPhoneCode } from '~/mixins/countries-phone-code'

export default {
  name: 'page-register',
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
.flex.flex-center.column.fixed-center
  .world-bg(v-if="$q.platform.is.desktop" style="background: url('bg/world.svg')")
  transition(
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  )
    div
      .title
        span Hypha
        strong EARTH
      .subtitle.q-mb-lg Create the next chapter in Earth's history
  .content.q-pa-md.row.q-col-gutter-md.bg-white
    .col-xs-12.col-md-3
      .content-title Register Account
      .content-text1 Please use the guided form to create a new SEEDS account and membership registration. Please note that you can use your existing SEEDS account (e.g. from the Passport) to login to the DHO (use the link below to sign in).
      .content-text3
        | Already have an account?&nbsp;
        router-link(to="/login") Login here.
        br
        | Just visiting?&nbsp;
        router-link(to="/dashboard") Continue as guest.
    .col-xs-12.col-md-9
      q-stepper(
        class="bg-none"
        ref="stepper"
        v-model="step"
        horizontal
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
            bg-color="white"
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
            bg-color="white"
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
              :option-value="option => option"
              :option-label="(option) => `${option.name} (${option.dialCode})`"
              :display-value="formStep1.countryCode && formStep1.countryCode.dialCode"
              label="Country"
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
            )
            q-input(
              ref="smsNumber"
              v-model="formStep1.smsNumber"
              color="accent"
              bg-color="white"
              label="Phone number"
              outlined
              :rules="[rules.required, isPhoneValid]"
              lazy-rules
              :style="{width:'60%'}"
            )
          .text-red.bg-white(v-if="error") {{ error }}
        q-step(
          name="keys"
          title="Keys"
          :done="stepIndex[step] > 2"
        )
          q-input.full-width(
            ref="code"
            v-model="formStep2.code"
            bg-color="white"
            outlined
            label="Verification code"
            :rules="[rules.required]"
            lazy-rules
            :error="!!error"
            :error-message="error"
          )
          q-input.q-mb-lg(
            ref="publicKey"
            v-model="formStep2.publicKey"
            label="Public Key"
            bg-color="white"
            outlined
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
            bg-color="white"
            outlined
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
              :label="step === 'finish' ? 'Done' : 'Next'"
              color="secondary"
              unelevated
              @click="next"
              :disable="step === 'keys' && !formStep2.copy"
              :loading="submitting"
            )
</template>

<style lang="stylus" scoped>
.bg-none
  background transparent
  box-shadow none
.title
  font-size 70px
  @media (max-width: $breakpoint-xs-max)
    letter-spacing -3px
    font-size 3.5em
    line-height 1.2
.subtitle
  font-size 22px
  @media (max-width: $breakpoint-xs-max)
    font-size 1em
    line-height 0.8
    padding-bottom 20px
.content
  text-align center
  width 900px
  border-radius 20px
  z-index 100
  @media (max-width: $breakpoint-xs-max)
    max-width 90%
  .content-title
    font-weight 600
    font-size 26px
  .content-text1
    font-size 1em
    line-height 1.2em
    margin-top 10px
    @media (max-width: $breakpoint-xs-max)
      max-width 90%
  .content-text3
    font-size 12px
    margin-top 20px
    @media (max-width: $breakpoint-xs-max)
      max-width 90%
  a
    color black
</style>
