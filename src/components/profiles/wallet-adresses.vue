<script>
import { validation } from '~/mixins/validation'

/**
 * Contact info component that is responsible for rendering and updating the wallet adresses
 */
export default {
  name: 'wallet-adresses',
  mixins: [validation],
  components: {
    WidgetEditable: () => import('~/components/common/widget-editable.vue'),
    TextInputToggle: () => import('~/components/form/text-input-toggle.vue')
  },

  props: {
    eosAccount: String
  },

  data () {
    return {
      form: {
        bitcoin: null,
        ethereun: null,
        eos: null
      },
      toggles: {
        bitcoin: false,
        ethereun: false,
        eos: false
      },
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
      return valid && (this.emailToggle || this.phoneToggle)
    },

    cancel () {
      this.editable = false
      this.reset()
    },

    async save (success, fail) {
      this.$emit('onSave', this.form, success, fail)
      this.editable = false
    },

    onEdit () {
      this.savable = false
      this.editable = true
    },

    async validateForm () {
      await this.resetValidation(this.form)
      return await this.validate(this.form)
    },

    reset () {
      this.form.eos = this.eosAccount
      this.toggles.eos = this.eosAccount != null
    }
  }
}
</script>

<template lang="pug">
widget-editable(title="Wallet Adresses"
  subtitle = "Only visible to you"
  editable = true
  @onCancel="cancel"
  @onEdit="onEdit"
  @onSave="save"
  :savable= "savable")
    .row
      text-input-toggle(
        ref="bitcoin"
        :text.sync = "form.bitcoin"
        :toggle.sync = "toggles.bitcoin"
        icon="fas fa-phone"
        label="Bitcoin"
        :validateRules="[rules.required]"
        :disable= "!editable"
        type= "text" )
    .row
      text-input-toggle(
        ref="ethereum"
        :text.sync = "form.ethereum"
        :toggle.sync = "toggles.ethereum"
        icon="fas fa-phone"
        label="Ethereum"
        :validateRules="[rules.required]"
        :disable= "!editable"
        type= "text" )
    .row
      text-input-toggle(
        ref="eos"
        :text.sync = "form.eos"
        :toggle.sync = "toggles.eos"
        icon="fas fa-phone"
        label="EOS"
        :validateRules="[rules.required]"
        :disable= "!editable"
        type= "text" )
</template>

<style lang="stylus" scoped>
.rounded-border
  :first-child
    border-radius 12px
</style>
