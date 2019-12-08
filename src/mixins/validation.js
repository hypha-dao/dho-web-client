import { mapActions } from 'vuex'
import { isURL } from 'validator'

export const validation = {
  data () {
    return {
      rules: {
        accountFormat: val => /^([a-z]|[1-5]){12}$/.test(val.toLowerCase()) || 'The account must contain lowercase characters only and number from 1 to 5.',
        accountLength: val => val.length === 12 || 'The account must contain 12 characters',
        isAccountAvailable: async account => (await this.isAccountFree(account.toLowerCase())) || `The account "${account}" already exists`,
        required: val => !!val || 'This field is required',
        positiveAmount: val => parseFloat(val) >= 0 || 'You must type a positive amount',
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
            valid = await this.$refs[key].validate() && valid
          }
        }
      }
      return valid
    },
    resetValidation (form) {
      if (!form) return
      for (const key of Object.keys(form)) {
        if (Array.isArray(form[key])) {
          for (let i = 0; i < form[key].length; i += 1) {
            for (const subKey of Object.keys(form[key][i])) {
              this.$refs[`${key}${i}_${subKey}`][0].resetValidation()
            }
          }
        } else {
          if (this.$refs[key]) {
            this.$refs[key].resetValidation()
          }
        }
      }
    }
  }
}
