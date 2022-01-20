<script>
import { mapGetters } from 'vuex'
import { documents } from '~/mixins/documents'

export default {
  name: 'page-members',
  mixins: [documents],
  components: {
    MemberBanner: () => import('~/components/profiles/member-banner.vue'),
    MembersList: () => import('~/components/profiles/members-list.vue'),
    MembersFilters: () => import('~/components/profiles/members-filter.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },
  apollo: {
    daoMembers: {
      query: require('../../query/members/members-pagination.gql'),
      update: data => {
        return data.getDao
      },
      variables () {
        return {
          daoId: this.selectedDao.docId,
          first: this.pagination.first,
          offset: 0
        }
      },
      fetchPolicy: 'network-only'
    }
  },

  meta: {
    title: 'Members'
  },

  data () {
    return {
      pagination: {
        first: 1,
        offset: 0
      },
      fetchMore: true,
      view: '',
      sort: '',
      filter: null,
      circle: ''
    }
  },

  computed: {
    ...mapGetters('dao', ['selectedDao']),

    members () {
      if (!this.daoMembers || !this.daoMembers.member) return
      return this.daoMembers.member.map(v => {
        return {
          name: v.details_member_n,
          joinedDate: new Date(v.createdDate).toDateString()
        }
      })
    }
  },

  methods: {
    onLoadMoreMembers (index, done) {
      // Do not fetch more if the initial fetch haven't been done
      if (!this.daoMembers || !this.daoMembers.member) {
        done()
        return
      }

      // Do not fetch more if it is the last page
      if (!this.fetchMore) {
        done(true)
        return
      }

      this.pagination.offset += this.pagination.first
      this.$apollo.queries.daoMembers?.fetchMore({
        // New variables
        variables: {
          daoId: this.selectedDao.docId,
          first: this.pagination.first,
          offset: this.pagination.offset
        },
        // Transform the previous result with new data
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult.getDao.member.length) {
            this.fetchMore = false
            return previousResult
          }

          previousResult.getDao.member = [
            ...previousResult.getDao.member,
            ...fetchMoreResult.getDao.member
          ]
          return previousResult
        }
      })

      done()
    }
  }
}
</script>

<template lang="pug">
.page-members.full-width
  .row.full-width.relative-position.q-mb-md
    q-btn.absolute-top-right.q-mt-md.q-mr-md.q-pa-xs.close-btn(
      flat round size="sm"
      icon="fas fa-times"
      color="white"
    )
    member-banner
    .row.full-width.q-mt-sm
      .col-9.q-px-sm.q-py-md
        members-list(:members="members" :view="view" @loadMore="onLoadMoreMembers")
      .col-3.q-pa-sm.q-py-md
        members-filters(:view.sync="view", :sort.sync="sort", :filter.sync="filter", :circle.sync="circle")
</template>

<style lang="stylus" scoped>
.rounded-border
  :first-child
    border-radius 12px

.close-btn
  z-index 1
</style>
