import { mapActions } from 'vuex'
import { isURL } from 'validator'
import { isValidPhoneNumber } from 'libphonenumber-js'
import I18n from '../utils/i18n'

export const validation = {
  data () {
    return {
      rules: {
        isEmail: (val) => /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/.test(val.toLowerCase()) || I18n.t('validation.invalidEmailFormat'),
        isPhoneNumber: (val) => isValidPhoneNumber(val.toLowerCase()) || I18n.t('validation.invalidPhoneFormat'),
        isDiscordUsername: (val) => val ? /^.{3,32}#[0-9]{4}$/gmi.test(val.toLowerCase()) || I18n.t('validation.invalidDiscordFormat') : true,
        accountFormat: val => /^([a-z]|[1-5]|.){1,12}$/.test(val.toLowerCase()) || I18n.t('validation.theAccountMustContain'),
        accountFormatBasic: val => /^([a-z]|[.]|[1-5]){12}$/.test(val.toLowerCase()) || I18n.t('validation.theAccountMustContain1'),
        accountLength: val => val.length === 12 || I18n.t('validation.theAccountMustContain2'),
        maxLength: val => value => value.length <= val || I18n.t('validation.thisFieldMustContainLessThan', { val: val }),
        isAccountAvailable: async account => (await this.isAccountAvailable(account.toLowerCase())) || I18n.t('validation.theAccountAlreadyExists', { account: account }),
        accountExists: async account => !(await this.isAccountAvailable(account.toLowerCase())) || I18n.t('validation.theAccountDoesntExists', { account: account }),
        isTokenAvailable: async token => (await this.isTokenAvailable(token.toUpperCase())) || I18n.t('validation.theTokenAlreadyExists', { token: token }),
        required: val => !!val || I18n.t('validation.thisFieldIsRequired'),
        requiredIf: cond => val => {
          if (!cond) {
            return true
          }
          if (cond && !!val) {
            return true
          }
          return I18n.t('validation.thisFieldIsRequired')
        },
        positiveAmount: val => parseFloat(val) >= 0 || I18n.t('validation.youMustTypeAPositiveAmount'),
        lessOrEqualThan: value => val => val <= value || I18n.t('validation.theValueMustBeLessThanOrEqual', { value: value }),
        greaterThan: value => val => parseFloat(val) > 0 || I18n.t('validation.youValueMustBeGreaterThan', { value: value }),
        greaterThanOrEqual: value => val => val >= value || I18n.t('validation.youValueMustBeGreaterThanOrEqual', { value: value }),
        min: number => val => val.length > number || I18n.t('validation.minimumNumberOfCharacters', { number: number }),
        max: number => val => val.length < number || I18n.t('validation.maximumNumberOfCharacters', { number: number }),
        url: val => !val || isURL(val, { require_protocol: true }) || I18n.t('validation.pleaseTypeAValidURL')
      }
    }
  },
  methods: {
    ...mapActions('accounts', ['isAccountAvailable']),
    ...mapActions('dao', ['isTokenAvailable']),
    async validate (form) {
      if (!form) return true
      let valid = true
      let el
      for await (const key of Object.keys(form)) {
        if (Array.isArray(form[key])) {
          for (let i = 0; i < form[key].length; i += 1) {
            for await (const subKey of Object.keys(form[key][i])) {
              valid = await this.$refs[`${key}.${i}.${subKey}`][0].validate() && valid
              if (!valid && !el) {
                el = this.$refs[`${key}.${i}.${subKey}`][0]
              }
            }
          }
        } else {
          if (this.$refs[key]) {
            // Form components
            if (this.$refs[key].onValidate) {
              valid = await this.$refs[key].onValidate() && valid
            } else if (this.$refs[key].validate) {
              valid = await this.$refs[key].validate() && valid
            }
            if (!valid && !el) {
              el = this.$refs[key]
            }
          }
        }
      }
      return valid
    },
    async resetValidation (form) {
      await this.$nextTick()
      if (!form) return
      for (const key of Object.keys(form)) {
        if (Array.isArray(form[key])) {
          for (let i = 0; i < form[key].length; i += 1) {
            for (const subKey of Object.keys(form[key][i])) {
              if (this.$refs[`${key}${i}_${subKey}`][0] && this.$refs[`${key}${i}_${subKey}`][0].resetValidation) {
                this.$refs[`${key}${i}_${subKey}`][0].resetValidation()
              }
            }
          }
        } else {
          if (this.$refs[key] && this.$refs[key].resetValidation) {
            this.$refs[key].resetValidation()
          }
        }
      }
    }
  }
}
