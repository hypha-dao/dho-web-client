<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import BrowserIpfs from '~/ipfs/browser-ipfs.js'
import gql from 'graphql-tag'
import { timeago } from '~/utils/TimeUtils'
import { parsedNotification } from '~/utils/notifications-utils'
import { ROUTE_NAMES } from '~/const'

// const MAX_NUM_OF_RETIRES = 10

// const DAO_ACTIVE_QUERY = `
//   activePlan(daoUrl: $daoUrl) {
//     subscriptionId
//     subscriptionItemId
//     subscriptionStatus
//     currency
//     currentPeriodEnd
//     currentPeriodStart
//     coreMembersCount
//     communityMembersCount
//     price
//     id: planId
//     name: planName
//   }

//   queryDao @cascade(fields: ["settings"]) {
//     docId
//     details_daoName_n

//     details_daoType_s
//     # details_isWaitingEcosystem_i
//     createdDate

//     upcomingelct {
//       docId
//     }

//     admin(filter: { details_member_n: { eq: $username } }) {
//       docId
//     }
//     enroller(filter: { details_member_n: { eq: $username } }) {
//       docId
//     }
//     applicant(filter: { details_member_n: { eq: $username } }) {
//       docId
//     }
//     member(filter: { details_member_n: { eq: $username } }) {
//       docId
//     }

//     announcements: alert {
//       id: docId
//       title: details_level_s
//       message: details_content_s
//       enabled: details_enabled_i
//     }

//     planmanager {
//       bill {
//         id: docId
//         startDate: details_startDate_t
//         endDate: details_endDate_t
//         expirationDate: details_expirationDate_t
//         periodCount: details_periodCount_i
//         name: details_planName_s
//         price: details_planPrice_a
//         isInfinite: details_isInfinite_i
//         discountPercX10000: details_discountPercX10000_i

//         pricingplan {
//           maxMemberCount: details_maxMemberCount_i
//         }
//       }
//       currentbill {
//         id: docId
//         startDate: details_startDate_t
//         endDate: details_endDate_t
//         expirationDate: details_expirationDate_t
//         periodCount: details_periodCount_i
//         name: details_planName_s
//         price: details_planPrice_a
//         isInfinite: details_isInfinite_i
//         discountPercX10000: details_discountPercX10000_i

//         pricingplan {
//           maxMemberCount: details_maxMemberCount_i
//         }
//       }
//       lastbill {
//         id: docId
//         startDate: details_startDate_t
//         endDate: details_endDate_t
//         expirationDate: details_expirationDate_t
//         periodCount: details_periodCount_i
//         name: details_planName_s
//         price: details_planPrice_a
//         isInfinite: details_isInfinite_i
//         discountPercX10000: details_discountPercX10000_i

//         pricingplan {
//           maxMemberCount: details_maxMemberCount_i
//         }
//       }
//     }

//     multisigs: openmultisig {
//       approvedby {
//         docId
//         details_member_n
//       }

//       id: docId

//       # ecosystem_name_s
//       # ecosystem_logo_s
//       # ecosystem_domain_s
//       # ecosystem_purpose_s

//       # settings_onboarderAccount_n

//       # settings_claimEnabled_i
//       settings_daoUrl_s
//       # settings_daoName_n
//       settings_daoTitle_s
//       # settings_daoDescription_s
//       # settings_governanceTokenContract_n
//       # settings_pegToken_a
//       # settings_pegTokenContract_n
//       # settings_rewardToken_a
//       # settings_rewardTokenContract_n
//       # settings_rewardToPegRatio_a
//       # settings_treasuryContract_n
//       # settings_voiceToken_a

//       settings_socialChat_s
//       settings_documentationButtonText_s

//       settings_proposalsCreationEnabled_i
//       settings_membersApplicationEnabled_i
//       settings_removableBannersEnabled_i
//       settings_multisigEnabled_i

//       settings_votingDurationSec_i
//       # settings_periodDurationSec_i
//       settings_votingAlignmentX100_i
//       settings_votingQuorumX100_i
//       # settings_voiceTokenDecayPeriod_i

//       settings_communityVotingEnabled_i
//       settings_communityVotingMethod_s
//       settings_upvoteStartDateTime_s
//       settings_upvoteDuration_i
//       settings_upvoteRounds_s
//       settings_upvoteCheifDelegateCount_i
//       settings_upvoteCheifDelegateDuration_i
//       settings_upvoteHeadDelegateRound_i
//       settings_upvoteHeadDelegateDuration_i
//       settings_communityVotingDurationSec_i
//       settings_communityVotingAlignmentPercent_i
//       settings_communityVotingQuorumPercent_i

//       # settings_usesSeeds_i
//       # settings_isHypha_i

