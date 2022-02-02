<script>
import { validation } from '~/mixins/validation'

/**
 * Contact info component that is responsible for rendering and updating the contact info
 */
export default {
  name: 'contact-info',
  mixins: [validation],
  components: {
    WidgetEditable: () => import('~/components/common/widget-editable.vue'),
    TextInputToggle: () => import('~/components/form/text-input-toggle.vue')
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
      toggles: {
        phone: false,
        email: false
      },
      editable: false,
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
    toggles: {
      handler: async function () {
        this.savable = await this.isSavable()
      },
      immediate: false,
      deep: true
    }
  },

  methods: {
    async isSavable () {
      const valid = await this.validateForm()
      return valid && (this.toggles.email || this.toggles.phone)
    },

    onEdit () {
      this.savable = false
      this.editable = true
    },

    cancel () {
      this.editable = false
      this.reset()
    },

    async save (success, fail) {
      this.$emit('onSave', this.form, success, fail)
      this.editable = false
    },

    async validateForm () {
      await this.resetValidation(this.form)
      return await this.validate(this.form)
    },

    reset () {
      this.form.phone = this.smsInfo.value
      this.form.email = this.emailInfo.value
      this.toggles.phone = this.smsInfo.exists
      this.toggles.email = this.emailInfo.exists
    }
  }
}
</script>

<template lang="pug">
widget-editable(title="Contact Info"
  subtitle = "Only visible to you"
  editable = true
  @onCancel="cancel"
  @onEdit="onEdit"
  @onSave="save"
  @onFail="reset"
  :savable= "savable")
  .row
    .col.q-pr-lg
      text-input-toggle(
        ref="phone"
        :text.sync = "form.phone"
        :toggle.sync = "toggles.phone"
        icon="fas fa-phone"
        label="Phone"
        :validateRules="[rules.required && toggles.phone, rules.phoneFormat]"
        :disable= "!editable"
        type= "tel" )
    .col.q-pr-lg
      text-input-toggle(
        ref="email"
        :text.sync = "form.email"
        :toggle.sync = "toggles.email"
        icon="fas fa-envelope"
        label="Email"
        :validateRules="[rules.required && toggles.email, rules.emailFormat]"
        :disable= "!editable"
        type= "email" )
</template>

<style lang="stylus" scoped>
.rounded-border
  :first-child
    border-radius 12px
</style>
