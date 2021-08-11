<script>
export default {
  name: 'assignment-header',
  components: {
    AssignmentClaimExtend: () => import('./assignment-claim-extend.vue'),
    Chips: () => import('../common/chips.vue'),
    PeriodCalendar: () => import('./period-calendar.vue')
  },

  props: {
    hash: String,
    title: String,
    start: Date,
    end: Date,
    active: Boolean,
    past: Boolean,
    periods: {
      type: Array,
      default: () => []
    },
    commit: Object,
    calendar: Boolean,
    expanded: Boolean,
    showButtons: Boolean,
    claims: Number,
    claiming: Boolean,
    extend: Object,
    usdEquivalent: Number,
    moons: Boolean,
    owner: Boolean
  },

  computed: {
    caption () {
      const periods = `${this.periods.length} period${this.periods.length > 1 ? 's' : ''}`
      const dates = (this.start && this.end) ? ` | ${this.dateString()}` : ''
      return `${periods}${dates}`
    },

    tags () {
      const result = [
        {
          label: this.active ? 'Active' : 'Archived',
          color: this.active ? 'positive' : 'secondary',
          text: 'white'
        }
      ]

      if (this.usdEquivalent) {
        const bucket = this.getSalaryBucket(this.usdEquivalent)
        if (bucket) {
          result.push({
            label: bucket,
            color: 'primary',
            tooltip: `Based on equivalent: $${new Intl.NumberFormat().format(this.usdEquivalent)} USD`
          })
        }
      }

      if (this.active && this.commit) {
        const icon = this.commit.value < this.commit.max ? { name: 'fas fa-arrow-down', color: 'grey-7' } : undefined
        const tooltip = this.commit.value < this.commit.max ? `Reduced from ${this.commit.max}%` : undefined
        result.push({
          label: `${this.commit.value}%`,
          icon,
          color: 'grey-4',
          text: 'grey-7',
          tooltip
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
    },

    getSalaryBucket (amount) {
      if (amount <= 80000) {
        return 'B1'
      } else if (amount > 80000 && amount <= 100000) {
        return 'B2'
      } else if (amount > 100000 && amount <= 120000) {
        return 'B3'
      } else if (amount > 120000 && amount <= 140000) {
        return 'B4'
      } else if (amount > 140000 && amount <= 160000) {
        return 'B5'
      } else if (amount > 160000 && amount <= 180000) {
        return 'B6'
      } else if (amount > 180000) {
        return 'B7'
      }

      return null
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
        .text-caption {{ caption }}
        transition(enter-active-class="animated fadeIn" leave-active-class="animated fadeOut")
          period-calendar.nudge-left(v-if="$q.screen.lt.md && calendar && !expanded && owner" :periods="periods" mini :moons="moons")
    .col-12.col-md-4(v-if="showButtons")
      assignment-claim-extend(
        :claims="claims"
        :claiming="claiming"
        :extend="extend"
        :stacked="!$q.screen.sm"
        @claim-all="$emit('claim-all')"
        @extend="$emit('extend')"
      )
  .row.q-mx-xs.nudge-top(v-if="($q.screen.gt.sm && calendar) || expanded || !owner")
    period-calendar(:periods="periods" :mini="!expanded || !owner" :moons="moons")
</template>

<style lang="stylus" scoped>
.nudge-left
  margin-left -6px

.nudge-top
  margin-top -4px
</style>
