<script>
export default {
  name: 'transaction-history',
  components: {
    Widget: () => import('~/components/widget.vue')
  },

  props: {
    more: Boolean,
    transactions: Array
  },

  methods: {
    dateString (timestamp) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' }
      return new Date(timestamp).toLocaleDateString(undefined, options)
    }
  }
}
</script>

<template lang="pug">
widget(bar :more="more" title="My transactions")
  q-list
    template(v-for="(item, index) in transactions")
      q-item(clickable v-ripple).transaction-item
        q-item-section
          q-item-label(lines="2").text-body1.text-bold {{ item.account + ':' + item.name }}
          q-item-label.caption {{ dateString(item.timestamp) }}
        q-item-section(side)
          q-icon(name="fas fa-chevron-right")
      q-separator(v-if="index < transactions.length - 1" spaced inset :key="'sep' + index")
</template>

<style lang="stylus" scoped>
.transaction-item
  color #728191
</style>
