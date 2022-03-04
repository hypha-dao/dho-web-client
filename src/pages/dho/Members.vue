<script>
import { mapGetters, mapActions } from 'vuex'
import { documents } from '~/mixins/documents'

const ordersMap = [{ desc: 'createdDate' }, { asc: 'createdDate' }, { asc: 'details_member_n' }]

export default {
  name: 'page-members',
  mixins: [documents],
  components: {
    BaseBanner: () => import('~/components/common/base-banner.vue'),
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
      variables () {
        return {
          first: this.membersPagination.first,
          offset: 0,
          daoId: this.selectedDao.docId,
          order: this.order,
          filter: this.fileterObject
        }
      },
      skip () {
        return !this.selectedDao || !this.selectedDao.docId
      },
      debounce: 500,
      loadingKey: 'loadingQueriesCount'
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
      variables () {
        return {
          first: this.applicantsPagination.first,
          offset: 0,
          daoId: this.selectedDao.docId,
          order: this.order,
          filter: this.fileterObject
        }
      },
      skip () {
        return !this.selectedDao || !this.selectedDao.docId
      },
      debounce: 500,
      loadingKey: 'loadingQueriesCount'
    }
  },

  meta: {
    title: 'Members'
  },

  watch: {
    'selectedDao.docId': {
      handler () {
        this.resetPagination(true)
      },
      immediate: false
    },
    loadingQueriesCount (val) {
      if (this.membersPagination.offset === 0 && this.applicantsPagination.offset === 0 && val === 0) {
        this.$refs.scroll?.resume()
      }
    },
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
        this.order = ordersMap[index]
        this.resetPagination(true)
      },
      immediate: false
    },
    textFilter: {
      handler: async function (value) {
        this.resetPagination(true)
      },
      immediate: false
    }
  },

  data () {
    return {
      loadingQueriesCount: 0,
      membersPagination: {
        first: 6,
        offset: 0,
        fetchMore: true
      },
      applicantsPagination: {
        first: 6,
        offset: 0,
        fetchMore: true
      },
      order: ordersMap[0],
      view: '',
      sort: '',
      textFilter: null,
      circle: '',
      optionArray: ['Sort by join date descending', 'Sort by join date ascending', 'Sort Alphabetically (A-Z)'],
      circleArray: ['All circles', 'Circle One'],
      showApplicants: undefined
    }
  },

  computed: {
    ...mapGetters('dao', ['selectedDao']),
    ...mapGetters('accounts', ['isMember', 'isApplicant', 'account']),

    fileterObject () {
      return this.textFilter ? { details_member_n: { regexp: `/${this.textFilter}/i` } } : null
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

  mounted () {
    this.$EventBus.$on('membersUpdated', this.pollData)
  },

  beforeDestroy () {
    this.$EventBus.$off('membersUpdated')
  },

  methods: {
    ...mapActions('members', ['apply']),

    async onApply () {
      const res = await this.apply({ content: 'DAO Applicant' })
      if (res) {
        this.$EventBus.$emit('membersUpdated')
      }
    },

    resetPagination (forceOffset) {
      if (forceOffset) {
        this.applicantsPagination.offset = 0
        this.membersPagination.offset = 0
        this.$refs.scroll?.stop()
      } else {
        // This ensures we are showing the cached data
        this.applicantsPagination.offset = this.daoApplicants?.length || 0
        this.membersPagination.offset = this.daoMembers?.length || 0
      }
      this.membersPagination.fetchMore = !this.showApplicants
      this.applicantsPagination.fetchMore = this.showApplicants
    },

    // Used to update the queries with lastest information
    // Could be slow if there are a lot of members loaded on the pagination, use it wisely
    pollData () {
      // Wait some time before updating the data
      setTimeout(() => {
        this.$apollo.queries.daoApplicants?.fetchMore({
          variables: {
            daoId: this.selectedDao.docId,
            first: this.applicantsPagination.first + this.applicantsPagination.offset,
            offset: 0,
            order: this.order,
            filter: this.fileterObject
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            return {
              getDao: {
                __typename: fetchMoreResult.getDao.__typename,
                docId: fetchMoreResult.getDao.docId,
                applicant: [
                  ...fetchMoreResult.getDao.applicant
                ]
              }
            }
          }
        })
        this.$apollo.queries.daoMembers?.fetchMore({
          variables: {
            daoId: this.selectedDao.docId,
            first: this.membersPagination.first + this.membersPagination.offset,
            offset: 0,
            order: this.order,
            filter: this.fileterObject
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            return {
              getDao: {
                __typename: fetchMoreResult.getDao.__typename,
                docId: fetchMoreResult.getDao.docId,
                member: [
                  ...fetchMoreResult.getDao.member
                ]
              }
            }
          }
        })
      }, 1250)
    },

    onLoadMoreMembers (index, done) {
      // Do not fetch more if the initial fetch haven't been done
      if (this.loadingQueriesCount !== 0 && (this.daoApplicants?.length || 0) === 0 && (this.daoMembers?.length || 0) === 0) {
        done()
        return
      }

      if ((this.daoApplicants?.length || 0) === 0) {
        this.applicantsPagination.fetchMore = false
        this.membersPagination.fetchMore = true
      }

      // Do not fetch more if it is the last page
      if (!this.membersPagination.fetchMore) {
        this.applicantsPagination.offset += this.applicantsPagination.first
        this.$apollo.queries.daoApplicants?.fetchMore({
          // New variables
          variables: {
            daoId: this.selectedDao.docId,
            first: this.applicantsPagination.first,
            offset: this.applicantsPagination.offset,
            order: this.order,
            filter: this.fileterObject
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
      } else if (this.daoMembers?.length > 0) {
        this.membersPagination.offset += this.membersPagination.first
        this.$apollo.queries.daoMembers?.fetchMore({
          // New variables
          variables: {
            daoId: this.selectedDao.docId,
            first: this.membersPagination.first,
            offset: this.membersPagination.offset,
            order: this.order,
            filter: this.fileterObject
          },
          // Transform the previous result with new data
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult.getDao.member.length) {
              this.membersPagination.fetchMore = false
            }

            done(!this.membersPagination.fetchMore)
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
      } else {
        done(false)
      }
    }
  }
}
</script>

<template lang="pug">
.page-members.full-width
  .row.full-width.relative-position.q-mb-md
    base-banner(
      title="Great vision **without great people** is irrelevant"
      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
      background="img/member-banner-bg.png"
    )
      template(v-slot:buttons)
        q-btn.q-px-lg.h-h7(color="secondary" no-caps unelevated rounded label="Become a member" @click="onApply" v-if="!(isApplicant || isMember || !account)")
        q-btn(class="h7" color="white" no-caps flat rounded label="Copy invite link")

    .row.full-width.q-mt-sm
      .col-9.q-py-md
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
        :showCircle="false"
        :toggleLabel="'Show applicants'")
</template>

<style lang="stylus" scoped>
.rounded-border
  :first-child
    border-radius 12px

.close-btn
  z-index 1
</style>