//       settings_logo_s
//       settings_extendedLogo_s
//       settings_primaryColor_s
//       settings_secondaryColor_s
//       settings_textColor_s
//       settings_pattern_s
//       settings_patternColor_s
//       settings_patternOpacity_i
//       settings_patternBase64_s

//       settings_splashBackgroundImage_s

//       settings_dashboardBackgroundImage_s
//       settings_dashboardTitle_s
//       settings_dashboardParagraph_s

//       settings_proposalsBackgroundImage_s
//       settings_proposalsTitle_s
//       settings_proposalsParagraph_s

//       settings_membersBackgroundImage_s
//       settings_membersTitle_s
//       settings_membersParagraph_s

//       settings_organisationBackgroundImage_s
//       settings_organisationTitle_s
//       settings_organisationParagraph_s

//       settings_exploreBackgroundImage_s
//       settings_exploreTitle_s
//       settings_exploreParagraph_s

//       settings_documentationURL_s
//     }

//     settings(filter: { settings_daoUrl_s: { regexp: $regexp } }) {
//       ecosystem_name_s
//       ecosystem_logo_s
//       ecosystem_domain_s
//       ecosystem_purpose_s

//       settings_onboarderAccount_n

//       settings_claimEnabled_i
//       settings_daoUrl_s
//       settings_daoName_n
//       settings_daoTitle_s
//       settings_daoDescription_s
//       settings_governanceTokenContract_n

//       settings_pegTokenName_s
//       settings_pegToken_a
//       settings_pegTokenContract_n
//       settings_treasuryTokenMultiplier_i
//       settings_treasuryContract_n

//       settings_rewardTokenName_s
//       settings_rewardToken_a
//       settings_rewardTokenContract_n
//       settings_rewardToPegRatio_a
//       settings_rewardTokenMaxSupply_a
//       settings_utilityTokenMultiplier_i

//       settings_voiceToken_a
//       settings_voiceTokenDecayPeriod_i
//       settings_voiceTokenDecayPerPeriodX10M_i
//       settings_voiceTokenMultiplier_i

//       settings_socialChat_s
//       settings_documentationButtonText_s

//       settings_proposalsCreationEnabled_i
//       settings_membersApplicationEnabled_i
//       settings_removableBannersEnabled_i
//       settings_multisigEnabled_i

//       settings_votingDurationSec_i
//       settings_periodDurationSec_i
//       settings_votingAlignmentX100_i
//       settings_votingQuorumX100_i
//       settings_voiceTokenDecayPeriod_i

//       settings_communityVotingEnabled_i
//       settings_communityVotingMethod_s
//       settings_upvoteStartDateTime_s
//       settings_upvoteDuration_i
//       settings_upvoteRounds_s
//       settings_upvoteCheifDelegateCount_i
//       settings_upvoteCheifDelegateDuration_i
//       settings_upvoteHeadDelegateRound_i
//       settings_upvoteHeadDelegateDuration_i
//       settings_communityVotingDurationSec_i
//       settings_communityVotingAlignmentPercent_i
//       settings_communityVotingQuorumPercent_i

//       settings_usesSeeds_i
//       settings_isHypha_i

//       settings_logo_s
//       settings_extendedLogo_s
//       settings_primaryColor_s
//       settings_secondaryColor_s
//       settings_textColor_s
//       settings_pattern_s
//       settings_patternColor_s
//       settings_patternOpacity_i
//       settings_patternBase64_s

//       settings_splashBackgroundImage_s

//       settings_dashboardBackgroundImage_s
//       settings_dashboardTitle_s
//       settings_dashboardParagraph_s

//       settings_proposalsBackgroundImage_s
//       settings_proposalsTitle_s
//       settings_proposalsParagraph_s

//       settings_membersBackgroundImage_s
//       settings_membersTitle_s
//       settings_membersParagraph_s

//       settings_organisationBackgroundImage_s
//       settings_organisationTitle_s
//       settings_organisationParagraph_s

//       settings_exploreBackgroundImage_s
//       settings_exploreTitle_s
//       settings_exploreParagraph_s

//       settings_documentationURL_s
//     }

//     levels: salaryband {
//       id: docId
//       name: details_name_s
//       annualAmount: details_annualUsdSalary_a
//       minDeferred: details_minDeferredX100_i
//     }

//     memberAggregate {
//       count
//     }
//   }
// `

// const NOTIFICATIONS_QUERY = `
//   queryNotification(order: { desc: time }) {
//     event {
//       eventType
//       name
//     }
//     user {
//       email
//       eosAccountName
//       name
//     }
//     id
//     content
//     read
//     time
//     archived
//   }
// `

const STATE = Object.freeze({
  LOADING: 'LOADING',
  READY: 'READY'
})

