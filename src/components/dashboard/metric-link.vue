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
      if (!this.link) return
      this.$router.push({ path: `${this.link}` })
      // this.$router.push({ path: `preview/${this.link}` })
    }
  }
}
</script>

<template lang="pug">
widget(noPadding :class="link ? 'cursor-pointer' : ''").q-py-md.full-height
  #container.q-px-sm(@click="redirectToLink")
    .row
      .col.q-pl-md
        .h-h1.q-pa-none.text-left {{ amount }}
    .row.full-width
      .col
        .q-pl-md.q-pt-xs.h-b1.text-grey-7 {{ title }}
      .self-center(v-if="link")
        q-btn(round unelevated class="round-circle" icon="fas fa-chevron-right" color="inherit" text-color="primary" size="sm" :ripple="false")
</template>

<style lang="stylus" scoped>
.action-label
  font-size: 0.8rem
</style>
