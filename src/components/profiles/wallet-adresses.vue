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
    walletAdresses: Object
  },

  data () {
    return {
      form: {
        btcAddress: null,
        ethAddress: null,
        eosAccount: null,
        eosMemo: null,
        defaultAddress: null
      },
      toggles: {
        bitcoin: false,
        ethereum: false,
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

  watch: {
    form: {
      handler: async function () {
        this.savable = await this.isSavable()
      },
      immediate: false,
      deep: true
    },
    'toggles.bitcoin': {
      handler: async function (value, old) {
        if (value) {
          this.form.defaultAddress = 'btcaddress'
          this.toggles.ethereum = false
          this.toggles.eos = false
        }
        this.savable = await this.isSavable()
      }
    },
    'toggles.ethereum': {
      handler: async function (value) {
        if (value) {
          this.form.defaultAddress = 'ethaddress'
          this.toggles.bitcoin = false
          this.toggles.eos = false
        }
        this.savable = await this.isSavable()
      }
    },
    'toggles.eos': {
      handler: async function (value) {
        if (value) {
          this.form.defaultAddress = 'eosaccount'
          this.toggles.ethereum = false
          this.toggles.bitcoin = false
        }
        this.savable = await this.isSavable()
      }
    }
  },

  methods: {
    async isSavable () {
      const valid = await this.validateForm()
      return valid && (this.toggles.bitcoin || this.toggles.ethereum || this.toggles.eos)
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
      if (this.walletAdresses) {
        this.form.eosMemo = this.walletAdresses.eosMemo
        this.form.eosAccount = this.walletAdresses.eosAccount
        this.toggles.eos = this.walletAdresses.defaultAddress === 'eosaccount'

        this.form.ethAddress = this.walletAdresses.ethAddress
        this.toggles.ethereum = this.walletAdresses.defaultAddress === 'ethaddress'

        this.form.btcAddress = this.walletAdresses.btcAddress
        this.toggles.bitcoin = this.walletAdresses.defaultAddress === 'btcaddress'
      }
    }
  }
}
</script>

<template lang="pug">
widget-editable(title="Wallet Adresses"
  subtitle = "Only visible to you"
  editable = true
  :notify = "false"
  @onCancel="cancel"
  @onEdit="onEdit"
  @onSave="save"
  @onFail="reset"
  :savable= "savable")
    .row.q-mt-sm
      text-input-toggle.full-width(
        ref="bitcoin"
        :text.sync = "form.btcAddress"
        :toggle.sync = "toggles.bitcoin"
        :icon="'img:'+ require('~/assets/icons/chains/bitcoin.svg')"
        :iconBackground= "false"
        label="Bitcoin"
        :validateRules="[toggles.bitcoin && rules.required]"
        :disable= "true"
        type= "text" )
    .row.q-mt-sm
      text-input-toggle.full-width(
        ref="ethereum"
        :text.sync = "form.ethAddress"
        :toggle.sync = "toggles.ethereum"
        :icon="'img:'+ require('~/assets/icons/chains/ethereum.svg')"
        :iconBackground= "false"
        label="Ethereum"
        :validateRules="[toggles.ethereum && rules.required]"
        :disable= "true"
        type= "text" )
    .row.q-mt-sm
      text-input-toggle.full-width(
        ref="eos"
        :text.sync = "form.eosAccount"
        :toggle.sync = "toggles.eos"
        :icon="'img:'+ require('~/assets/icons/chains/eos.svg')"
        :iconBackground= "false"
        label="EOS"
        :validateRules="[toggles.eos && rules.required]"
        :disable= "!editable"
        type= "text" )
          q-input.full-width.rounded-border.q-mt-xs(dense outlined
            ref="eosMemo"
            v-model="form.eosMemo"
            type = "text"
            :disable= "!editable")
</template>

<style lang="stylus" scoped>
.rounded-border
  :first-child
    border-radius 12px
</style>
