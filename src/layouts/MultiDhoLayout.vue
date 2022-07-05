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
    InputField: () => import('~/components/common/input-field.vue')
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
      title: undefined
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
    }
  },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated', 'isMember', 'isApplicant', 'account']),
    ...mapGetters('search', ['search']),
    ...mapGetters('dao', ['daoSettings']),
    breadcrumbs () {
      return this.$route.meta ? this.$route.meta.breadcrumbs : null
    },
    status () {
      return this.$route.meta ? this.$route.meta.status ?? 'red' : 'red'
    },
    dhos () {
      const member = (this.$apolloData && this.$apolloData.member) ? this.$apolloData.member : this.member
      return this.getDaos(member)
    },
    loadingAccount () {
      return localStorage?.getItem('autoLogin') && !this.account
    },
    loadingMember () {
      return localStorage?.getItem('isMember') && !this.account
    }
  },
  created () {
  },
  methods: {
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
    async onSearch () {
      this.setSearch(this.searchInput)
      this.$router.push({
        name: 'search',
        query: {
          q: this.searchInput,
          ...this.$route.query
        }
      })
    },
    clearSearchInput () {
      const query = { ...this.$route.query, q: '' }
      this.$router.replace({ query })
      this.searchInput = ''
    },

    isActiveRoute (name) { return this.$route.name === name }
  }
}
</script>
<template lang="pug">
q-layout(:style="{ 'min-height': 'inherit' }" :view="'lHr Lpr lFr'" ref="layout")
  // dho-switcher.fixed-left
  q-header.bg-white(v-if="$q.screen.lt.md")
    top-navigation(:profile="profile" @toggle-sidebar="right = true")
  q-page-container.bg-white.window-height.q-py-md(:class="{ 'q-pr-md': $q.screen.gt.sm }")
    .scroll-background.bg-internal-bg.content.full-height
      q-resize-observer(@resize="onContainerResize")
      q-scroll-area.full-height(:thumb-style=" { 'border-radius': '6px' }" ref="scrollArea")
        .row.full-width
          .col.margin-min
          .col-auto
            .main(:class="{'q-pt-lg': $q.screen.gt.sm }")
              .row.full-width.items-center.justify-between
                // navigation-header
                .col-auto
                  .row(v-if="breadcrumbs")
                    router-link.text-primary.text-underline.text-weight-600(:to="breadcrumbs.tab.link") {{ breadcrumbs.tab.name }}
                  .row
                    .h-h3(v-if="title") {{ title }}
                .col
                  .row.justify-end.items-center
                    q-btn.q-mr-xs(:to="{ name: 'configuration' }" unelevated rounded padding="12px" icon="fas fa-cog"  size="sm" :color="isActiveRoute('configuration') ? 'primary' : 'white'" :text-color="isActiveRoute('configuration') ? 'white' : 'primary'" )
                    q-btn(:to="{ name: 'support' }" unelevated rounded padding="12px" icon="far fa-question-circle"  size="sm" color="white" text-color="primary")
                    input-field.q-ml-md.search(
                      v-if="$q.screen.gt.sm"
                      v-model="searchInput"
                      placeholder="Search the whole DAO"
                      outlined
                      bg-color="white"
                      dense
                      debounce="500"
                      @input="onSearch()"
                    )
                      template(v-slot:prepend)
                        q-icon(size="xs" color="primary" name="fas fa-search")
                      template(v-slot:append v-if="searchInput")
                        q-icon(size="xs" name="fas fa-times" @click="clearSearchInput")
                guest-menu.q-ml-md(v-if="!account && !loadingAccount" :daoName="daoName")
                non-member-menu.q-ml-md(v-if="!isMember && !isApplicant && account && !loadingAccount && !loadingMember", :registrationEnabled="daoSettings.registrationEnabled")
                q-btn.q-ml-lg.q-mr-md(v-if="$q.screen.gt.sm && !right && !loadingAccount" flat round @click="right = true")
                  profile-picture(v-bind="profile" size="36px" v-if="account")
                  profile-picture(username="g" size="36px" v-if="!account" textOnly)
              .row.full-width.q-my-md
              //-   alert-message(:status="status")
              keep-alive(include="page-members,page-proposals,page-explore")
                router-view
          .col.margin-min
  q-drawer(v-model="right" side="right" :width="$q.screen.gt.lg ? 370 : 140" v-if="$q.screen.gt.lg || account" persistent :show-if-above="true")
    .row.full-width.full-height.flex.items-center.justify-center(v-if="loadingAccount")
      loading-spinner(size="120px")
    profile-sidebar(v-if="account" :profile="profile" :daoName="daoName" @close="right = false" :isMember="isMember" :compact="!$q.screen.gt.lg")
    profile-sidebar-guest(v-if="!account && $q.screen.gt.lg && !loadingAccount" :daoName="daoName" @close="right = false" :registrationEnabled="daoSettings.registrationEnabled")
  q-footer.bg-white(v-if="$q.screen.lt.md" :style="{ height: '74px' }")
    bottom-navigation
  q-drawer(v-else v-model="left" side="left" :width="80" persistent :show-if-above="true")
    left-navigation(:dho="dho" :dhos="getDaos($apolloData.data.member)")
</template>
<style lang="stylus" scoped>
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
    width calc(100vw - 290px)
  @media (max-width: $breakpoint-sm)
    width calc(100vw - 32px)
.margin-min
  min-width 8px
</style>
