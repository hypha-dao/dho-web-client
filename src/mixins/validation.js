import { mapActions } from 'vuex'
import { isURL } from 'validator'

export const validation = {
  data () {
    return {
      rules: {
        accountFormat: val => /^([a-z]|[1-5]|.){1,12}$/.test(val.toLowerCase()) || 'The account must contain lowercase characters only, number from 1 to 5 or a period.',
        accountFormatBasic: val => /^([a-z]|[1-5]){12}$/.test(val.toLowerCase()) || 'The account must contain lowercase characters only and number from 1 to 5.',
        accountLength: val => val.length === 12 || 'The account must contain 12 characters',
        isAccountAvailable: async account => (await this.isAccountFree(account.toLowerCase())) || `The account "${account}" already exists`,
        accountExists: async account => !(await this.isAccountFree(account.toLowerCase())) || `The account "${account}" doesn't exist`,
        required: val => !!val || 'This field is required',
        requiredIf: cond => val => {
          if (!cond) {
            return true
          }
          if (cond && !!val) {
            return true
          }
          return 'This field is required'
        },
        positiveAmount: val => parseFloat(val) >= 0 || 'You must type a positive amount',
        lessOrEqualThan: value => val => val <= value || `The value must be less than or equal to ${value}`,
        moreOrEqualThan: value => val => val >= value || `The value must be more than or equal to ${value}`,
        url: val => !val || isURL(val) || 'Please type a valid URL'
      }
    }
  },
  methods: {
    ...mapActions('accounts', ['isAccountFree']),
    async validate (form) {
      if (!form) return true
      let valid = true
      for await (const key of Object.keys(form)) {
        if (Array.isArray(form[key])) {
          for (let i = 0; i < form[key].length; i += 1) {
            for await (const subKey of Object.keys(form[key][i])) {
              valid = await this.$refs[`${key}${i}_${subKey}`][0].validate() && valid
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
