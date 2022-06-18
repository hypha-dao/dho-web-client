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
    view: String
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
  .template(v-for="p in proposals" :class="(view === 'card') ? 'col-4' : 'col-12'")
    proposal-card.q-mr-md.q-mb-md(
      :view="view"
      :key="p.hash"
      :proposal="p"
    )
</template>
