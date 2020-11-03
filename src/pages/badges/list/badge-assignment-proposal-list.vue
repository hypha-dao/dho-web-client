<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import ProposalCard from '../components/badge-assignment-proposal-card'
import DraftProposalCard from '~/pages/proposals/components/draft-proposal-card'

export default {
  name: 'badge-assignment-proposal-list',
  components: { ProposalCard, DraftProposalCard },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated']),
    ...mapGetters('profiles', ['drafts']),
    ...mapGetters('badges', ['proposals'])
  },
  async beforeMount () {
    this.setBreadcrumbs([{ title: 'Badge Assignment proposals' }])
    await this.loadBadgeAssignmentProposals()
  },
  methods: {
    ...mapMutations('layout', ['setBreadcrumbs']),
    ...mapActions('badges', ['loadBadgeAssignmentProposals']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    async onProposed () {
      await this.loadBadgeAssignmentProposals()
    }
  }
}
</script>

<template lang="pug">
.row
  draft-proposal-card(
    v-for="draft in drafts.filter(d => d.type === 'badgeAssignment')"
    :key="draft.draft.id"
    :draft="draft.draft"
    :type="draft.type"
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
        fab
        icon="fas fa-sync-alt"
        color="secondary"
        size="lg"
        @click="loadBadgeAssignmentProposals"
      )
        q-tooltip Refresh
</template>

<style lang="stylus" scoped>

</style>
