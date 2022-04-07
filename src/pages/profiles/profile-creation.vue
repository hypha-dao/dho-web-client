<script>
import { mapActions, mapGetters } from 'vuex'

import { validation } from '~/mixins/validation'
import { countriesPhoneCode } from '~/mixins/countries-phone-code'
import { timeZones } from '~/mixins/time-zones'
import pick from '~/utils/pick'
import 'vue-croppa/dist/vue-croppa.css'

export default {
  name: 'profile-creation',
  mixins: [validation, countriesPhoneCode, timeZones],
  components: {
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue'),
    TextInputToggle: () => import('~/components/form/text-input-toggle.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  data () {
    return {
      image: {},
      nextAvailable: false,
      activeStepIndex: 0,
      steps: [
        'PERSONAL_INFO',
        'ABOUT_YOU',
        'WALLET_ADDRESSES',
        'CONTACT_INFO'
      ],

      phoneOptions: [],
      timeZoneOptions: [],

      form: {
        avatarFile: null,
        avatar: null,
        name: null,
        location: null,
        timeZone: null,
        bio: null,
        email: null,
        phoneNumber: null,
        contactMethod: 'EMAIL' // Default
      },
      walletAddressesForm: {
        btcAddress: null,
        ethAddress: null,
        eosAccount: null,
        eosMemo: null,
        defaultAddress: 'eosaccount' // Hardcoded for now
      },

      toggles: {
        bitcoin: false,
        ethereum: false,
        eos: true,

        phoneNumber: false,
        email: true // Default
      },

      error: null,
      submitting: false,
      loading: false
    }
  },

  computed: {
    ...mapGetters('accounts', ['account']),
    ...mapGetters('profiles', ['isConnected']),
    lastStep () {
      return this.activeStepIndex === this.steps.length - 1
    }
  },

  watch: {
    'toggles.bitcoin': function (value) {
      if (value) { this.setDefaultAddress('btcaddress') }
    },
    'toggles.ethereum': function (value) {
      if (value) { this.setDefaultAddress('ethaddress') }
    },
    'toggles.eos': function (value) {
      if (value) { this.setDefaultAddress('eosaccount') }
    },
    'toggles.phoneNumber': function (value) {
      if (value) {
        this.setCommPref('SMS')
      }
    },
    'toggles.email': function (value) {
      if (value) {
        this.setCommPref('EMAIL')
      }
    }
  },

  async mounted () {
    await this.loadProfile()
    this.timeZoneOptions = this.timeZonesOptions
    this.phoneOptions = this.countriesPhoneCode
  },

  beforeUpdate () {
    if (this.form.contactMethod === 'SMS') {
      this.toggles.email = false
    }

    if (this.form.contactMethod === 'EMAIL') {
      this.toggles.phoneNumber = false
    }

    if (this.form.defaultAddress === 'btcaddress') {
      // this.toggles.bitcoin = true
      this.toggles.ethereum = false
      this.toggles.eos = false
    }

    if (this.form.defaultAddress === 'ethaddress') {
      this.toggles.bitcoin = false
      // this.toggles.ethereum = true
      this.toggles.eos = false
    }

    if (this.form.defaultAddress === 'eosaccount') {
      this.toggles.bitcoin = false
      this.toggles.ethereum = false
      // this.toggles.eos = true
    }
  },

  updated () {

  },

  methods: {
    ...mapActions('profiles', ['updateProfile', 'getProfile', 'saveAddresses']),
    getImageBlob () {
      return new Promise((resolve, reject) => {
        try {
          if (this.image.hasImage()) {
            this.image.generateBlob((blob) => {
              resolve(blob)
            }, 'image/jpg', 0.8)
          } else {
            resolve(null)
          }
        } catch (e) {
          reject(new Error(e))
        }
      })
    },
    onNewImage (file) {
      setTimeout(async () => {
        this.form.avatar = this.image.generateDataUrl()
        this.form.avatarFile = await this.getImageBlob()
      }, 250) // TODO: Find a way to remove this hack
    },
    async isNextAvailable () {
      const dataForValidation = {
        0: { ...pick(this.form, ['name', 'location', 'timeZone']) },
        1: { ...pick(this.form, ['bio']) },
        // 2: { ...pick(this.walletAddressesForm, ['btcAddress', 'ethAddress', 'eosAccount', 'eosMemo', 'defaultAddress']) },
        3: { ...pick(this.form, ['email', 'phoneNumber', 'contactMethod']) }
      }
      let valid = await this.validateForm(dataForValidation[this.activeStepIndex])
      // if (this.activeStepIndex === 2) { // Wallet Adresses
      //   if (!dataForValidation[this.activeStepIndex].defaultAddress) {
      //     valid = false
      //   }
      // }
      if (this.activeStepIndex === 3) { // Contact method
        if (!dataForValidation[this.activeStepIndex].contactMethod && !(this.toggles.phoneNumber || this.toggles.email)) {
          valid = false
        }
      }
      return valid
    },

    async validateForm (form) {
      await this.resetValidation(form)
      return await this.validate(form)
    },

    capitalizeFirstLetter: (str) => {
      return str.charAt(0).toUpperCase() + str.replace('_', ' ').toLowerCase().slice(1)
    },

    filterCountry (val, update) {
      update(() => {
        this.phoneOptions = this.countriesPhoneCode.filter(v => v.name.toLowerCase().indexOf(val.toLowerCase()) > -1)
      })
    },

    filterTimeZones (val, update) {
      update(() => {
        if (val === '') {
          this.timeZoneOptions = this.timeZonesOptions
          return
        }

        const needle = val.toLowerCase()
        this.timeZoneOptions = this.timeZonesOptions.filter(
          v => v.text.toLowerCase().indexOf(needle) > -1
        )
      })
    },

    setCommPref (value) {
      this.form.contactMethod = value
    },

    setDefaultAddress (value) {
      this.form.defaultAddress = value
    },

    async loadProfile () {
      this.loading = true

      const profile = await this.getProfile(this.account)

      if (profile) {
        this.form.avatar = profile.publicData.avatar
        this.form.name = profile.publicData.name
        this.form.timeZone = profile.publicData.timeZone
        this.form.location = profile.publicData.location

        this.form.bio = profile.publicData.bio

        this.walletAddressesForm.defaultAddress = profile.publicData.defaultAddress
        this.walletAddressesForm.btcAddress = profile?.publicData?.btcAddress
        this.walletAddressesForm.ethAddress = profile?.publicData?.ethAddress
        this.walletAddressesForm.eosAccount = profile?.publicData?.eosAccount
        this.walletAddressesForm.eosMemo = profile?.publicData?.eosMemo

        if (this.walletAddressesForm.defaultAddress === 'btcaddress') {
          this.toggles.bitcoin = true
          this.toggles.ethereum = false
          this.toggles.eos = false
        }

        if (this.walletAddressesForm.defaultAddress === 'ethaddress') {
          this.toggles.bitcoin = false
          this.toggles.ethereum = true
          this.toggles.eos = false
        }

        if (this.walletAddressesForm.defaultAddress === 'eosaccount') {
          this.toggles.bitcoin = false
          this.toggles.ethereum = false
          this.toggles.eos = true
        }

        this.form.contactMethod = profile.commPref

        if (this.form.contactMethod === 'SMS') {
          this.toggles.phoneNumber = true
          this.toggles.email = false
        } else {
          this.toggles.phoneNumber = false
          this.toggles.email = true
        }

        this.form.email = profile?.emailInfo?.value
        this.form.phoneNumber = profile.smsInfo.value
      }

      this.loading = false
    },

    async onPrevStep () {
      if (this.activeStepIndex >= 0) {
        this.activeStepIndex = this.activeStepIndex - 1
      }
    },

    async onNextStep () {
      if (!await this.isNextAvailable()) {
        return
      }

      if (this.lastStep) {
        try {
          this.submitting = true
          await this.updateProfile({ data: { ...this.form } })
          await this.saveAddresses({ newData: this.walletAddressesForm, oldData: undefined })
          this.$router.push({ name: 'profile', params: { username: this.account } })
        } catch (error) {
          this.error = error
        }
      } else {
        this.activeStepIndex = this.activeStepIndex + 1
      }

      this.submitting = false
    }
  }
}
</script>

<template lang="pug">
.row.justify-between
  .column.col-xs-12.col-sm-9.col-md-9.q-pr-md
    widget

      section.row(v-show="activeStepIndex === 0")
        label.h-h4.q-mt-md Profile picure
        .row.full-width.q-mt-md.no-wrap
          profile-picture(:username="account" size="108px" :url="form.avatar")
          .full-width.q-pl-xl.column.justify-between.items-start
            p.text-caption.text-weight-thin.text-grey-7 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            croppa.image-selector.q-mb-lg(
              v-model="image"
              ref="croppa"
              :accept="'image/*'"
              :file-size-limit="4e6"
              :width="140"
              :height="140"
              :quality="1"
              prevent-white-space
              @file-choose="onNewImage"
              style="display: none"
            )
            q-btn.q-px-xl.rounded-border.text-bold(
                @click="$refs.croppa.chooseFile()"
                color="primary"
                no-caps
                outline
                rounded
                unelevated
            ) Upload an image
        .row.full-width.justify-between.q-mt-xl
          .col-xs-12.col-sm-6.col-md-6.q-pr-sm
            label.h-h4 Name
            q-input.q-my-md.rounded-border(
                  :debounce="200"
                  :rules="[rules.required]"
                  bg-color="white"
                  color="accent"
                  dense
                  lazy-rules
                  maxlength="200"
                  outlined
                  placeholder="Type your full name here"
                  ref="name"
                  rounded
                  v-model="form.name"
                )
          .col-xs-12.col-sm-6.col-md-6.q-pl-sm
            label.h-h4 Account name
            q-input.q-my-md.rounded-border(
                  bg-color="white"
                  color="accent"
                  dense
                  lazy-rules
                  maxlength="12"
                  outlined
                  rounded
                  v-model="account"
                  :disable="true"
                )
        .row.full-width.justify-between.q-mt-md
          label.h-h4.full-width Location
          .col-xs-12.col-sm-6.col-md-6.q-pr-sm
            q-select.q-my-md.rounded-border(
              :display-value="form.location && form.location.code"
              :option-label="(option) => `${option.name} (${option.code})`"
              :option-value="option => option"
              :options="phoneOptions"
              :rules="[rules.required]"
              @filter="filterCountry"
              bg-color="white"
              dense
              emit-value
              fill-input
              hide-selected
              lazy-rules
              map-options
              outlined
              placeholder="Select a country"
              ref="location"
              rounded
              use-input
              v-model="form.location"
            )
          .col-xs-12.col-sm-6.col-md-6.q-pl-sm
            q-select.q-my-md.rounded-border(
              :options="timeZoneOptions"
              :rules="[rules.required]"
              @filter="filterTimeZones"
              bg-color="white"
              dense
              emit-value,
              fill-input
              hide-selected
              map-options
              option-label="text"
              option-value="value"
              outlined
              placeholder="Select a time zone"
              ref="timeZone"
              rounded
              use-input
              v-model='form.timeZone'
            )

      section.row(v-show="activeStepIndex === 1")
        label.h-h4.q-mt-md Tell us something about you
        p.text-caption.text-weight-thin.text-grey-7.q-mt-md Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

        q-input.q-mt-xl.full-width.rounded-border(
            :input-style="{ 'resize': 'none' }"
            :rules="[rules.required]"
            bg-color="white"
            dense
            lazy-rules
            maxlength="3000"
            outlined
            placeholder="Type a short bio here"
            ref="bio"
            rows='10'
            type="textarea"
            v-model="form.bio"
          )

      section.column.full-width(v-show="activeStepIndex === 2")
        label.h-h4.q-mt-md Connect your personal wallet
        p.text-caption.text-weight-thin.text-grey-7.q-mt-md Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

        .row.items-end
          .col-7
            text-input-toggle.full-width(
                :disable="true"
                :icon="'img:'+ require('~/assets/icons/chains/bitcoin.svg')"
                :iconBackground="false"
                :showToggle="false"
                :text.sync="walletAddressesForm.btcAddress"
                :toggle.sync="toggles.bitcoin"
                disabled
                label="Bitcoin (Currently disabled)"
                placeholder='Bitcoin address'
                ref="btcAddress"
                type="text"
              )
          .col-5.flex.items-center.q-pl-md
            .text-body2.text-grey-7 Select this as preferred address
            q-toggle(v-model="toggles.bitcoin" color="secondary" :disable="true")
          .col-7
            p.text-caption.text-weight-thin.text-grey-7.text-right.q-mt-xs.q-mb-none Need a new Bitcoin address?
              a(href='#').q-ml-sm Click here

        .row.items-end
          .col-7
            text-input-toggle.full-width(
                :disable="true"
                :icon="'img:'+ require('~/assets/icons/chains/ethereum.svg')"
                :iconBackground="false"
                :showToggle="false"
                :text.sync="walletAddressesForm.ethAddress"
                :toggle.sync="toggles.ethereum"
                disabled
                label="Ethereum (Currently disabled)"
                placeholder='Ethereum address'
                ref="ethAddress"
                type="text"
              )
          .col-5.flex.items-center.q-pl-md
            .text-body2.text-grey-7 Select this as preferred address
            q-toggle(v-model="toggles.ethereum" color="secondary" disabled :disable="true")
          .col-7
            p.text-caption.text-weight-thin.text-grey-7.text-right.q-mt-xs.q-mb-none Need a new Ethereum address?
              a(href='#').q-ml-sm Click here

        .row.items-end
          .col-7
            .row.items-end
              text-input-toggle.col-7(
                  :disable="false"
                  :icon="'img:'+ require('~/assets/icons/chains/eos.svg')"
                  :iconBackground="false"
                  :showToggle="false"
                  :text.sync="walletAddressesForm.eosAccount"
                  :toggle.sync="toggles.eos"
                  label="EOS"
                  ref="eosAccount"
                  type="text"
                  placeholder='EOS address'
                )
              q-input.col-5.rounded-border.q-pl-sm(
                  :disable="false"
                  dense
                  outlined
                  ref="eosMemo"
                  type="text"
                  v-model="walletAddressesForm.eosMemo"
                  placeholder='EOS memo'
                )

          .col-5.flex.items-center.q-pl-md
            .text-body2.text-grey-7 Select this as preferred address
            q-toggle(v-model="toggles.eos" color="secondary" :disable="true")
          .col-7
            p.text-caption.text-weight-thin.text-grey-7.text-right.q-mt-xs.q-mb-none Need a new EOS address?
              a(href='#').q-ml-sm Click here

      section.column.full-width.q-mb-xl(v-show="activeStepIndex === 3")
        label.h-h4.q-mt-md Your contact info
        p.text-caption.text-weight-thin.text-grey-7.q-mt-md Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        .row.items-end
          .col-7
            text-input-toggle(
                :icon="'img:'+ require('~/assets/icons/phone.svg')"
                :iconBackground= "false"
                :showToggle="false"
                :text.sync = "form.phoneNumber"
                :validateRules="[toggles.phoneNumber && rules.required, form.phoneNumber && rules.phoneFormat]"
                label="Phone"
                ref="phoneNumber"
              )
          .col-5.flex.items-center.q-pl-md
            .text-body2.text-grey-7 Select this as preferred contact method
            q-toggle(v-model="toggles.phoneNumber" color="secondary")
        .row.items-end
          .col-7
            text-input-toggle.full-width(
                :icon="'img:'+ require('~/assets/icons/email.svg')"
                :iconBackground= "false"
                :showToggle="false"
                :text.sync = "form.email"
                :validateRules="[toggles.email && rules.required, form.email && rules.emailFormat]"
                label="Email"
                ref="email"
              )
          .col-5.flex.items-center.q-pl-md
            .text-body2.text-grey-7 Select this as preferred contact method
            q-toggle(v-model="toggles.email" color="secondary")

      div.row.full-width
        .text-red.bg-white(v-if="error") {{ error }}

      nav.row.justify-end.q-mt-xl.q-mb-md
        q-btn.q-px-xl.q-mr-sm(
          :disable="submitting"
          @click="onPrevStep"
          color="primary"
          label="Previous"
          no-caps
          outline
          rounded
          unelevated
          v-show="activeStepIndex > 0"
        )
        q-btn.q-px-xl.q-ml-sm(
          :disable="submitting"
          :loading="submitting"
          @click="onNextStep"
          color="primary"
          label="Next"
          no-caps
          rounded
          unelevated
        )

  .column.col-xs-12.col-sm-3.col-md-3
    //- TODO: Refactor to encompass proposal creation, and dho creation
    widget
      .h-h4.q-my-md Creation process
      q-list().q-pt-md.wizard
        template(v-for="(step, index) in steps")
          q-item(:key="index" ).q-py-md.q-px-none.wizard-item
            q-item-section(avatar)
              transition(enter-active-class="animated fadeIn" leave-active-class="animated fadeOut")
                span(v-show='activeStepIndex > index').wizard-item-line
              div(:class="activeStepIndex === index && 'active'").text-bold.wizard-item-icon
                span(v-show='activeStepIndex <= index') {{ index + 1 }}
                q-icon(v-show='activeStepIndex > index' center size='10px' name="fas fa-check")
            q-item-section
              div(:class="activeStepIndex === index && 'text-bold text-primary'").text-body2.q-pl-sm {{ capitalizeFirstLetter(step) }}
      //- q-btn.full-width.q-mt-xl.q-mb-md(
      //-     label="Done"
      //-     color="primary"
      //-     unelevated
      //-     rounded
      //-     no-caps
      //-     @click="onNextStep"
      //-     :disable="!lastStep"
      //-   )
</template>

<style lang="stylus" scoped>
.rounded-border
  :first-child
    border-radius 15px

.wizard-item
  position: relative;
  z-index: 10;

.wizard-item-line
  height: 99%;
  border: 2px solid #242f5d;
  position: absolute;
  top: 1em;
  margin-top: .5em;
  z-index: 1;
  margin-left: 13px;

.wizard-item-icon
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  z-index: 1000;
  background-color: white;
  color: var(--q-color-primary);
  border: 1px solid var(--q-color-primary) !important;

.wizard-item-icon.active
  background-color: white;
  background-color: var(--q-color-primary) ;
  color: white;
</style>
