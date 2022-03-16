<script>
export default {
  name: 'treasury-token',
  components: {
    Widget: () => import('../common/widget.vue')
  },
  props: {
    /**
     * Logo url
     */
    logo: String,
    /**
     * Token Name
     */
    tokenName: String,
    /**
     * Token Amount
     */
    amount: Number
  },
  data () {
    return {
    }
  },
  computed: {
    formattedAmount () {
      let lang
      if (navigator.languages !== undefined) { lang = navigator.languages[0] } else { lang = navigator.language }
      if (this.amount > 1000000) {
        return (new Intl.NumberFormat(lang, { notation: 'compact', compactDisplay: 'short' }).format(this.amount)).slice(0)
      } else {
        return (new Intl.NumberFormat(lang, { style: 'currency', currency: 'USD' }).format(this.amount)).slice(0)
      }
    }
  }
}
</script>

<template lang="pug">
  #container
    .row.items-center.justify-around-q-pa-none.q-ma-none
      .col-auto
        q-avatar.flex(size="40px").q-mr-xs
          img(:src="logo")
      .col-9
        .row.bg-internal-bg.q-gutter-x-xxs.justify-between.flex.value-container.full-width.q-pa-xs
          .h-b2.text-body.text-no-wrap  {{formattedAmount}}
          .h-b2.text-body.text-right.text-wrap.text-weight-bold.q-mr-xxs {{tokenName}}
</template>

<style lang="stylus" scoped>
.value-container
  border-radius: 15px
.text-wrap
  white-space: nowrap
  max-width: 100px
  text-overflow: ellipsis
  overflow: hidden
</style>
