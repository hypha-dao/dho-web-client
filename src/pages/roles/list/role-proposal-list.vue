<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import ProposalCard from '../components/role-proposal-card'
import ProposalCardDraft from '../components/role-proposal-card-draft'

export default {
  name: 'role-proposal-list',
  components: { ProposalCard, ProposalCardDraft },
  data () {
    return {
      pagination: {
        first: 10,
        offset: 0
      },
      loaded: false
    }
  },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated', 'isMember']),
    ...mapGetters('profiles', ['drafts']),
    ...mapGetters('roles', ['proposals'])
  },
  async beforeMount () {
    this.clearProposals()
    this.setBreadcrumbs([{ title: 'Role proposals' }])
  },
  methods: {
    ...mapMutations('layout', ['setBreadcrumbs']),
    ...mapMutations('roles', ['clearProposals']),
    ...mapActions('roles', ['loadProposals']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    async onLoad (index, done) {
      this.loaded = await this.loadProposals(this.pagination)
      if (!this.loaded) {
        this.pagination.offset += this.pagination.first
      }
      done()
    },
    displayForm () {
      this.setShowRightSidebar(true)
      this.setRightSidebarType('roleForm')
    },
    async refreshProposals () {
      this.clearProposals()
      this.pagination = {
        first: 10,
        offset: 0
      }
      this.loaded = false
    }
  }
}
</script>

<template lang="pug">
q-infinite-scroll(
  :disable="loaded"
  @load="onLoad"
  :offset="250"
)
  .row
    proposal-card-draft(
      v-for="draft in drafts.filter(d => d.type === 'role')"
      :key="draft.draft.id"
      :draft="draft.draft"
      @proposed="refreshProposals"
    )
    proposal-card(
      v-for="proposal in proposals"
      :key="proposal.hash"
      :proposal="proposal"
    )
  template(v-slot:loading)
    .row.justify-center.q-my-md
      q-spinner-dots(
        color="primary"
        size="40px"
      )
  q-page-sticky(
    position="right"
    :offset="[18, 0]"
    :style="{'z-index': 100}"
  )
    .flex.column
      q-btn.q-mb-sm(
        v-if="isAuthenticated && isMember"
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
        @click="refreshProposals"
      )
        q-tooltip Refresh
</template>
