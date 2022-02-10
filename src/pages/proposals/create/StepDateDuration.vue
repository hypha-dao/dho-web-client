<script>
export default {
  name: 'step-date-duration',
  components: {
    PeriodCard: () => import('~/components/assignments/period-card.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  apollo: {
    periods: {
      query: require('../../../query/periods-upcoming.gql'),
      update: data => data.queryPeriod,
      variables () {
        // Return periods available after 1 voting duration
        const date = new Date(Date.now() + (this.$store.state.dao.settings.votingDurationSeconds * 1000))
        const dateString = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`
        console.log('dateString', dateString)
        return {
          after: dateString,
          name: 'daoxpr'
        }
      }
    }
  },

  data () {
    return {
      startIndex: -1,
      endIndex: -1
    }
  },

  computed: {
    periodCount () {
      if (this.startIndex === -1 || this.endIndex === -1) {
        return 0
      }
      return this.endIndex - this.startIndex + 1
    },

    dateString () {
      if (this.startIndex === -1 || this.endIndex === -1) {
        return ''
      }

      const start = new Date(this.start(this.periods[this.startIndex]))
      const end = new Date(this.start(this.periods[this.endIndex + 1]))

      const startOpts = { year: (start.getFullYear() !== end.getFullYear()) ? 'numeric' : undefined, month: 'long', day: 'numeric' }
      const endOpts = { year: 'numeric', month: 'long', day: 'numeric' }

      return `From ${start.toLocaleDateString(undefined, startOpts)} to ${end.toLocaleDateString(undefined, endOpts)}`
    }
  },

  // TODO: Move to shared place?
  methods: {
    title (period) {
      return period && period.details_label_s
    },

    start (period) {
      return period && new Date(period.details_startTime_t)
    },

    reset () {
      this.startIndex = -1
      this.endIndex = -1
    },

    select (index) {
      if (this.startIndex === -1 || index < this.startIndex) {
        this.startIndex = index
      } else if (this.startIndex === index) {
        if (this.endIndex === -1) {
          this.endIndex = index
        } else {
          this.startIndex = -1
          this.endIndex = -1
        }
      } else if (this.endIndex === index) {
        this.endIndex = -1
      } else {
        this.endIndex = index
      }
    }
  }
}
</script>

<template lang="pug">
widget
  .q-mt-md
  .text-h6.q-mb-md Select the periods
  .row.q-gutter-sm.q-mb-lg
    template(v-for="(period, i) in periods")
      period-card(v-if="i < periods.length-1"
        :title="title(period)"
        :start="start(period)"
        :end="start(periods[i+1])"
        :selected="i === startIndex || i >= startIndex && i <= endIndex"
        clickable
        :outline="i === startIndex && endIndex === -1"
        @click="select(i)"
      )
  .confirm(v-if="startIndex >= 0 && endIndex >= 0")
    .text-italic.text-grey-7.text-center {{ `${periodCount} lunar period${periodCount > 1 ? 's' : ''} - ${dateString}` }}
  .next-step.q-my-lg
    .row.justify-between
      q-btn.q-px-md(no-caps rounded unelevated color="white" text-color="primary" label="Reset selection" @click="reset()")
      .buttons
        q-btn.q-px-md.q-mr-md(no-caps rounded flat color="primary" label="Prev step" @click="$emit('prev')")
        q-btn.q-px-md(no-caps rounded unelevated color="primary" label="Next step" @click="$emit('next')")
</template>
