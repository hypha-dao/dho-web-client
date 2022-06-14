<script>
import parsePhoneNumber from 'libphonenumber-js'
import { countriesPhoneCode } from '~/mixins/countries-phone-code'
import { validation } from '~/mixins/validation'

export default {
  name: 'form-phone-number',
  mixins: [countriesPhoneCode, validation],
  props: {
    value: { type: String },
    initValue: { type: String },
    outlined: { type: Boolean, default: () => false },
    required: { type: Boolean, default: () => false }
  },
  data () {
    return {
      form: {
        country: null,
        number: null
      },
      phoneOptions: []
    }
  },
  async mounted () {
    this.phoneOptions = this.countriesPhoneCode.map(
      country => ({
        value: `${country.dialCode}_${country.code}`,
        label: `${country.name} (${country.dialCode})`
      })
    )
  },
  methods: {
    isPhoneValid () {
      if (!this.form.country || !this.form.number) return true
      try {
        const phoneUtil = PhoneNumberUtil.getInstance()
        const number = parsePhoneNumber(`${this.form.country.split('_')[0]}${this.form.number}`, this.form.country.split('_')[1])
        if (phoneUtil.isValid()) {
          this.$emit('update:value', number.formatInternational())
          return true
        }
        this.$emit('update:value', null)
        return 'Please type a valid phone'
      } catch (e) {
        this.$emit('update:value', null)
        return 'Please type a valid phone'
      }
    },
    async onValidate () {
      this.resetValidation(this.form)
      return this.validate(this.form)
    }
  },
  watch: {
    initValue: {
      immediate: true,
      handler (val) {
        if (val) {
          try {
            const phoneUtil = PhoneNumberUtil.getInstance()
            const number = phoneUtil.parseAndKeepRawInput(val)
            this.form.country = `+${number.getCountryCode()}_${phoneUtil.getRegionCodeForNumber(number)}`
            this.form.number = number.getNationalNumber()
          } catch (e) {
            // Do nothing
          }
        }
      }
    }
  }
}
</script>

<template lang="pug">
.row.flex.phone-input
  q-select(
    ref="country"
    v-model="form.country"
    :options="phoneOptions"
    :label="`Country${required ? '*' : ''}`"
    map-options
    emit-value
    :rules="[rules.requiredIf(required), isPhoneValid]"
    lazy-rules
    :outlined="outlined"
    :style="{width:'50%'}"
  )
  q-input(
    ref="number"
    v-model="form.number"
    color="accent"
    :label="`Phone number${required ? '*' : ''}`"
    :rules="[rules.requiredIf(required), isPhoneValid]"
    lazy-rules
    :outlined="outlined"
    :style="{width:'50%'}"
  )
</template>

<style lang="stylus" scoped>
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
