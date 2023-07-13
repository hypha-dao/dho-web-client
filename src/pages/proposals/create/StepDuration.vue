<script>
import { date } from 'quasar'
import { mapGetters } from 'vuex'
import { dateToString } from '~/utils/TimeUtils'

const MAX_PERIODS = 26
const DEFAULT_PERIOD_COUNT = 12

export default {
  name: 'step-duration',
  components: {
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue'),
    Widget: () => import('~/components/common/widget.vue'),
    CreationStepper: () => import('~/components/proposals/creation-stepper.vue')
  },
  props: {
    disablePrevButton: Boolean,
    fields: Object,
    stepIndex: Number,
    steps: Array
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
        this.periodCount = this.isExtension ? DEFAULT_PERIOD_COUNT : DEFAULT_PERIOD_COUNT
        if ((this.isFromDraft && v?.length > 0 && !this.resetPeriods) || this.isExtension) {
          const startPeriod = this.$store.state.proposals.draft.startPeriod
          const periodCount = this.$store.state.proposals.draft.periodCount
          const index = v.findIndex(el => el.docId === startPeriod.docId)
          this.startIndex = index
          this.endIndex = index + periodCount - 1
          this.originalEndIndex = this.endIndex
          const start = new Date(this.start(v[this.startIndex]))
          const from = date.formatDate(start, 'YYYY/MM/DD')
          const to = this.endIndex
          this.setRangeToCalendar(from, to)
        }
        if (!this.isExtension) {
          this.startValue = date.formatDate(v?.[0].details_startTime_t, 'YYYY/MM/DD')
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
      startIndex: 1,
      endIndex: -1,
      resetPeriods: false,
      dateDuration: {
        from: Date.now().toString(),
        to: Date.now().toString()
      },
      startValue: ''
    }
  },
  async mounted () {
    await this._initParams()
  },
  async activated () {
    await this._initParams()
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
    periodCount: {
      get () {
        if (this.startIndex === -1 || this.endIndex === -1) {
          return 0
        }
        return this.endIndex - this.startIndex + 1
      },
      set (value) {
        this.setEndIndex(Number(value) + this.startIndex - 1)
        this.$store.commit('proposals/setPeriodCount', Number(value))
      }
    },

    dateString () {
      if (this.startIndex === -1 || this.endIndex === -1) {
        return ''
      }
      const start = new Date(this.start(this.periods.period[this.startIndex]))
      const end = new Date(this.start(this.periods.period[this.endIndex + 1]))
      return `from ${dateToString(start, start.getFullYear() !== end.getFullYear())} to ${dateToString(end)}`
    },

    isExtension () {
      return this.$store.state.proposals.draft.isExtension
    }
  },
  watch: {
    dateString (v) {
      if (v.length > 0 && this.periodCount > 0) {
        if (this.periods && this.periods.period) {
          this.$store.commit('proposals/setStartPeriod', this.periods.period[this.startIndex])
          if (this.isExtension) {
            this.startValue = date.formatDate(this.periods.period[this.startIndex].details_startTime_t, 'YYYY/MM/DD')
          }
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
    startValue: {
      handler: function () {
        if (this.startValue) {
          const startIndex = this.periods.period.findIndex(
            el => new Date(el.details_startTime_t).toDateString() === new Date(this.startValue).toDateString()
          )
          this.startIndex = startIndex
          this.periodCount = this.$store.state.proposals.draft.periodCount
        } else {
          this.startIndex = -1
        }
      }
    }
  },

  // TODO: Move to shared place?
  methods: {
    async _initParams () {
      this.isFromDraft = false
      this.startDate = undefined
      this.originalEndIndex = undefined
      const startPeriod = this.$store.state.proposals.draft.startPeriod
      const endIndex = this.$store.state.proposals.draft.endIndex
      // const periodCount = this.$store.state.proposals.draft.periodCount
      await this.$nextTick()
      if (startPeriod && endIndex) {
        this.isFromDraft = true
        this.startDate = startPeriod.details_startTime_t
        this.endIndex = endIndex
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
    async setRangeToCalendar (from, to) {
      await this.$nextTick()
      this.startValue = from
      this.endIndex = to
    },
    title (period) {
      return 'Until'
      // return period && period.details_label_s
    },

    start (period) {
      return period && new Date(period.details_startTime_t)
    },
    setEndIndex (index) {
      this.endIndex = index
      this.$store.commit('proposals/setEndIndex', this.endIndex)
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
          q-input.rounded-border.col.q-mt-xs(dense outlined rounded v-model="startValue")
            template(v-slot:append)
              q-icon(size="xs" name="fa fa-calendar-alt")
          q-date.bg-internal-bg.calendar.absolute.z-top(:options="datePickerOptions" minimal="minimal" ref="calendar" v-model="startValue" rounded)
        .col
          label.h-h7 {{ $t('pages.proposals.create.stepduration.periods') }}
          q-input.rounded-border.col.q-mt-xs(dense outlined rounded v-model="periodCount")
        .col
          label.h-h7 {{ $t('pages.proposals.create.stepduration.endDate') }}
          q-input.rounded-border.col.q-mt-xs(dense filled rounded disable v-model="dateString")
    .row.justify-center(v-if="$apolloData.queries.periods.loading")
      q-spinner-tail(size="md")
  .confirm.q-mt-xl(v-if="startIndex >= 0 && endIndex >= 0")
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
