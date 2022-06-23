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
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue'),
    InputField: () => import('~/components/common/input-field.vue')
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
    ...mapActions('accounts', ['sendOTP', 'verifyOTP']),
    filterCountry (val, update) {
      update(() => {
        this.phoneOptions = this.countriesPhoneCode.filter(v => v.name.toLowerCase().indexOf(val.toLowerCase()) > -1)
      })
    },
    isPhoneValid () {
      try {
        const isValid = this.rules.phoneFormat(`${this.formStep1.countryCode.dialCode}${this.formStep1.smsNumber}`)
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
    }
  }
}

</script>
<template lang="pug">
.full-width.full-height.flex.items-start.main-container
    q-scroll-area.full-width.full-height(:thumb-style=" { 'border-radius': '6px' }" ref="scrollArea")#form-container
        .q-mb-xxs
        #internal-container
          #form1(v-show="step === 'phoneNumber'")
            //-  transition(enter-active-class="animated fadeIn" leave-active-class="animated fadeOut")
            .h-h1-signup.color-primary Account
            .h-h1-signup.text-bold.color-primary information
            .h-b1-signup.color-secondary.q-mt-lg.q-mb-lg In order to participate in any decision making or apply for any role or receive any contribution you need to register and become a member. This is a two step process that begins with the account creation and ends with the enrollment in the DAO.
              .h-h7.q-mb-xs.q-pt-xxxl Account Name
              q-input.q-mb-sm(
                ref="account"
                v-model="formStep1.account"
                bg-color="white"
                color = "heading"
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
              //- .h-b2-signup.color-primary.text-bold.input-label.q-mb-md Reason for membership
              //- q-input.q-mb-sm(
              //-   ref="reason"
              //-   v-model="formStep1.reason"
              //-   bg-color="white"
              //-   color = "heading"
              //-   counter
              //-   outlined
              //-   maxlength="140"
              //-   :rules="[rules.required]"
              //-   lazy-rules
              //-   placeholder="Max 140 characters"
              //-   rounded
              //-   dense
              //- )
              .h-h7.q-mb-xs Phone number
              .row.flex.phone-input.q-col-gutter-x-sm
                .col
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
                    use-input
                    hide-selected
                    fill-input
                    @filter="filterCountry"
                    rounded
                    dense
                  )
                .col
                  q-input(
                    ref="smsNumber"
                    v-model="formStep1.smsNumber"
                    bg-color="white"
                    color = "heading"
                    placeholder="Phone number"
                    outlined
                    :rules="[rules.required, isPhoneValid]"
                    lazy-rules
                    type="number"
                    rounded
                    dense
                  )
              .text-red.bg-white(v-if="error") {{ error }}
          #form2(v-show="step === 'keys'")
              //- transition(enter-active-class="animated fadeIn" leave-active-class="animated fadeOut")
              .h-h1-signup.color-primary Your new
              .h-h1-signup.color-primary.text-bold keys
              .h-b1-signup.color-secondary.q-mt-lg.q-mb-lg It is essential to keep your keys in a safe place; never share your private keys with anyone.
              .h-h7.text-bold.input-label.q-mb-xxs Verification code
              q-input.q-pa-none.full-width(
                ref="code"
                v-model="formStep2.code"
                bg-color="white"
                color = "heading"
                outlined
                placeholder="12 characters, alphanumeric a-z, 1-5"
                :rules="[rules.required]"
                lazy-rules
                :error="!!error"
                :error-message="error"
                rounded
                dense
              )
              p.text-xs.text-h-gray.font-lato.q-pa-none.q-ma-none.q-mt-xs.row.items-center.justify-end
                span.q-mr-xxs Problems with the code?
                q-btn(flat color="primary" no-caps padding='0' @click="step = 'phoneNumber'").q-pa-none.q-ma-none.text-underline Check your phone number

              .h-h7.text-bold.input-label.q-mb-xxs.q-mt-md Public Key
              q-input.q-mb-xl.full-width(
                ref="publicKey"
                v-model="formStep2.publicKey"
                placeholder="Public Key"
                bg-color="white"
                color = "heading"
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
              .h-h7.text-bold.input-label.q-mb-xxs Private Key
              q-input.q-mb-md.full-width(
                  ref="privateKey"
                  v-model="formStep2.privateKey"
                  placeholder="Private Key"
                  bg-color="white"
                  color = "heading"
                  outlined
                  @click="$refs['privateKey'].select()"
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
                      @click="onCopyToClipboard(formStep2.privateKey)"
                  )
              q-checkbox.full-width(
                v-model="formStep2.copy"
                label="I have copied my keys somewhere safe"
                dense
              )
          #form3(v-show="step === 'finish'")
              //- transition(enter-active-class="animated fadeIn" leave-active-class="animated fadeOut")
              .h-h1-signup Welcome
              .h-h1-signup.text-bold to {{ $route.params.dhoname }}
              .h-b1-signup.q-mt-lg.q-mb-lg.text-grey Our authentication method is Anchor, a secure and Open Source tool that is available for download as a <a href="https://greymass.com/anchor/" target="_blank">Desktop App for Windows and Mac</a> and a mobile app for both <a href="https://play.google.com/store/apps/details?id=com.greymass.anchor&hl=de&gl=US" target="_blank">Android</a> and <a href="https://apps.apple.com/us/app/anchor-wallet/id1487410877" target="_blank">iOS</a>. For more help with setting up Anchor, see <a href="https://docs.google.com/presentation/d/1RWbnMEIJpYSOoae7FJNAVprI2aR2yGTQlBaYtIR9vIs/present?slide=id.g84be9ac256_0_0" target="_blank">these slides</a>.
              .row.justify-center.q-mt-xl
                profile-picture(:username="formStep1.account" size="9rem")
              .row.justify-center.h-h1.q-mt-md.text-bold {{ '@'+formStep1.account }}
              //- .row.justify-center.upload-pic Upload a profile picture
          #bottom-indicator.row.items-center
              .col
                  .row.q-gutter-sm
                      .ellipse-border( :class="step === 'phoneNumber' && 'ellipse-filled'")
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
                      no-caps
                  )
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
  height 70vh
  width 100%
#bottom-indicator
  margin-top 30px
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
</style>
