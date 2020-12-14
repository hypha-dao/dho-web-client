<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import ProposalCard from '../components/role-proposal-card'
import DraftProposalCard from '~/pages/proposals/components/draft-proposal-card'

export default {
  name: 'role-proposal-list',
  components: { ProposalCard, DraftProposalCard },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated']),
    ...mapGetters('profiles', ['drafts']),
    ...mapGetters('roles', ['proposals'])
  },
  async beforeMount () {
    this.setBreadcrumbs([{ title: 'Roles proposals' }])
    await this.loadProposals()
  },
  methods: {
    ...mapMutations('layout', ['setBreadcrumbs']),
    ...mapActions('roles', ['loadProposals']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    displayForm () {
      this.setShowRightSidebar(true)
      this.setRightSidebarType('roleForm')
    },
    async onProposed () {
      await this.loadProposals()
    }
  }
}
</script>

<template lang="pug">
.row
  draft-proposal-card(
    v-for="draft in drafts.filter(d => d.type === 'role')"
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
        v-if="isAuthenticated"
        fab
        icon="fas fa-plus"
        color="red"
        size="lg"
        @click="displayForm"
      )
        q-tooltip Add a role
      q-btn.q-mb-sm(
        fab
        icon="fas fa-sync-alt"
        color="secondary"
        size="lg"
        @click="loadProposals"
      )
        q-tooltip Refresh
</template>

<style lang="stylus" scoped>

</style>
