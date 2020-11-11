<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import RightMenuGuest from '~/components/layout/right-menu-guest'
import RightMenuAuthenticated from '~/components/layout/right-menu-authenticated'
import LeftMenu from '~/components/layout/left-menu'
import RightSidebar from '~/components/layout/right-sidebar'
import Trianglify from 'trianglify'
import { dom, Notify } from 'quasar'
const { height, width } = dom

export default {
  name: 'main-layout',
  components: { RightMenuGuest, RightMenuAuthenticated, LeftMenu, RightSidebar },
  data () {
    return {
      reveal: false,
      left: !this.$q.platform.is.mobile
    }
  },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated', 'account']),
    ...mapGetters('layout', ['rightSidebarType', 'breadcrumbs']),
    ...mapGetters('notifications', ['successCount', 'errorCount'])
  },
  methods: {
    ...mapMutations('notifications', ['initNotifications', 'unmarkRead', 'unmarkNew']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    ...mapActions('periods', ['fetchPeriods']),
    ...mapActions('accounts', ['autoLogin', 'lightWalletLogin']),
    toggleNotifications () {
      if (this.rightSidebarType === 'notifications') {
        this.unmarkRead()
        this.setShowRightSidebar(false)
        this.setRightSidebarType(null)
      } else {
        this.setShowRightSidebar(true)
        this.setRightSidebarType('notifications')
      }
    }
  },
  async mounted () {
    let colors = 'Greys'
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 8) {
      colors = 'YlOrRd'
    } else if (hour >= 8 && hour < 11) {
      colors = 'OrRd'
    } else if (hour >= 11 && hour < 14) {
      colors = 'Blues'
    } else if (hour >= 14 && hour < 17) {
      colors = 'BuPu'
    } else if (hour >= 17 && hour < 18) {
      colors = 'PuRd'
    } else if (hour >= 18 && hour < 19) {
      colors = 'RdPu'
    }
    const pattern = Trianglify({
      width: width(this.$refs.layout.$el),
      height: height(this.$refs.layout.$el),
      xColors: colors,
      yColors: 'match'
    })
    pattern.toSVG(document.getElementById('bg'))

    this.initNotifications()
    await this.fetchPeriods()

    this.lightWalletLogin()

    if (!await this.autoLogin(this.$router.currentRoute.path)) {
      if (!localStorage.getItem('known-user') && this.$router.currentRoute.path !== '/welcome') {
        await this.$router.push({ path: '/welcome' })
      } else if (this.$router.currentRoute.path === '/') {
        await this.$router.push({ path: '/dashboard' })
      }
    }
    if (localStorage.getItem('refreshNotif')) {
      localStorage.removeItem('refreshNotif')
      Notify.create({
        color: 'orange',
        message: 'An update is available, please refresh.',
        position: 'bottom',
        icon: 'fas fa-warning notif-icon',
        timeout: 30000,
        actions: [
          { label: 'Refresh', color: 'white', handler: () => { document.location.reload(true) } }
        ]
      })
    }
  },
  watch: {
    '$route.meta.single': {
      immediate: true,
      handler (val) {
        this.reveal = !val
      }
    }
  }
}
</script>

<template lang="pug">
q-layout(
  view="lHr lpR fFf"
  ref="layout"
)
  svg#bg
  router-link.q-ml-sm.float-left.logo(to="/" style="display:block;margin-top:8px")
    img(
      src="~assets/logos/hypha-logo-light.png"
      style="width:150px;"
      :class="{ 'mobile-logo': $q.screen.lt.sm}"
    )
  transition(
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  )
    div(
      v-if="reveal"
    )
      q-header.bg-none(
        reveal
        :class="{ 'mobile-header': !$q.platform.is.desktop }"
      )
        q-toolbar
          q-toolbar-title.q-mt-xs.flex.items-center
            q-btn.float-left(
              icon="fas fa-bars"
              dense
              round
              unelevated
              color="white"
              text-color="black"
              @click="left = !left"
              :size="$q.platform.is.desktop ? '18px' : '16px'"
              :style="{ marginTop: $q.platform.is.desktop ? '8px' : '0' }"
            )
            .breadcrumb(
              :class="{ 'mobile-breadcrumb': !$q.platform.is.desktop }"
            )
              q-icon.bg-white.map-marked(
                name="fas fa-map-marker-alt"
                :size="$q.platform.is.desktop ? '30px' : '16px'"
                :class="{ 'mobile-map-marked': !$q.platform.is.desktop }"
                color="black"
              )
              router-link.link(to="/dashboard").text-black Hypha DHO
              .location(v-for="breadcrumb in breadcrumbs") &nbsp;/ {{ breadcrumb.title }}
          right-menu-guest
          right-menu-authenticated
      q-drawer(
        v-model="left"
        bordered
      )
        left-menu(
          @close="left = false"
        )
      right-sidebar
  q-page-container
    router-view
</template>

<style lang="stylus" scoped>
.mobile-header
  height 110px
.mobile-breadcrumb
  position fixed
  margin-top 40px
  font-size 16px !important
  left 0
.breadcrumb
  display inline-flex
  align-items center
  color #434343
  margin-left 10px
  font-size 30px
  line-height 30px
  z-index 1000
  .location
    font-weight 800
  > *
    display inline-block
    text-decoration none
  .link
    &:hover
     text-decoration underline
.bg-none
  background none
#bg
  background-size cover !important
  height 100vh
  position fixed
  width 100vw
  z-index 0
.notification-badge
  font-size 10px
  padding 2px 3px
  right -5px
.badge-left
  left -5px
  right auto
.logo
  position fixed
  bottom 5px
  right 25px
.mobile-logo
  width 100px !important
.map-marked
  width 44px
  height 44px
  margin-top 8px
  margin-left 5px
  margin-right 5px
  border-radius 50%
.mobile-map-marked
  width 26px !important
  height 26px !important
  margin-top 2px
</style>
