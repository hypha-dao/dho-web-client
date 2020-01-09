<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'dashboard',
  data () {
    return {
      tokens: {
        hvoice: 0,
        hypha: 0,
        seeds: 0
      }
    }
  },
  computed: {
    ...mapGetters('accounts', ['account'])
  },
  methods: {
    ...mapActions('profiles', ['getTokensAmounts']),
    async loadTokens () {
      this.tokens = await this.getTokensAmounts(this.account)
    }
  },
  watch: {
    account: {
      immediate: true,
      handler: async function () {
        await this.loadTokens()
      }
    }
  }
}
</script>

<template lang="pug">
q-page.q-pa-lg
  .row
    .col-2
      q-card(v-if="account")
        q-card-section.text-center.bg-primary.text-white.q-mb-lg
          .text-h6 Tokens held
        q-card-section.text-right
          | {{ tokens.hypha }} #[strong HYPHA]
        q-card-section.text-right
          | {{ tokens.hvoice }} #[strong HVOICE]
        q-card-section.text-right
          | {{ tokens.seeds }} #[strong SEEDS]
</template>

<style lang="sass" scoped>

</style>
