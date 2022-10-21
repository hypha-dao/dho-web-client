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
    /**
     * Object containing email info { value: String}
     */
    emailInfo: Object,
    /**
     * Object containing sms info { value: String}
     */
    smsInfo: Object,
    /**
     * Prefered comunication method SMS || EMAIL
     */
    commPref: String
  },

  data () {
    return {
      form: {
        phone: null,
        email: null,
        commPref: null
      },
      toggles: {
        phone: false,
        email: false
      },
      editable: false,
      savable: false
    }
  },

  mounted () {
    this.reset()
  },

  computed: {

  },

  watch: {
    emailInfo: {
      handler: async function () {
        this.reset()
      },
      immediate: false,
      deep: true
    },
    smsInfo: {
      handler: async function () {
        this.reset()
      },
      immediate: false,
      deep: true
    },
    commPref: {
      handler: async function () {
        this.reset()
      },
      immediate: false,
      deep: true
    },
    form: {
      handler: async function () {
        this.savable = await this.isSavable()
      },
      immediate: false,
      deep: true
    },
    'toggles.phone': {
      handler: async function (value) {
        this.savable = await this.isSavable()
        if (value) {
          this.form.commPref = 'SMS'
          this.toggles.email = false
        }
      },
      immediate: false
    },
    'toggles.email': {
      handler: async function (value) {
        this.savable = await this.isSavable()
        if (value) {
          this.form.commPref = 'EMAIL'
          this.toggles.phone = false
        }
      },
      immediate: false
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
      this.form.phone = this.smsInfo?.value || ''
      this.form.email = this.emailInfo?.value || ''
      this.form.commPref = this.commPref
      this.toggles.phone = this.commPref === 'SMS'
      this.toggles.email = this.commPref === 'EMAIL'
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
    .col-md.col-12(:class="{'q-pr-lg': $q.screen.gt.sm}")
      text-input-toggle(
        ref="phone"
        :text.sync = "form.phone"
        :toggle.sync = "toggles.phone"
        icon="fas fa-phone"
        label="Phone"
        :validateRules="[toggles.phone && rules.required, form.phone && rules.isPhoneNumber]"
        :disable= "!editable"
        type= "tel" )
    .col-md.col-12
      text-input-toggle(
        ref="email"
        :text.sync = "form.email"
        :toggle.sync = "toggles.email"
        icon="fas fa-envelope"
        label="Email"
        :validateRules="[toggles.email && rules.required, form.email && rules.isEmail]"
        :disable= "!editable"
        type= "email" )
</template>

<style lang="stylus" scoped>
</style>
