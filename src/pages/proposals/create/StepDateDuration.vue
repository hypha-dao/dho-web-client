<script>
import { mapGetters } from 'vuex'
import { date } from 'quasar'
import { dateToString } from '~/utils/TimeUtils'

const MAX_PERIODS = 26
export default {
  name: 'step-date-duration',
  components: {
    PeriodCard: () => import('~/components/assignments/period-card.vue'),
    Widget: () => import('~/components/common/widget.vue'),
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue'),
    InputField: () => import('~/components/common/input-field.vue')
  },

  apollo: {
    periods: {
      query: require('../../../query/periods-upcoming.gql'),
      update: data => data.getDao,
      variables () {
        return {
          daoId: this.selectedDao?.docId,
          after: this.periodAfterDate
        }
      },
      skip () {
        return this.selectedDao?.docId === undefined
      },
      result (res) {
        const v = res.data.getDao.period
        if (this.isFromDraft && v?.length > 0 && !this.resetPeriods) {
          const startPeriod = this.$store.state.proposals.draft.startPeriod
          const periodCount = this.$store.state.proposals.draft.periodCount
          const index = v.findIndex(el => el.docId === startPeriod.docId)
          this.startIndex = index
          this.endIndex = index + periodCount - 1
          this.originalEndIndex = this.endIndex

          const start = new Date(this.start(v[this.startIndex]))
          const end = new Date(this.start(v[this.endIndex]))
          const from = date.formatDate(start, 'YYYY/MM/DD')
          const to = date.formatDate(end, 'YYYY/MM/DD')
          this.setRangeToCalendar({ from, to })
        }
      },
      fetchPolicy: 'no-cache'
    }
  },

  data () {
    return {
      MAX_PERIODS: MAX_PERIODS,
      extendedPeriods: 0,
      isFromDraft: false,
      originalEndIndex: undefined,
      startIndex: -1,
      endIndex: -1,
      resetPeriods: false,
      dateDuration: {
        from: Date.now().toString(),
        to: Date.now().toString()
      }
    }
  },
  mounted () {
    this._initParams()
  },
  activated () {
    this._initParams()
  },
  computed: {
    ...mapGetters('dao', ['selectedDao']),
    periodAfterDate () {
      if (this.isFromDraft) {
        return this.startDate
      }
      return new Date().toISOString()
    },
    originalPeriodCount () {
      return this.$store.state.proposals.draft.original?.details_periodCount_i || 0
    },
    lastOriginalIndex () {
      return this.startIndex + this.originalPeriodCount - 1
    },
    nextDisabled () {
      return (this.periodCount - this.originalPeriodCount) < 1 || (this.periodCount - this.originalPeriodCount) >= MAX_PERIODS
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

      return `from ${dateToString(start, start.getFullYear() !== end.getFullYear())} to ${dateToString(end)}`
    }
  },
  watch: {
    dateString (v) {
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
    extendedPeriods () {
      this.endIndex = this.lastOriginalIndex + this.extendedPeriods
    },
    dateDuration: {
      handler: function () {
        if (this.dateDuration) {
          const startIndex = this.periods.period.findIndex(
            el => new Date(el.details_startTime_t).toDateString() === new Date(this.dateDuration.from).toDateString()
          )
          const endIndex = this.periods.period.findIndex(
            el => new Date(el.details_startTime_t).toDateString() === new Date(this.dateDuration.to).toDateString()
          )
          this.startIndex = startIndex
          this.endIndex = endIndex
        } else {
          this.startIndex = -1
          this.endIndex = -1
        }
      },
      immediate: false,
      deep: true
    }
  },

  // TODO: Move to shared place?
  methods: {
    async _initParams () {
      this.isFromDraft = false
      this.startDate = undefined
      this.originalEndIndex = undefined
      const startPeriod = this.$store.state.proposals.draft.startPeriod
      const periodCount = this.$store.state.proposals.draft.periodCount
      await this.$nextTick()
      if (periodCount && startPeriod) {
        this.isFromDraft = true
        this.startDate = startPeriod.details_startTime_t
      }
    },
    isInvalidDate (date) {
      return date.includes('/')
    },
    getFormatDate (_date) {
      const date = new Date(new Date(_date) + (this.$store.state.dao.settings.votingDurationSec * 1000))
      // const dateString = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`
      // return dateString
      return date.toISOString()
    },
    datePickerOptions (date) {
      return this.enableOnlyPeriods(date) && this.disableOldDates(date)
    },
    disableOldDates (date) {
      const today = new Date().toISOString().split('T')[0].replaceAll('-', '/')
      return date >= today
    },
    // TODO: This can be optimized
    enableOnlyPeriods (date) {
      if (!this.periods) return false
      const periodArray = this.periods.period
      const todayDate = new Date(date)
      todayDate.setHours(0, 0, 0, 0)
      for (let index = 0; index < periodArray.length; index++) {
        const element = periodArray[index]
        const elementDate = new Date(element.details_startTime_t)
        elementDate.setHours(0, 0, 0, 0)
        if (+todayDate === +elementDate) {
          return true
        }
      }
      return false
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
      if (!this.$store.state.proposals.draft.edit) {
        this.isFromDraft = false
        this.startDate = undefined
        this.startIndex = -1
        this.endIndex = -1
        this.resetPeriods = true
        this.dateDuration = undefined
        // this.$apollo.queries.periods.refresh()
        // this.periods.period = []
      } else {
        this.endIndex = this.startIndex + this.originalPeriodCount - 1
      }
    }
  }
}
</script>

<template lang="pug">
widget
  div(v-if="$store.state.proposals.draft.edit")
    .h-h6 Input the number of periods to extend
    input-field.q-mt-sm(
     v-model.number="extendedPeriods"
     type="number"
     rounded
     outlined
     dense
     style="max-width: 200px")

  div(v-if="!$store.state.proposals.draft.edit")
    div
      label.h-h4 Range of dates
      q-date.full-width.q-mt-lg(
        range
        v-model="dateDuration"
        ref="calendar"
        :options="datePickerOptions"
      )

    div.q-mt-xl
      label.h-h4 Duration in periods

    .row.justify-center(v-if="$apolloData.queries.periods.loading")
      q-spinner-tail(size="md")

    .row.q-mt-sm(v-else)
      .row.q-gutter-sm(v-if="periods && periods.period")
        template(v-for="i in periodCount")
          period-card(
            :title="title(periods.period[startIndex + i - 1])"
            :start="start(periods.period[startIndex + i - 1])"
            :end="start(periods.period[startIndex + i])"
            :selected="true"
            :index="i"
          )
          //- :outline="i === startIndex && endIndex === -1"
  .confirm.q-mt-xl(v-if="startIndex >= 0 && endIndex >= 0")
    .text-italic.text-grey-7.text-center {{ `${periodCount} period${periodCount > 1 ? 's' : ''} - ${dateString}` }}
    .text-negative.h-b2.q-ml-xs.text-center(v-if="periodCount >= (MAX_PERIODS + originalPeriodCount) && $store.state.proposals.draft.edit") You must select less than {{MAX_PERIODS + originalPeriodCount}} periods (Currently you selected {{periodCount}} periods)
    .text-negative.h-b2.q-ml-xs.text-center(v-if="periodCount >= MAX_PERIODS && !$store.state.proposals.draft.edit") You must select less than {{MAX_PERIODS}} periods (Currently you selected {{periodCount}} periods)
  .next-step.q-mt-xl
    .row.items-center(:class="{'justify-between': !$store.state.proposals.draft.edit, 'justify-end': $store.state.proposals.draft.edit}")
      q-btn.q-px-md(no-caps rounded unelevated color="white" text-color="primary" label="Reset selection" @click="reset()" v-if="!$store.state.proposals.draft.edit")
      nav.row.justify-end.q-gutter-xs
        q-btn.q-px-xl(
          @click="$emit('prev')"
          color="primary"
          label="Previous step"
          no-caps
          outline
          rounded
          unelevated
        )
        q-btn.q-px-xl(
          :disable="nextDisabled"
          @click="$emit('next')"
          color="primary"
          label="Next step"
          no-caps
          rounded
          unelevated
        )
</template>

<style scoped lang="stylus">
.q-date__calendar-item
  color red !important
  width 500px !important
</style>
