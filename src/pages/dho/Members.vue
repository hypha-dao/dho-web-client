<script>
import { mapGetters } from 'vuex'
import { documents } from '~/mixins/documents'

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
        return data.getDao
      },
      variables () {
        return {
          daoId: this.selectedDao.docId,
          first: this.membersPagination.first,
          offset: 0
        }
      },
      skip () {
        return this.selectDao !== undefined
      }
    },
    daoApplicants: {
      query: require('../../query/members/applicants-pagination.gql'),
      update: data => {
        return data.getDao
      },
      variables () {
        return {
          daoId: this.selectedDao.docId,
          first: this.applicantsPagination.first,
          offset: 0
        }
      },
      skip () {
        return this.selectDao !== undefined
      }
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
      view: '',
      sort: '',
      textFilter: null,
      circle: '',
      optionArray: ['Sort by last added', 'Sort by something else'],
      circleArray: ['All circles', 'Circle One'],
      showApplicants: undefined
    }
  },

  computed: {
    ...mapGetters('dao', ['selectedDao']),

    members () {
      if (!this.daoMembers || !this.daoMembers.member) return
      if ((!this.daoApplicants || !this.daoApplicants.applicant) && this.showApplicants) return

      const listData = this.daoMembers.member.map(v => {
        const returnData = {
          username: v.details_member_n,
          joinedDate: v.createdDate
        }
        return returnData
      })

      if (this.showApplicants) {
        const applicantsData = this.daoApplicants?.applicant?.map(v => {
          const returnData = {
            username: v.details_member_n,
            isApplicant: true,
            joinedDate: v.createdDate
          }
          return returnData
        })
        if (applicantsData) {
          listData.unshift(...applicantsData)
        }
      }
      return listData
    }
  },

  methods: {
    onLoadMoreMembers (index, done) {
      // Do not fetch more if the initial fetch haven't been done
      if (!this.daoMembers || !this.daoMembers.member ||
         ((!this.daoApplicants || !this.daoApplicants.applicant) && this.showApplicants)) {
        done()
        return
      }

      // Do not fetch more if it is the last page
      if (!this.membersPagination.fetchMore && (!this.applicantsPagination.fetchMore || !this.showApplicants)) {
        done(true)
        return
      } else if (!this.membersPagination.fetchMore) {
        this.applicantsPagination.offset += this.applicantsPagination.first
        this.$apollo.queries.daoApplicants?.fetchMore({
          // New variables
          variables: {
            daoId: this.selectedDao.docId,
            first: this.applicantsPagination.first,
            offset: this.applicantsPagination.offset
          },
          // Transform the previous result with new data
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult.getDao.applicant.length) {
              this.applicantsPagination.fetchMore = false
              this.membersPagination.fetchMore = true
              return previousResult
            }

            previousResult.getDao.applicant = [
              ...previousResult.getDao.applicant,
              ...fetchMoreResult.getDao.applicant
            ]
            return previousResult
          }
        })
      } else {
        this.membersPagination.offset += this.membersPagination.first
        this.$apollo.queries.daoMembers?.fetchMore({
          // New variables
          variables: {
            daoId: this.selectedDao.docId,
            first: this.membersPagination.first,
            offset: this.membersPagination.offset
          },
          // Transform the previous result with new data
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult.getDao.member.length) {
              this.membersPagination.fetchMore = false
              return previousResult
            }

            previousResult.getDao.member = [
              ...previousResult.getDao.member,
              ...fetchMoreResult.getDao.member
            ]
            return previousResult
          }
        })
      }
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