export default {
  name: 'multi-dho-layout',
  components: {
    AlertMessage: () => import('~/components/navigation/alert-message.vue'),
    BottomNavigation: () => import('~/components/navigation/bottom-navigation.vue'),
    GuestMenu: () => import('~/components/navigation/guest-menu.vue'),
    NonMemberMenu: () => import('~/components/navigation/non-member-menu.vue'),
    LeftNavigation: () => import('~/components/navigation/left-navigation.vue'),
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue'),
    ProfileSidebar: () => import('~/components/navigation/profile-sidebar.vue'),
    ProfileSidebarGuest: () => import('~/components/navigation/profile-sidebar-guest.vue'),
    TopNavigation: () => import('~/components/navigation/top-navigation.vue'),
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue'),
    QuickLinks: () => import('~/components/navigation/quick-links.vue'),
    Widget: () => import('~/components/common/widget.vue'),

    TemplatesModal: () => import('~/components/templates/templates-modal.vue')
  },

  props: {
    dhoname: String,
    dao: Object
  },

  apollo: {
    // dao: {
    //   query: gql`query activeDao($daoUrl: String!, $regexp: String!, $username: String) { ${DAO_ACTIVE_QUERY} }`,
    //   update: data => {
    //     const dao = data.queryDao[0]
    //     return {
    //       ...dao,
    //       name: dao?.details_daoName_n || '',
    //       title: dao?.settings[0]?.settings_daoTitle_s || '',
    //       icon: dao?.settings[0]?.settings_logo_s || '',
    //       isHypha: dao?.settings[0]?.settings_isHypha_i || ''
    //     }
    //   },
    //   skip () { return !this.dhoname || this.isLogged ? !this.account : '' },
    //   variables () {
    //     return {
    //       regexp: '/^' + this.dhoname + '$/i',
    //       daoUrl: this.dhoname,
    //       username: this.account
    //     }
    //   },

    //   async result (res) {
    //     const data = res?.data

    //     if (!data?.queryDao?.length) {
    //       this.daoQueryNumberOfRetires++
    //       if (this.daoQueryNumberOfRetires > MAX_NUM_OF_RETIRES) {
    //         this.$router.push({ path: '/not-found' })
    //       } else {
    //         this.$apollo.queries.dao.refetch()
    //       }
    //       return
    //     }

    //     this.$store.commit('accounts/setMember', data?.queryDao[0])
    //     this.$store.dispatch('ballots/getSupply')
    //     this.$store.commit('dao/switchDao', data)
    //     this.$store.dispatch('dao/setTheme')
    //     this.state = STATE.READY
    //   },
    //   loadingKey: 'loading',
    //   fetchPolicy: 'no-cache'
    //   // pollInterval: 300 // TODO: Swap with subscribe once dgraph is ready
    // },

    dhos: {
      query: require('../query/profile/profile-dhos.gql'),
      update: data => data?.getMember?.memberof.map(dao => ({
        name: dao.details_daoName_n,
        title: dao.settings[0].settings_daoTitle_s,
        icon: dao.settings[0].settings_logo_s,
        logo: dao.settings[0].settings_logo_s,
        isHypha: dao.settings[0].settings_isHypha_i,
        url: dao.settings[0].settings_daoUrl_s
      })),
      skip () { return !this.account },
      variables () { return { username: this.account } }
    }

    // notifications: {
    //   query: gql`query notifications { ${NOTIFICATIONS_QUERY} }`,
    //   update: data => data.queryNotification.filter(notification => !notification.archived),
    //   variables () { return { account: this.account } },
    //   skip () { return !this.account },
    //   // subscribeToMore: {
    //   //   query: gql`subscription notifications { ${NOTIFICATIONS_QUERY} }`,
    //   //   skip () { return !this.account },
    //   //   variables () { return { account: this.account } },
    //   //   updateQuery: (previousResult, { subscriptionData }) => {
    //   //     if (!subscriptionData.data) {
    //   //       return previousResult
    //   //     }
    //   //     if (!previousResult) {
    //   //       return undefined
    //   //     }
    //   //     return subscriptionData.data
    //   //   }
    //   // },
    //   fetchPolicy: 'network',
    //   pollInterval: 1000
    // }
  },

  data () {
    return {
      daoQueryNumberOfRetires: 0,
      STATE,
      state: STATE.READY,

      ROUTE_NAMES,
      timeago,
      parsedNotification,
      notifications: [],
      profile: {
        username: null,
        avatar: null,
        name: null
      },
      searchInput: '',
      left: true,
      right: true,
      showNotificationsBar: false,
      title: undefined,
      showMinimizedMenu: false,
      isActivated: false,
      languageSettings: false,
      currentLang: localStorage.getItem('lang') ? localStorage.getItem('lang') : 'en',
      autoTranslate: false,
      languages: [

        // {
        //   label: 'English (UK)',
        //   value: 'en-UK',
        //   image: require('assets/images/locales/uk.png')
        // },
        {
          label: 'English',
          value: 'en-US',
          image: require('assets/images/locales/us.png')
        },
        {
          label: 'Español',
          value: 'es',
          image: require('assets/images/locales/es.jpeg')
        },
        {
          label: 'Português (BR)',
          value: 'pt',
          image: require('assets/images/locales/pt.png')
        },
        {
          label: 'Српски',
          value: 'sr',
          image: require('assets/images/locales/sr.svg')
        },
        {
          label: 'Македонски',
          value: 'mk',
          image: require('assets/images/locales/mk.png')
        },
        {
          label: '한국인',
          value: 'ko',
          image: require('assets/images/locales/ko.png')
        },
        {
          label: '中國人',
          value: 'zh',
          image: require('assets/images/locales/zh.png')
        },
        {
          label: 'French',
          value: 'fr',
          image: require('assets/images/locales/fr.png')
        }
      ]
    }
  },

  watch: {

    dao (v) {
      if (v.icon) {
        this.updateTitle()
        this.updateFavicon()
      }
    },

    $route: {
      handler () {
        this.$refs.scrollArea.setScrollPosition('vertical', 0)
      },
      immediate: false
    },
    '$route.meta.title': {
      handler () {
        if (this.$route.meta) {
          // this.title = this.$route.meta.title
          //   ? this.$route.meta.title !== 'Search' ? this.$route.meta.title : 'Search results for "' + this.searchInput + '"'
          //   : null
          if (this.$route.meta.title) {
            if (this.$route.meta.title === 'Search') {
              const searchTitle = this.searchInput || this.$route.query.q
              this.title = searchTitle ? 'Search results for "' + searchTitle + '"' : 'Search results'
            } else {
              this.title = this.$route.meta.title
              this.searchInput = undefined
            }
          } else {
            this.title = null
          }
        }
      },
      immediate: true
    },
    searchInput: {
      handler () {
        if (this.searchInput || this.searchInput === '') {
          this.title = this.searchInput ? 'Search results for "' + this.searchInput + '"' : 'Search results'
        }
      },
      immediate: false
    },
    account: {
      async handler () {
        // await this.$nextTick()
        if (this.account) {
          this.getProfile()
          this.$store.dispatch('accounts/getHyphaOwners')
          // await this.$nextTick()
          // await this.$apollo.queries.member.setVariables({
          //   username: this.account
          // })
        } else {
          this.member = {}
        }
      },
      immediate: true
    },

    currentLang(value) {
      this.languages.forEach(option => {
        if (option.id !== value) {
          option.selected = false
        }
        this.$i18n.locale = value
        localStorage.setItem('lang', value)
        this.languageSettings = false
        window.location.reload() // solution for updating translations supplied from js
      })
    }
  },

  computed: {
    ...mapGetters('accounts', ['account', 'isApplicant', 'isAuthenticated', 'isMember', 'isAdmin', 'memberType']),
    ...mapGetters('dao', ['announcement', 'daoSettings', 'selectedDao', 'selectedDaoPlan']),
    ...mapGetters('search', ['search']),

    breadcrumbs () { return this.$route.meta ? this.$route.meta.breadcrumbs : null },

    isLoading () { return this.$apollo.queries.dhos.loading },
    status () { return this.$route.meta ? this.$route.meta.status ?? 'red' : 'red' },
    isLogged () { return localStorage.getItem('autoLogin') },

    loadingAccount () { return localStorage?.getItem('autoLogin') && !this.account },
    showTopBarItems () {
      // TODO: commented out until there is a better way to make general search work

      const exceptions = ['dao-launcher', 'explore']
      if (exceptions.includes(this.$route.name)) {
        return false
      }
      return true
    }
  },

  methods: {
    ...mapActions('dao', ['downgradeDAOPlan', 'initDAOTemplate']),
    ...mapActions('profiles', ['getPublicProfile']),
    ...mapMutations('search', ['setSearch']),

    async updateFavicon () {
      let link = document.querySelector("link[rel~='icon']")
      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        document.getElementsByTagName('head')[0].appendChild(link)
      }
      const file = await BrowserIpfs.retrieve(this.dao.icon)
      const faviconUrl = URL.createObjectURL(file.payload)
      link.href = faviconUrl
      // link.href = 'https://stackoverflow.com/favicon.ico'
    },
    async updateTitle () {
      const title = this.$route.meta.title
      document.title = `${title} - ${this.dao.title}`
      // let title = document.querySelector('title')
      // link.href = faviconUrl
      // link.href = 'https://stackoverflow.com/favicon.ico'
    },
    onContainerResize (size) {
      document.documentElement.style.setProperty('--container-width', size.width + 'px')
      if (this.$q.screen.lt.lg) {
        if (this.right) {
          this.right = false
        }
      }
    },

    async getProfile () {
      if (this.account) {
        const profile = await this.getPublicProfile(this.account)
        this.$set(this.profile, 'username', this.account)
        this.$set(this.profile, 'name', undefined)
        this.$set(this.profile, 'avatar', undefined)
        if (profile) {
          this.$set(this.profile, 'name', profile?.publicData?.name)
          this.$set(this.profile, 'avatar', profile?.publicData?.avatar)
        }
      }
    },
    async onSearch (input) {
      this.setSearch(input)
      this.$router.push({
        name: 'search',
        query: {
          q: input,
          ...this.$route.query
        }
      })
    },
    clearSearchInput () {
      const query = { ...this.$route.query, q: '' }
      this.$router.replace({ query })
      this.searchInput = ''
    },

    isActiveRoute (name) { return this.$route.name === name },

    async downgradePlan () {
      try {
        await this.downgradeDAOPlan(this.selectedDao.docId)
      } catch (error) {
      }
    },

    async setupTemplate (selected) {
      try {
        const { archetypes, circles, policies, coreBadges, communityBadges, coreVotingMethod, communityVotingMethod } = selected.details

        await this.initDAOTemplate({
          proposals: [
            ...archetypes.map(_ => ({ ..._, type: 'role' })),
            ...circles.map(_ => ({ ..._, type: 'circle' })),
            ...policies.map(_ => ({ ..._, type: 'policy' })),
            ...[...coreBadges, ...communityBadges].map(_ => ({ ..._, type: 'badge' }))
          ],
          settings: {
            votingAlignmentX100: coreVotingMethod[0].unity,
            votingQuorumX100: coreVotingMethod[0].quorum,
            communityVotingAlignmentPercent: communityVotingMethod[0].unity,
            communityVotingQuorumPercent: communityVotingMethod[0].quorum
          }
        })

        // TODO we are going to change this flow so local stroage flag is temp.
        this.isActivated = true
        localStorage?.setItem('isActivated', true)

        this.$router.push({ name: 'agreements' })
      } catch (error) {

      }
    },

    countObjectsWithKeyValue(array, key, value) {
      if (!array) return 0

      let count = 0
      array.forEach(obj => {
        if (obj[key] === value) {
          count++
        }
      })
      return count
    },
    readNotification (id) {
      this.$apollo.mutate({
        mutation: gql`mutation($id: [ID!]) {
          updateNotification(input: {set: {read: true}, filter: {id: $id}}) {
            notification {
              read
            }
          }
        }`,
        variables: {
          id: id
        }
      })
      this.$apollo.queries.notifications.refetch()
    },
    clearAllNotifications () {
      this.notifications.forEach(notification => {
        this.$apollo.mutate({
          mutation: gql`mutation($id: [ID!]) {
            updateNotification(input: {set: {archived: true}, filter: {id: $id}}) {
              notification {
                archived
              }
            }
          }`,
          variables: {
            id: notification.id
          }
        })
      })
      this.$apollo.queries.notifications.refetch()
    },
    goToProposal (notification) {
      const proposal = JSON.parse(notification.content).proposalId
      if (proposal) {
        this.$router.push({ path: `/${this.selectedDao?.name}/proposals/${proposal}` })
      }
    }
  }

}
</script>

