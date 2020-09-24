<script>
import { mapActions, mapMutations } from 'vuex'

export default {
  name: 'treasury',
  data () {
    return {
      loading: true,
      tokens: {
        husd: 0,
        hypha: 0,
        seeds: 0
      }
    }
  },
  async beforeMount () {
    this.setBreadcrumbs([{ title: 'Treasury' }])
    let lang
    if (navigator.languages !== undefined) { lang = navigator.languages[0] } else { lang = navigator.language }
    this.tokens = await this.getSupply()
    this.loading = false
    if (this.tokens.husd > 1000000) {
      this.tokens.husd = (new Intl.NumberFormat(lang, { notation: 'compact', compactDisplay: 'short' }).format(this.tokens.husd)).slice(1)
    } else {
      this.tokens.husd = (new Intl.NumberFormat(lang, { style: 'currency', currency: 'USD' }).format(this.tokens.husd)).slice(1)
    }
    if (this.tokens.hypha > 1000000) {
      this.tokens.hypha = (new Intl.NumberFormat(lang, { notation: 'compact', compactDisplay: 'short' }).format(this.tokens.hypha))
    } else {
      this.tokens.hypha = (new Intl.NumberFormat(lang, { style: 'currency', currency: 'USD' }).format(this.tokens.hypha)).slice(1)
    }
    if (this.tokens.seeds > 1000000) {
      this.tokens.seeds = (new Intl.NumberFormat(lang, { notation: 'compact', compactDisplay: 'short' }).format(this.tokens.seeds))
    } else {
      this.tokens.seeds = (new Intl.NumberFormat(lang, { style: 'currency', currency: 'USD' }).format(this.tokens.seeds)).slice(1)
    }
  },
  methods: {
    ...mapMutations('layout', ['setBreadcrumbs']),
    ...mapActions('treasury', ['getSupply'])
  }
}
</script>

<template lang="pug">
.q-pa-lg
  .row
    .payments-list(ref="paymentsListRef")
    .tokens-wallet
      .token-info.row.flex.items-center
        img.icon(src="~assets/icons/seeds.png")
        div
          .name SEEDS
          q-spinner-dots(
            v-if="loading"
            color="primary"
            size="30px"
          )
          .amount(v-else) {{ tokens.seeds }}
      .token-info.row.flex.items-center
        img.icon(src="~assets/icons/hypha.svg")
        div
          .name HYPHA
          q-spinner-dots(
            v-if="loading"
            color="primary"
            size="30px"
          )
          .amount(v-else) {{ tokens.hypha }}
      .token-info.row.flex.items-center
        img.icon(src="~assets/icons/hvoice.svg")
        div
          .name HUSD
          q-spinner-dots(
            v-if="loading"
            color="primary"
            size="30px"
          )
          .amount(v-else) {{ tokens.husd }}
</template>

<style lang="stylus" scoped>
.payments-list
  width calc(100% - 200px)
.tokens-wallet
  width 250px
  position fixed
  right -40px
.token-info
  background white
  border-radius 50px
  padding 5px 16px 5px 10px
  margin-bottom 10px
  transition margin-left 0.2s ease-in, width 0.2s ease-in
  .icon
    margin-right 15px
    width 40px
  .name
    text-transform uppercase
    font-weight 600
    font-size 16px
  .amount
    font-size 16px
.redeem-icon
  margin-right 20px
.redeem-form
  width 400px
  transition margin-left 0.2s ease-in, width 0.2s ease-in
  margin-left -160px
.table-icon
  width auto
  max-width 40px
  max-height 40px
.table-header
  font-size 16px
.button-sep
  border-right 1px solid white
.wallet-table
  background rgba(227,242,253,0.4)
  .q-table
    tbody
      td
        font-size 16px !important
</style>
