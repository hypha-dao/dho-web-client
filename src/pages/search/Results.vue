<script>
import { mapState } from 'vuex'
import ElasticSearch from '~/elasticSearch/elastic-search.js'
export default {
  name: 'page-search-results',
  components: {
    Widget: () => import('~/components/common/widget.vue'),
    Result: () => import('./components/result.vue'),
    FilterWidget: () => import('~/components/filters/filter-widget.vue')
  },
  computed: {
    ...mapState('search', ['search']),
    getPaginationText () {
      const total = this.results.total.value
      if (total === 0) {
        return 'No results found'
      }
      const lowerBound = this.params.from + 1
      let upperBound = this.params.from + this.params.size + 1
      if (upperBound > total) {
        upperBound = total
      }
      return lowerBound + '-' + upperBound + ' of ' + total
    },
    isLastPage () {
      return this.params.from + this.params.size >= this.results.total.value
    }
  },
  watch: {
    search: {
      async handler () {
        this.params.from = 0
        this.params.size = 10
        await this.onSearch()
      },
      immediate: true
    }
  },
  data () {
    return {
      params: {
        from: 0,
        size: 10,
        fields: ['*'],
        fuzziness: 'auto'
      },
      optionArray: ['Sort by last added'],
      circleArray: ['All circles'],
      results: [],
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
  },
  methods: {
    getIcon (type) {
      switch (type) {
        case 'Member':
          return 'far fa-user'
        default:
          break
      }
    },
    async onSearch () {
      const _results = await ElasticSearch.search(this.search, this.params)
      this.results = _results.hits
    },
    onPrev () {
      this.params.from = this.params.from - this.params.size
      this.onSearch()
    },
    onNext () {
      this.params.from = this.params.from + this.params.size
      this.onSearch()
    }
  }
}

</script>

<template lang="pug">
q-page.page-search-results
  .row.q-mt-sm
    .col-9.q-px-sm.q-py-md
      widget(:title="`${results.total.value} Results`")
        result(
          v-for="result in results.hits"
          :type="result._source.type"
          :title="result._source.system_nodeLabel_s"
          :key="result.title"
          :icon ="getIcon(result._source.type)"
          v-bind="result"
        )
        .row.justify-between.q-pt-sm
          q-btn(@click="onPrev()" :disable="!params.from" round unelevated class="round-circle" icon="fas fa-chevron-left" color="inherit" text-color="primary" size="sm" :ripple="false")
          .q-pt-sm {{  getPaginationText }}
          q-btn(@click="onNext()" :disable="isLastPage" round unelevated class="round-circle" icon="fas fa-chevron-right" color="inherit" text-color="primary" size="sm" :ripple="false")
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
