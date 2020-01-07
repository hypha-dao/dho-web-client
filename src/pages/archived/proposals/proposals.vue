<template lang="pug">
q-page.q-pa-lg
  .profiles(ref="profilesRef")
    .row.q-col-gutter-md
      .col-xs-12.col-sm-6.col-md-4(v-for="proposal in proposals")
        proposal-card(:proposal="proposal")
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ProposalCard from './components/proposal-card'

export default {
  name: 'proposals',
  components: {
    ProposalCard
  },
  async mounted () {
    await this.fetchProposals()
  },
  computed: {
    ...mapGetters('proposals', ['proposals'])
  },
  methods: {
    ...mapActions('proposals', ['fetchProposals'])
  }
}
</script>

<style scoped>

</style>
