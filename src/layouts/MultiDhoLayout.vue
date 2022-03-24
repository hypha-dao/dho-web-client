<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
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
    TopNavigation: () => import('~/components/navigation/top-navigation.vue')
  },

  props: {
    dho: Object,
    daoName: String
  },

  apollo: {
    member: {
      query: require('../query/profile/profile-dhos.gql'),
      update: data => {
        // console.log('update query', data.getMember)
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
    '$apolloData.data.member': {
      handler () {
        // console.log('member changed', this.member)
      },
      immediate: true
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
              this.title = 'Search results for "' + searchTitle + '"'
            } else {
              this.title = this.$route.meta.title
            }
          } else {
            this.title = null
          }
        }
        this.searchInput = undefined
      },
      immediate: true
    },
    searchInput: {
      handler () {
        if (this.searchInput && this.searchInput.length > 0) {
          this.title = 'Search results for "' + this.searchInput + '"'
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
    breadcrumbs () {
      return this.$route.meta ? this.$route.meta.breadcrumbs : null
    },

    status () {
      return this.$route.meta ? this.$route.meta.status ?? 'red' : 'red'
    },

    dhos () {
      const member = (this.$apolloData && this.$apolloData.member) ? this.$apolloData.member : this.member
      return this.getDaos(member)
    }
  },

  created () {
  },

  methods: {
    ...mapActions('profiles', ['getPublicProfile']),
    ...mapMutations('search', ['setSearch']),
    onContainerResize (size) {
      document.documentElement.style.setProperty('--container-width', size.width + 'px')
    },
    getDaos (member) {
      const results = []
      // console.log('dhos', member, this.member, this.$apolloData.member)

      if (member) {
        // console.log('maping daos')
        member.memberof?.forEach((dao) => {
          results.push({
            name: dao.details_daoName_n,
            title: dao.settings[0].settings_daoTitle_s
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
      if (this.searchInput && this.searchInput.length > 0) {
        this.setSearch(this.searchInput)
        this.$router.push({
          name: 'search',
          query: {
            q: this.searchInput
          }
        })
      }
    }
  }

}
</script>

<template lang="pug">
q-layout(:style="{ 'min-height': 'inherit' }" :view="'lHr Lpr lFr'" ref="layout")
  // dho-switcher.fixed-left
  q-header.bg-white(v-if="$q.screen.lt.md")
    top-navigation(:profile="profile" @toggle-sidebar="right = true")
  q-drawer(v-if="$q.screen.gt.sm" v-model="left" :width="80")
    left-navigation(:dho="dho" :dhos="getDaos($apolloData.data.member)")
  q-page-container.bg-white.window-height.q-py-md(:class="{ 'q-pr-md': $q.screen.gt.sm }")
    .scroll-background.bg-internal-bg.content.full-height
      q-resize-observer(@resize="onContainerResize")
      q-scroll-area.full-height(:thumb-style=" { 'border-radius': '6px' }")
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
                    q-btn(:to="{ name: 'support' }" unelevated rounded padding="12px" icon="far fa-question-circle"  size="sm" color="white" text-color="primary")
                    q-input.q-ml-md.search(
                      v-if="$q.screen.gt.sm"
                      v-model="searchInput"
                      placeholder="Search the whole DHO"
                      outlined
                      bg-color="white"
                      dense
                      debounce="500"
                      @input="onSearch()"
                    )
                      template(v-slot:prepend)
                        q-icon(size="xs" color="primary" name="fas fa-search")
                guest-menu.q-ml-md(v-if="!account" :daoName="daoName")
                non-member-menu.q-ml-md(v-if="!isMember && !isApplicant && account")
                q-btn.q-ml-lg.q-mr-md(v-if="$q.screen.gt.sm && !right" flat round @click="right = true")
                  profile-picture(v-bind="profile" size="36px" v-if="account")
                  profile-picture(username="g" size="36px" v-if="!account" textOnly)
              .row.full-width.q-my-md
              //-   alert-message(:status="status")
              keep-alive(include="page-members,page-proposals,page-explore")
                router-view
          .col.margin-min
  q-drawer(v-model="right" side="right" :width="370")
    profile-sidebar(v-if="account" :profile="profile" :daoName="daoName" @close="right = false" :isMember="isMember")
    profile-sidebar-guest(v-if="!account" :profile="profile" :daoName="daoName" @close="right = false")
  q-footer.bg-white(v-if="$q.screen.lt.md" :style="{ height: '74px' }")
    bottom-navigation
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
  width calc(100vw - 32px)

.margin-min
  min-width 8px
</style>
