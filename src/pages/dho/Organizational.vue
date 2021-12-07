<script>
export default {
  name: 'dho-overview',
  components: {
    Widget: () => import('~/components/common/widget.vue'),
    MetricLink: () => import('~/components/dashboard/metric-link.vue'),
    CirclesWidget: () => import('~/components/organization/circles-widget.vue')
  },
  data () {
    return {
      circles: [
        {
          title: 'Anchor',
          description: 'A lot of things are new but the purpose of the DHO remains the same. Govern decentralized organisations.',
          icon: 'fas fa-anchor'
        },
        {
          title: 'Communication',
          description: 'A lot of things are new but the purpose of the DHO remains the same. Govern decentralized organisations.',
          icon: 'far fa-paper-plane'
        },
        {
          title: 'Financial',
          description: 'A lot of things are new but the purpose of the DHO remains the same. Govern decentralized organisations.',
          icon: 'fas fa-chart-line'
        },
        {
          title: 'Movement building',
          description: 'A lot of things are new but the purpose of the DHO remains the same. Govern decentralized organisations.',
          icon: 'fas fa-bullhorn'
        },
        {
          title: 'People',
          description: 'A lot of things are new but the purpose of the DHO remains the same. Govern decentralized organisations.',
          icon: 'fas fa-user-friends'
        },
        {
          title: 'Product',
          description: 'A lot of things are new but the purpose of the DHO remains the same. Govern decentralized organisations.',
          icon: 'fas fa-cube'
        }
      ]
    }
  }
}
</script>

<template lang="pug">
.dho-overview.q-px-xl
  .row.full-width
    .col-10
      .row.full-width.q-my-md
        .col.q-pr-sm
          metric-link(amount="26" link="treasury" title="Active assignments" icon="fas fa-coins")
        .col.q-pr-sm
          metric-link(amount="15" link="treasury" title="Active quests" icon="fas fa-coins")
        .col.q-pr-sm
          metric-link(amount="32" link="treasury" title="Recent payouts" icon="fas fa-coins")
        .col.q-pr-sm
          metric-link(amount="18" link="treasury" title="Active badges" icon="fas fa-coins")
        .col.q-pr-sm
          metric-link(amount="5" link="treasury" title="Recent strategies" icon="fas fa-coins")
      .row
        circles-widget(:circles="circles")
      .col.bg-green
</template>
