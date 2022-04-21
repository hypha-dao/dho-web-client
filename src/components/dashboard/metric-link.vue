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
    link: [String, Object],
    title: String,
    icon: String
  },
  methods: {
    redirectToLink () {
      if (!this.link) return
      if (typeof this.link === 'string') return this.$router.push({ name: this.link, params: { dhoname: this.$route.params.dhoname } })
      return this.$router.push({ name: this.link.link, path: this.link.path, params: { ...this.link.params, dhoname: this.$route.params.dhoname }, query: this.link.query })
      // this.$router.push({ path: `preview/${this.link}` })
    }
  }
}
</script>

<template lang="pug">
widget(noPadding :class="link ? 'cursor-pointer' : ''")
  #container(@click="redirectToLink").q-px-xxl.q-py-xl
    .row
      .col
        .h-h1.q-pa-none.text-left.ellipsis {{ amount }}
    .row.full-width.flex-justify-arround.items-center.q-pt-xxs.no-wrap
      .col-10
        .h-b1.text-grey-7.ellipsis {{ title }}
      .col.flex.justify-end.q-pl-xxl(v-if="link")
        q-btn(flat rounded dense icon="fas fa-chevron-right" color="inherit" text-color="primary" size="xs" :ripple="false")
</template>

<style lang="stylus" scoped>
.action-label
  font-size: 0.8rem
</style>
