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
    calendar: Boolean,
    expanded: Boolean,
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
          label: this.future ? 'UPCOMING' : (this.active ? 'ACTIVE' : 'ARCHIVED'),
          color: (this.future || this.active) ? 'positive' : (this.active ? 'primary' : 'grey-7'),
          text: 'white'
        }
      ]

      result.push({
        label: 'ROLE ASSIGNMENT',
        color: 'primary'
      })

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
          color: 'internal-bg',
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
      return `${this.start.toLocaleDateString('en-US', options)} - ${this.end.toLocaleDateString('en-US', options)}`
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
.row.full-width.flex.items-center.justify-between
  .col-12.col-md-8
    .row.items-end
      chips(:tags="tags" chipSize="sm")
      .h-b2.text-italic.q-mx-sm.ellipsis(:style="{ 'font-size': '13px' }") {{ roleTitle }}
    .q-mt-xxs
      .h-h5.text-bold(:style="{ 'font-size': '19px' }") {{ title }}
      transition(enter-active-class="animated fadeIn" leave-active-class="animated fadeOut")
        period-calendar.q-pt-xxs(v-if="calendar" :periods="periods" mini :moons="moons")
  .col-12.col-md-4
    .q-mt-md(v-if="$q.screen.sm")
    assignment-claim-extend(
      v-if="!future && owner"
      :claims="claims"
      :claiming="claiming"
      :extend="extend"
      :stacked="true"
      @claim-all="$emit('claim-all')"
      @extend="$emit('extend')"
    )
    q-btn.q-mr-md.view-proposa-btn(
      v-if="!owner"
      label="View proposal"
      color="primary"
      rounded
      unelevated
      no-caps
      outline
      @click="$emit('view-proposal')"
    )
  .row.q-mx-xs.q-mt-md.flex.justify-center.items-center(v-if="expanded")
    period-calendar(:periods="periods" :mini="false" :moons="moons" )
</template>

<style lang="stylus" scoped>
.view-proposa-btn
  width 271px

</style>
