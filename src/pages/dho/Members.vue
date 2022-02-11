<script>
import { mapGetters } from 'vuex'
import { documents } from '~/mixins/documents'

const filtersMap = [{ asc: 'createdDate' }, { desc: 'createdDate' }, { asc: 'details_member_n' }]

export default {
  name: 'page-members',
  mixins: [documents],
  components: {
    MemberBanner: () => import('~/components/profiles/member-banner.vue'),
    MembersList: () => import('~/components/profiles/members-list.vue'),
    FilterWidget: () => import('~/components/filters/filter-widget.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },
  apollo: {
    daoMembers: {
      query: require('../../query/members/members-pagination.gql'),
      update: data => {
        const mapUsers = data.getDao.member.map(user => {
          return {
            username: user.details_member_n,
            joinedDate: user.createdDate
          }
        })
        return mapUsers
      },
      skip: true
    },
    daoApplicants: {
      query: require('../../query/members/applicants-pagination.gql'),
      update: data => {
        const mapUsers = data.getDao.applicant.map(user => {
          return {
            username: user.details_member_n,
            joinedDate: user.createdDate,
            isApplicant: true
          }
        })
        return mapUsers
      },
      skip: true
    }
  },

  meta: {
    title: 'Members'
  },

  watch: {
    showApplicants: {
      handler: function (value) {
        if (this.showApplicants) {
          this.membersPagination.fetchMore = false
          this.applicantsPagination.fetchMore = true
        } else {
          this.membersPagination.fetchMore = true
          this.applicantsPagination.fetchMore = false
        }
      },
      immediate: true
    },
    sort: {
      handler: async function (value) {
        const index = this.optionArray.findIndex(option => option === value)
        this.order = filtersMap[index]
        this.resetPagination()
        this.$apollo.queries.daoApplicants.refetch()
        this.$apollo.queries.daoMembers.refetch()
      },
      immediate: false
    },
    textFilter: {
      handler: async function (value) {
        this.resetPagination()
        this.$apollo.queries.daoApplicants.refetch()
        this.$apollo.queries.daoMembers.refetch()
      },
      immediate: false
    },
    selectedDao: {
      handler: async function (value) {
        if (value) {
          this.resetPagination()
          this.$apollo.queries.daoMembers.skip = false
          this.$apollo.queries.daoApplicants.skip = false
        }
      },
      immediate: false
    }
  },

  data () {
    return {
      membersPagination: {
        first: 10,
        offset: 0,
        fetchMore: true
      },
      applicantsPagination: {
        first: 10,
        offset: 0,
        fetchMore: true
      },
      order: filtersMap[0],
      view: '',
      sort: '',
      textFilter: null,
      circle: '',
      optionArray: ['Sort by join date ascending', 'Sort by join date descending', 'Sort Alphabetically (A-Z)'],
      circleArray: ['All circles', 'Circle One'],
      showApplicants: undefined
    }
  },

  computed: {
    ...mapGetters('dao', ['selectedDao']),

    skipQuery () {
      return !this.selectedDao || !this.selectedDao.docId
    },

    members () {
      if (!this.daoMembers) return
      if ((!this.daoApplicants) && this.showApplicants) return

      const listData = [...this.daoMembers]
      if (this.showApplicants && this.daoApplicants) {
        listData.unshift(...this.daoApplicants)
      }
      return listData
    }
  },

  methods: {
    resetPagination () {
      this.membersPagination = {
        first: 10,
        offset: 0,
        fetchMore: !this.showApplicants
      }
      this.applicantsPagination = {
        first: 10,
        offset: 0,
        fetchMore: this.showApplicants
      }
      this.$apollo.queries.daoMembers.setVariables({
        daoId: this.selectedDao.docId,
        first: this.membersPagination.first,
        offset: 0,
        order: this.order,
        filter: this.textFilter ? { details_member_n: { eq: this.textFilter } } : null
      })

      this.$apollo.queries.daoApplicants.setVariables({
        daoId: this.selectedDao.docId,
        first: this.applicantsPagination.first,
        offset: 0,
        order: this.order,
        filter: this.textFilter ? { details_member_n: { eq: this.textFilter } } : null
      })
      if (this.selectedDao) {
        this.$apollo.queries.daoMembers.skip = false
        this.$apollo.queries.daoApplicants.skip = false
      }
      this.$refs.scroll?.resume()
    },
    onLoadMoreMembers (index, done) {
      // Do not fetch more if the initial fetch haven't been done
      if (!this.daoMembers ||
         ((!this.daoApplicants) && this.showApplicants)) {
        done()
        return
      }

      // Do not fetch more if it is the last page
      if (!this.membersPagination.fetchMore && (!this.applicantsPagination.fetchMore || !this.showApplicants)) {
        done(true)
      } else if (!this.membersPagination.fetchMore) {
        this.applicantsPagination.offset += this.applicantsPagination.first
        this.$apollo.queries.daoApplicants?.fetchMore({
          // New variables
          variables: {
            daoId: this.selectedDao.docId,
            first: this.applicantsPagination.first,
            offset: this.applicantsPagination.offset,
            order: this.order
          },
          // Transform the previous result with new data
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult.getDao.applicant.length) {
              this.applicantsPagination.fetchMore = false
              this.membersPagination.fetchMore = true
            }

            done()
            return {
              getDao: {
                __typename: fetchMoreResult.getDao.__typename,
                docId: fetchMoreResult.getDao.docId,
                applicant: [
                  ...previousResult ? (previousResult?.getDao.applicant.filter(n => !fetchMoreResult.getDao.applicant.some(p => p.docId === n.docId))) : [],
                  ...fetchMoreResult.getDao.applicant
                ]
              }
            }
          }
        })
      } else {
        this.membersPagination.offset += this.membersPagination.first
        this.$apollo.queries.daoMembers?.fetchMore({
          // New variables
          variables: {
            daoId: this.selectedDao.docId,
            first: this.membersPagination.first,
            offset: this.membersPagination.offset,
            order: this.order
          },
          // Transform the previous result with new data
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult.getDao.member.length) {
              this.membersPagination.fetchMore = false
            }

            done()
            return {
              getDao: {
                __typename: fetchMoreResult.getDao.__typename,
                docId: fetchMoreResult.getDao.docId,
                member: [
                  ...previousResult ? (previousResult?.getDao.member.filter(n => !fetchMoreResult.getDao.member.some(p => p.docId === n.docId))) : [],
                  ...fetchMoreResult.getDao.member
                ]
              }
            }
          }
        })
      }
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
        members-list(:members="members" :view="view" @loadMore="onLoadMoreMembers" ref="scroll")
      .col-3.q-pa-sm.q-py-md
        filter-widget(:view.sync="view",
        :toggle.sync="showApplicants",
        :sort.sync="sort",
        :textFilter.sync="textFilter",
        :circle.sync="circle",
        :optionArray.sync="optionArray",
        :circleArray.sync="circleArray"
        :viewSelectorLabel="'Members view'",
        :showToggle="true",
        :toggleLabel="'Show applicants'")
</template>

<style lang="stylus" scoped>
.rounded-border
  :first-child
    border-radius 12px

.close-btn
  z-index 1
</style>
