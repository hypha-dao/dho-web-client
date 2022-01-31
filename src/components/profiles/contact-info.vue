<script>
import { validation } from '~/mixins/validation'
import { Notify } from 'quasar'

/**
 * Contact info component that is responsible for rendering and updating the contact info
 */
export default {
  name: 'contact-info',
  mixins: [validation],
  components: {
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    emailInfo: Object,
    smsInfo: Object
  },

  data () {
    return {
      form: {
        phone: null,
        email: null
      },
      phoneToggle: false,
      emailToggle: false,
      editable: false,
      submitting: false
    }
  },

  created () {
    this.reset()
  },

  computed: {

  },

  methods: {
    cancel () {
      this.editable = false
      this.reset()
    },

    async save () {
      const valid = await this.validateForm()
      if (!valid || (!this.phoneToggle && !this.emailToggle)) {
        this.reset()
      } else {
        Notify.create({
          message: 'Saving...',
          type: 'ongoing',
          position: 'bottom',
          timeout: 5000
        })
        this.$emit('onSave', {
          phone: this.form.phone,
          email: this.form.email
        }, this.success, this.fail)
      }
      this.editable = false
    },

    success () {
      this.submitting = false
      Notify.create({
        message: 'Successfully saved',
        type: 'positive',
        position: 'bottom',
        timeout: 5000
      })
    },

    fail (message) {
      this.reset()
      Notify.create({
        message: 'Something went wrong',
        type: 'negative',
        position: 'bottom',
        timeout: 5000
      })
    },

    async validateForm () {
      await this.resetValidation(this.form)
      return await this.validate(this.form)
    },

    reset () {
      this.form.phone = this.smsInfo.value
      this.form.email = this.emailInfo.value
      this.phoneToggle = this.smsInfo.exists
      this.emailToggle = this.emailInfo.exists
      this.submitting = false
    }
  }
}
</script>

<template lang="pug">
widget(title="Contact Info"
  subtitle = "Only visible to you"
  editable = true
  @onEdit="editable = true"
  @onCancel="cancel"
  @onSave="save")
  .row.items-center.justify-center
    .col-1
      .text-caption.text-weight-bold.q-mb-sm Phone
      q-btn(round unelevated icon="fas fa-phone" color="primary" text-color="white" size="sm" :ripple="false")
    .col.q-pr-lg
      .row
        q-space
        q-toggle(v-model="phoneToggle" color="secondary" :disable= "!editable")
      .row
        q-input.full-width(dense rounded outlined
          ref="phone"
          v-model="form.phone"
          label="Phone"
          placeholder="+39 325 541 6341"
          type = "tel"
          :rules="[rules.required, rules.phoneFormat]"
          :disable= "!phoneToggle || !editable")
    .col-1
      .text-caption.text-weight-bold.q-mb-sm Email
      q-btn(round unelevated icon="far fa-envelope" color="primary" text-color="white" size="sm" :ripple="false")
    .col
      .row
        q-space
        q-toggle(v-model="emailToggle" color="secondary" :disable= "!editable")
      .row
      q-input.full-width(dense rounded outlined
        ref="email"
        v-model="form.email" label="Email"
        placeholder="emailadress@email.com"
        type = "email",
        :rules="[rules.required, rules.emailFormat]"
        :disable= "!emailToggle || !editable")
</template>

<style lang="stylus" scoped>

</style>