<template lang="pug">
.multi-dho-layout
  .spinner(v-if="state === STATE.LOADING")
  div(v-else)
    q-layout(:style="{ 'min-height': 'inherit' }" :view="'lHr Lpr lFr'" ref="layout")
      q-dialog(:value="selectedDaoPlan.hasExpired && $route.name !== 'configuration' && $route.name !== 'login'" persistent="persistent")
      div.absolute.full-width.full-height.bg-black(v-if="languageSettings" @click="languageSettings = false" :style="{ 'opacity': '.4', 'z-index': '2000' }")
      div.absolute.full-width.full-height.bg-black(v-if="showNotificationsBar" @click="showNotificationsBar = false" :style="{ 'opacity': '.4', 'z-index': '2000' }")
      //- templates-modal(:isOpen="!isActivated" @submit="setupTemplate")
      q-dialog(:value="selectedDaoPlan.hasExpired && $route.name !== 'configuration' && $route.name !== 'login'" persistent)
        .bg-negative.rounded-border(:style="{'min-width':'680px'}")
          header.q-px-xl.q-py-md.row.h-h4.text-white(:class="{'justify-between h-h5': !$q.screen.gt.sm }" :style="{'border-bottom': '2px solid rgba(255, 255, 255, .2)'}")
            div(:class="{'q-pr-md': $q.screen.gt.sm }") {{ $t('layouts.multidholayout.plan', { '1': selectedDaoPlan.name }) }}
              span.text-weight-500.q-pl-xxs {{ $t('layouts.multidholayout.suspended') }}
            div(:class="{'q-px-sm': $q.screen.gt.sm }")
              .full-height(:style="{'width': '2px', 'background': 'rgba(255, 255, 255, .2)' }")
            .row.items-center.q-gutter-x-sm(v-if="$q.screen.gt.sm" :class="{'q-pl-xl': $q.screen.gt.sm }")
              q-icon(name="fas fa-exclamation-triangle" size="sm")
              span {{ $t('layouts.multidholayout.actionRequired') }}
          section.q-px-xl.q-py-md
            h3.q-pa-none.q-ma-none.h-h2.text-white.text-weight-700 {{ $t('layouts.multidholayout.reactivateYourDao') }}
            p.h-b1.text-white.q-my-lg.text-weight-300 {{ $t('layouts.multidholayout.weHaveTemporarily') }}
          nav.q-px-xl.q-pb-xl.full-width.row
            .col-6.q-pr-xs
              q-btn.q-px-xl.rounded-border.text-bold.full-width(@click="downgradePlan" :label="$t('layouts.multidholayout.downgradeMeTo')" no-caps outline rounded text-color="white" unelevated)
            .col-6.q-pl-xs
              q-btn.q-px-xl.rounded-border.text-bold.full-width(:to="{ name: 'configuration', query: { tab: 'PLAN' } }" color="white" text-color="negative" :label="$t('layouts.multidholayout.renewMyCurrentPlan')" no-caps rounded unelevated)
      //- Because iOS z-index doesn`t work
      router-view(v-if="$router.currentRoute.name === 'proposal-create' && $q.screen.lt.md")
      q-header.bg-white(v-if="$q.screen.lt.lg && $route.name !== ROUTE_NAMES.PROPOSAL_DETAIL && $route.name !== ROUTE_NAMES.CREATE_YOUR_DAO")
        top-navigation(
          :dho="dao"
          :dhos="dhos"
          :selectedDaoPlan="selectedDaoPlan"
          @search="onSearch"
          :notifications="notifications"
          :profile="profile"
          :showTopButtons="showTopBarItems"
          :unreadNotifications="countObjectsWithKeyValue(notifications, 'read', false)"
          @isActiveRoute="isActiveRoute"
          @openNotifications="languageSettings = false, right = false, showNotificationsBar = true"
          @showLangSettings="languageSettings = true, right = false"
          @toggle-sidebar="!$q.screen.md ? right = true : showMinimizedMenu = true"
          )
      q-page-container.bg-white.window-height.q-py-sm(:class="{ 'q-pr-sm': $q.screen.gt.md, 'q-px-xs': !$q.screen.gt.md}")
        .bg-internal-bg.content.full-height
          q-resize-observer(@resize="onContainerResize")
          q-scroll-area#multi-dho-scroll-area.full-height(:thumb-style=" { 'opacity': '0' }" ref="scrollArea")
            .row.full-width
              .col.margin-min(v-if="$q.screen.gt.sm")
              .col-auto.q-py-md(:class="{'full-width': !$q.screen.gt.sm}")
                .main(:class="{'q-pt-lg': $q.screen.gt.sm, 'full-width': !$q.screen.gt.sm, 'q-px-md': !$q.screen.gt.sm }")
                  .row.full-width.items-center.justify-between
                    // navigation-header
                    .col-auto
                      .row(v-if="breadcrumbs")
                        router-link.text-primary.text-underline.text-weight-600(:to="breadcrumbs.tab.link") {{ breadcrumbs.tab.name }}
                      .row
                        .h-h3(v-if="title") {{ title }}
                    .col(v-if="showTopBarItems")
                      .row.justify-end.items-center(v-if="$q.screen.gt.md")
                        .notifications-icon
                          .notifications-icon__counter(v-if="countObjectsWithKeyValue(notifications, 'read', false) > 0") {{ countObjectsWithKeyValue(notifications, 'read', false) }}
                          //- q-btn.q-mr-xs(@click="languageSettings = false, right = false, showNotificationsBar = true" unelevated rounded padding="12px" icon="far fa-bell"  size="sm" :color="'white'" :text-color="'primary'")
                        router-link(v-if="selectedDaoPlan.isEcosystem" :to="{ name: 'ecosystem' }")
                          q-btn.q-mr-xs(unelevated rounded padding="12px" icon="fas fa-share-alt" size="sm" :color="isActiveRoute('ecosystem') ? 'primary' : 'white'" :text-color="isActiveRoute('ecosystem') ? 'white' : 'primary'")
                        router-link(:to="{ name: 'configuration' }")
                          q-btn.q-mr-xs(unelevated rounded padding="12px" icon="fas fa-cog"  size="sm" :color="isActiveRoute('configuration') ? 'primary' : 'white'" :text-color="isActiveRoute('configuration') ? 'white' : 'primary'" )
                        router-link.q-mr-sm(:to="{ name: 'support' }")
                          q-btn(unelevated rounded padding="12px" icon="fas fa-question-circle"  size="sm" :color="isActiveRoute('support') ? 'primary' : 'white'" :text-color="isActiveRoute('support') ? 'white' : 'primary'")
                        q-separator.q-mr-sm(vertical inset)
                        q-btn(@click="languageSettings = true, right = false" unelevated rounded padding="12px" icon="fas fa-globe"  size="sm" :color="'white'" :text-color="'primary'")
                        //- q-input.q-mx-md.search(
                        //-   v-model="searchInput"
                        //-   placeholder="Search the whole DAO"
                        //-   outlined
                        //-   bg-color="white"
                        //-   dense
                        //-   debounce="500"
                        //-   @input="onSearch(searchInput)"
                        //- )
                        //-   template(v-slot:prepend)
                        //-     q-icon(size="xs" color="primary" name="fas fa-search")
                        //-   template(v-slot:append v-if="searchInput")
                        //-     q-icon(size="xs" name="fas fa-times" @click="clearSearchInput")
                    guest-menu.q-ml-md(v-if="!account && !loadingAccount && showTopBarItems" :daoName="dao?.url")
                    non-member-menu.q-ml-md(v-if="!isMember && !isApplicant && account && !loadingAccount && showTopBarItems" :registrationEnabled="daoSettings.registrationEnabled")
                    q-btn.profile-button.q-ml-xs.q-mr-md(v-if="$q.screen.gt.md && !right && !loadingAccount" flat round @click="right = true")
                      profile-picture(v-bind="profile" size="36px" v-if="account")
                      profile-picture(username="g" size="36px" v-if="!account" textOnly="textOnly")
                    q-dialog.relative(:value="showMinimizedMenu" @hide="showMinimizedMenu = false" position="right")
                      widget.absolute.z-top.quick-links.bg-white.q-pa-sm(v-if="$q.screen.md" :style="{ 'border-radius': '25px', 'box-shadow': '0px 0px 16px #0000000F', 'width': '338px', 'top': '60px', 'right': '20px' }")
                        .h-h4 {{ account }}
                        q-chip.q-mb-sm(color="primary" :dense="true" :ripple="false" size="16px" text-color="white")
                          .h-b2.text-white {{ $t('layouts.multidholayout.member', { '1': memberType }) }}
                        quick-links.q-py-sm(:username="profile.username" :isMember="isMember" :isAuthenticated="isAuthenticated")
                  .row.full-width.q-my-md
                  keep-alive(include="page-members,page-proposals,page-explore")
                    router-view
              .col.margin-min(v-if="$q.screen.gt.sm")
      q-drawer.full-width(v-model="right" side="right" :width="$q.screen.gt.lg ? 370 : ($q.screen.md ? 400 : ($q.screen.gt.sm ?  140 : $q.screen.width))" v-if="$q.screen.gt.lg || account || !$q.screen.gt.sm" persistent)
      q-drawer(v-model="languageSettings" overlay side="right" :width="$q.screen.gt.lg ? 370 : ($q.screen.md || $q.screen.gt.sm ? 400 : $q.screen.width)").full-width
        div.q-pa-xl.full-height.position-relative
          .row
            .flex.full-width.justify-between.no-wrap
              .h-h3 Select your default language
              q-btn(color="internal-bg" text-color="primary" rounded unelevated size="sm" padding="12px" icon="fas fa-times" :style="{ 'height': '40px' }" @click="languageSettings = false")
            .q-mt-md.full-width
              .col(v-for="lang in languages" :key="lang.name")
                .row.q-pa-xs.items-center.flex.justify-between.q-mb-xs(:class="{ 'selected': currentLang === lang.value }")
                  .row.items-center
                    img.q-mr-sm(:src="lang.image" :style="{ 'border-radius': '50%', 'width': '30px', 'height': '30px' }")
                    .h-b2(:style="{ 'font-size': '16px' }" :class="{ 'selected-text': currentLang === lang.value }") {{ lang.label }}
                  input(
                    :value="lang.value"
                    v-model="currentLang"
                    type="radio"
                    :style="{ 'width': '20px', 'height': '20px', 'accent-color': '#242f5d', 'cursor': 'pointer' }"
                  )
      q-drawer(v-model="showNotificationsBar" overlay side="right" :width="$q.screen.gt.lg ? 370 : ($q.screen.md || $q.screen.gt.sm ? 400 : $q.screen.width)" persistent).full-width
        div.q-pa-xl.full-height
          .row
            .flex.full-width.justify-between.no-wrap
              .h-h3.items-center.flex {{ $t('notifications.notifications')}}
              q-btn(color="internal-bg" text-color="primary" rounded unelevated size="sm" padding="12px" icon="fas fa-times" :style="{ 'height': '40px' }" @click="showNotificationsBar = false")
            .q-mt-md.full-width(:style="{ 'position': 'relative' }")
              .col(v-for="notification, index in notifications" :key="notification.id")
                .row.q-py-md.cursor-pointer(@click="goToProposal(notification)" v-on:mouseover="readNotification(notification.id)" :style="{ 'border-top': '1px solid #CBCDD1' }" :class="{ 'last-item': index === notifications?.length - 1, 'read-notify': notification.read === true }")
                  .col-2.items-center.flex
                    div.flex.items-center.justify-center(:style="{ 'width': '40px', 'height': '40px', 'border-radius': '50%', 'background': '#F2F1F3'}")
                      img(:src="parsedNotification(notification).icon")
                  .col
                    .h-b2.text-bold.text-black.q-mb-xs(:style="{ 'font-size': '16px' }") {{ parsedNotification(notification).title }}
                    .h-b2 {{ parsedNotification(notification).description }}
                  .col-3.flex.items-center
                    .h-b2.text-italic {{ parsedNotification(notification).createdDate }}
              .row.bg-white.full-width(v-if="notifications?.length" :style="{ 'position': 'fixed', 'bottom': '0', 'padding-right': '60px', 'padding-bottom': '20px', 'padding-top': '20px' }")
                q-btn.full-width.q-px-xl(@click="clearAllNotifications()" color="primary" :label="$t('notifications.clearAll')" no-caps outline rounded unelevated)
          //- .translation-box.q-pa-sm(:style="{ 'position': 'absolute', 'bottom': '30px', 'right': '30px', 'left': '30px' }")
          //-   .row.items-center.q-mb-md.justify-between
          //-     .row
          //-       img.q-mr-sm(:src="require('assets/images/locales/translation.png')" :style="{ 'width': '26px', 'height': '26px' }")
          //-       .h-b2.text-bold(:style="{ 'font-size': '14px' }") Translation
          //-     q-toggle(v-model="autoTranslate" color="secondary" keep-color)
          //-   .h-b2 Automatically translate proposals and Projects to your default language
      q-drawer(v-model="right" side="right" :width="$q.screen.gt.lg ? 370 : ($q.screen.md ? 400 : ($q.screen.gt.sm ?  140 : $q.screen.width))" v-if="$q.screen.gt.lg || account || !$q.screen.gt.sm" persistent).full-width
        .row.full-width.full-height.flex.items-center.justify-center(v-if="loadingAccount")
          loading-spinner(size="120px")
        profile-sidebar(v-if="account" :profile="profile" :announcement="announcement" :dhoTitle="dao?.title" :daoName="dao?.title" @close="right = false" :isMember="isMember" :isAuthenticated="isAuthenticated" :compact="!$q.screen.gt.lg && $q.screen.gt.md" :isMobile="!$q.screen.gt.md")
        profile-sidebar-guest(v-if="!account && ($q.screen.gt.lg || !$q.screen.gt.sm) && !loadingAccount" :dhoTitle="dao?.title" :daoName="dao?.url" @close="right = false" :registrationEnabled="daoSettings.registrationEnabled")
      q-footer.bg-white(v-if="$q.screen.lt.lg && $route.name !== ROUTE_NAMES.PROPOSAL_DETAIL && $route.name !== ROUTE_NAMES.CREATE_YOUR_DAO" :style="{ height: '74px' }")
        bottom-navigation
      q-drawer(v-else-if="$q.screen.gt.md" v-model="left" side="left" :width="80" persistent="persistent" :show-if-above="true")
        left-navigation(:dho="dao" :dhos="dhos")

