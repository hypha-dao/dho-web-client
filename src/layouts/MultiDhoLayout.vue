<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import BrowserIpfs from '~/ipfs/browser-ipfs.js'
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
    dho: Object,
    daoName: String
  },

  apollo: {
    member: {
      query: require('../query/profile/profile-dhos.gql'),
      update: data => {
        return data.getMember
      },
      variables () {
        return {
          username: this.account
        }
      },
      skip () {
        return !this.account
      }
    }
  },

  data () {
    return {
      profile: {
        username: null,
        avatar: null,
        name: null
      },
      searchInput: '',
      left: true,
      right: true,
      title: undefined,
      showMinimizedMenu: false,
      isActivated: false,
      languageSettings: false,
      currentLang: localStorage.getItem('lang') ? localStorage.getItem('lang') : 'en',
      autoTranslate: false,
      languages: [
        // {
        //   label: 'Српски',
        //   value: 'sr',
        //   image: require('assets/images/locales/sr.svg')
        // },
        {
          label: 'English (UK)',
          value: 'en-UK',
          image: require('assets/images/locales/uk.png')
        },
        {
          label: 'English (US)',
          value: 'en-US',
          image: require('assets/images/locales/us.png')
        },
        // {
        //   label: 'Español',
        //   value: 'es',
        //   image: require('assets/images/locales/es.jpeg')
        // },
        {
          label: 'Português (BR)',
          value: 'pt',
          image: require('assets/images/locales/pt.png')
        }
        // {
        //   label: '한국인',
        //   value: 'ko',
        //   image: require('assets/images/locales/ko.png')
        // },
        // {
        //   label: '中國人',
        //   value: 'zh',
        //   image: require('assets/images/locales/zh.png')
        // }
      ]
    }
  },

  watch: {
    dho (v) {
      if (v.icon) {
        this.updateTitle()
        this.updateFavicon()
      }
    },
    '$apolloData.data.member': {
      handler () {
      },
      immediate: true
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
        await this.$nextTick()
        if (this.account) {
          this.getProfile()
          this.$store.dispatch('accounts/checkMembership')
          this.$store.dispatch('accounts/getHyphaOwners')
          await this.$nextTick()
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
      })
    }
  },

  computed: {
    ...mapGetters('accounts', ['account', 'isApplicant', 'isAuthenticated', 'isMember', 'isAdmin', 'memberType']),
    ...mapGetters('dao', ['announcement', 'daoSettings', 'selectedDao', 'selectedDaoPlan']),
    ...mapGetters('search', ['search']),

    breadcrumbs () { return this.$route.meta ? this.$route.meta.breadcrumbs : null },

    status () { return this.$route.meta ? this.$route.meta.status ?? 'red' : 'red' },

    dhos () {
      const member = (this.$apolloData && this.$apolloData.member) ? this.$apolloData.member : this.member
      return this.getDaos(member)
    },

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
      const file = await BrowserIpfs.retrieve(this.dho.icon)
      const faviconUrl = URL.createObjectURL(file.payload)
      link.href = faviconUrl
      // link.href = 'https://stackoverflow.com/favicon.ico'
    },
    async updateTitle () {
      const title = this.$route.meta.title
      document.title = `${title} - ${this.dho.title}`
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
    getDaos (member) {
      const results = []
      if (member) {
        member.memberof?.forEach((dao) => {
          results.push({
            name: dao.details_daoName_n,
            title: dao.settings[0].settings_daoTitle_s,
            icon: dao.settings[0].settings_logo_s,
            logo: dao.settings[0].settings_logo_s,
            isHypha: dao.settings[0].settings_isHypha_i,
            url: dao.settings[0].settings_daoUrl_s
          })
        })
      }
      return results
    },
    async getProfile () {
      if (this.account) {
        const profile = await this.getPublicProfile(this.account)
        this.$set(this.profile, 'username', this.account)
        this.$set(this.profile, 'name', undefined)
        this.$set(this.profile, 'avatar', undefined)
        if (profile) {
          this.$set(this.profile, 'name', profile.publicData.name)
          this.$set(this.profile, 'avatar', profile.publicData.avatar)
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

        this.$router.push({ name: 'proposals' })
      } catch (error) {

      }
    }
  }
}
</script>

