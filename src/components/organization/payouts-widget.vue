<script>
export default {
  name: 'payouts-widget',
  components: {
    Widget: () => import('../common/widget.vue'),
    PayoutCard: () => import('./payout-card.vue'),
    EmptyWidgetLabel: () => import('../common/empty-widget-label.vue')
  },
  props: {
    payouts: {
      type: Array,
      default: () => []
    },
    /**
     * Show compact style
     */
    compact: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<template lang="pug">
widget(title="Passed Generic Contributions" more morePosition="top" @more-clicked="$router.push({ name: 'search', params: { dhoname: $route.params.dhoname, findBy: 'One Time Activity' }, query: {q: 'Generic Contribution'} })").full-width
  .q-mt-xs
  .row(v-if="!payouts || payouts.length === 0")
    slot(name="empty")
      empty-widget-label(sectionTitle="Passed Generic Contributions")
  .row(v-else v-for="payout in payouts")
      .col-12
          Payout-card(v-bind="payout" :compact="compact" @click.native="$router.push({ path: `/${$route.params.dhoname}/proposals/${payout.docId}` })" )
</template>
