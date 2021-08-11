<script>
export default {
  name: 'proposal-list',
  components: {
    ProposalCard: () => import('~/components/proposals/proposal-card')
  },

  props: {
    proposals: {
      type: Array,
      default: () => []
    },
    view: String
  }
}
</script>

<template lang="pug">
.proposal-list.row.q-gutter-md
  template(v-for="proposal in proposals")
    proposal-card(v-bind="proposal" :view="view")
</template>
