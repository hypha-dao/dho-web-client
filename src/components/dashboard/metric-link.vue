<script>
export default {
  name: 'metric-link',
  components: {
    Widget: () => import('../common/widget.vue')
  },
  props: {
    amount: String,
    link: String,
    title: String,
    icon: String,
    linkLabel: String
  },
  methods: {
    redirectToLink () {
      this.$router.push({ path: `${this.link}` })
      // this.$router.push({ path: `preview/${this.link}` })
    }
  }
}
</script>

<template lang="pug">
widget.cursor-pointer
  #container(@click="redirectToLink")
    .row
      .col-6.text-left
        q-btn(round unelevated :icon="icon" color="primary" text-color="white" size="sm" :ripple="false")
      .col-6
    .row.justify-between.items-end
      .col-6
        .text-h4.q-pa-none.text-bold.text-grey-9.text-left {{ amount }}
        .text-subtitle2.text-no-wrap.text-grey-7.text-capitalize {{ title }}
      .col-6(@click="redirectToLink")
        .action-label.text-bold.text-primary.text-capitalize.text-right {{ linkLabel }}
</template>

<style lang="stylus" scoped>
.action-label
  font-size: 0.8rem
</style>
