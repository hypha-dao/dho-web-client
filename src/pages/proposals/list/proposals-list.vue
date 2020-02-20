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
    ...mapActions('proposals', ['fetchData']),
    ...mapMutations('proposals', ['clearData']),
    async onLoad (index, done) {
      const type = this.$route.params.type
      const id = this.$route.params.id
      await this.fetchData({ type, roleId: id })
      done()
    }
  },
  watch: {
    '$route.params.type': {
      immediate: true,
      handler () {
        this.clearData()
      }
    },
    '$route.params.id': {
      immediate: true,
      handler () {
        this.clearData()
      }
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
        )
      template(v-slot:loading)
        .row.justify-center.q-my-md
          q-spinner-dots(
            color="primary"
            size="40px"
          )
  q-page-sticky(
    position="bottom-right"
    :offset="[18, 18]"
    :style="{'z-index': 100}"
  )
    q-btn(
      fab
      icon="fas fa-history"
      color="accent"
      size="lg"
      to="/proposals/history"
    )
      q-tooltip Proposals history
  q-page-sticky(
    v-if="isAuthenticated && $route.params.type === 'payout'"
    position="bottom-right"
    :offset="[90, 18]"
    :style="{'z-index': 100}"
  )
    q-btn(
      fab
      icon="fas fa-plus"
      color="red"
      size="lg"
      to="/proposals/payouts/add"
    )
      q-tooltip Add a payout

</template>

<style lang="stylus" scoped>

</style>
