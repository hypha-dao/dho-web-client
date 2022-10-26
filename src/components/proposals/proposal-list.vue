<script>
import { mapGetters } from 'vuex'
/**
 * A view containing a set of proposals
 */
export default {
  name: 'proposal-list',
  components: {
    ProposalCard: () => import('~/components/proposals/proposal-card')
  },

  props: {
    /**
     * An array of the proposals to display
     */
    proposals: {
      type: Array,
      default: () => []
    },
    /**
     * The total vote supply, needed to calculate the voting results
     */
    supply: Number,
    /**
     * The user to display the voted of on the proposal
     */
    username: String,
    /**
     * Whether the card is a list style or card style
     */
    view: String,
    compact: Boolean,

    updateProposals: Promise
  },
  computed: {
    ...mapGetters('dao', ['daoSettings'])
  },

  methods: {

  }
}
</script>

<template lang="pug">
.proposal-list.row(:class="{'q-mr-md' : view === 'list'}")
  .template(v-for="p in proposals" :class="{ 'col-6 q-px-xs': $q.screen.md, 'col-4': view === 'card' && !compact, 'col-12': view === 'card' && compact && !$q.screen.md }").flex.justify-center
    proposal-card.q-mb-md(
      :fullWidth="compact"
      :updateProposals="updateProposals"
      :style="{width: '100%'}"
      :class="{'q-mr-md' : !compact}"
      :view="view"
      :key="p.hash"
      :proposal="p"
    )
</template>
