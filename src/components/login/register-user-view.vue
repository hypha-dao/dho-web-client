<script>
import { mapActions } from 'vuex'
import parsePhoneNumber from 'libphonenumber-js'

import { validation } from '~/mixins/validation'
import { countriesPhoneCode } from '~/mixins/countries-phone-code'
import { copyToClipboard, generateKeys } from '~/utils/eosio'

export default {
  name: 'register-user-view',
  mixins: [validation, countriesPhoneCode],
  components: {
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue')
  },
  props: {
    isOnboarding: {
      type: Boolean,
      default: false
    }
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
    const keyPairs = await generateKeys()
    this.formStep2.privateKey = keyPairs.privateKey
    this.formStep2.publicKey = keyPairs.publicKey
    this.$emit('stepChanged', 'phoneNumber')
  },
  methods: {
    ...mapActions('accounts', ['sendOTP', 'verifyOTP', 'loginWallet']),

    filterCountry (val, update) {
      update(() => {
        this.phoneOptions = this.countriesPhoneCode.filter(v => v.name.toLowerCase().indexOf(val.toLowerCase()) > -1)
      })
    },
    isPhoneValid () {
      try {
        const isValid = this.rules.isPhoneNumber(`${this.formStep1.countryCode.dialCode}${this.formStep1.smsNumber}`)
        return isValid || 'Please type a valid phone'
      } catch (e) {
        return 'Please type a valid phone'
      }
    },
    async onSendOTP () {
      await this.resetValidation(this.formStep1)
      this.error = null
      if (!(await this.validate(this.formStep1))) return
      const number = parsePhoneNumber(`${this.formStep1.countryCode.dialCode}${this.formStep1.smsNumber}`, this.formStep1.countryCode.code)
      this.formStep1.internationalPhone = number.formatInternational()
      this.submitting = true
      const { success, error } = await this.sendOTP(this.formStep1)
      if (success) {
        this.step = 'keys'
        this.$emit('stepChanged', 'keys')
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
        this.$emit('stepChanged', 'finish')
      } else {
        this.error = error
      }
      this.submitting = false
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
        await this.$emit('onFinish')
        // if (this.$router.currentRoute.path !== '/preview/') {
        // }
      }
    },

    async onAuthorize () {
      await this.loginWallet({ idx: 0, returnUrl: 'create' })
    }
  }
}

