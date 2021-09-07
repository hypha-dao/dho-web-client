<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'active-proposals',
  components: {
    ProposalBanner: () => import('~/components/proposals/proposal-banner'),
    ProposalList: () => import('~/components/proposals/proposal-list'),
    ProposalFilters: () => import('~/components/proposals/proposal-filters')
  },

  meta: {
    title: 'Active Proposals'
  },

  apollo: {
    dho: {
      query: require('../../query/proposals-typed.gql'),
      update: data => data.getDho,
      variables: {
        // TODO: dho value determined by url?
        hash: '52a7ff82bd6f53b31285e97d6806d886eefb650e79754784e9d923d3df347c91'
      }
    }
  },

  data () {
    return {
      view: 'list'
    }
  },

  computed: {
    ...mapGetters('ballots', ['supply'])
  },

  created () {
    if (!this.supply) {
      this.getSupply()
    }
  },

  methods: {
    ...mapActions('ballots', ['getSupply'])
  }
}
</script>

<template lang="pug">
.active-proposals.full-width.q-px-xl
  // .row.items-center.justify-between
  .row.q-mt-sm
    proposal-banner
  .row.q-mt-sm
    .col-9.q-px-sm.q-py-md
      proposal-list(v-if="dho" :proposals="dho.proposal" :supply="supply" :view="view")
    .col-3.q-pa-sm.relative-position
      // q-btn-toggle.absolute-top-right.in-front(
        v-model="view"
        padding="10px"
        size="sm"
        toggle-color="primary"
        :options="[{ value: 'list', icon: 'fas fa-list' },{ value: 'card', icon: 'fas fa-th-large' }]"
      // )
      proposal-filters
</template>

<style lang="stylus" scoped>
.in-front {
  margin-right 32px
  margin-top 32px
  z-index 1
}
</style>
