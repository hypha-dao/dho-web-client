<script>
import { validation } from '~/mixins/validation'

/**
 * Contact info component that is responsible for rendering and updating the wallet adresses
 */
export default {
  name: 'wallet-adresses',
  mixins: [validation],
  components: {
    TextInputToggle: () => import('~/components/form/text-input-toggle.vue'),
    WidgetEditable: () => import('~/components/common/widget-editable.vue')

  },

  props: {
    isHypha: Boolean,
    walletAdresses: Object,
    modalState: Boolean
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
      savable: false,
      submitting: false
    }
  },

  mounted () {
    this.reset()
  },

  watch: {
    walletAdresses: {
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
widget-editable(:notify="false" :savable="savable" @onCancel="cancel" @onEdit="onEdit" @onFail="reset" @onSave="save" editable="editable" :subtitle="modalState ? '' : $t('profiles.wallet-adresses.onlyVisibleToYou')" :title="modalState ? '' : $t('profiles.wallet-adresses.walletAdresses')" :class="{ 'modal': modalState }" :modalState="modalState")
  template(v-if="!modalState")
    .row.q-mt-sm
      text-input-toggle.full-width(:disable="!editable || isHypha" :icon="'img:'+ require('~/assets/icons/chains/bitcoin.svg')" :iconBackground="false" :text.sync="form.btcAddress" :toggle.sync="toggles.bitcoin" :validateRules="[toggles.bitcoin && rules.required]" :label="$t('profiles.wallet-adresses.bitcoin')" :placeholder="$t('profiles.wallet-adresses.address')" ref="btcAddress" type="text")
        q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-show="!editable || isHypha") {{ $t('profiles.wallet-adresses.btcPayoutsAre') }}
    .row.q-mt-sm
      text-input-toggle.full-width(:disable="!editable || isHypha" :icon="'img:'+ require('~/assets/icons/chains/ethereum.svg')" :iconBackground="false" :text.sync="form.ethAddress" :toggle.sync="toggles.ethereum" :validateRules="[toggles.ethereum && rules.required]" :label="$t('profiles.wallet-adresses.ethereum')" :placeholder="$t('profiles.wallet-adresses.address1')" ref="ethAddress" type="text")
        q-tooltip(:content-style="{ 'font-size': '1em' }" anchor="top middle" self="bottom middle" v-show="!editable || isHypha") {{ $t('profiles.wallet-adresses.ethPayoutsAre') }}
    .row.q-mt-sm
      text-input-toggle.full-width(:disable="!editable" :icon="'img:'+ require('~/assets/icons/chains/eos.svg')" :iconBackground="false" :text.sync="form.eosAccount" :toggle.sync="toggles.eos" :validateRules="[toggles.eos && rules.required]" :label="$t('profiles.wallet-adresses.eos')" :placeholder="$t('profiles.wallet-adresses.address2')" ref="eosAccount" type="text")
        q-input.full-width.rounded-border.q-mt-xs(dense outlined :disable="!editable" :placeholder="$t('profiles.wallet-adresses.memo')" ref="eosMemo" type="text" v-model="form.eosMemo")
  template(v-else)
    .row.q-mt-sm
      .col
        text-input-toggle.full-width(:disable="!editable" :icon="'img:'+ require('~/assets/icons/chains/eos.svg')" :iconBackground="false" :text.sync="form.eosAccount" :toggle.sync="toggles.eos" :validateRules="[toggles.eos && rules.required]" :whiteInput="modalState" :label="$t('profiles.wallet-adresses.eos1')" :placeholder="$t('profiles.wallet-adresses.address3')" ref="eosAccount" type="text")
      .col-5.flex.items-end.q-ml-md
        q-input.full-width.rounded-border.q-mt-xs(dense outlined :disable="!editable" :class="{ 'bg-white': modalState }" :placeholder="$t('profiles.wallet-adresses.memo1')" ref="eosMemo" type="text" v-model="form.eosMemo")

</template>

<style lang="stylus" scoped>
.modal
  padding: 0 20px 10px 20px
  background: #F1F1F3 !important
</style>
