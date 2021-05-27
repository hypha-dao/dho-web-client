<script>
export default {
  name: 'active-assignments',
  components: {
    PeriodCalendar: () => import('~/components/contributions/period-calendar.vue'),
    SalaryFieldset: () => import('~/components/contributions/salary-fieldset.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    assignments: {
      type: Array,
      default: () => []
    }
  },

  methods: {
    dateString (assign) {
      // Show the year if the start/end years are different,
      //   or the end is not the current year
      const showYear =
        (assign.start.getFullYear() !== assign.end.getFullYear()) ||
        (assign.end.getFullYear() !== new Date().getFullYear())

      const options = { year: showYear ? 'numeric' : undefined, month: 'short', day: 'numeric' }
      return `${assign.start.toLocaleDateString(undefined, options)} - ${assign.end.toLocaleDateString(undefined, options)}`
    },

    claimTimeString (period) {
      const options = { month: 'short', day: 'numeric' }
      return `${period.end.toLocaleDateString(undefined, options)}`
    },

    isClaimable (period, index) {
      return !period.claimed && index < 3 // && Date.now() > period.end
    }
  }
}
</script>

<template lang="pug">
widget(noPadding title="Assignments")
  .text-body2.q-mx-md(v-if="assignments.length === 0") You have no active assignments
  q-list.q-mx-md(v-else bordered class="rounded-borders")
    template(v-for="assign in assignments")
      q-expansion-item(expand-separator)
        template(v-slot:header)
          q-item-section
            .row.items-center
              .text-subtitle1.on-left {{ assign.title }}
              .text-caption.text-positive.on-left(v-if="!assign.past") Ongoing
            .text-caption {{ dateString(assign) + ' (' + assign.periods.length + ' periods)' }}
          q-item-section(side)
            q-btn.q-px-sm(v-if="true" rounded color="primary" @click.stop="") Claim 2 Periods
            // .row.items-center(v-if="true")
              q-badge.on-left(rounded color="primary" label="1")
              .text-positive Claims Available
            .text-primary(v-else) All Claimed
        q-card
          // q-separator
          q-card-section
            salary-fieldset(v-bind="assign")
          q-separator
          q-card-section
            period-calendar(:periods="assign.periods")

</template>
