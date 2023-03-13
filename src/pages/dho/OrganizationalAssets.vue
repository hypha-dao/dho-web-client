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
    FilterWidgetMobile: () => import('~/components/filters/filter-widget-mobile.vue'),
    FilterOpenButton: () => import('~/components/filters/filter-open-button.vue'),
    BasePlaceholder: () => import('~/components/placeholders/base-placeholder.vue'),
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue')
  },
  apollo: {
    // upvoteElectionQuery: {
    //   query: require('~/query/upvote-election-data.gql'),
    //   update: data => {
    //     return {
    //       currentRound: data.getDao.ongoingelct[0]?.currentround[0].details_type_s,
    //       nextRound: data.getDao.ongoingelct[0]?.currentround[0].nextround,
    //       upcomingElection: data.getDao.upcomingelct
    //     }
    //   },
    //   variables () {
    //     return {
    //       daoName: this.selectedDao.name
    //     }
    //   },
    //   result (data) {
    //     this.upvoteElectionData = {
    //       currentRound: data.data.getDao.ongoingelct[0]?.currentround[0].details_type_s,
    //       nextRound: data.data.getDao.ongoingelct[0]?.currentround[0].nextround,
    //       upcomingElection: data.data.getDao.upcomingelct
    //     }
    //   }
    // },
    memberBadges: {
      query: require('~/query/badges/member-badges.gql'),
      update: data => {
        return data.getDao?.badge?.map(badge => {
          return {
            title: badge.details_title_s,
            description: badge.details_description_s,
            icon: badge.details_icon_s,
            docId: badge.assignment[0]?.docId,
            assignments: badge.assignment
          }
        })
      },
      variables () {
        return {
          daoId: this.selectedDao.docId,
          username: this.account
        }
      },
      skip () {
        return !this.account || !this.selectedDao || !this.selectedDao.docId
      },
      fetchPolicy: 'no-cache'
    },
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
                username: ownedby.details_assignee_n,
                daoName: ownedby.dao[0].details_daoName_n
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
                username: ownedby.details_assignee_n,
                daoName: ownedby.dao[0].details_daoName_n
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
      mobileFilterOpen: false,
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
    ...mapGetters('accounts', ['account']),
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
    },
    currentElectionIndex () {
      let stepIndex = null
      if (this.upvoteElectionData.upcomingElection?.length) {
        stepIndex = 0
      } else if (!this.upvoteElectionData.nextRound?.length && this.upvoteElectionData?.currentRound !== 'head') {
        stepIndex = 4
      } else {
        switch (this.upvoteElectionData?.currentRound) {
          case ('delegate'):
            stepIndex = 1
            break
          case ('chief'):
            stepIndex = 2
            break
          case ('head'):
            stepIndex = 3
            break
        }
      }
      return stepIndex
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
  .row.full-width(v-if="$q.screen.gt.md")
    .col-9.q-py-md
        div(v-if="!(list && list.length)" class="row justify-center q-my-md")
          loading-spinner(color="primary" size="72px")
        base-placeholder(v-if="(list && !list.length)" title= "No Badges" subtitle="Your organization doesn't have any badges yet. You can create one by clicking the button below."
          icon= "fas fa-id-badge" :actionButtons="[{label: 'Create a new badge', color: 'primary', onClick: () => routeTo('proposals/create')}]" )
        asset-list(:assetList="list" @loadMore="onLoadMore" ref="scroll" ownerStyles :memberBadges="memberBadges" :currentElectionIndex="currentElectionIndex")
    .col-3.q-py-md.q-pl-md
      filter-widget.sticky(
      :sort.sync="sort",
      :textFilter.sync="textFilter",
      :optionArray.sync="optionArray",
      :showCircle="false"
      :showViewSelector="false"
      :showToggle="false"
      :filterTitle="type === 'badge' ? 'Search badges' : 'Filter by name' ")
  .row.full-width(v-else)
    filter-open-button(@open="mobileFilterOpen = true")
    filter-widget-mobile(
      v-show="mobileFilterOpen"
      @close="mobileFilterOpen = false"
      :sort.sync="sort",
      :textFilter.sync="textFilter",
      :optionArray.sync="optionArray",
      :showCircle="false"
      :showViewSelector="false"
      :style="'width: 400px; right: 0; left: auto;'"
      :showToggle="false")
    .col-12.q-py-md
        div(v-if="!(list && list.length)" class="row justify-center q-my-md")
          loading-spinner(color="primary" size="72px")
        base-placeholder(v-if="(list && !list.length)" title= "No Badges" subtitle="Your organization doesn't have any badges yet. You can create one by clicking the button below."
          icon= "fas fa-id-badge" :actionButtons="[{label: 'Create a new badge', color: 'primary', onClick: () => routeTo('proposals/create')}]" ).full-width
        asset-list(:assetList="list" @loadMore="onLoadMore" ref="scroll" isMobile ownerStyles :memberBadges="memberBadges").full-width
</template>
