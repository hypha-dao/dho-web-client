<script>
import { mapGetters } from 'vuex'
import { format } from '~/mixins/format'
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
          label: 'Unclaimed periods',
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
        return !this.selectedDao
      },
      result (data) {
        this.computeRows(data)
      }
    }
  },
  computed: {
    ...mapGetters('dao', ['selectedDao', 'daoSettings'])
  },
  methods: {
    computeRows (data) {
      if (!data) return
      const assignments = data.data.getDao.passedprops
      this.rows = []

      assignments.forEach(async element => {
        const row = {}
        row.name = element.details_title_s
        row.docId = element.docId
        row.creator = element.creator

        const totalPeriods = element.details_periodCount_i
        const claimedPeriods = element.claimedAggregate.count
        const unclaimedPeriods = totalPeriods - claimedPeriods

        row.claimed = claimedPeriods
        row.unclaimed = unclaimedPeriods
        row.unclaimedCash = this.toAsset(((element.details_pegSalaryPerPeriod_a?.split(' ')[0] * unclaimedPeriods) || 0))
        row.unclaimedUtility = this.toAsset(((element.details_rewardSalaryPerPeriod_a?.split(' ')[0] * unclaimedPeriods) || 0))
        row.unclaimedVoice = this.toAsset(((element.details_voiceSalaryPerPeriod_a?.split(' ')[0] * unclaimedPeriods) || 0))
        this.rows.push(row)

        this.totalUnclaimedPeriods += unclaimedPeriods
        this.totalUnclaimedCash += parseFloat(row.unclaimedCash)
        this.totalUnclaimedUtility += parseFloat(row.unclaimedUtility)
        this.totalUnclaimedVoice += parseFloat(row.unclaimedVoice)
      })
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
      .h-h7 {{toAsset(totalUnclaimedUtility)}}
    widget(title="Total unclaimed cash")
      .h-h7 {{toAsset(totalUnclaimedCash)}}
    widget(title="Total unclaimed voice")
      .h-h7 {{toAsset(totalUnclaimedVoice)}}

  .table-container
    q-table(
      :pagination="{rowsPerPage: 30}"
      title="Assignments"
      dense
      :data="rows"
      :columns="columns"
      row-key="docId")
</template>
<style lang="stylus" scoped>
.kpi
  .widget
    width: 320px
</style>
