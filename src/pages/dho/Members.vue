<script>
import { mapGetters, mapActions } from 'vuex'
import { copyToClipboard } from 'quasar'
import { MEMBER_TYPE } from '~/const'
import { documents } from '~/mixins/documents'
import ipfsy from '~/utils/ipfsy'
import gql from 'graphql-tag'

const ordersMap = [{ asc: 'createdDate' }, { desc: 'createdDate' }, { asc: 'details_member_n' }]

const DAO_APPLICANTS_QUERY = `
  getDao (docId: $daoId) {
    docId

    applicantAggregate {
      count
    }

    applicants: applicant (first: $first, offset: $offset, filter: $filter, order: $order) {
      docId
      __typename

      ... on Member {
        details_member_n
        createdDate
      }
    }
  }
`

const DAO_CORE_MEMBERS_QUERY = `
  getDao (docId: $daoId) {
    docId

    memberAggregate {
      count
    }

    members: member (first: $first, offset: $offset, filter: $filter, order: $order) {
      docId
      __typename

      ... on Member {
        details_member_n
        createdDate
        
        holdsbadge {
          system_nodeLabel_s
          details_icon_s
        }
      }
    }
  }

`

const STATES = Object.freeze({
  WAITING: 'WAITING',
  CREATING_LINK: 'CREATING_LINK',
  CREATED_LINK: 'CREATED_LINK'
})

