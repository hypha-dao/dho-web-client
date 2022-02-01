<script>
export default {
  name: 'metric-link',
  components: {
    Widget: () => import('../common/widget.vue'),
    ComingSoonTag: () => import('~/components/common/coming-soon-tag')
  },
  props: {
    amount: {
      type: [String, Number]
    },
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
widget(noPadding).cursor-pointer.q-py-md.full-height
  #container.q-px-sm(@click="redirectToLink")
    .row
      .self-center.q-mr-md
        q-btn(round unelevated :icon="icon" color="primary" text-color="white" size="sm" :ripple="false")
      .col
        .text-h4.q-pa-none.text-bold.text-grey-9.text-left {{ amount }}
      .self-center
        q-btn(round unelevated icon="fas fa-chevron-right" color="inherit" text-color="primary" size="sm" :ripple="false")
    .row.full-width
      .text-subtitle2.text-grey-7.text-capitalize.text-center {{ title }}
</template>

<style lang="stylus" scoped>
.action-label
  font-size: 0.8rem
</style>
