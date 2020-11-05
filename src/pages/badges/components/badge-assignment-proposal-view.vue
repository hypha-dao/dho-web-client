<script>
import { mapGetters, mapMutations } from 'vuex'
import { documents } from '~/mixins/documents'
import MarkdownDisplay from '~/components/form/markdown-display'
import LunarCyclesDisplay from '~/components/documents-parts/lunar-cycles-display'
import VoteYesNoAbstain from '~/components/documents-parts/vote-yes-no-abstain'

export default {
  name: 'badge-assignment-proposal-view',
  mixins: [documents],
  components: { MarkdownDisplay, LunarCyclesDisplay, VoteYesNoAbstain },
  props: {
    proposal: { type: Object }
  },
  computed: {
    ...mapGetters('periods', ['periods']),
    title () {
      return this.getValue(this.proposal, 'details', 'title')
    },
    description () {
      return this.getValue(this.proposal, 'details', 'description')
    },
    startPhase () {
      const id = this.getValue(this.proposal, 'details', 'start_period')
      if (id) {
        return this.periods.find(p => p.period_id === id)
      }
      return null
    },
    endPhase () {
      const id = this.getValue(this.proposal, 'details', 'end_period')
      if (id) {
        return this.periods.find(p => p.period_id === id)
      }
      return null
    },
    proposer () {
      return this.getValue(this.proposal, 'system', 'proposer')
    },
    ballotId () {
      return this.getValue(this.proposal, 'system', 'ballot_id')
    }
  },
  methods: {
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    ...mapMutations('badges', ['removeProposal']),
    onClose () {
      this.removeProposal()
      this.hide()
    },
    hide () {
      this.setShowRightSidebar(false)
      this.setRightSidebarType(null)
    }
  }
}
</script>

<template lang="pug">
.q-pa-xs
  .text-h6.q-mb-sm.q-ml-md {{ title }}
  .description.relative-position(
    v-if="description"
  )
    markdown-display(:text="description")
  lunar-cycles-display(
    :startPhase="startPhase"
    :endPhase="endPhase"
  )
  fieldset.q-mt-sm
    legend Vote results
    p This is the current tally for this proposal. Please vote with the buttons below. Repeat votes allowed until close.
    vote-yes-no-abstain(v-if="ballotId" :ballotId="ballotId" :proposer="proposer" :hash="this.proposal.hash" @close-proposal="onClose" :countdown="true")
  .row.flex.justify-start.q-mt-md
    q-btn(
      label="Close"
      rounded
      color="grey"
      unelevated
      @click="hide"
    )
</template>

<style lang="stylus" scoped>
fieldset
  border-radius 4px
  border 1px solid rgba(0,0,0,.24)
  legend
    text-transform uppercase
    font-size 12px
  p
    font-size 12px
button
  width 30%
.avatar
  margin-top 20px
  width 100%
  max-width 150px
  height 150px
</style>
