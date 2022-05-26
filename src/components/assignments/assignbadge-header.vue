<template lang="pug">
.row.full-width.flex.items-center.justify-between
  .col-12.col-md-8
    .row.items-end
      proposal-card-chips(type="Assignbadge" :state="state" :showVotingState="true" :accepted="accepted" :votingExpired="votingExpired" :active="active" :past="past" :future="future")
      .h-b2.text-italic.q-mx-sm.ellipsis(:style="{ 'font-size': '13px' }") {{ badgeTitle }}
    .q-mt-xxs
      .h-h5.text-bold(:style="{ 'font-size': '19px' }") {{ title }}
      //- .row.q-mt-xs
        q-icon.q-mr-sm(name="fas fa-calendar-alt")
        .h-b2.text-italic(:style="{ 'font-size': '13px' }") {{ dateString(created) }}
      transition(enter-active-class="animated fadeIn" leave-active-class="animated fadeOut")
        period-calendar.q-pt-xxs(v-if="calendar" :periods="periods" mini :moons="true")
  .col-12.col-md-4
    slot(name="right")
  .row.q-mx-xs.q-mt-md.flex.justify-center.items-center(v-if="expanded")
    period-calendar(:periods="periods" :mini="false" :moons="moons" )
</template>

<script>
export default {
  name: 'assignbadge-header',
  components: {
    VotingResult: () => import('../proposals/voting-result.vue'),
    PeriodCalendar: () => import('./period-calendar.vue'),
    ProposalCardChips: () => import('../proposals/proposal-card-chips.vue')
  },
  props: {
    title: String,
    badgeTitle: String,
    description: String,
    state: String,
    accepted: Boolean,
    votingExpired: Boolean,
    created: Date,
    active: Boolean,
    future: Boolean,
    past: Boolean,
    calendar: Boolean,
    periods: {
      type: Array,
      default: () => []
    },
    moons: Boolean,
    expanded: Boolean
  },
  methods: {
    dateString () {
      const options = { year: 'numeric', month: 'short', day: 'numeric' }
      return `${this.created.toLocaleDateString('en-US', options)}`
    }
  }
}
</script>

<style>

</style>
