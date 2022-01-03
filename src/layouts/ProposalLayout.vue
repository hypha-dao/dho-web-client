<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'proposal-layout',
  components: {
    AlertMessage: () => import('~/components/navigation/alert-message.vue'),
    ProfileSidebar: () => import('~/components/navigation/profile-sidebar.vue'),
    TopNavigation: () => import('~/components/navigation/top-navigation.vue')
  },

  data () {
    return {
      profile: {
        username: null,
        avatar: null,
        name: null
      },
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
        if (profile) {
          this.$set(this.profile, 'username', this.account)
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
  q-header.bg-white
    top-navigation(:profile="profile" @toggle-sidebar="right = true")
  q-page-container.bg-white.window-height(:class="{ 'q-pr-md': $q.screen.gt.sm }")
    .scroll-background.bg-grey-4.content.full-height(:style="{ 'padding-bottom': '210px' }")
      q-scroll-area.full-height(:thumb-style=" { 'border-radius': '6px' }")
        .row.full-width
          .col.margin-min
          .col-auto
            .main
              .row.full-width.q-my-md
                alert-message(:status="status")
              router-view
          .col.margin-min
  q-drawer(v-model="right" overlay side="right" :width="370")
    profile-sidebar(v-if="account" :profile="profile" @close="right = false")
</template>

<style lang="stylus" scoped>
.content
  border-top-left-radius 26px
  border-top-right-radius 26px

.scroll-background
  padding-top 20px

.scroll-height
  height 100vh

.main
  width calc(100vw - 32px)

.margin-min
  min-width 8px
</style>
