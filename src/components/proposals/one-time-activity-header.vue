<script>
import { dateToStringShort } from '~/utils/TimeUtils'

/**
 * A component to display header information of a contribution
 */
export default {
  name: 'one-time-activity-header',
  components: {
    ProposalCardChips: () => import('~/components/proposals/proposal-card-chips.vue')
  },

  props: {
    /**
     * The title of the proposal
     */
    title: String,
    /**
     * The proposal state, can be one of: proposed, withdrawed, rejected, archived, approved, suspended
     */
    state: String,
    /**
     * The date when proposal was created
     */
    created: Date,
    /**
     * True if the proposal is approved
     */
    accepted: Boolean,
    /**
     * True if the voting time has passed
     */
    votingExpired: Boolean,
    /**
     * Compensation amount string. Example: 400.00 HUSD
     */
    compensation: Object
  },

  computed: {

  },

  methods: {
    dateToStringShort
  }
}
</script>

<template lang="pug">
.row.full-width.flex.items-center.justify-between
  .col-12.col-md-8
    .row.items-end
      proposal-card-chips(type="Payout" :state="state" :showVotingState="true" :accepted="accepted" :votingExpired="votingExpired" :compensation="compensation")
    .q-mt-xxs
      .h-h5.text-bold.ellipsis {{ title }}
      .row.q-mt-xs
        q-icon.q-mr-sm(name="fas fa-calendar-alt")
        .h-b2.text-italic(:style="{ 'font-size': '13px' }") {{ dateToStringShort(created) }}
  .col-12.col-md-4
    slot(name="right")
</template>

<style lang="stylus" scoped>
.nudge-left
  margin-left -6px
</style>
