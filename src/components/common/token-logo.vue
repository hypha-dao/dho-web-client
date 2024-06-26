<script lang="ts">
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'
import IpfsImageViewer from '~/components/ipfs/ipfs-image-viewer.vue'
import currency from 'src/data/currency.json'

const mapCurrency = (currency) => (_) => ({
  label: `${currency[_]?.symbol} - ${currency[_]?.name}`,
  value: currency[_].code,
  ...currency[_]
})

/**
 * Displays a token, icon
 * Can be a custom image or can be constructed using logo
 */
export default defineComponent({
  name: 'token-logo',
  components: {
    IpfsImageViewer
  },

  props: {
    /**
     * Icon
     */
    customIcon: String,
    /**
     * utility | cash | voice
     * Determines the icon that will be shown if no icon is provided
     */
    type: {
      type: String,
      default: 'utility'
    },
    /**
     * IPFS CID of the DAO logo
     */
    daoLogo: {
      type: String,
      default: undefined
    },
    size: {
      type: String,
      default: 'md'
    }
  },

  computed: {
    ...mapGetters('dao', ['daoSettings']),
    currencies () { return Object.keys(currency).map(mapCurrency(currency)) }
  },

  methods: {
    getCurrencySymbol(code) {
      return this.currencies.find(currency => currency.code === code).symbol
    }
  }
})
</script>

<template lang="pug">
.row.items-center.justify-center
  .col-auto.on-left(v-if="customIcon")
    q-avatar(:size="size")
      img(:src="customIcon")
  .col-auto.on-left(v-else)
    q-avatar(:size="size")
      ipfs-image-viewer(:color="daoLogo ? 'white' : 'secondary'" :ipfsCid="daoLogo" :size="size" showDefault)
      .div.absolute.text-white.token-overlay(v-if="type === 'voice' || type === 'cash'")
      .div.absolute.text-white.token-text(v-if="type === 'voice'") V
      .div.absolute.text-white.token-text(v-if="type === 'cash'") {{ daoSettings.treasuryCurrency ? getCurrencySymbol(daoSettings.treasuryCurrency): '$' }}
</template>
<style scoped lang="stylus">
.token-text
  color white
  font-family: 'Source Sans Pro', sans-serif
  font-size: 145%
  font-style: italic
  font-weight: bold
  width: 100%
  height: 100%
  display: flex
  align-items: center
  justify-content: center
.token-overlay
  opacity 0.75
  background-color: var(--q-color-primary)
  width: 100%
  height: 100%
  border-radius: 50%
</style>
