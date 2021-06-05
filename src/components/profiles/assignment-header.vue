<script>
export default {
  name: 'assignment-header',
  components: {
    AssignmentClaimExtend: () => import('./assignment-claim-extend.vue'),
    Chips: () => import('~/components/common/chips.vue'),
    PeriodCalendar: () => import('~/components/contributions/period-calendar.vue')
  },

  props: {
    title: String,
    start: Date,
    end: Date,
    past: Boolean,
    periods: Array,
    commit: Object,
    calendar: Boolean,
    expanded: Boolean,
    showButtons: Boolean
  },

  computed: {
    tags () {
      if (this.past) return undefined
      const result = [
        {
          label: 'Active',
          color: 'positive',
          text: 'white'
        }
        /*
        {
          label: this.title, // TODO: This.role.title??
          color: 'primary',
          text: 'white'
        }
        */
      ]

      if (this.commit) {
        result.push({
          label: `${this.commit.value}%`,
          color: 'grey-4',
          text: 'grey-7'
        })
      }

      return result
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
      return `${this.start.toLocaleDateString(undefined, options)} - ${this.end.toLocaleDateString(undefined, options)}`
    }
  }
}
</script>

<template lang="pug">
.full-width
  .row.full-width.items-center.justify-between
    .col-12.col-md-8
      chips(:tags="tags")
      .q-ma-sm
        .text-bold(:style="{ 'font-size': '1.25em' }") {{ title }}
        .text-caption {{ `${periods.length} periods | ${dateString()}` }}
        transition(v-if="" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut")
          period-calendar(v-if="$q.screen.lt.md && calendar && !expanded" :periods="periods" mini moon)
    .col-12.col-md-4(v-if="showButtons")
      assignment-claim-extend(:stacked="!$q.screen.sm")
  .row.q-mx-sm(v-if="($q.screen.gt.sm && calendar) || expanded")
    period-calendar(:periods="periods" :mini="!expanded" moon)
</template>
