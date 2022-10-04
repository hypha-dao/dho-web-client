<script>
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex'
import ElasticSearch from '~/elasticSearch/elastic-search.js'
import { debounce } from 'quasar'

export default {
  name: 'page-search-results',
  components: {
    Widget: () => import('~/components/common/widget.vue'),
    Result: () => import('./components/result.vue'),
    FilterWidgetMobile: () => import('~/components/filters/filter-widget-mobile.vue'),
    FilterOpenButton: () => import('~/components/filters/filter-open-button.vue')
  },
  meta: {
    title: 'Search results'
  },
  async mounted () {
    this.orderField = 'createdDate'
    this.onSearch = debounce(this.onSearch)
    if (this.activeFilter) {
      this.filters.forEach((filter, index) => {
        if (this.activeFilter.includes(index + 1)) {
          this.filters[index].enabled = true
        }
      })
    }
  },
  computed: {
    ...mapState('search', ['search']),
    ...mapGetters('dao', ['selectedDao']),
    getPaginationText () {
      const total = this.results.total ? this.results.total.value : 0
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
      const totalResults = this.results.total ? this.results.total.value : 0
      return this.params.from + this.params.size >= totalResults
    },
    activeFilter () {
      const filter = this.$route.query.type
      return filter
    },
    defaultSelector () {
      switch (this.$route.query.filter) {
        case 'All':
          return 1
        case 'Voting':
          return 2
        case 'Active':
          return 3
        case 'Archived':
          return 4
        case 'Suspended':
          return 5
        default:
          return 1
      }
    },
    orderDefaultSelector () {
      switch (this.$route.query.order) {
        case 'asc':
          return 1
        case 'desc':
          return 2
        case 'alph':
          return 3
        default:
          return 1
      }
    }
  },
  watch: {
    search: {
      async handler () {
        this.results = []
        this.params.from = 0
        this.params.size = 10
        await this.$nextTick()
        await this.onSearch()
      },
      immediate: false
    },
    'selectedDao.docId': {
      async handler () {
        if (this.$route.query.q && this.search !== this.$route.query.q) {
          await this.setSearch(this.$route.query.q)
        }
        // if (!this.$route.query.q) {
        //   this.$router.push({ name: 'dashboard' })
        // }
        this.results = []
        this.params.from = 0
        this.params.size = 10
        await this.$nextTick()
        await this.onSearch()
      },
      immediate: true
    },
    filters: {
      async handler () {
        if (!this.filtersToEvaluate) {
          const someFilterIsTrue = this.filters.some(filter => filter.enabled && (filter.label !== this.filters[0].label))
          if (someFilterIsTrue && this.filters[0].enabled) {
            this.filters[0].enabled = false
          }
          this.filtersToEvaluate = JSON.parse(JSON.stringify(this.filters))
          return
        }
        if (!this.filtersToEvaluate[0].enabled && this.filters[0].enabled) {
          this.filters = this.filters.map(f => {
            if (f.label === this.filters[0].label) {
              return f
            }
            return { ...f, enabled: false }
          })
        } else {
          const someFilterIsTrue = this.filters.some(filter => filter.enabled && (filter.label !== this.filters[0].label))
          if (someFilterIsTrue && this.filters[0].enabled) {
            this.filters[0].enabled = false
          }
        }

        this.filtersToEvaluate = JSON.parse(JSON.stringify(this.filters))
        this.params.filter.queries = []
        if (this.filters[0].enabled) {
          this.params.filter.queries = [
            'Payout', 'Member', 'Assignbadge',
            'Assignment', 'Role', 'Badge',
            'Payout', 'Suspend', 'Edit'
          ]
          this.params.from = 0
          this.params.size = 10
          await this.$nextTick()
          await this.onSearch()
          const query = { ...this.$route.query, type: '1' }
          this.$router.replace({ query })
        } else {
          this.params.filter.queries = []
          let type = ''
          this.filters.forEach((filter) => {
            if (filter.enabled) {
              switch (filter.label) {
                case 'Members':
                  type = `${type}2,`
                  this.params.filter.queries.push('Member')
                  break
                case 'Recurring Activity':
                  this.params.filter.queries.push('Assignbadge', 'Assignment')
                  break
                case 'Organizational':
                  this.params.filter.queries.push('Role', 'Badge')
                  break
                case 'Generic Contribution':
                  type = `${type}3,`
                  this.params.filter.queries.push('Payout')
                  break
                case 'Role Archetypes':
                  type = `${type}4,`
                  this.params.filter.queries.push('Role')
                  break
                case 'Role Assignments':
                  type = `${type}5,`
                  this.params.filter.queries.push('Assignment')
                  break
                case 'Badge Types':
                  type = `${type}6,`
                  this.params.filter.queries.push('Badge')
                  break
                case 'Badge Assignments':
                  type = `${type}7,`
                  this.params.filter.queries.push('Assignbadge')
                  break
                case 'Suspensions':
                  type = `${type}8,`
                  this.params.filter.queries.push('Suspend')
                  break
              }
            }
          })
          if (type.slice(-1) === ',') type = type.slice(0, -1)
          const query = { ...this.$route.query, type }
          this.$router.replace({ query })
          this.params.from = 0
          this.params.size = 10
          await this.$nextTick()
          await this.onSearch()
        }
      },
      immediate: true,
      deep: true
    },
    async filterStatus () {
      if (!this.filterStatus) return
      // if (this.filterStatus === this.optionArray[0]) {
      //   // this.params.filter.states = this.optionArray.slice(1).map(s => {
      //   //   if (s === 'Active') return 'approved'
      //   //   return s.toLowerCase()
      //   // })
      //   this.params.filter.states = this.params.filter.invalidStates
      // } else {
      // }
      if (this.filterStatus === 'All') {
        this.params.filter.states = this.optionArray.filter(v => (v !== this.filterStatus && v !== 'All' && typeof v !== 'object')).map(s => {
          return s.toLowerCase()
        })
        this.params.filter.states = [...this.params.filter.states, ...this.params.filter.invalidStates]
      } else if (this.filterStatus === 'Active') {
        // this.params.filter.states = ['approved']
        this.params.filter.states = this.optionArray.filter(v => (v !== this.filterStatus && v !== 'All' && typeof v !== 'object')).map(s => {
          if (s === 'Voting') return 'proposed'
          return s.toLowerCase()
        })
        this.params.filter.states = [...this.params.filter.states, ...this.params.filter.invalidStates]
      } else {
        // this.params.filter.states = [this.filterStatus.toLowerCase()]
        this.params.filter.states = this.optionArray.filter(v => (v !== this.filterStatus && v !== 'All' && typeof v !== 'object')).map(s => {
          if (s === 'Active') return 'approved'
          if (s === 'Voting') return 'proposed'
          return s.toLowerCase()
        })
        this.params.filter.states = [...this.params.filter.states, ...this.params.filter.invalidStates]
      }
      const query = { ...this.$route.query, filter: this.filterStatus }
      this.$router.replace({ query })
      this.params.from = 0
      this.params.size = 10
      await this.$nextTick()
      await this.onSearch()
    },
    async orderSelected (value) {
      const query = this.$route.query
      if (value === this.circleArray[1]) {
        this.params.filter.sort = 'asc'
        query.order = { asc: 'createdDate' }
      }
      if (value === this.circleArray[2]) {
        this.params.filter.sort = 'desc'
        query.order = { desc: 'createdDate' }
      }
      if (value === this.circleArray[3]) {
        this.params.filter.sort = 'A-Z'
        query.order = { alph: 'details_title_s' }
      }
      this.$router.replace({ query })
      await this.$nextTick()
      await this.onSearch()
    }
  },
  data () {
    return {
      mobileFilterOpen: false,
      params: {
        from: 0,
        size: 10,
        fields: [
          'details_title_s', 'details_description_s',
          'system_nodeLabel_s', 'details_member_n', 'type'
        ],
        fuzziness: 'AUTO',
        filter: {
          queries: [
            'Payout', 'Member', 'Assignbadge',
            'Assignment', 'Role', 'Badge',
            'Suspend', 'Edit'
          ],
          fieldsDocType: ['type'],
          fieldsBelongs: ['edges.dao', 'edges.memberof', 'edges.applicantof', 'edges.payment'],
          ids: [],
          states: ['voting', 'approved', 'archived', 'suspended'],
          invalidStates: ['rejected', 'withdrawed'],
          sort: 'asc'
        }
      },
      optionArray: [{ label: 'Filter by', disable: true }, 'All', 'Voting', 'Active', 'Archived', 'Suspended'],
      circleArray: [{ label: 'Sort by', disable: true }, 'Create date ascending', 'Create date descending', 'Alphabetically (A-Z)'],
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
          filter: (p) => p.__typename === 'Member'
        },
        {
          label: 'Generic Contribution',
          enabled: false,
          filter: (p) => p.__typename === 'Generic Contribution'
        },
        // {
        //   label: 'Recurring Activity',
        //   enabled: false,
        //   filter: (p) => p.__typename === 'Recurring Activity'
        // },
        // {
        //   label: 'Organizational',
        //   enabled: false,
        //   filter: (p) => p.__typename === 'Organizational'
        // },
        {
          label: 'Role Assignments',
          enabled: false,
          filter: (p) => p.__typename === 'Assignment'
        },
        {
          label: 'Role Archetypes',
          enabled: false,
          filter: (p) => p.__typename === 'Role'
        },
        {
          label: 'Badge Types',
          enabled: false,
          filter: (p) => p.__typename === 'Badge'
        },
        {
          label: 'Badge Assignments',
          enabled: false,
          filter: (p) => p.__typename === 'Assignbadge'
        },
        {
          label: 'Suspensions',
          enabled: false,
          filter: (p) => p.__typename === 'Suspend'
        }
      ],
      filtersToEvaluate: undefined,
      filterStatus: 'All',
      orderSelected: '',
      orderField: ''
    }
  },
  methods: {
    ...mapMutations('search', ['setSearch']),
    ...mapActions('profiles', ['getPublicProfile']),
    onClick (document) {
      document.type === 'Member'
        ? this.$router.push({ name: 'profile', params: { username: document.system_nodeLabel_s } })
        : this.$router.push({ name: 'proposal-detail', params: { docId: document.docId } })
    },
    getIcon (type) {
      /* eslint-disable no-multi-spaces */
      switch (type) {
        case 'Member':      return 'far fa-user'
        case 'Assignbadge': return 'far fa-calendar-alt'
        case 'Assignment':  return 'far fa-calendar-alt'
        case 'Role':        return 'far fa-user'
        case 'Badge':       return 'fas fa-award'
        case 'Payout':      return 'far fa-paper-plane'
        case 'Payment':     return 'far fa-paper-plane'
        default:            return ''
      }
    },
    async onSearch () {
      if (this.selectedDao.docId) {
        this.params.filter.ids = [this.selectedDao.docId]
        const _results = await ElasticSearch.search(this.search, this.params, this.$route.params.filterBy)
        // this.$route.params.filterBy = undefined

        this.results = _results.hits
      }
    },
    async getMemberName (userName) {
      const profile = await this.getPublicProfile(userName)
      if (profile) {
        return profile.publicData.name
      }
      return userName
    },
    async onPrev () {
      this.params.from = this.params.from - this.params.size
      await this.onSearch()
    },
    async onNext () {
      this.params.from = this.params.from + this.params.size
      await this.onSearch()
    },
    isApplicant (source) {
      return source.edges?.applicantof?.length > 0
    }
  }
}

