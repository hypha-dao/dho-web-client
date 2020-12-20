<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import ProposalCard from '../components/assignment-proposal-card'
import ProposalCardDraft from '~/pages/assignments/components/assignment-proposal-card-draft'

export default {
  name: 'assignment-proposal-list',
  components: { ProposalCard, ProposalCardDraft },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated']),
    ...mapGetters('profiles', ['drafts']),
    ...mapGetters('assignments', ['proposals'])
  },
  async beforeMount () {
    this.setBreadcrumbs([{ title: 'Assignments proposals' }])
    await this.loadProposals()
  },
  methods: {
    ...mapMutations('layout', ['setBreadcrumbs']),
    ...mapActions('assignments', ['loadProposals']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    async onProposed () {
      await this.loadProposals()
    }
  }
}
</script>

<template lang="pug">
.row
  proposal-card-draft(
    v-for="draft in drafts.filter(d => d.type === 'assignment')"
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
        fab
        icon="fas fa-sync-alt"
        color="secondary"
        size="lg"
        @click="loadProposals"
      )
        q-tooltip Refresh
</template>
