<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'multi-dho-layout',
  components: {
    AlertMessage: () => import('~/components/navigation/alert-message.vue'),
    BottomNavigation: () => import('~/components/navigation/bottom-navigation.vue'),
    GuestMenu: () => import('~/components/navigation/guest-menu.vue'),
    LeftNavigation: () => import('~/components/navigation/left-navigation.vue'),
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue'),
    ProfileSidebar: () => import('~/components/navigation/profile-sidebar.vue'),
    TopNavigation: () => import('~/components/navigation/top-navigation.vue')
  },

  props: {
    dho: Object
  },

  apollo: {
    member: {
      // TODO: Don't do query if no account
      query: require('../query/profile/profile-dhos.gql'),
      update: data => data.queryMember,
      variables () {
        return {
          username: this.account
        }
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
      search: '',
      left: true,
      right: true
    }
  },

  computed: {
    ...mapGetters('accounts', ['isAuthenticated', 'account']),

    breadcrumbs () {
      return this.$route.meta ? this.$route.meta.breadcrumbs : null
    },

    status () {
      return this.$route.meta ? this.$route.meta.status ?? 'red' : 'red'
    },

    title () {
      return this.$route.meta ? this.$route.meta.title : null
    },

    dhos () {
      const results = []
      if (this.member && this.member.length) {
        this.member[0].memberof.forEach((dao) => {
          results.push({
            name: dao.details_daoName_n,
            title: dao.settings[0].settings_daoTitle_s
          })
        })
      }
      return results
    }
  },

  created () {
    this.getProfile()
  },

  methods: {
    ...mapActions('profiles', ['getPublicProfile']),

    async getProfile () {
      if (this.account) {
        const profile = await this.getPublicProfile(this.account)
        this.$set(this.profile, 'username', this.account)
        if (profile) {
          this.$set(this.profile, 'avatar', profile.publicData.avatar)
          this.$set(this.profile, 'name', profile.publicData.name)
        }
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
    left-navigation(:dho="dho" :dhos="dhos")
  q-page-container.bg-white.window-height.q-py-md(:class="{ 'q-pr-md': $q.screen.gt.sm }")
    .scroll-background.bg-grey-4.content.full-height
      q-scroll-area.full-height(:thumb-style=" { 'border-radius': '6px' }")
        .row.full-width
          .col.margin-min
          .col-auto
            .main(:class="{'q-pt-lg': $q.screen.gt.sm }")
              .row.full-width.items-center.justify-between
                // navigation-header
                .col-auto
                  .text-h6(v-if="title") {{ title }}
                .col
                  .row.justify-end.items-center
                    q-btn(unelevated rounded padding="12px" icon="far fa-question-circle"  size="sm" color="white" text-color="primary")
                    q-input.q-ml-md.search(
                      v-if="$q.screen.gt.sm"
                      v-model="search"
                      placeholder="Search the DHO"
                      outlined
                      bg-color="white"
                      dense
                    )
                      template(v-slot:prepend)
                        q-icon(size="xs" color="primary" name="fas fa-search")
                    guest-menu.q-ml-md(v-if="!account")
                    q-btn.q-ml-lg.q-mr-md(v-if="$q.screen.gt.sm && !right" flat round @click="right = true")
                      profile-picture(v-bind="profile" size="36px" badge="2")
              .row.full-width.q-my-md
                alert-message(:status="status")
              keep-alive(include="page-members")
                router-view
          .col.margin-min
  q-drawer(v-if="account" v-model="right" side="right" :width="370")
    profile-sidebar(v-if="account" :profile="profile" @close="right = false")
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
  max-width 1259px
  width calc(100vw - 32px)

.margin-min
  min-width 8px
</style>
