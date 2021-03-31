<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { documents } from '~/mixins/documents'
import { format } from '~/mixins/format'
import MarkdownDisplay from '~/components/form/markdown-display'
import LunarCyclesDisplay from '~/components/documents-parts/lunar-cycles-display'
import VoteYesNoAbstain from '~/components/documents-parts/vote-yes-no-abstain'
import VotesDetails from '~/components/documents-parts/votes-details'
import RawDisplayIcon from '~/components/documents-parts/raw-display-icon'

export default {
  name: 'assignment-proposal-view',
  mixins: [documents, format],
  components: { MarkdownDisplay, LunarCyclesDisplay, VoteYesNoAbstain, VotesDetails, RawDisplayIcon },
  props: {
    proposal: { type: Object }
  },
  data () {
    return {
      role: null,
      monthly: false
    }
  },
  computed: {
    ...mapGetters('periods', ['periods']),
    roleId () {
      return this.getValue(this.proposal, 'details', 'role')
    },
    title () {
      return this.getValue(this.proposal, 'details', 'title')
    },
    description () {
      return this.getValue(this.proposal, 'details', 'description')
    },
    assignee () {
      return this.getValue(this.proposal, 'details', 'assignee')
    },
    url () {
      return this.getValue(this.proposal, 'details', 'url')
    },
    tokenHvoice () {
      const amount = parseFloat(this.getValue(this.proposal, 'details', 'hvoice_salary_per_phase'))
      return this.toAsset(amount * (this.monthly ? 4 : 1) || 0)
    },
    tokenHusd () {
      const amount = parseFloat(this.getValue(this.proposal, 'details', 'husd_salary_value_per_phase'))
      return this.toAsset(amount * (this.monthly ? 4 : 1) || 0)
    },
    tokenHypha () {
      const amount = parseFloat(this.getValue(this.proposal, 'details', 'hypha_salary_per_phase'))
      return this.toAsset(amount * (this.monthly ? 4 : 1) || 0)
    },
    salaryCommitted () {
      return this.getValue(this.proposal, 'details', 'time_share_x100')
    },
    salaryDeferred () {
      return this.getValue(this.proposal, 'details', 'deferred_perc_x100')
    },
    usdEquity () {
      return this.role && this.getValue(this.role, 'details', 'annual_usd_salary')
    },
    startPhase () {
      const period = this.getValue(this.proposal, 'details', 'start_period')
      if (period) {
        return this.periods.find(p => p.value === period)
      }
      return null
    },
    periodCount () {
      return this.getValue(this.proposal, 'details', 'period_count')
    },
    ballotId () {
      return this.getValue(this.proposal, 'system', 'ballot_id')
    }
  },
  methods: {
    ...mapActions('roles', ['loadRole']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    ...mapMutations('assignments', ['removeProposal']),
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
    roleId: {
      immediate: true,
      async handler (val) {
        this.role = val && await this.loadRole(val)
      }
    }
  }
}
</script>

<template lang="pug">
.q-pa-xs
  .text-h6.q-mb-sm.q-ml-md
    | {{ title }}
    raw-display-icon(:document="proposal")
  .description.relative-position(
    v-if="description"
  )
    markdown-display(:text="description")
  fieldset.q-mt-sm(v-if="url")
    legend Supporting documentation
    a.link.q-my-md(:href="url" target="_blank") {{ url | truncate(60) }}
  fieldset.q-mt-sm
    legend Salary
    p Fields below display the payout of this assignment for a {{ this.monthly ? 'full lunar cycle (ca. 1 month)' : 'single lunar period (ca. 1 week)' }} as well as % committed and % HYPHA tokens vs. HUSD tokens. The payout is shown as USD equivalent and the corresponding amounts in HVOICE, HYPHA and HUSD.
    .row.q-col-gutter-xs
      .col-xs-12.col-md-6
        q-input.bg-grey-4.text-black(
          v-model="salaryCommitted"
          outlined
          dense
          readonly
        )
        .hint Committed
      .col-xs-12.col-md-6
        q-input.bg-grey-4.text-black(
          v-model="salaryDeferred"
          outlined
          dense
          readonly
        )
        .hint Deferred
    .row.q-my-sm
      strong SALARY CALCULATION (BASED ON USD EQUIVALENT OF USD {{ usdEquity }})
    .row.q-col-gutter-xs
      .col-4
        q-input.bg-liquid.text-black(
          v-model="tokenHusd"
          outlined
          dense
          readonly
        )
        .hint HUSD
      .col-4
        q-input.bg-liquid.text-black(
          v-model="tokenHvoice"
          outlined
          dense
          readonly
        )
        .hint HVOICE
      .col-4
        q-input.bg-liquid.text-black(
          v-model="tokenHypha"
          outlined
          dense
          readonly
        )
        .hint HYPHA
    .row
      q-toggle(v-model="monthly" label="Show tokens for a full lunar cycle (ca. 1 month)")
  lunar-cycles-display(
    :startPhase="startPhase"
    :periodCount="periodCount"
    text="This is the lunar start date and periods for this assignment. We recommend a maximum of 12 periods before reevaluation."
  )
  fieldset.q-mt-sm
    legend Vote results
    p This is the current tally for this proposal. Please vote with the buttons below. Repeat votes allowed until close.
    vote-yes-no-abstain(v-if="ballotId" :ballotId="ballotId" :proposer="assignee" :hash="this.proposal.hash" @close-proposal="onClose" :countdown="true")
  votes-details(v-if="ballotId" :ballotId="ballotId" :size="5")
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
