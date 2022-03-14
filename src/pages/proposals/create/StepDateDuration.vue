<script>
import { mapGetters } from 'vuex'
import { date } from 'quasar'

export default {
  name: 'step-date-duration',
  components: {
    PeriodCard: () => import('~/components/assignments/period-card.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  apollo: {
    periods: {
      query: require('../../../query/periods-upcoming.gql'),
      update: data => data.getDao,
      skip () {
        return !this.selectedDao || !this.selectedDao.docId || !this.startDate
      }
    }
  },

  data () {
    return {
      startIndex: -1,
      endIndex: -1,
      dateDuration: {
        from: Date.now().toString(),
        to: Date.now().toString()
      }
    }
  },
  computed: {
    ...mapGetters('dao', ['selectedDao']),
    disabledNext () {
      return !this.periodCount >= 1
    },
    startDate: {
      get () {
        return this.$store.state.proposals.draft.startDate || ''
      },

      set (value) {
        this.$store.commit('proposals/setStartDate', value)
      }
    },
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

      const start = new Date(this.start(this.periods.period[this.startIndex]))
      const end = new Date(this.start(this.periods.period[this.endIndex + 1]))

      const startOpts = { year: (start.getFullYear() !== end.getFullYear()) ? 'numeric' : undefined, month: 'long', day: 'numeric' }
      const endOpts = { year: 'numeric', month: 'long', day: 'numeric' }

      return `From ${start.toLocaleDateString(undefined, startOpts)} to ${end.toLocaleDateString(undefined, endOpts)}`
    }
  },
  watch: {
    dateString (v) {
      const start = new Date(this.start(this.periods.period[this.startIndex]))
      const end = new Date(this.start(this.periods.period[this.endIndex + 1]))
      const from = date.formatDate(start, 'YYYY/MM/DD')
      const to = date.formatDate(end, 'YYYY/MM/DD')
      this.setRangeToCalendar({ from, to })
      if (v.length > 0 && this.periodCount > 0) {
        if (this.periods && this.periods.period) {
          this.$store.commit('proposals/setStartPeriod', this.periods.period[this.startIndex])
        }
        this.$store.commit('proposals/setPeriodCount', this.periodCount)
        this.$store.commit('proposals/setDetailsPeriod', {
          dateString: v
        })
      }
    },
    startDate: {
      immediate: true,
      handler (val) {
        if (val) {
          const after = this.getFormatDate(this.startDate)
          if (!after) return
          this.$apollo.queries.periods.setVariables({
            after: after,
            daoId: this.selectedDao.docId
          })
        }
      }
    }
  },

  // TODO: Move to shared place?
  methods: {
    getFormatDate (_date) {
      const date = new Date(new Date(_date) + (this.$store.state.dao.settings.votingDurationSeconds * 1000))
      // const dateString = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`
      // return dateString
      return date.toISOString()
    },
    async setRangeToCalendar ({ from, to }) {
      await this.$nextTick()
      this.dateDuration = { from, to }
    },
    title (period) {
      return 'Until'
      // return period && period.details_label_s
    },

    start (period) {
      return period && new Date(period.details_startTime_t)
    },

    reset () {
      this.startIndex = -1
      this.endIndex = -1
      this.$apollo.queries.periods.refresh()
      this.periods.period = []
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
  .text-h6.q-mb-md Start date
  q-date.full-width(
    v-if="this.periodCount >= 1"
    range
    v-model="dateDuration"
    ref="calendar"
    readonly
  )
  q-date.full-width(
    v-else
    v-model="startDate"
  )
  .q-mt-md
  .text-h6.q-mb-md Duration in cycles
  .row.justify-center(v-if="$apolloData.queries.periods.loading")
    q-spinner(size="md")
  .row(v-else)
    .row.q-gutter-sm.q-mb-lg(v-if="periods && periods.period")
      template(v-for="(period, i) in periods.period")
        period-card(v-if="i < periods.period.length-1"
          :title="title(period)"
          :start="start(period)"
          :end="start(periods.period[i+1])"
          :selected="i === startIndex || i >= startIndex && i <= endIndex"
          clickable
          :index="i"
          :outline="i === startIndex && endIndex === -1"
          @click="select(i)"
        )
  .confirm(v-if="startIndex >= 0 && endIndex >= 0")
    .text-italic.text-grey-7.text-center {{ `${periodCount} period${periodCount > 1 ? 's' : ''} - ${dateString}` }}
  .next-step.q-my-lg
    .row.justify-between
      q-btn.q-px-md(no-caps rounded unelevated color="white" text-color="primary" label="Reset selection" @click="reset()")
      .buttons
        q-btn.q-px-md.q-mr-md(no-caps rounded flat color="primary" label="Prev step" @click="$emit('prev')")
        q-btn.q-px-md(no-caps rounded unelevated color="primary" label="Next step" @click="$emit('next')" :disable="disabledNext")
</template>
