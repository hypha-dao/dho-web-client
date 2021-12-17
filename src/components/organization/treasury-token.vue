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
    amount: String
  },
  data () {
    return {
    }
  }
}
</script>

<template lang="pug">
  #container
    .row.items-center.justify-around
      .col-auto
        q-avatar.q-mr-sm.flex(size="md")
          img(src="../../assets/logos/hypha-logo.png")
      .col-9
        .row.bg-grey-4.q-gutter-x-xs.justify-between.flex.value-container.full-width.q-pa-sm
          .text-body2.text-weight-thin.text-grey-7.text-no-wrap  {{amount}}
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