</script>
<template lang="pug">
.full-width.full-height.flex.items-start.main-container
  #top-indicator
    .indicator.row.q-gutter-sm.justify-center(v-if="$q.screen.lt.md || $q.screen.md")
      .ellipse-border(:class="step === 'phoneNumber' && 'ellipse-filled'")
      .ellipse-border(:class="step === 'keys' && 'ellipse-filled'")
      .ellipse-border(:class="step === 'finish' && 'ellipse-filled'")
  q-scroll-area#form-container.full-width.full-height(:thumb-style=" { 'opacity': '0' }" ref="scrollArea")
    .q-mb-xxs
    #internal-container
      #form1(v-show="step === 'phoneNumber'")
        template
          .h-h1-signup(:class="{ 'h-h1-signup-mobile':$q.platform.is.mobile, 'color-primary':$q.platform.is.desktop }") {{ $t('login.register-user-view.account') }}
          .h-h1-signup.text-bold(:class="{'h-h1-signup-mobile':$q.platform.is.mobile, 'color-primary':$q.platform.is.desktop, 'text-weight-800':$q.platform.is.mobile }") {{ $t('login.register-user-view.information') }}
        .h-b1-signup.color-secondary.q-mt-lg.q-mb-lg(v-if="$q.platform.is.desktop") {{ $t('login.register-user-view.inOrderTo') }}
        .h-b1-signup.color-secondary.q-mt-lg.q-mb-lg(v-if="$q.platform.is.mobile") {{ $t('login.register-user-view.pleaseUseThe') }}
        .h-h7.q-mb-xs.q-pt-xxxl(:class="{ 'input-label-mobile':$q.platform.is.mobile }") {{ $t('login.register-user-view.accountName') }}
          q-input.q-mb-sm(ref="account" v-model="formStep1.account" bg-color="white" :placeholder="$t('login.register-user-view.charactersAlphanumeric')" outlined="outlined" maxlength="12" :rules="[rules.required, rules.accountFormatBasic, rules.accountLength, rules.isAccountAvailable]" lazy-rules="lazy-rules" :debounce="200" rounded="rounded" @blur="formStep1.account = (formStep1.account || '').toLowerCase()" dense="dense")
          .h-h7.q-mb-xs(:class="{ 'input-label-mobile':$q.platform.is.mobile }") {{ $t('login.register-user-view.phoneNumber') }}
          .row.flex.phone-input.q-col-gutter-x-sm
            .col
              q-select(ref="countryCode" v-model="formStep1.countryCode" :options="phoneOptions" :option-value="option => option" :option-label="(option) => `${option.name} (${option.dialCode})`" :display-value="formStep1.countryCode && formStep1.countryCode.dialCode" :placeholder="$t('login.register-user-view.country')" bg-color="white" emit-value="emit-value" map-options="map-options" outlined="outlined" clearable="clearable" :rules="[rules.required]" lazy-rules="lazy-rules" use-input="use-input" hide-selected="hide-selected" fill-input="fill-input" @filter="filterCountry" rounded="rounded" dense="dense")
            .col
              q-input(ref="smsNumber" v-model="formStep1.smsNumber" bg-color="white" :placeholder="$t('login.register-user-view.phoneNumber1')" outlined="outlined" :rules="[rules.required, isPhoneValid]" lazy-rules="lazy-rules" type="number" rounded="rounded" dense="dense")
          .text-red.bg-white(v-if="error") {{ error }}
      #form2(v-show="step === 'keys'")
        .h-h1-signup.color-primary {{ $t('login.register-user-view.your') }}
        .h-h1-signup.color-primary.text-bold {{ $t('login.register-user-view.verificationCode') }}
        .h-b1-signup.color-secondary.q-mt-lg.q-mb-lg {{ $t('login.register-user-view.pleaseCheckYour') }}
        .h-h7.text-bold.input-label.q-mb-xxs {{ $t('login.register-user-view.verificationCode1') }}
        input-field.q-pa-none.full-width(ref="code" v-model="formStep2.code" bg-color="white" outlined="outlined" :placeholder="$t('login.register-user-view.charactersAlphanumeric1')" :rules="[rules.required]" lazy-rules="lazy-rules" :error="!!error" :error-message="error" rounded="rounded" dense="dense")
        p.text-xs.text-h-gray.font-lato.q-pa-none.q-ma-none.q-mt-xs.row.items-center.justify-end
          span.q-mr-xxs {{ $t('login.register-user-view.problemsWithTheCode') }}
          q-btn.q-pa-none.q-ma-none.text-underline(flat="flat" color="primary" no-caps="no-caps" padding="0" @click="step = 'phoneNumber'") {{ $t('login.register-user-view.checkYourPhoneNumber') }}
      #form3(v-show="step === 'finish'")
        template
          .h-h1-signup(:class="{ 'h-h1-signup-mobile':$q.platform.is.mobile, 'color-primary':$q.platform.is.desktop }") {{ $t('login.register-user-view.welcome') }}
          .h-h1-signup.text-bold(:class="{'h-h1-signup-mobile':$q.platform.is.mobile, 'color-primary':$q.platform.is.desktop, 'text-weight-800':$q.platform.is.mobile }") to
            | {{ $route.params.dhoname }}
        .h-b1-signup.q-mt-lg.q-mb-lg.text-grey {{ $t('login.register-user-view.ourAuthenticationMethod') }}
          a(href="https://greymass.com/anchor/" target="_blank") {{ $t('login.register-user-view.desktopAppFor') }}
          | {{ $t('login.register-user-view.andAMobile') }}
          a(href="https://play.google.com/store/apps/details?id=com.greymass.anchor&hl=de&gl=US" target="_blank") {{ $t('login.register-user-view.android') }}
          | {{ $t('login.register-user-view.and') }}
          a(href="https://apps.apple.com/us/app/anchor-wallet/id1487410877" target="_blank") {{ $t('login.register-user-view.ios') }}
          | {{ $t('login.register-user-view.forMore') }}
          a(href="https://docs.google.com/presentation/d/1RWbnMEIJpYSOoae7FJNAVprI2aR2yGTQlBaYtIR9vIs/present?slide=id.g84be9ac256_0_0" target="_blank") {{ $t('login.register-user-view.theseSlides') }}
          | .
        .row.justify-center.q-mt-xl
          profile-picture(:username="formStep1.account" size="9rem")
        .row.justify-center.h-h1.q-mt-md.text-bold {{ '@'+formStep1.account }}
      #bottom-indicator.row.items-center
        .col
          .row.q-gutter-sm(v-if="$q.screen.gt.md")
            .ellipse-border(:class="step === 'phoneNumber' && 'ellipse-filled'")
            .ellipse-border(:class="step === 'keys' && 'ellipse-filled'")
            .ellipse-border(:class="step === 'finish' && 'ellipse-filled'")
          .h-b3-signup.color-secondary.flex.column(v-if="$q.platform.is.mobile") {{ $t('login.register-user-view.areYouAMember') }}
            span.h-b3-signup.text-primary.cursor-pointer(style="text-decoration: underline" @click="$emit('onClickLoginPage')") {{ $t('login.register-user-view.loginHere') }}
        .col-4(v-if="$q.platform.is.desktop")
          q-btn.full-width(v-if="isOnboarding && step === 'finish'" @click="onAuthorize" :label="$t('login.register-user-view.createDao')" color="primary" unelevated="unelevated" rounded="rounded" no-caps="no-caps")
          q-btn.full-width(v-if="isOnboarding ? step !== 'finish' : true" :label="step === 'finish' ? 'Done' : 'Next'" color="primary" unelevated="unelevated" @click="next" :disable="step === 'keys' && !formStep2.copy" :loading="submitting" rounded="rounded" no-caps="no-caps")
        .col(v-if="$q.platform.is.mobile")
          q-btn.full-width(:label="step === 'finish' ? 'Done' : 'Next'" color="primary" unelevated="unelevated" @click="next" :loading="submitting" rounded="rounded" no-caps="no-caps")

</template>

<style lang="stylus" scoped>
#form1
  height 100%
#form-container
  max-height 80vh
#internal-container
  display flex
  flex-direction column
  justify-content space-between !important
  height auto
  width 100%
  margin-bottom 50px
#top-indicator
  width: 100%
  .indicator
    margin-bottom: 10px
#bottom-indicator
  margin-top 22px
  width 100%
.main-container
  margin-top 0
.ellipse-border
 width: 10px
 height: 10px
 border: 1px solid $primary
 border-radius: 10px
.ellipse-filled
 background-color: $primary
.input-label-mobile
  font-size: 22px
  font-weight: 600
</style>
