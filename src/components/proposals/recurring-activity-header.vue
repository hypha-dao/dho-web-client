<script>
export default {
  name: 'recurring-activity-header',
  components: {
    PeriodCalendar: () => import('~/components/assignments/period-calendar.vue'),
    ProposalCardChips: () => import('~/components/proposals/proposal-card-chips.vue')
  },

  props: {
    type: String,
    title: String,
    subtitle: String,
    periods: {
      type: Array,
      default: () => []
    },
    state: String,
    calendar: Boolean,
    expanded: Boolean,
    salary: String,
    moons: Boolean,
    accepted: Boolean,
    votingExpired: Boolean,
    commit: Object
  }
}
</script>

<template lang="pug">
.row.full-width.flex.items-center.justify-between
  .col-12.col-md-8
    .row.items-end
      proposal-card-chips(:type="type" :state="state" :showVotingState="true" :accepted="accepted" :votingExpired="votingExpired" :salary="salary"  :commit="commit && commit.value")
      .h-b2.text-italic.q-mx-sm.ellipsis(:style="{ 'font-size': '13px' }") {{ subtitle }}
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
