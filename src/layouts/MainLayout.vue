<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import RightMenuGuest from '~/components/layout/right-menu-guest'
import RightMenuAuthenticated from '~/components/layout/right-menu-authenticated'
import LeftMenu from '~/components/layout/left-menu'
import RightSidebar from '~/components/layout/right-sidebar'
import Trianglify from 'trianglify'
import { dom } from 'quasar'
const { height, width } = dom

export default {
  name: 'main-layout',
  components: { RightMenuGuest, RightMenuAuthenticated, LeftMenu, RightSidebar },
  data () {
    return {
      left: !this.$q.platform.is.mobile,
      background: 'background: url("statics/bg/main.png")'
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
    ...mapActions('accounts', ['autoLogin']),
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
      x_colors: colors,
      y_colors: 'match_x'
    })
    this.background = `background: url(${pattern.png()})`
    this.initNotifications()
    await this.fetchPeriods()
    await this.autoLogin()
  }
}
</script>

<template lang="pug">
q-layout(
  view="lHr lpR fFf"
  ref="layout"
)
  .bg(:style="background")
  router-link.q-ml-sm.float-left.logo(to="/" style="display:block;margin-top:8px")
    img(
      src="~assets/logos/hypha-logo-light.png"
      style="width:150px;"
      :class="{ 'mobile-logo': $q.screen.lt.sm}"
    )
  q-header.bg-none(
    reveal
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
          size="18px"
          style="margin-top:8px"
        )
        q-icon.bg-white.map-marked(
          name="fas fa-map-marker-alt"
          size="30px"
          color="black"
        )
        .breadcrumb(v-if="$q.platform.is.desktop")
          router-link.link(to="/").text-black Hypha DHO
          .location(v-for="breadcrumb in breadcrumbs") &nbsp;/ {{ breadcrumb.title }}
      // -
        q-btn(
          v-if="isAuthenticated"
          color="black"
          dense
          flat
          round
          icon="fas fa-broadcast-tower"
          @click="toggleNotifications"
          size="sm"
        )
          q-badge.notification-badge(
            v-if="successCount"
            color="green"
            :label="successCount"
            floating
          )
          q-badge.notification-badge.badge-left(
            v-if="errorCount"
            color="red"
            :label="errorCount"
            floating
          )
      //
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
  .breadcrumb(
    v-if="!$q.platform.is.desktop"
    style="margin-top:70px"
  )
    router-link.link(to="/").text-black Hypha DHO
    .location(v-for="breadcrumb in breadcrumbs") &nbsp;/ {{ breadcrumb.title }}
  q-page-container
    router-view
</template>

<style lang="stylus" scoped>
.breadcrumb
  display inline-flex
  color #434343
  margin-left 10px
  font-size 30px
  line-height 30px
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
.bg
  background-size cover !important
  height 100vh
  position fixed
  width 100vw
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
  border-radius 50%
</style>
