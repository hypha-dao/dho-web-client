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
    icon: String
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
      .self-center.q-mr-md
        q-btn(round unelevated :icon="icon" color="primary" text-color="white" size="sm" :ripple="false")
      .col
        .text-h4.q-pa-none.text-bold.text-grey-9.text-left {{ amount }}
        .text-subtitle2.text-no-wrap.text-grey-7.text-capitalize {{ title }}
      .self-center
        q-btn(round unelevated icon="fas fa-chevron-right" color="inherit" text-color="primary" size="sm" :ripple="false")
</template>

<style lang="stylus" scoped>
.action-label
  font-size: 0.8rem
</style>
