<script>
import { mapGetters } from 'vuex'
import { format } from '~/mixins/format'
import { exportFile } from 'quasar'

function wrapCsvValue (val, formatFn, row) {
  let formatted = formatFn !== undefined
    ? formatFn(val, row)
    : val

  formatted = formatted === undefined || formatted === null
    ? ''
    : String(formatted)

  formatted = formatted.split('"').join('""').split('\n').join('\\n').split('\r').join('\\r')
  return `"${formatted}"`
}

export default {
  name: 'finflow-tools',
  mixins: [format],
  components: {
    Widget: () => import('~/components/common/widget.vue')
  },

  meta: {
    title: 'Finflow tools'
  },

  data () {
    return {
      columns: [
        {
          name: 'docId',
          label: 'ID',
          align: 'left',
          field: 'docId',
          sortable: true
        },
        {
          name: 'name',
          label: 'Name',
          align: 'left',
          field: 'name',
          sortable: true
        },
        {
          name: 'creator',
          label: 'Creator',
          align: 'left',
          field: 'creator',
          sortable: true
        },
        {
          name: 'claimed',
          label: 'Claimed periods',
          align: 'left',
          field: 'claimed',
          sortable: true
        },
        {
          name: 'unclaimed',
          label: 'Unclaimed past periods',
          align: 'left',
          field: 'unclaimed',
          sortable: true
        },
        {
          name: 'unclaimedUtility',
          label: 'Unclaimed Utility Token',
          align: 'left',
          field: 'unclaimedUtility',
          sortable: true
        },
        {
          name: 'unclaimedCash',
          label: 'Unclaimed Cash Token',
          align: 'left',
          field: 'unclaimedCash',
          sortable: true
        },
        {
          name: 'unclaimedVoice',
          label: 'Unclaimed Voice Token',
          align: 'left',
          field: 'unclaimedVoice',
          sortable: true
        }
      ],
      rows: [],
      totalUnclaimedPeriods: 0,
      totalUnclaimedUtility: 0,
      totalUnclaimedCash: 0,
      totalUnclaimedVoice: 0
    }
  },
  apollo: {
    passedprops: {
      query () {
        return require('~/query/assignments/dao-approved-assignments.gql')
      },
      update: data => data.passedprops,
      variables () {
        return {
          daoId: this.selectedDao.docId
        }
      },
      skip () {
        return !this.selectedDao || !this.selectedDao.docId
      },
      result (data) {
        this.computeRows(data)
      },
      fetchPolicy: 'no-cache'
    }
  },
  computed: {
    ...mapGetters('dao', ['selectedDao', 'daoSettings'])
  },
  methods: {
    customSort (rows, sortBy, descending) {
      const data = [...rows]

      if (sortBy) {
        data.sort((a, b) => {
          const x = descending ? b : a
          const y = descending ? a : b

          if (sortBy === 'name') {
            // string sort
            return x[sortBy] > y[sortBy] ? 1 : x[sortBy] < y[sortBy] ? -1 : 0
          } else if (sortBy === 'claimed' || sortBy === 'unclaimed') {
            // numeric sort
            return parseFloat(x[sortBy]) - parseFloat(y[sortBy])
          } else {
            return parseFloat(x[sortBy].replace(',', '')) - parseFloat(y[sortBy].replace(',', ''))
          }
        })
      }

      return data
    },
    computeRows (data) {
      if (!data?.data?.getDao?.passedprops) return
      const assignments = data.data.getDao.passedprops
      this.rows = []
      this.totalUnclaimedPeriods = 0
      this.totalUnclaimedUtility = 0
      this.totalUnclaimedCash = 0
      this.totalUnclaimedVoice = 0
      assignments.forEach(async element => {
        const row = {}
        row.name = element.details_title_s
        row.docId = element.docId
        row.creator = element.creator

        const now = new Date()
        const endDate = new Date(new Date(element.start[0]?.details_startTime_t).getTime() +
              (element.details_periodCount_i * this.daoSettings.periodDurationSec * 1000))
        const startDate = new Date(element.start[0]?.details_startTime_t)
        const elapsedTime = Math.min(now.getTime(), endDate) - startDate.getTime()

        const totalPeriods = parseInt(elapsedTime / (this.daoSettings.periodDurationSec * 1000))
        const claimedPeriods = element.claimedAggregate.count
        const unclaimedPeriods = totalPeriods - claimedPeriods

        if (unclaimedPeriods > 0) {
          const timeshare = await this.$apollo.query({
            query: require('../../query/assignments/assignment-timeshare.gql'),
            variables: {
              docId: row.docId
            }
          })

          let unclaimedCash = 0
          let unclaimedUtility = 0
          let unclaimedVoice = 0
          for (let index = 0; index < unclaimedPeriods; index++) {
            const poeriodIndex = claimedPeriods + index
            const periodStart = new Date(startDate.getTime() + (poeriodIndex * this.daoSettings.periodDurationSec * 1000))
            let timeshareAmount = timeshare.data.queryTimeshare[0].details_timeShareX100_i
            timeshare.data.queryTimeshare.forEach(element => {
              const timeshareStart = new Date(element.details_startDate_t)
              if (timeshareStart <= periodStart) {
                timeshareAmount = element.details_timeShareX100_i
              }
            })
            const x100Cash = ((element.details_pegSalaryPerPeriod_a?.split(' ')[0] || 0) * 100) / timeshare.data.queryTimeshare[0].details_timeShareX100_i
            unclaimedCash += (timeshareAmount / 100) * x100Cash
            const x100Utility = ((element.details_rewardSalaryPerPeriod_a?.split(' ')[0] || 0) * 100) / timeshare.data.queryTimeshare[0].details_timeShareX100_i
            unclaimedUtility += (timeshareAmount / 100) * x100Utility
            const x100Voice = ((element.details_voiceSalaryPerPeriod_a?.split(' ')[0] || 0) * 100) / timeshare.data.queryTimeshare[0].details_timeShareX100_i
            unclaimedVoice += (timeshareAmount / 100) * x100Voice
          }

          row.claimed = claimedPeriods
          row.unclaimed = unclaimedPeriods
          row.unclaimedCash = this.getFormatedTokenAmount(unclaimedCash, Number.MAX_VALUE)
          row.unclaimedUtility = this.getFormatedTokenAmount(unclaimedUtility, Number.MAX_VALUE)
          row.unclaimedVoice = this.getFormatedTokenAmount(unclaimedVoice, Number.MAX_VALUE)
          this.rows.push(row)

          this.totalUnclaimedPeriods += unclaimedPeriods
          this.totalUnclaimedCash += parseFloat(unclaimedCash)
          this.totalUnclaimedUtility += parseFloat(unclaimedUtility)
          this.totalUnclaimedVoice += parseFloat(unclaimedVoice)
        }
      })
    },
    exportTable () {
      // naive encoding to csv format
      const content = [this.columns.map(col => wrapCsvValue(col.label))].concat(
        this.rows.map(row => this.columns.map(col => wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === undefined ? col.name : col.field],
          col.format,
          row
        )).join(','))
      ).join('\r\n')

      const status = exportFile(
        `${this.selectedDao.name}-assignments-${(new Date()).toISOString()}.csv`,
        content,
        'text/csv'
      )
      if (status !== true) {
        this.$q.notify({
          message: 'Browser denied file download...',
          color: 'negative',
          icon: 'fa fa-exclamation-triangle',
          actions: [{ icon: 'fas fa-times', color: 'white' }]

        })
      } else {
        this.$q.notify({
          message: 'Browser file downloaded',
          color: 'positive',
          icon: 'fa fa-check',
          actions: [{ icon: 'fas fa-times', color: 'white' }]
        })
      }
    },
    onRowClick (evt, row) {
      this.$router.push(`/${this.$route.params.dhoname}/proposals/${row.docId}`)
    }
  }
}
</script>
<template lang="pug">
.page-tools.full-width
  .kpi.row.q-gutter-sm.q-mb-lg
    widget(title="Total unclaimed periods")
      .h-h7 {{totalUnclaimedPeriods}}
    widget(title="Total unclaimed utility")
      .h-h7 {{getFormatedTokenAmount(totalUnclaimedUtility)}}
    widget(title="Total unclaimed cash")
      .h-h7 {{getFormatedTokenAmount(totalUnclaimedCash)}}
    widget(title="Total unclaimed voice")
      .h-h7 {{getFormatedTokenAmount(totalUnclaimedVoice)}}

  .table-container
    q-table(
      :pagination="{rowsPerPage: 30}"
      title="Assignments"
      dense
      @row-click="onRowClick"
      :data="rows"
      :columns="columns"
      :sort-method="customSort"
      binary-state-sort
      row-key="docId")
      template(v-slot:top-right)
        q-btn(
          color="primary"
          icon-right="fa fa-download"
          label="Export to csv"
          no-caps
          unelevated
          rounded
          @click="exportTable")

</template>
<style lang="stylus" scoped>
.kpi
  .widget
    width: 320px
</style>