</script>

<template lang="pug">
q-page.page-search-results
  .row.q-mt-sm
    .q-py-md(:class="{'col-9': $q.screen.gt.sm, 'q-px-sm': $q.screen.gt.sm , 'col-12': !$q.screen.gt.sm }")
      widget(:title="`${results.total ? results.total.value : 0} Results`" )
        div.cursor-pointer(v-for="result in results.hits" @click="onClick(result._source)")
          result(:key = "result.title"
                 :type = "result._source.type"
                 :icon = "getIcon(result._source.type)"
                 :salary = "result._source.details_husdAmount_a"
                 :compensation = "result._source.details_voiceAmount_a"
                 :status = "result._source.details_state_s"
                 :applicant = "isApplicant(result._source)"
                 :expirationDate = "result._source.ballot_expiration_t"
                 :username = "result._source.type === 'Member' ? result._source.details_member_n : ''"
                 :creator = "result._source.type !== 'Member' ? getMemberName(result._source.creator) : ''"
                 :title = "result._source.type !== 'Member' ? result._source.details_title_s : getMemberName(result._source.system_nodeLabel_s)"
          )
        .row.justify-between.q-pt-sm
          q-btn(@click="onPrev()" :disable="!params.from" round unelevated class="round-circle" icon="fas fa-chevron-left" color="inherit" text-color="primary" size="sm" :ripple="false")
          .q-pt-sm {{  getPaginationText }}
          q-btn(@click="onNext()" :disable="isLastPage" round unelevated class="round-circle" icon="fas fa-chevron-right" color="inherit" text-color="primary" size="sm" :ripple="false")
    .col-3.q-pa-sm.q-py-md(v-if="$q.screen.gt.sm")
      filter-widget.sticky(
        filterTitle = "Search DAOs"
        :sort.sync = "filterStatus"
        :optionArray = "optionArray"
        :defaultOption = "defaultSelector"
        :circle.sync = "orderSelected"
        :circleArray = "circleArray"
        :circleDefault = "orderDefaultSelector"
        :showToggle = "false"
        :showViewSelector = "false"
        :chipsFiltersLabel = "'Results types'"
        :filters.sync = "filters"
        :showTextFilter = "false"
      )
    .mobile-filter(v-else)
      filter-open-button(@open="mobileFilterOpen = true")
      filter-widget-mobile(
      v-show="mobileFilterOpen"
      @close="mobileFilterOpen = false"
      filterTitle = "Search DAOs"
      :sort.sync = "filterStatus"
      :optionArray = "optionArray"
      :defaultOption = "defaultSelector"
      :circle.sync = "orderSelected"
      :circleArray = "circleArray"
      :circleDefault = "orderDefaultSelector"
      :showToggle = "false"
      :showViewSelector = "false"
      :chipsFiltersLabel = "'Results types'"
      :filters.sync = "filters"
      :showTextFilter = "false"
      )
</template>
