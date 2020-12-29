<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import ProposalCard from '../components/payout-proposal-card'
import ProposalCardDraft from '../components/payout-proposal-card-draft'

export default {
  name: 'payout-proposal-list',
  components: { ProposalCard, ProposalCardDraft },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated']),
    ...mapGetters('profiles', ['drafts']),
    ...mapGetters('payouts', ['proposals'])
  },
  async beforeMount () {
    this.setBreadcrumbs([{ title: 'Contributions proposals' }])
    await this.loadProposals()
  },
  methods: {
    ...mapMutations('layout', ['setBreadcrumbs']),
    ...mapActions('payouts', ['loadProposals']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    displayForm () {
      this.setShowRightSidebar(true)
      this.setRightSidebarType('payoutForm')
    },
    async onProposed () {
      await this.loadProposals()
    }
  }
}
</script>

<template lang="pug">
.row
  proposal-card-draft(
    v-for="draft in drafts.filter(d => d.type === 'payout')"
    :key="draft.draft.id"
    :draft="draft.draft"
    @proposed="onProposed"
  )
  proposal-card(
    v-for="proposal in proposals"
    :key="proposal.hash"
    :proposal="proposal"
  )
  q-page-sticky(
    position="right"
    :offset="[18, 0]"
    :style="{'z-index': 100}"
  )
    .flex.column
      q-btn.q-mb-sm(
        v-if="isAuthenticated"
        fab
        icon="fas fa-plus"
        color="red"
        size="lg"
        @click="displayForm"
      )
        q-tooltip Add a contribution
      q-btn.q-mb-sm(
        fab
        icon="fas fa-sync-alt"
        color="secondary"
        size="lg"
        @click="loadProposals"
      )
        q-tooltip Refresh
      q-btn.q-mb-sm(
        fab
        icon="fas fa-history"
        color="secondary"
        size="lg"
        to="/documents/payout"
      )
        q-tooltip History
</template>

<style lang="stylus" scoped>

</style>
