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
    .row.items-center.justify-around
      .col-auto
        q-avatar.q-mr-sm.flex(size="md")
          img(:src="logo")
      .col-9
        .row.bg-grey-4.q-gutter-x-xs.justify-between.flex.value-container.full-width.q-pa-sm
          .text-body2.text-weight-thin.text-grey-7.text-no-wrap  {{formattedAmount}}
          .text-body2.text-weight-bold.text-grey-7.text-right.text-wrap {{tokenName}}
</template>

<style lang="stylus" scoped>
.value-container
  border-radius: 10px
.text-wrap
  white-space: nowrap
  max-width: 100px
  text-overflow: ellipsis
  overflow: hidden
</style>