export default {
  name: 'page-members',
  mixins: [documents],
  components: {
    BaseBanner: () => import('~/components/common/base-banner.vue'),
    FilterOpenButton: () => import('~/components/filters/filter-open-button.vue'),
    FilterWidget: () => import('~/components/filters/filter-widget.vue'),
    FilterWidgetMobile: () => import('~/components/filters/filter-widget-mobile.vue'),
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue'),
    MembersList: () => import('~/components/profiles/members-list.vue'),
    ProfileCard: () => import('~/components/profiles/profile-card.vue'),
    UpvoteDelegateWidget: () => import('~/components/common/upvote-delegate-widget.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  data () {
    return {
      STATES,
      state: STATES.WAITING,

      inviteURL: process.env.JOIN_URI,

      applicantsCount: 0,
      applicantsPagination: {
        fetchMore: true,
        page: 0,
        size: 3
      },

      coreMembersCount: 0,
      coreMembersPagination: {
        fetchMore: true,
        page: 0,
        size: 3
      },

      communityMembersCount: 0,
      communityMembersPagination: {
        fetchMore: true,
        page: 0,
        size: 3
      },

      circle: '',
      isMembersBannerVisible: true,
      mobileFilterOpen: false,
      order: ordersMap[1],
      shouldReset: false,
      sort: '',
      textFilter: null,
      optionArray: [
        { label: this.$t('pages.dho.members.sortBy'), disable: true },
        this.$t('pages.dho.members.joinDateDescending'),
        this.$t('pages.dho.members.joinDateAscending'),
        this.$t('pages.dho.members.alphabetically')
      ],
      circleArray: ['All circles', 'Circle One'],
      showApplicants: false,
      mobileFilterStyles: {
        width: this.$q.screen.md ? '400px' : '100%',
        right: this.$q.screen.md ? '0' : '0',
        left: this.$q.screen.md ? 'auto' : '0'
      },
      filters: [
        {
          label: this.$t('pages.dho.members.all'),
          value: MEMBER_TYPE.ALL,
          enabled: true,
          filter: () => true
        },
        {
          label: this.$t('pages.dho.members.coreTeam'),
          value: MEMBER_TYPE.CORE,
          enabled: false,
          filter: (p) => p.__typename === 'Payout'
        },
        {
          label: this.$t('pages.dho.members.communityMembers'),
          value: MEMBER_TYPE.COMMUNITY,
          enabled: false,
          filter: (p) => p.__typename === 'Assignment' || p.__typename === 'Edit'
        }

      ]
    }
  },

  apollo: {
    daoApplicants: {
      query: gql`query applicantPagination ($daoId: String!, $first: Int, $offset: Int, $filter: MemberFilter, $order: MemberOrder) { ${DAO_APPLICANTS_QUERY} }`,
      update: data => data.getDao.applicants.map(user => {
        return {
          isApplicant: true,
          joinedDate: user.createdDate,
          username: user.details_member_n
        }
      }),
      variables () {
        return {
          first: this.applicantsPagination.size,
          offset: 0,
          daoId: this.selectedDao.docId,
          order: this.order,
          filter: this.filterObject
        }
      },
      skip () { return !this.selectedDao || !this.selectedDao.docId },

      result ({ data }) {
        this.applicantsCount = data?.getDao?.applicantAggregate?.count
      },

      pollInterval: 1000 // TODO: Swap with subscribe once dgraph is ready
    },

    daoCoreMembers: {
      query: gql`query coreMembersPagination ($daoId: String!, $first: Int, $offset: Int, $filter: MemberFilter, $order: MemberOrder) { ${DAO_CORE_MEMBERS_QUERY} }`,
      update: data => data.getDao.members.map(user => {
        return {
          isCoreMember: true,
          joinedDate: user.createdDate,
          username: user.details_member_n,
          badges: user.holdsbadge
        }
      }),
      variables () {
        return {
          first: this.coreMembersPagination.size,
          offset: 0,
          daoId: this.selectedDao.docId,
          order: this.order,
          filter: this.filterObject
        }
      },
      skip () { return !this.selectedDao || !this.selectedDao.docId },

      result ({ data }) {
        this.coreMembersCount = data?.getDao?.memberAggregate?.count
      }

      // pollInterval: 1000 // TODO: Swap with subscribe once dgraph is ready
    }

    // daoCommunityMembers: {
    //   query: require('~/query/members/members-community-pagination.gql'),
    //   // cmmtymember
    //   update: data => data.getDao.commember.map(user => ({
    //     username: user.details_member_n,
    //     joinedDate: user.createdDate,
    //     isCommunityMember: true,
    //     badges: user.holdsbadge
    //   })),
    //   variables () {
    //     return {
    //       first: 10,
    //       offset: 0,
    //       daoId: this.selectedDao.docId,
    //       order: this.order,
    //       filter: this.filterObject
    //     }
    //   },
    //   skip () { return !this.selectedDao || !this.selectedDao.docId },
    //   debounce: 500
    // }

  },

  watch: {
    'selectedDao.docId': {
      handler () {
        this.resetPagination(true)
      },
      immediate: false
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
    ...mapGetters('dao', ['canEnroll', 'daoSettings', 'selectedDao']),

    banner () {
      return {
        title: this.daoSettings.membersTitle || this.$t('pages.dho.members.discoverATapestry'),
        description: this.daoSettings.membersParagraph || this.$t('pages.dho.members.wereBuildingAThriving'),
        background: ipfsy(this.daoSettings.membersBackgroundImage),
        color: this.daoSettings.primaryColor,
        pattern: this.daoSettings.pattern,
        patternColor: this.daoSettings.patternColor,
        patternAlpha: this.daoSettings.patternOpacity
      }
    },

    members () {
      return [
        ...(this.showCoreMembers && this.daoCoreMembers ? [...this.daoCoreMembers] : [])
        // ...(this.showCommunityMembers && this.daoCommunityMembers ? [...this.daoCommunityMembers] : [])
      ]
    },

    filterObject () { return this.textFilter ? { details_member_n: { regexp: `/${this.textFilter}/i` } } : null },
    memberTypeFilter () { return this.filters.filter(_ => _.enabled).map(_ => _.value) },
    showCommunityMembers () { return this.memberTypeFilter.includes(MEMBER_TYPE.ALL) || this.memberTypeFilter.includes(MEMBER_TYPE.COMMUNITY) },
    showCoreMembers () { return this.memberTypeFilter.includes(MEMBER_TYPE.ALL) || this.memberTypeFilter.includes(MEMBER_TYPE.CORE) },
    isInviteModalOpen () {
      return [
        STATES.CREATING_LINK,
        STATES.CREATED_LINK
      ].includes(this.state)
    }
  },

  mounted () {
    this.$EventBus.$on('membersUpdated', this.pollData)
  },

  beforeDestroy () {
    this.$EventBus.$off('membersUpdated')
  },

  methods: {
    ...mapActions('accounts', ['applyMember']),
    ...mapActions('dao', ['createInviteLink']),

    async _createInviteLink () {
      try {
        this.state = STATES.CREATING_LINK
        const invite = await this.createInviteLink()
        const url = new URL(process.env.JOIN_URI)

        Object.keys(invite).forEach(key => {
          url.searchParams.set(key, invite[key])
        })

        this.inviteURL = url.toString()
        this.state = STATES.CREATED_LINK
      } catch (e) {
        const message = e.message || e.cause.message
        this.showNotification({ message, color: 'red' })
      }
    },

    async _copyToClipBoard () {
      try {
        await copyToClipboard(this.inviteURL)
        this.showNotification({
          message: this.$t('messages.linkCopied'),
          color: 'secondary',
          icon: 'far fa-copy'
        })
      } catch (e) {
        const message = e.message || e.cause.message
        this.showNotification({ message, color: 'red' })
      }
    },

    pollData () {
      setTimeout(() => {
        this.$apollo.queries.daoApplicants?.fetchMore({
          variables: {
            first: this.applicantsPagination.size,
            offset: this.applicantsPagination.page * this.applicantsPagination.size,
            daoId: this.selectedDao.docId,
            order: this.order,
            filter: this.filterObject
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            return {
              getDao: {
                __typename: fetchMoreResult.getDao.__typename,
                docId: fetchMoreResult.getDao.docId,
                applicants: [
                  ...(fetchMoreResult ? fetchMoreResult.getDao.applicants : [])
                ]
              }
            }
          }
        })

        this.$apollo.queries.daoCoreMembers?.fetchMore({
          variables: {
            first: this.coreMembersPagination.size,
            offset: this.coreMembersPagination.page * this.coreMembersPagination.size,
            daoId: this.selectedDao.docId,
            order: this.order,
            filter: this.filterObject
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            return {
              getDao: {
                __typename: fetchMoreResult.getDao.__typename,
                docId: fetchMoreResult.getDao.docId,
                members: [
                  ...(fetchMoreResult ? fetchMoreResult.getDao.members : [])
                ]
              }
            }
          }
        })
      }, 1250)
    },

    async onApply () {
      this.$EventBus.$emit('membersUpdated')
      const res = await this.applyMember({ content: 'DAO Applicant' })
      if (res) {
        this.$EventBus.$emit('membersUpdated')
      }
    },

    resetPagination (forceOffset) {
      if (forceOffset) {
        this.applicantsPagination.page = 0
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

    onChange (name, value) { this.$set(this, name, value) },

    hasLastResult () { return this.$apollo.queries.daoApplicants.observer?.lastResult },

    loadMoreDaoApplicants (page, done) {
      if (this.daoApplicants?.length === this.applicantsCount) {
        return
        // done(true)
      }

      this.applicantsPagination.page += 1

      this.$apollo.queries.daoApplicants?.fetchMore({
        variables: {
          first: this.applicantsPagination.size,
          offset: this.applicantsPagination.page * this.applicantsPagination.size,
          daoId: this.selectedDao.docId,
          order: this.order,
          filter: this.filterObject
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          // done()

          return {
            getDao: {
              __typename: fetchMoreResult.getDao.__typename,
              docId: fetchMoreResult.getDao.docId,
              applicants: [
                ...(previousResult ? previousResult.getDao.applicants : []),
                ...(fetchMoreResult ? fetchMoreResult.getDao.applicants : [])
              ]
            }
          }
        }
      })
    },

    loadMoreDaoCoreMembers (page, done) {
      if (this.daoCoreMembers?.length === this.coreMembersCount) {
        done(true)
      }

      this.coreMembersPagination.page += 1

      this.$apollo.queries.daoCoreMembers?.fetchMore({
        variables: {
          first: this.coreMembersPagination.size,
          offset: this.coreMembersPagination.page * this.coreMembersPagination.size,
          daoId: this.selectedDao.docId,
          order: this.order,
          filter: this.filterObject
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          done()

          return {
            getDao: {
              __typename: fetchMoreResult.getDao.__typename,
              docId: fetchMoreResult.getDao.docId,
              members: [
                ...(previousResult ? previousResult.getDao.members : []),
                ...(fetchMoreResult ? fetchMoreResult.getDao.members : [])
              ]
            }
          }
        }
      })
    }
  }
}
</script>

<template lang="pug">
q-page.page-members
  base-banner(:compact="!$q.screen.gt.sm" :split="$q.screen.gt.md" v-bind="banner" v-if="isMembersBannerVisible")
    template(v-slot:buttons)
      nav.row.items-center
        .row.inline.q-pr-md(v-if="!isMember && !isApplicant && account")
          q-btn.q-px-lg.h-btn1(:disable="!daoSettings.registrationEnabled" @click="onApply" color="secondary" :label="$t('pages.dho.members.becomeAMember')" no-caps="no-caps" rounded text-color="white" unelevated="unelevated")
          q-tooltip(v-if="!daoSettings.registrationEnabled") {{ $t('pages.dho.members.registrationIsTemporarilyDisabled') }}
        q-btn.q-px-lg.h-btn1(:flat="!account" @click="_createInviteLink" color="secondary" :label="$t('pages.dho.members.copyInviteLink')" no-caps="no-caps" rounded text-color="white" unelevated="unelevated")
          q-tooltip {{ $t('pages.dho.members.sendALink') }}

  //- upvote-delegate-widget(endDate="2023-05-29" :users="tempUsersForVotes")

  q-dialog(:value="isInviteModalOpen")
    .row.justify-center.items-center
      div.q-pa-xl(v-if="state === STATES.CREATING_LINK")
        loading-spinner(color="primary" size="72px")
      div.bg-white.rounded-full.q-pa-xl(v-if="state === STATES.CREATED_LINK" :style="{'min-width': '480px'}")
        header
          h3.q-pa-none.q-ma-none.h-h4.text-weight-700 {{ $t('pages.dho.members.copyInviteLink') }}
        section.q-mt-xl
          .row.full-width.q-my-xs.relative-position
            q-input.full-width(dense disable filled rounded v-model='inviteURL')
            q-btn.q-px-lg.absolute-right(
              :label="$t('pages.dho.members.copy')"
              @click="_copyToClipBoard"
              color="secondary"
              no-caps="no-caps"
              rounded
              text-color="white"
              unelevated="unelevated"
            )

  .row.q-py-md
    div.col-9(:class="{'full-width': $q.screen.lt.md}")

      section#applicants
        header.row.q-mb-md
          .h-h4 {{ $t('pages.dho.members.daoApplicants') }}
          .h-h4-regular.q-ml-xs ({{ daoApplicants?.length }}/{{ applicantsCount }})

        .row.q-mr-md
          template.full-width(v-for="applicant in daoApplicants")
            profile-card.q-mb-md(
              :canEnroll="canEnroll"
              :compact="true"
              :key="applicant.hash"
              v-bind="applicant"
              :view="$q.screen.gt.md ?  'list' : 'card'"
            )

        footer.row.justify-center.text-center
          p.full-width.text-sm.text-h-gray.leading-loose ({{ daoApplicants?.length }}/{{ applicantsCount }})
          q-btn.full-width.q-pa-xxs(
            :label="$t('common.widget-more-btn.seeMore')"
            @click="loadMoreDaoApplicants"
            color="primary"
            flat
            no-caps
            rounded
            size="12px"
            v-if="daoApplicants?.length !== applicantsCount"
          )

      section#core-members.q-mt-xl
        header.row.q-mb-md
          .h-h4 {{ $t('pages.dho.members.members') }}
          .h-h4-regular.q-ml-xs ({{ members?.length }}/{{ coreMembersCount }})

        members-list(
          :lastResult="hasLastResult()"
          :compact="$q.screen.gt.md ? false : true"
          :members="members"
          view="card"
          @loadMore="loadMoreDaoCoreMembers"
          v-bind="{ canEnroll }"
        )

        footer.row.justify-center.text-center
          p.full-width.text-sm.text-h-gray.leading-loose ({{ members?.length }}/{{ coreMembersCount }})

    div.col-3(:class="{'full-width': $q.screen.lt.md}")
      filter-widget.sticky(v-if="$q.screen.gt.md" :circle.sync="circle" :circleArray.sync="circleArray" :defaultOption="1" :optionArray.sync="optionArray" :showCircle="false" :sort.sync="sort" :textFilter.sync="textFilter" :filterTitle="$t('pages.dho.members.filterByAccountName')" :filters.sync="filters" :showViewSelector="false" @update:filters="value => onChange('filters', value)")

      filter-open-button(v-if="$q.screen.lt.md" @open="mobileFilterOpen = true")
      filter-widget-mobile(v-if="$q.screen.lt.md" :circle.sync="circle" :circleArray.sync="circleArray" :defaultOption="1" :optionArray.sync="optionArray" :showCircle="false" :sort.sync="sort" :textFilter.sync="textFilter" :showViewSelector="false" @close="mobileFilterOpen = false" :filterTitle="$t('pages.dho.members.filterByAccountName')" v-show="mobileFilterOpen" :style="mobileFilterStyles")

</template>

<style lang="stylus" scoped>
</style>
