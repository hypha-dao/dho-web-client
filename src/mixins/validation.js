export const validation = {
  data () {
    return {
      rules: {
        accountFormat: val => !/[^a-z1-5]/.test(val) || 'The account must contain lowercase characters only and number from 1 to 5.',
        accountLength: val => val.length === 12 || 'The account must contain 12 characters',
        required: val => !!val || 'This field is required'
      }
    }
  },
  methods: {
    async validate (form) {
      if (!form) return true
      for await (const key of Object.keys(form)) {
        if (this.$refs[key]) {
          await this.$refs[key].validate()
        }
      }
      return Object.keys(form).reduce((valid, key) => valid && (!this.$refs[key] || !this.$refs[key].hasError), true)
    },
    resetValidation (form) {
      if (!form) return
      Object.keys(form).forEach((key) => this.$refs[key] && this.$refs[key].resetValidation())
    }
  }
}
