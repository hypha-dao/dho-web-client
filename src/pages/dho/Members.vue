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
    FilterOpenButton: () => import('~/components/filters/filter-open-button.vue'),
    FilterWidget: () => import('~/components/filters/filter-widget.vue'),
    FilterWidgetMobile: () => import('~/components/filters/filter-widget-mobile.vue'),
    MembersList: () => import('~/components/profiles/members-list.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  data () {
    return {
      mobileFilterOpen: false,
      shouldReset: false,
      isMembersBannerVisible: true,
      loadingQueriesCount: 0,

      applicantsPagination: {
        first: 6,
        offset: 0,
        fetchMore: true
      },
      coreMembersPagination: {
        first: 6,
        offset: 0,
        fetchMore: true
      },
      communityMembersPagination: {
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
      showApplicants: false,
      mobileFilterStyles: {
        width: this.$q.screen.md ? '400px' : '100%',
        right: this.$q.screen.md ? '0' : '0',
        left: this.$q.screen.md ? 'auto' : '0'
      },

      filters: [
        {
          label: 'All',
          value: 'ALL',
          enabled: true,
          filter: () => true
        },
        {
          label: 'Core Team',
          value: 'CORE',
          enabled: false,
          filter: (p) => p.__typename === 'Payout'
        },
        {
          label: 'Community Members',
          value: 'COMMUNITY',
          enabled: false,
          filter: (p) => p.__typename === 'Assignment' || p.__typename === 'Edit'
        }

      ]
    }
  },

  apollo: {
    daoApplicants: {
      query: require('~/query/members/applicants-pagination.gql'),
      update: data => data.getDao.applicant.map(user => {
        return {
          username: user.details_member_n,
          joinedDate: user.createdDate,
          isApplicant: true
        }
      }),
      variables () {
        return {
          first: this.applicantsPagination.first,
          offset: 0,
          daoId: this.selectedDao.docId,
          order: this.order,
          filter: this.filterObject
        }
      },
      skip () { return !this.selectedDao || !this.selectedDao.docId },
      debounce: 500,
      loadingKey: 'loadingQueriesCount'
    },

    daoCoreMembers: {
      query: require('~/query/members/members-core-pagination.gql'),
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
          filter: this.filterObject
        }
      },
      skip () { return !this.selectedDao || !this.selectedDao.docId },
      debounce: 500,
      loadingKey: 'loadingQueriesCount'
    },

    daoCommunityMembers: {
      query: require('~/query/members/members-community-pagination.gql'),
      // cmmtymember
      update: data => data.getDao.commember.map(user => ({
        username: user.details_member_n,
        joinedDate: user.createdDate
      })),
      variables () {
        return {
          first: 10,
          offset: 0,
          daoId: this.selectedDao.docId,
          order: this.order,
          filter: this.filterObject
        }
      },
      skip () { return !this.selectedDao || !this.selectedDao.docId },
      debounce: 500
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
      if (this.coreMembersPagination.offset === 0 && this.applicantsPagination.offset === 0 && val === 0) {
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
          this.coreMembersPagination.fetchMore = false
          this.applicantsPagination.fetchMore = true
        } else {
          this.coreMembersPagination.fetchMore = true
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
    },
    filters: {
      deep: true,
      handler () {
        if (!this.filtersToEvaluate) {
          const someFilterIsTrue = this.filters.some(filter => filter.enabled && (filter.label !== this.filters[0].label))
          this.filters[0].enabled = !someFilterIsTrue
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
          this.filters[0].enabled = !someFilterIsTrue
        }

        this.filtersToEvaluate = JSON.parse(JSON.stringify(this.filters))
      }
    }
  },

  computed: {
    ...mapGetters('accounts', ['account', 'isApplicant', 'isMember']),
    ...mapGetters('dao', ['canEnroll', 'daoSettings', 'selectedDao', 'selectedDaoPlan']),

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

    members () {
      return [
        ...(this.showApplicants && this.daoApplicants ? [...this.daoApplicants] : []),
        ...(this.showCoreMembers && this.daoCoreMembers ? [...this.daoCoreMembers] : []),
        ...(this.showCommunityMembers && this.daoCommunityMembers ? [...this.daoCommunityMembers] : [])
      ]
    },

    filterObject () { return this.textFilter ? { details_member_n: { regexp: `/${this.textFilter}/i` } } : null },
    loadingAccount () { return localStorage?.getItem('autoLogin') && !this.account },
    memberTypeFilter () { return this.filters.filter(_ => _.enabled).map(_ => _.value) },
    showCoreMembers () { return this.memberTypeFilter.includes('ALL') || this.memberTypeFilter.includes('CORE') },
    showCommunityMembers () { return this.memberTypeFilter.includes('ALL') || this.memberTypeFilter.includes('COMMUNITY') }

  },

  mounted () {
    if (localStorage.getItem('showMembersBanner') === 'false') {
      this.isMembersBannerVisible = false
    }

    this.showApplicants = this.$route.params.applicants === undefined ? false : this.$route.params.applicants
    this.$forceUpdate()

    this.$EventBus.$on('membersUpdated', this.pollData)
  },

  beforeDestroy () {
    this.$EventBus.$off('membersUpdated')
  },

  methods: {
    ...mapActions('accounts', ['applyMember']),

    hideMembersBanner () {
      localStorage.setItem('showMembersBanner', false)
      this.isMembersBannerVisible = false
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
        this.coreMembersPagination.offset = 0
        this.$refs.scroll?.stop()
      } else {
        // This ensures we are showing the cached data
        this.applicantsPagination.offset = Math.max((this.daoApplicants?.length || 0) - this.applicantsPagination.first, 0)
        this.coreMembersPagination.offset = Math.max((this.daoCoreMembers?.length || 0) - this.coreMembersPagination.first, 0)
      }
      this.coreMembersPagination.fetchMore = !this.showApplicants
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
            filter: this.filterObject
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
        this.$apollo.queries.daoCoreMembers?.fetchMore({
          variables: {
            daoId: this.selectedDao.docId,
            first: this.coreMembersPagination.first + this.coreMembersPagination.offset,
            offset: 0,
            order: this.order,
            filter: this.filterObject
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
      //   this.coreMembersPagination.fetchMore = true
      // }

      // Do not fetch more if it is the last page
      if (!this.coreMembersPagination.fetchMore) {
        this.applicantsPagination.offset += this.applicantsPagination.first
        this.$apollo.queries.daoApplicants?.fetchMore({
          // New variables
          variables: {
            daoId: this.selectedDao.docId,
            first: this.applicantsPagination.first,
            offset: this.applicantsPagination.offset,
            order: this.order,
            filter: this.filterObject
          },
          // Transform the previous result with new data
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult.getDao.applicant.length) {
              this.applicantsPagination.fetchMore = false
              this.coreMembersPagination.fetchMore = true
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
        if (this.coreMembersPagination.offset === 0) {
          this.coreMembersPagination.offset += 1
        } else {
          this.coreMembersPagination.offset += this.coreMembersPagination.first
        }
        this.$apollo.queries.daoCoreMembers?.fetchMore({
          // New variables
          variables: {
            daoId: this.selectedDao.docId,
            first: this.coreMembersPagination.first,
            offset: this.coreMembersPagination.offset,
            order: this.order,
            filter: this.filterObject
          },
          // Transform the previous result with new data
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult.getDao.member.length) {
              this.coreMembersPagination.fetchMore = false
            }

            done(!this.coreMembersPagination.fetchMore)
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
    },

    onChange (name, value) { this.$set(this, name, value) }

  },

  updated () {
    console.log(JSON.stringify(this.daoCommunityMembers))
  }

}
</script>

<template lang="pug">
q-page.page-members
  base-banner(
    :compact="!$q.screen.gt.sm"
    @onClose="hideMembersBanner"
    :split="$q.screen.gt.md"
    v-bind="banner"
    v-if="isMembersBannerVisible"
  )
    template(v-slot:buttons)
      nav.row.items-center
        div.row.inline.q-pr-md(v-if="!isMember && !isApplicant && account && !loadingAccount")
          q-btn.q-px-lg.h-btn1(
            :disable="!daoSettings.registrationEnabled"
            @click="onApply"
            color="secondary"
            label="Become a member"
            no-caps
            rounded
            text-color="white"
            unelevated
          )
          q-tooltip(v-if="!daoSettings.registrationEnabled") Registration is temporarily disabled
        q-btn.q-px-lg.h-btn1(
          :flat="!account"
          @click="copyToClipBoard"
          color="secondary"
          label="Copy invite link"
          no-caps
          rounded
          text-color="white"
          unelevated
        )
          q-tooltip Send a link to your friends to invite them to join this DAO

  .row.q-py-md(v-if="$q.screen.gt.md")
    .col-9
      members-list(
        :members="members"
        :view="view"
        @loadMore="onLoadMoreMembers"
        ref="scroll"
        v-bind="{ canEnroll }"
      )
    .col-3
      filter-widget.sticky(
        :circle.sync="circle",
        :circleArray.sync="circleArray"
        :defaultOption="1",
        :optionArray.sync="optionArray",
        :showCircle="false"
        :showToggle="true",
        :sort.sync="sort",
        :textFilter.sync="textFilter",
        :toggle.sync="showApplicants",
        :toggleDefault="false",
        :toggleLabel="'Show applicants'"
        :view.sync="view",
        :viewSelectorLabel="'View'",
        filterTitle="Filter by account name"
        :filters.sync="filters"
        @update:filters="value => onChange('filters', value)"
      )

  div(v-else)
    filter-open-button(@open="mobileFilterOpen = true")
    filter-widget-mobile(
      :circle.sync="circle",
      :circleArray.sync="circleArray"
      :defaultOption="1",
      :optionArray.sync="optionArray",
      :showCircle="false"
      :showToggle="true",
      :sort.sync="sort",
      :textFilter.sync="textFilter",
      :toggle.sync="showApplicants",
      :toggleDefault="false",
      :toggleLabel="'Show applicants'"
      :viewSelectorLabel="'View'",
      @close="mobileFilterOpen = false",
      filterTitle="Filter by account name",
      v-show="mobileFilterOpen",
      :style="mobileFilterStyles"
    )
    .cols.q-mt-md
      members-list(
          :members="members"
          view="card"
          @loadMore="onLoadMoreMembers"
          ref="scroll"
          compact
          v-bind="{ canEnroll }"
        )
</template>

<style lang="stylus" scoped>
</style>
