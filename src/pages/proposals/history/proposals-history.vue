<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import ProposalCard from '../components/proposal-card'

export default {
  name: 'page-proposals-list',
  components: { ProposalCard },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated']),
    ...mapGetters('proposals', ['proposals', 'proposalsLoaded'])
  },
  beforeMount () {
    this.clearData()
  },
  methods: {
    ...mapActions('proposals', ['fetchHistoryFiltered']),
    ...mapMutations('proposals', ['clearData']),
    async onLoad (index, done) {
      const type = this.$route.params.type
      await this.fetchHistoryFiltered({ type })
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
      .row.text-center
        proposal-card(
          v-for="proposal in proposals"
          :key="proposal.proposal_id"
          :proposal="proposal"
          :readonly="true"
        )
      template(v-slot:loading)
        .row.justify-center.q-my-md
          q-spinner-dots(
            color="primary"
            size="40px"
          )

</template>

<style lang="stylus" scoped>

</style>