<template lang="pug">
q-layout(:style="{ 'min-height': 'inherit' }" :view="'lHr Lpr lFr'" ref="layout")
  q-dialog(:value="selectedDaoPlan.hasExpired && $route.name !== 'configuration' && $route.name !== 'login'" persistent="persistent")
  div.absolute.full-width.full-height.bg-black(v-if="languageSettings" @click="languageSettings = false" :style="{ 'opacity': '.4', 'z-index': '2000' }")
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
          q-btn.q-px-xl.rounded-border.text-bold.full-width(@click="downgradePlan" :label="$t('layouts.multidholayout.downgradeMeTo')" no-caps="no-caps" outline="outline" rounded="rounded" text-color="white" unelevated="unelevated")
        .col-6.q-pl-xs
          q-btn.q-px-xl.rounded-border.text-bold.full-width(:to="{ name: 'configuration', query: { tab: 'PLAN' } }" color="white" text-color="negative" :label="$t('layouts.multidholayout.renewMyCurrentPlan')" no-caps="no-caps" rounded="rounded" unelevated="unelevated")
  q-header.bg-white(v-if="$q.screen.lt.lg")
    top-navigation(@isActiveRoute="isActiveRoute" @showLangSettings="languageSettings = true, right = false" :showTopButtons="showTopBarItems" :profile="profile" @toggle-sidebar="!$q.screen.md ? right = true : showMinimizedMenu = true" @search="onSearch" :dho="dho" :dhos="getDaos($apolloData.data.member)" :selectedDaoPlan="selectedDaoPlan")
  q-page-container.bg-white.window-height.q-py-sm(:class="{ 'q-pr-sm': $q.screen.gt.md, 'q-px-xs': !$q.screen.gt.md}")
    .bg-internal-bg.content.full-height
      q-resize-observer(@resize="onContainerResize")
      q-scroll-area#multi-dho-scroll-area.full-height(:thumb-style=" { 'opacity': '0' }" ref="scrollArea" :class="{ 'q-px-md': !$q.screen.gt.sm}")
        .row.full-width
          .col.margin-min(v-if="$q.screen.gt.sm")
          .col-auto.q-py-md(:class="{'full-width': !$q.screen.gt.sm}")
            .main(:class="{'q-pt-lg': $q.screen.gt.sm, 'full-width': !$q.screen.gt.sm}")
              .row.full-width.items-center.justify-between
                // navigation-header
                .col-auto
                  .row(v-if="breadcrumbs")
                    router-link.text-primary.text-underline.text-weight-600(:to="breadcrumbs.tab.link") {{ breadcrumbs.tab.name }}
                  .row
                    .h-h3(v-if="title") {{ title }}
                .col(v-if="showTopBarItems")
                  .row.justify-end.items-center(v-if="$q.screen.gt.md")
                    router-link(v-if="selectedDaoPlan.isEcosystem" :to="{ name: 'ecosystem' }")
                      q-btn.q-mr-xs(unelevated="unelevated" rounded="rounded" padding="12px" icon="fas fa-share-alt" size="sm" :color="isActiveRoute('ecosystem') ? 'primary' : 'white'" :text-color="isActiveRoute('ecosystem') ? 'white' : 'primary'")
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
                guest-menu.q-ml-md(v-if="!account && !loadingAccount && showTopBarItems" :daoName="daoName")
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
  q-drawer.full-width(v-model="right" side="right" :width="$q.screen.gt.lg ? 370 : ($q.screen.md ? 400 : ($q.screen.gt.sm ?  140 : $q.screen.width))" v-if="$q.screen.gt.lg || account || !$q.screen.gt.sm" persistent="persistent" :show-if-above="false")
  q-drawer(v-model="languageSettings" overlay side="right" :width="$q.screen.gt.lg ? 370 : ($q.screen.md || $q.screen.gt.sm ? 400 : $q.screen.width)" :show-if-above="true").full-width
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
      .translation-box.q-pa-sm(:style="{ 'position': 'absolute', 'bottom': '30px', 'right': '30px', 'left': '30px' }")
        .row.items-center.q-mb-md.justify-between
          .row
            img.q-mr-sm(:src="require('assets/images/locales/translation.png')" :style="{ 'width': '26px', 'height': '26px' }")
            .h-b2.text-bold(:style="{ 'font-size': '14px' }") Translation
          q-toggle(v-model="autoTranslate" color="secondary" keep-color)
        .h-b2 Automatically translate proposals and Projects to your default language
  q-drawer(v-model="right" side="right" :width="$q.screen.gt.lg ? 370 : ($q.screen.md ? 400 : ($q.screen.gt.sm ?  140 : $q.screen.width))" v-if="$q.screen.gt.lg || account || !$q.screen.gt.sm" persistent :show-if-above="false").full-width
    .row.full-width.full-height.flex.items-center.justify-center(v-if="loadingAccount")
      loading-spinner(size="120px")
    profile-sidebar(v-if="account" :profile="profile" :announcement="announcement" :daoName="daoName" @close="right = false" :isMember="isMember" :isAuthenticated="isAuthenticated" :compact="!$q.screen.gt.lg && $q.screen.gt.md" :isMobile="!$q.screen.gt.md")
    profile-sidebar-guest(v-if="!account && ($q.screen.gt.lg || !$q.screen.gt.sm) && !loadingAccount" :daoName="daoName" @close="right = false" :registrationEnabled="daoSettings.registrationEnabled")
  q-footer.bg-white(v-if="$q.screen.lt.lg" :style="{ height: '74px' }")
    bottom-navigation
  q-drawer(v-else v-model="left" side="left" :width="80" persistent="persistent" :show-if-above="true")
    left-navigation(:dho="dho" :dhos="getDaos($apolloData.data.member)")

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
</style>
