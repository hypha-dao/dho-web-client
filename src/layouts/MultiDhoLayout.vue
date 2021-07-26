<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'multi-dho-layout',
  components: {
    DhoSwitcher: () => import('~/components/navigation/dho-switcher.vue'),
    GuestMenu: () => import('~/components/navigation/guest-menu.vue'),
    LeftNavigation: () => import('~/components/navigation/left-navigation.vue'),
    NavigationHeader: () => import('~/components/navigation/navigation-header.vue'),
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue'),
    ProfileSidebar: () => import('~/components/navigation/profile-sidebar.vue')
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
    ...mapGetters('accounts', ['isAuthenticated', 'account'])
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
q-layout(:style="{ 'min-height': 'inherit' }" view="lHr Lpr lFr" ref="layout")
  // dho-switcher.fixed-left
  left-navigation.fixed-left
  q-page-container.bg-grey-4.content(:style="{ 'margin-right': (right && account) ? '280px' : '20px' }")
    .scroll-background.full-height
      q-scroll-area.scroll-height(:thumb-style=" { 'border-radius': '6px' }")
        .row.full-width.items-center.justify-between.q-my-sm.q-mb-lg.q-px-xl
          .col-6
            q-breadcrumbs(align="left")
              q-breadcrumbs-el(:to="{ name: 'dho-home' }" label="Hypha DHO")
              q-breadcrumbs-el(label="Dashboard")
            // navigation-header
          .col-6
            .row.justify-end
              q-input.search(
                v-model="search"
                placeholder="Search"
                rounded
                outlined
                bg-color="white"
                dense
              )
              guest-menu.q-ml-md(v-if="!account")
              q-btn.q-ml-xl(v-if="!right" flat round @click="right = true")
                profile-picture(v-bind="profile" size="36px")
        router-view
  profile-sidebar.fixed-right(v-if="right && account" :profile="profile" @close="right = false")
</template>

<style lang="stylus" scoped>
.content
  border-radius 26px
  margin-left 80px
  margin-top 20px
  margin-bottom 20px

.scroll-background
  padding-top 20px
  padding-bottom 20px

.scroll-height
  height calc(100vh - 80px)

.search
  width 272px
</style>
