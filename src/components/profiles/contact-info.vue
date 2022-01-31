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
      submitting: false,
      savable: false
    }
  },

  created () {
    this.reset()
  },

  computed: {

  },

  watch: {
    form: {
      handler: async function () {
        this.savable = await this.isSavable()
      },
      immediate: false,
      deep: true
    },
    phoneToggle: {
      handler: async function () {
        this.savable = await this.isSavable()
      },
      immediate: false
    },
    emailToggle: {
      handler: async function () {
        this.savable = await this.isSavable()
      },
      immediate: false
    }
  },

  methods: {
    async isSavable () {
      const valid = await this.validateForm()
      return valid && (this.emailToggle || this.phoneToggle)
    },

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
  @onSave="save"
  :savable= "savable")
  .row.items-end.justify-center
    .col-auto.q-mr-sm.q-mb-lg
      .text-caption.text-weight-bold.q-mb-sm Phone
      q-btn.q-pa-xs(round unelevated icon="fas fa-phone" color="primary" text-color="white" size="sm" :ripple="false")
    .col.q-pr-lg
      .row
        q-space
        q-toggle(v-model="phoneToggle" color="secondary" :disable= "!editable")
      .row
        q-input.full-width.rounded-border(dense outlined
          ref="phone"
          v-model="form.phone"
          label="Phone"
          placeholder="+39 325 541 6341"
          type = "tel"
          :rules="[rules.required, rules.phoneFormat]"
          :disable= "!phoneToggle || !editable")
    .col-auto.q-mr-sm.q-mb-lg
      .text-caption.text-weight-bold.q-mb-sm Email
      q-btn.q-pa-xs(round unelevated icon="far fa-envelope" color="primary" text-color="white" size="sm" :ripple="false")
    .col
      .row
        q-space
        q-toggle(v-model="emailToggle" color="secondary" :disable= "!editable")
      .row
      q-input.full-width.rounded-border(dense outlined
        ref="email"
        v-model="form.email" label="Email"
        placeholder="emailadress@email.com"
        type = "email",
        :rules="[rules.required, rules.emailFormat]"
        :disable= "!emailToggle || !editable")
</template>

<style lang="stylus" scoped>
.rounded-border
  :first-child
    border-radius 12px
</style>
