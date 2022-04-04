<script>
export default {
  name: 'assignment-header',
  components: {
    Chips: () => import('../common/chips.vue'),
    PeriodCalendar: () => import('./period-calendar.vue'),
    AssignmentClaimExtend: () => import('./assignment-claim-extend.vue'),
    VotingResult: () => import('../proposals/voting-result.vue'),
    ProposalCardChips: () => import('../proposals/proposal-card-chips.vue')
  },

  props: {
    hash: String,
    title: String,
    roleTitle: String,
    description: String,
    start: Date,
    end: Date,
    active: Boolean,
    future: Boolean,
    past: Boolean,
    periods: {
      type: Array,
      default: () => []
    },
    commit: Object,
    voting: Object,
    state: String,
    calendar: Boolean,
    expanded: Boolean,
    claims: Number,
    claiming: Boolean,
    extend: Object,
    salary: String,
    moons: Boolean,
    owner: Boolean,
    accepted: Boolean,
    votingExpired: Boolean
  },

  computed: {
    caption () {
      const periods = `${this.periods.length} period${this.periods.length > 1 ? 's' : ''}`
      const dates = (this.start && this.end) ? ` | ${this.dateString()}` : ''
      return `${periods}${dates}`
    }
  },
  methods: {
    dateString () {
      // Show the year if the start/end years are different,
      //   or the end is not the current year
      const showYear =
        (this.start.getFullYear() !== this.end.getFullYear()) ||
        (this.end.getFullYear() !== new Date().getFullYear())

      const options = { year: showYear ? 'numeric' : undefined, month: 'short', day: 'numeric' }
      return `${this.start.toLocaleDateString('en-US', options)} - ${this.end.toLocaleDateString('en-US', options)}`
    }
  }
}
</script>

<template lang="pug">
.row.full-width.flex.items-center.justify-between
  .col-12.col-md-8
    .row.items-end
      proposal-card-chips(type="Assignment" :state="state" :showVotingState="true" :accepted="accepted" :votingExpired="votingExpired" :salary="salary" :active="active" :past="past" :future="future")
      .h-b2.text-italic.q-mx-sm.ellipsis(:style="{ 'font-size': '13px' }") {{ roleTitle }}
    .q-mt-xxs
      .h-h5.text-bold(:style="{ 'font-size': '19px' }") {{ title }}
      transition(enter-active-class="animated fadeIn" leave-active-class="animated fadeOut")
        period-calendar.q-pt-xxs(v-if="calendar" :periods="periods" mini :moons="moons")
  .col-12.col-md-4
    slot(name="right")
  .row.q-mx-xs.q-mt-md.flex.justify-center.items-center(v-if="expanded")
    period-calendar(:periods="periods" :mini="false" :moons="moons" )
</template>

<style lang="stylus" scoped>

</style>
