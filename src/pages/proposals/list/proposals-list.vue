<script>
import { mapActions, mapGetters } from 'vuex'
import ProposalCard from '../components/proposal-card'

export default {
  name: 'page-proposals-list',
  components: { ProposalCard },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated']),
    ...mapGetters('proposals', ['proposals', 'proposalsLoaded'])
  },
  methods: {
    ...mapActions('proposals', ['fetchProposals']),
    async onLoad (index, done) {
      await this.fetchProposals()
      done()
    }
  }
}
</script>

<template lang="pug">
q-page.q-pa-lg
  .proposals-list(ref="proposalsListRef")
    q-infinite-scroll(
      :disable="proposalsLoaded"
      @load="onLoad"
      :offset="250"
      :scroll-target="$refs.proposalsListRef"
    )
      .row.q-col-gutter-md
        .col-xs-12.col-sm-6.col-md-3(v-for="proposal in proposals")
          proposal-card(:proposal="proposal")
      template(v-slot:loading)
        .row.justify-center.q-my-md
          q-spinner-dots(
            color="primary"
            size="40px"
          )
  q-page-sticky(
    v-if="isAuthenticated"
    position="bottom-right"
    :offset="[18, 18]"
  )
    q-btn(
      fab
      icon="fas fa-plus"
      color="accent"
      to="/proposals/add"
    )

</template>

<style lang="stylus" scoped>

</style>
