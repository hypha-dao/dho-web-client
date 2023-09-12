<script>
import { mapGetters } from 'vuex'
import gql from 'graphql-tag'
import { date } from 'quasar'
import { dateToString } from '~/utils/TimeUtils'

const MAX_PERIODS = 26
const DEFAULT_PERIOD_COUNT = 12

function monthDiff(_dateFrom, _dateTo) {
  const dateFrom = new Date(_dateFrom)
  const dateTo = new Date(_dateTo)
  return dateTo.getMonth() - dateFrom.getMonth() +
   (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
}

const UPCOMING_PERIODS_QUERY = `
  getDao(docId: $daoId) {
    __typename
    id: docId

    calendar {
      __typename
      id: docId

      period(
        filter: { details_startTime_t: { ge: $start } }
        first: $count
        offset: $page
      ) {
        __typename
        id: docId
        details_label_s
        details_startTime_t
        docId
        next {
          __typename
          id: docId
          end: details_startTime_t
        }
      }
    }
  }
`

export default {
  name: 'step-duration',
  components: {
    CreationStepper: () => import('~/components/proposals/creation-stepper.vue'),
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    disablePrevButton: Boolean,
    fields: Object,
    stepIndex: Number,
    steps: Array
  },

  apollo: {
    periods: {
      query: gql`query periodsUpcoming($daoId: String!, $start: DateTime!, $count: Int!, $page: Int) { ${UPCOMING_PERIODS_QUERY} }`,
      update: data => data.getDao.calendar[0].period,
      skip () { return !this.selectedDao?.docId },
      variables () {
        return {
          start: new Date(this.startDate),
          count: this.size,
          daoId: this.selectedDao.docId,
          page: 0
        }
      },
      result (res) {
        const periods = res.data.getDao.calendar[0].period

        if (!this.periodCount) this.periodCount = DEFAULT_PERIOD_COUNT
        if (!this.startDate) this.startDate = periods[0].details_startTime_t
      },
      fetchPolicy: 'no-cache'
    }
  },

  data () {
    return {
      MAX_PERIODS: MAX_PERIODS,
      size: MAX_PERIODS * 2,
      page: 0
    }
  },

  computed: {
    ...mapGetters('dao', ['selectedDao']),

    availableDates () {
      return this.periods && this.periods.map(_ => date.formatDate(_.details_startTime_t, 'YYYY/MM/DD'))
    },

    nextDisabled () {
      return this.periodCount < 1 || this.periodCount >= MAX_PERIODS
    },

    durationString () {
      const start = new Date(this.startDate)
      const end = new Date(this.endDate)

      return `from ${dateToString(start, start.getFullYear() !== end.getFullYear())} to ${dateToString(end)}`
    },

    startDate: {
      get () {
        return date.formatDate(this?.$store?.state?.proposals?.draft?.startPeriod?.details_startTime_t || new Date(), 'YYYY/MM/DD')
      },

      set (value) {
        this.$store.commit('proposals/setStartPeriod', this.periods[this.getStartIndex(value)])
      }
    },

    periodCount: {
      get () {
        return this.$store.state.proposals.draft.periodCount
      },

      set (value) {
        this.$store.commit('proposals/setPeriodCount', Number(value))
      }
    },

    endDate () {
      const index = this.getEndIndex()
      if (this.periods && this.periods.length - 1 >= index) {
        return this.periods[index].details_startTime_t
      }
      return ''
    }

  },

  watch: {

  },

  methods: {
    formatDate: date.formatDate,

    getStartIndex (startDate) {
      return this.periods && startDate && this.periods.findIndex(
        _ => new Date(_.details_startTime_t).toDateString() === new Date(startDate).toDateString()
      )
    },

    getEndIndex () {
      return this.getStartIndex(this.startDate) + this.periodCount
    },

    isDateAvaiable (date) { return this.availableDates ? this.availableDates.includes(date) : true },

    onDateNavigate ({ month, year }) {
      const newStartPeriodsDate = new Date(this.startDate)
      // newStartPeriodsDate.setDate(1)
      newStartPeriodsDate.setMonth(month - 1)
      newStartPeriodsDate.setFullYear(year)

      const diffrenceInMonths = monthDiff(this.startDate, newStartPeriodsDate)

      const page = Math.floor(diffrenceInMonths / 5.5555)
      if (this.page !== page) {
        this.page = page
        // this.$apollo.queries.periods.fetchMore({
        // // New variables
        //   variables: {
        //     page: this.page * this.size
        //   },
        //   // Transform the previous result with new data
        //   updateQuery: (previousResult, { fetchMoreResult }) => {
        //     return {
        //       getDao: {
        //         ...previousResult.getDao,
        //         calendar: [
        //           {
        //             period: [
        //               ...previousResult.getDao.calendar[0].period
        //               // ...fetchMoreResult.getDao.calendar[0].period
        //             ]
        //           }
        //         ]

        //       }

        //     }
        //     // const newTags = fetchMoreResult.tagsPage.tags
        //     // const hasMore = fetchMoreResult.tagsPage.hasMore

        //     // this.showMoreEnabled = hasMore

        //     // data.getDao.calendar[0].period

        //   // return {
        //   //   tagsPage: {
        //   //     __typename: previousResult.tagsPage.__typename,
        //   //     // Merging the tag list
        //   //     tags: [...previousResult.tagsPage.tags, ...newTags],
        //   //     hasMore,
        //   //   },
        //   // }
        //   }
        // })
      }
    }

  }

}
</script>

<template lang="pug">
widget
  label.h-h4 {{ fields.stepDurationTitle.label }}
  div
    .q-mt-md
      .q-gutter-sm(:class="{ 'row': $q.screen.gt.md }")
        .col.select-date-block.relative
          label.h-h7 {{ $t('pages.proposals.create.stepduration.startDate') }}
          q-input.rounded-border.col.q-mt-xs(dense outlined rounded v-model="startDate")
            template(v-slot:append)
              q-icon(size="xs" name="fa fa-calendar-alt")
          q-date.bg-internal-bg.calendar.absolute.z-top(
            :options="isDateAvaiable"
            @input="onDateChanged"
            @navigation="onDateNavigate"
            minimal="minimal"
            ref="calendar"
            rounded
            v-model="startDate"
          )

        .col
          label.h-h7 {{ $t('pages.proposals.create.stepduration.periods') }}
          q-input.rounded-border.col.q-mt-xs(dense outlined rounded v-model="periodCount" :max="MAX_PERIODS")
          q-tooltip {{ $t('pages.proposals.create.stepduration.1MoonPeriod') }}

        .col
          label.h-h7 {{ $t('pages.proposals.create.stepduration.endDate') }}
          q-input.rounded-border.col.q-mt-xs(dense filled rounded disable v-model="durationString")

    .row.justify-center(v-if="$apolloData.queries.periods.loading")
      q-spinner-tail(size="md")

  .confirm.q-mt-xl
    .text-negative.h-b2.q-ml-xs.text-center(v-if="periodCount >= MAX_PERIODS") {{ $t('pages.proposals.create.stepduration.youMustSelect', { '1': MAX_PERIODS, '2': periodCount }) }}
    .text-negative.h-b2.q-ml-xs.text-center(v-if="periodCount < 0") {{ $t('pages.proposals.create.stepduration.theStartDate') }}

  .next-step.q-mt-xl
    .row.items-center(:class="{'justify-between': !$store.state.proposals.draft.edit, 'justify-end': $store.state.proposals.draft.edit}")
      nav.row.justify-end.full-width.q-gutter-xs(v-if="$q.screen.gt.md")
        q-btn.h-btn2.q-px-xl(v-if="!disablePrevButton" @click="$emit('prev')" color="primary" :label="$t('pages.proposals.create.stepduration.back')" no-caps outline rounded flat)
        q-btn.q-px-xl(:disable="nextDisabled" @click="$emit('next')" color="primary" :label="$t('pages.proposals.create.stepduration.nextStep')" no-caps rounded unelevated)
  template(v-if="$q.screen.lt.md || $q.screen.md")
    q-card(:style="'border-radius: 25px; box-shadow: none; z-index: 7000; position: fixed; bottom: -20px; left: 0; right: 0; box-shadow: 0px 0px 26px 0px rgba(0, 0, 41, 0.2);'")
      creation-stepper(
        :activeStepIndex="stepIndex"
        :steps="steps"
        :nextDisabled="nextDisabled"
        @publish="$emit('publish')"
        @save="$emit('save')"
        @next="$emit('next')"
      )
</template>

<style scoped lang="stylus">

.calendar
  display: none
  box-shadow: 0px 0px 18px #00000014
  border-radius: 15px
.select-date-block:hover > .calendar
  display: flex
.calendar:hover
  display: flex
</style>
