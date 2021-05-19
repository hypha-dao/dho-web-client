<script>
export default {
  name: 'transaction-history',
  components: {
    Widget: () => import('~/components/common/widget.vue')
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
widget(:more="more" title="Transaction History")
  q-list.margin-fix
    template(v-for="(item, index) in transactions")
      q-item(clickable v-ripple)
        q-item-section
          q-item-label(lines="2").text-body1.text-bold {{ item.account + ':' + item.name }}
          q-item-label.caption {{ dateString(item.timestamp) }}
        q-item-section(side)
          q-icon(name="fas fa-chevron-right")
      q-separator(v-if="index < transactions.length - 1" spaced inset :key="'sep' + index")
</template>

<style lang="stylus" scoped>
// Add negative margins to the list so its
// contents line up properly with widget title
.margin-fix
  margin-left -16px
  margin-right -16px
</style>
