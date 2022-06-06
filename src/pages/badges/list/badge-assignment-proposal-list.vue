<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import ProposalCard from '../components/badge-assignment-proposal-card'
import ProposalCardDraft from '../components/badge-assignment-proposal-card-draft'

export default {
  name: 'badge-assignment-proposal-list',
  components: { ProposalCard, ProposalCardDraft },

  meta: {
    title: 'Badge Assignment Proposals'
  },

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
    ...mapGetters('accounts', ['isAuthenticated']),
    ...mapGetters('profiles', ['drafts']),
    ...mapGetters('badges', ['proposals'])
  },
  async beforeMount () {
    this.clearProposals()
    this.setBreadcrumbs([{ title: 'Badge Assignment proposals' }])
  },
  methods: {
    ...mapMutations('layout', ['setBreadcrumbs']),
    ...mapMutations('badges', ['clearProposals']),
    ...mapActions('badges', ['loadBadgeAssignmentProposals']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    async onLoad (index, done) {
      this.loaded = await this.loadBadgeAssignmentProposals(this.pagination)
      if (!this.loaded) {
        this.pagination.offset += this.pagination.first
      }
      done()
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
      v-for="draft in drafts.filter(d => d.type === 'badgeAssignment')"
      :key="draft.draft.id"
      :draft="draft.draft"
      :type="draft.type"
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
        fab
        icon="fas fa-sync-alt"
        color="secondary"
        size="lg"
        @click="refreshProposals"
      )
        q-tooltip Refresh
</template>

<style lang="stylus" scoped>

</style>
