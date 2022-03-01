<script>
import { mapState } from 'vuex'
export default {
  name: 'page-search-results',
  components: {
    Widget: () => import('~/components/common/widget.vue'),
    Result: () => import('./components/result.vue'),
    FilterWidget: () => import('~/components/filters/filter-widget.vue')
  },
  methods: {
    // ...mapGetters('search', ['getResults']),
    // getResultsStore () {
    //   console.log('----------------')
    //   console.log(this.getResults())
    //   console.log('----------------')
    //   this.results = this.getResults()
    // }
  },
  beforeMount () {
    // this.getResultsStore()
  },
  computed: {
    ...mapState('search', ['results'])
    // results () {
    //   console.log('test')
    //   console.log(this.getResults())
    //   return this.results
    // }
  },
  data () {
    return {
      optionArray: ['Sort by last added'],
      circleArray: ['All circles'],
      results2: [],
      filters: [
        {
          label: 'All',
          enabled: true,
          filter: () => true
        },
        {
          label: 'Members',
          enabled: false,
          filter: (p) => p.__typename === ''
        },
        {
          label: 'One Time Active',
          enabled: false,
          filter: (p) => p.__typename === ''
        },
        {
          label: 'Recurring Activity',
          enabled: false,
          filter: (p) => p.__typename === ''
        },
        {
          label: 'Organizational',
          enabled: false,
          filter: (p) => p.__typename === ''
        }
      ]
    }
  }
}
</script>

<template lang="pug">
q-page.page-search-results
  .row.q-mt-sm
    .col-9.q-px-sm.q-py-md
      widget(:title="`${results.length} Results`")
        div( style="max-height: 400px; overflow: auto;" ref="scrollTargetRef" v-for="result in results")
          pre {{result._source.type}} | {{result._score}} | {{result._source.system_nodeLabel_s}}
          //- pre {{result._source}}
          //- result(v-for="result in results" :key="result.title" v-bind="result")
          //- q-infinite-scroll(@load="onLoad" :offset="250" :scroll-target="$refs.scrollTargetRef")
    .col-3.q-pa-sm.q-py-md
      filter-widget(
        filterTitle="Search DHOs"
        :optionArray="optionArray"
        :circleArray="circleArray"
        :showToggle="false"
        :showViewSelector="false"
        :chipsFiltersLabel="'Results types'"
        :filters.sync="filters"
        :showTextFilter="false"
      )
</template>
