<script>
import { copyToClipboard } from '~/utils/eosio'
import { mapGetters } from 'vuex'

export default {
  name: 'key-value-display',
  props: {
    object: { type: Object },
    scope: { type: String },
    id: { type: Number }
  },
  data () {
    return {
      excludedFields: ['trxs', 'floats'],
      initialPagination: {
        sortBy: 'key',
        descending: false,
        page: 1,
        rowsPerPage: 20
      },
      columns: [
        { name: 'key', required: true, label: 'Key', align: 'left', field: row => row.key, sortable: true },
        { name: 'value', required: true, label: 'Value', align: 'left', field: row => row.value, sortable: true }
      ],
      keyValues: []
    }
  },
  computed: {
    ...mapGetters('periods', ['periods'])
  },
  methods: {
    onCopyToClipboard () {
      copyToClipboard(`${window.location.origin}/#/raw/${this.scope}/${this.id}`)
    }
  },
  watch: {
    object: {
      immediate: true,
      handler (val) {
        for (const key of Object.keys(val)) {
          if (Array.isArray(val[key])) {
            for (const obj of val[key]) {
              this.keyValues.push({
                key: `${key}.${obj.key}`,
                value: JSON.stringify(obj.value)
              })
            }
          } else {
            this.keyValues.push({
              key,
              value: val[key]
            })
          }
        }
        this.keyValues = this.keyValues.filter(obj => !this.excludedFields.some(f => obj.key.includes(f)))
        this.keyValues = this.keyValues.map(obj => {
          if (obj.key.includes('x100')) {
            obj.value = `${obj.value}%`
          } else if (obj.key.includes('start_period')) {
            const period = this.periods.find(p => p.period_id === parseInt(obj.value))
            if (period) {
              obj.value = period.start_date
            }
          } else if (obj.key.includes('end_period')) {
            const period = this.periods.find(p => p.period_id === parseInt(obj.value))
            if (period) {
              obj.value = period.end_date
            }
          }
          return obj
        })
      }
    }
  }
}
</script>

<template lang="pug">
q-table(
  title="Object content"
  :data="keyValues"
  :columns="columns"
  row-key="key"
  :pagination.sync="initialPagination"
)
  template(v-slot:top)
    .text-h6 Object Content
    q-btn(
      icon="fas fa-link"
      flat
      size="sm"
      color="primary"
      @click="onCopyToClipboard"
    )
  template(v-slot:header="props")
    q-tr(:props="props")
      q-th(auto-width)
      q-th Key
      q-th Value
  template(v-slot:body="props")
    q-tr(:props="props")
      q-td(auto-width)
        q-btn(v-if="props.row.value.length >= 150" size="sm" color="accent" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'")
      q-td
        | {{ props.row.key }}
      q-td
        | {{ props.row.value && ('' + props.row.value).slice(0, 150) }}
        span(v-if="props.row.value.length >= 150") ...
    q-tr(v-show="props.expand" :props="props")
      q-td(colspan="100%")
        .details {{ props.row.value }}
</template>

<style lang="sass" scoped>
.details
  word-break: break-all
  white-space: pre-line
</style>