</template>
<style lang="stylus" scoped>
.rounded-border
  border-radius: 15px
.content
  border-radius 26px
.scroll-background
  padding-top 20px
  padding-bottom 10px
.scroll-height
  height 100vh
.search
  width 300px
  :first-child
    border-radius 12px
.main
  max-width 1270px
  @media (min-width: $breakpoint-lg)
    width calc(100vw - 520px)
  @media (min-width: $breakpoint-md) and (max-width: $breakpoint-lg)
    width calc(100vw - 290px)
  @media (min-width: $breakpoint-sm) and (max-width: $breakpoint-md)
    width calc(100vw - 64px)
  @media (max-width: $breakpoint-sm)
    width calc(100vw - 32px)
.margin-min
  min-width 8px
.selected
  background: #F2F1F3
  border-radius: 10px
.selected-text
  color: #242F5D !important
  font-weight: 700
.translation-box
  background: #F2F1F3
  border-radius: 10px
.notifications-icon
  position: relative
.notifications-icon__counter
  width: 16px
  height: 16px
  background: #EF3F69
  border-radius: 50%
  display: flex
  align-items: center
  justify-content: center
  color: #FFFFFF
  position: absolute
  z-index: 1
  right: 8px
  top: -2px
  font-size: 14px
.last-item
  margin-bottom: 80px
.read-notify
  opacity: .5
</style>
