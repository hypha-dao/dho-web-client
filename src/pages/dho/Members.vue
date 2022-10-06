<script>
import { mapGetters, mapActions } from 'vuex'
import { copyToClipboard } from 'quasar'
import { documents } from '~/mixins/documents'
import ipfsy from '~/utils/ipfsy'

const ordersMap = [{ asc: 'createdDate' }, { desc: 'createdDate' }, { asc: 'details_member_n' }]

export default {
  name: 'page-members',
  mixins: [documents],
  components: {
    BaseBanner: () => import('~/components/common/base-banner.vue'),
    MembersList: () => import('~/components/profiles/members-list.vue'),
    FilterWidget: () => import('~/components/filters/filter-widget.vue'),
    FilterWidgetMobile: () => import('~/components/filters/filter-widget-mobile.vue'),
    FilterOpenButton: () => import('~/components/filters/filter-open-button.vue'),
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
          first: 10,
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
      } else if (val === 0 && this.shouldReset) {
        this.$refs.scroll?.resume()
        this.resetPagination(false)
        this.shouldReset = false
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
        this.shouldReset = true
      },
      immediate: false
    },
    textFilter: {
      handler: async function (value) {
        this.shouldReset = true
      },
      immediate: false
    }
  },

  data () {
    return {
      mobileFilterOpen: false,
      shouldReset: false,
      isShowingMembersBanner: true,
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
      optionArray: [{ label: 'Sort by', disable: true }, 'Join date descending', 'Join date ascending', 'Alphabetically (A-Z)'],
      circleArray: ['All circles', 'Circle One'],
      showApplicants: false
    }
  },

  computed: {
    ...mapGetters('accounts', ['account', 'isApplicant', 'isMember']),
    ...mapGetters('dao', ['daoSettings', 'selectedDao']),

    banner () {
      return {
        title: this.daoSettings.membersTitle,
        description: this.daoSettings.membersParagraph,
        background: ipfsy(this.daoSettings.membersBackgroundImage),
        color: this.daoSettings.primaryColor,
        pattern: this.daoSettings.pattern,
        patternColor: this.daoSettings.patternColor,
        patternAlpha: this.daoSettings.patternOpacity
      }
    },

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

  activated () {
    this.showApplicants = this.$route.params.applicants === undefined ? false : this.$route.params.applicants
    this.$forceUpdate()
  },

  mounted () {
    if (localStorage.getItem('showMembersBanner') === 'false') {
      this.isShowingMembersBanner = false
    }
    this.$EventBus.$on('membersUpdated', this.pollData)
    this.showApplicants = this.$route.params.applicants === undefined ? false : this.$route.params.applicants
    this.$forceUpdate()
  },

  beforeDestroy () {
    this.$EventBus.$off('membersUpdated')
  },

  methods: {
    ...mapActions('accounts', ['applyMember']),
    hideMembersBanner () {
      localStorage.setItem('showMembersBanner', false)
      this.isShowingMembersBanner = false
    },
    async onApply () {
      const res = await this.applyMember({ content: 'DAO Applicant' })
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
        this.applicantsPagination.offset = Math.max((this.daoApplicants?.length || 0) - this.applicantsPagination.first, 0)
        this.membersPagination.offset = Math.max((this.daoMembers?.length || 0) - this.membersPagination.first, 0)
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
      if (this.loadingQueriesCount !== 0) {
        done()
        return
      }

      // if ((this.daoApplicants?.length || 0) === 0) {
      //   this.applicantsPagination.fetchMore = false
      //   this.membersPagination.fetchMore = true
      // }

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
                  ...(previousResult?.getDao?.applicant?.filter(n => !fetchMoreResult.getDao.applicant.some(p => p.docId === n.docId))) || [],
                  ...fetchMoreResult.getDao.applicant || []
                ]
              }
            }
          }
        })
      } else {
        if (this.membersPagination.offset === 0) {
          this.membersPagination.offset += 1
        } else {
          this.membersPagination.offset += this.membersPagination.first
        }
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
      }
    },
    async copyToClipBoard () {
      try {
        const resolved = this.$router.resolve({ name: 'login', params: { dhoname: this.daoSettings.url } })
        const host = window.location.host
        const url = `${host}${resolved.href}`
        await copyToClipboard(url)
        this.showNotification({
          message: 'The link has been copied',
          color: 'secondary',
          icon: 'far fa-copy'
        })
      } catch (error) {
        this.showNotification({
          message: 'Error',
          textColor: 'white',
          color: 'negative',
          icon: 'far fa-copy'
        })
      }
    }
  }
}
</script>

<template lang="pug">
.page-members
  .row.full-width(v-if="isShowingMembersBanner")
    base-banner(v-bind="banner" @onClose="hideMembersBanner" :compact="!$q.screen.gt.sm")
      template(v-slot:buttons)
        div(v-if="!account")
          q-btn.q-px-lg.h-h7(color="secondary" no-caps unelevated rounded label="Become a member" @click="onApply" :disable="!daoSettings.registrationEnabled")
          q-tooltip(v-if="!daoSettings.registrationEnabled") Registration is temporarily disabled
        q-btn.q-px-lg.h-h7(v-bind:class="{'bg-secondary': account}" color="white" no-caps flat rounded label="Copy invite link" @click="copyToClipBoard")
          q-tooltip Send a link to your friends to invite them to join this DAO

  .row.full-width.q-py-md(v-if="$q.screen.gt.sm")
    .col-9
      members-list(:members="members" :view="view" @loadMore="onLoadMoreMembers" ref="scroll")
    .col-3
      filter-widget.sticky(:view.sync="view",
      :toggle.sync="showApplicants",
      :toggleDefault="false",
      :defaultOption="1",
      :sort.sync="sort",
      :textFilter.sync="textFilter",
      :circle.sync="circle",
      :optionArray.sync="optionArray",
      :circleArray.sync="circleArray"
      :viewSelectorLabel="'Members view'",
      :showToggle="true",
      :showCircle="false"
      :toggleLabel="'Show applicants'"
      filterTitle="Filter by account name"
      )
  .s(v-else)
    filter-open-button(@open="mobileFilterOpen = true")
    filter-widget-mobile(
    v-show="mobileFilterOpen"
    @close="mobileFilterOpen = false"
    :toggle.sync="showApplicants",
    :toggleDefault="false",
    :defaultOption="1",
    :sort.sync="sort",
    :textFilter.sync="textFilter",
    :circle.sync="circle",
    :optionArray.sync="optionArray",
    :circleArray.sync="circleArray"
    :viewSelectorLabel="'Members view'",
    :showToggle="true",
    :showCircle="false"
    :toggleLabel="'Show applicants'"
    filterTitle="Filter by account name"
    )
    .cols.q-mt-md
      members-list(:members="members" view="card" @loadMore="onLoadMoreMembers" ref="scroll" compact)
</template>

<style lang="stylus" scoped>
.rounded-border
  :first-child
    border-radius 12px

.close-btn
  z-index 1
</style>
