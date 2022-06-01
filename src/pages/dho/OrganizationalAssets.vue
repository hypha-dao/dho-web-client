<script>
import { mapGetters } from 'vuex'
import { daoRouting } from '~/mixins/dao-routing'
const ordersMap = [{ asc: 'createdDate' }, { desc: 'createdDate' }, { asc: 'details_title_s' }]

export default {
  name: 'organizational-assets',
  mixins: [daoRouting],
  components: {
    Widget: () => import('~/components/common/widget.vue'),
    AssetList: () => import('~/components/organization-asset/asset-list.vue'),
    FilterWidget: () => import('~/components/filters/filter-widget.vue'),
    BasePlaceholder: () => import('~/components/placeholders/base-placeholder.vue')
  },
  apollo: {
    daoBadges: {
      query: require('~/query/badges/dao-badges.gql'),
      update: data => {
        return data.getDao.badge?.map(badge => {
          return {
            title: badge.details_title_s,
            description: badge.details_description_s,
            icon: badge.details_icon_s,
            docId: badge.docId,
            assignmentAggregate: badge.assignmentAggregate,
            assignment: badge.assignment.map((ownedby) => {
              return {
                username: ownedby.details_assignee_n
              }
            })
          }
        })
      },
      variables () {
        return {
          first: this.pagination.first,
          offset: 0,
          daoId: this.selectedDao.docId,
          order: this.order,
          filter: this.textFilter ? { details_title_s: { regexp: `/.*${this.textFilter}.*/i` } } : null
        }
      },
      skip () {
        return !this.selectedDao || !this.selectedDao.docId || this.type !== 'badge'
      },
      debounce: 500,
      loadingKey: 'loadingQueriesCount',
      result ({ data, loading, networkStatus }) {
        if (this.pagination.offset === 0) {
          this.$refs.scroll?.resume()
        }
      }
    },
    daoArchetypes: {
      query: require('~/query/archetypes/dao-archetypes.gql'),
      update: data => {
        return data.getDao.role?.map(role => {
          return {
            title: role.details_title_s,
            description: role.details_description_s,
            icon: role.details_icon_s,
            docId: role.docId,
            assignmentAggregate: role.assignmentAggregate,
            assignment: role.assignment.map((ownedby) => {
              return {
                username: ownedby.details_assignee_n
              }
            })
          }
        })
      },
      variables () {
        return {
          first: this.pagination.first,
          offset: 0,
          daoId: this.selectedDao.docId,
          order: this.order,
          filter: this.textFilter ? { details_title_s: { regexp: `/.*${this.textFilter}.*/i` } } : null
        }
      },
      skip () {
        return !this.selectedDao || !this.selectedDao.docId || this.type !== 'role'
      },
      debounce: 500,
      loadingKey: 'loadingQueriesCount',
      result ({ data, loading, networkStatus }) {
        if (this.pagination.offset === 0) {
          this.$refs.scroll?.resume()
        }
      }
    }
  },
  data () {
    return {
      loadingQueriesCount: 0,
      sort: '',
      order: ordersMap[0],
      textFilter: null,
      optionArray: ['Sort by create date ascending', 'Sort by create date descending', 'Sort Alphabetically (A-Z)'],
      pagination: {
        first: 6,
        offset: 0,
        fetchMore: true
      }
    }
  },
  meta () {
    return {
      title: `${this.title}`
    }
  },
  async mounted () {
  },
  watch: {
    'selectedDao.docId': {
      handler () {
        this.resetPagination(true)
      },
      immediate: false
    },
    title: {
      handler: async function (value) {
        this.resetPagination()
        this.$route.meta.title = this.title
        this.$parent.$parent.$parent.$parent.title = this.title // TODO: Find a better way to update the title
      },
      immediate: true
    },
    textFilter: {
      handler: function (value) {
        this.resetPagination(true)
      },
      immediate: false
    },
    sort: {
      handler: async function (value) {
        const index = this.optionArray.findIndex(option => option === value)
        this.order = ordersMap[index]
        this.resetPagination(true)
      },
      immediate: false
    }
  },
  computed: {
    ...mapGetters('dao', ['selectedDao']),
    title () {
      switch (this.type) {
        case 'role':
          return 'Role archetypes'
        case 'badge':
          return 'Badges'
        default:
          return undefined
      }
    },
    type () {
      return this.$route.params.type
    },
    list () {
      switch (this.type) {
        case 'role':
          return this.daoArchetypes
        case 'badge':
          return this.daoBadges
        default:
          return undefined
      }
    },
    query () {
      switch (this.type) {
        case 'role':
          return this.$apollo.queries.daoArchetypes
        case 'badge':
          return this.$apollo.queries.daoBadges
        default:
          return undefined
      }
    }
  },

  methods: {
    resetPagination (forceOffset) {
      if (forceOffset) {
        this.pagination.offset = 0
        this.$refs.scroll?.stop()
      } else {
        this.pagination.offset = this.list?.length || 0 // This ensures we are showing the cached data
      }
      this.pagination.fetchMore = true
    },

    onLoadMore (index, done) {
      // Do not fetch more if the initial fetch haven't been done
      if (!this.list?.length || this.query.skip || this.loadingQueriesCount !== 0) {
        done()
        return
      }
      if (this.query && this.type && this.pagination.fetchMore) {
        this.pagination.offset = this.pagination.offset + this.pagination.first
        this.query.fetchMore({
          variables: {
            daoId: this.selectedDao.docId,
            first: this.pagination.first,
            offset: this.pagination.offset,
            order: this.order,
            filter: this.textFilter ? { details_title_s: { regexp: `/.*${this.textFilter}.*/i` } } : null
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (fetchMoreResult.getDao?.[this.type]?.length === 0) this.pagination.fetchMore = false
            done(!this.pagination.fetchMore)
            return {
              getDao: {
                ...prev.getDao,
                [this.type]: [
                  ...(prev?.getDao?.[this.type]?.filter(n => !fetchMoreResult.getDao?.[this.type].some(p => p.docId === n.docId)) || []),
                  ...(fetchMoreResult.getDao?.[this.type] || [])
                ]
              }
            }
          }
        })
      } else {
        done(false)
      }
    }
  }
}
</script>

<template lang="pug">
.organizational-assets
  .row.full-width
    .col-9.q-py-md
        base-placeholder(v-if="!(list && list.length)" title= "No Badges" subtitle="Your organization doesn't have any badges yet. You can create one by clicking the button below."
          icon= "fas fa-id-badge" :actionButtons="[{label: 'Create a new badge', color: 'primary', onClick: () => routeTo('proposals/create')}]" )
        asset-list(:assetList="list" @loadMore="onLoadMore" ref="scroll")
    .col-3.q-py-md.q-pl-md
      filter-widget(
      :sort.sync="sort",
      :textFilter.sync="textFilter",
      :optionArray.sync="optionArray",
      :showCircle="false"
      :showViewSelector="false"
      :showToggle="false")
</template>
