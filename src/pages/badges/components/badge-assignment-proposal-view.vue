<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { documents } from '~/mixins/documents'
import MarkdownDisplay from '~/components/form/markdown-display'
import LunarCyclesDisplay from '~/components/documents-parts/lunar-cycles-display'
import VoteYesNoAbstain from '~/components/documents-parts/vote-yes-no-abstain'
import VotesDetails from '~/components/documents-parts/votes-details'

export default {
  name: 'badge-assignment-proposal-view',
  mixins: [documents],
  components: { MarkdownDisplay, LunarCyclesDisplay, VoteYesNoAbstain, VotesDetails },
  props: {
    proposal: { type: Object }
  },
  data () {
    return {
      badge: null
    }
  },
  computed: {
    ...mapGetters('periods', ['periods']),
    badgeHash () {
      return this.getValue(this.proposal, 'details', 'badge')
    },
    seeds () {
      return this.badge && this.getValue(this.badge, 'details', 'seeds_coefficient_x10000') / 100
    },
    hypha () {
      return this.badge && this.getValue(this.badge, 'details', 'hypha_coefficient_x10000') / 100
    },
    hvoice () {
      return this.badge && this.getValue(this.badge, 'details', 'hvoice_coefficient_x10000') / 100
    },
    husd () {
      return this.badge && this.getValue(this.badge, 'details', 'husd_coefficient_x10000') / 100
    },
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
    ...mapActions('badges', ['loadBadge']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    ...mapMutations('badges', ['removeProposal']),
    onClose () {
      this.removeProposal(this.proposal.hash)
      this.hide()
    },
    hide () {
      this.setShowRightSidebar(false)
      this.setRightSidebarType(null)
    }
  },
  watch: {
    badgeHash: {
      immediate: true,
      async handler (val) {
        if (val) {
          this.badge = await this.loadBadge(val)
        }
      }
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
  fieldset.q-mt-sm
    legend Token coefficients
    p Badges are a token of appreciation and achievement but they don’t create value unless you apply them to a contribution or assignment. The value is calculated by multiplying a percentage for each token in the boxes below, with 100% equal to no change in the compensation.
    .row.q-col-gutter-xs
      .col-6
        q-input.bg-seeds.text-black(
          v-model="seeds"
          type="number"
          outlined
          readonly
          dense
        )
          template(v-slot:append)
            q-icon(
              name="img:app/icons/seeds.png"
              size="xs"
            )
        .hint Deferred Seeds
      .col-6
        q-input.bg-liquid.text-black(
          v-model="husd"
          type="number"
          outlined
          readonly
          dense
        )
        .hint HUSD
      .col-6
        q-input.bg-liquid.text-black(
          v-model="hvoice"
          type="number"
          outlined
          readonly
          dense
        )
        .hint HVOICE
      .col-6
        q-input.bg-liquid.text-black(
          v-model="hypha"
          type="number"
          readonly
          outlined
          dense
        )
        .hint HYPHA
  lunar-cycles-display(
    :startPhase="startPhase"
    :endPhase="endPhase"
  )
  fieldset.q-mt-sm
    legend Vote results
    p This is the current tally for this proposal. Please vote with the buttons below. Repeat votes allowed until close.
    vote-yes-no-abstain(v-if="ballotId" :ballotId="ballotId" :proposer="proposer" :hash="this.proposal.hash" @close-proposal="onClose" :countdown="true")
  votes-details(v-if="ballotId" :ballotId="ballotId && ballot.ballot_name" :size="5")
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
