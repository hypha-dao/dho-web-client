<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import RightMenuGuest from '~/components/layout/right-menu-guest'
import RightMenuAuthenticated from '~/components/layout/right-menu-authenticated'
import LeftMenu from '~/components/layout/left-menu'
import HeaderMenu from '~/components/layout/header-menu'
import RightSidebar from '~/components/layout/right-sidebar'
import Trianglify from 'trianglify'
import { dom } from 'quasar'
const { height, width } = dom

export default {
  name: 'main-layout',
  components: { HeaderMenu, RightMenuGuest, RightMenuAuthenticated, LeftMenu, RightSidebar },
  data () {
    return {
      left: false,
      background: 'background: url("statics/bg/main.png")'
    }
  },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated', 'account']),
    ...mapGetters('layout', ['rightSidebarType']),
    ...mapGetters('notifications', ['successCount', 'errorCount'])
  },
  methods: {
    ...mapMutations('notifications', ['initNotifications', 'unmarkRead', 'unmarkNew']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    ...mapActions('periods', ['fetchPeriods']),
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
    if (hour >= 5 && hour < 12) {
      colors = 'YlOrRd'
    } else if (hour >= 12 && hour < 17) {
      colors = 'Blues'
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
  }
}
</script>

<template lang="pug">
q-layout.bg(
  view="lHr lpR fFf"
  ref="layout"
  :style="background"
)
  q-header.bg-none(
    reveal
  )
    q-toolbar
      q-toolbar-title.q-mt-xs
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
        router-link.q-ml-sm.float-left(to="/" style="display:block;margin-top:8px")
          img(
            src="~assets/logos/hypha-logo.png"
            style="width:150px;"
            :class="{ 'mobile-logo': $q.screen.lt.sm}"
          )
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
    overlay
    behavior="mobile"
  )
    left-menu(
      @close="left = false"
    )
  right-sidebar
  q-page-container
    .breadcrumb(v-if="$route.path !== '/'")
      q-icon(name="fas fa-map-marker-alt" size="sm" color="#434343")
      router-link.link(to="/").text-black Hypha DHO
      .location(v-if="$route.meta.title") &nbsp;/ {{ this.$route.meta.title }}
    router-view
</template>

<style lang="stylus" scoped>
.breadcrumb
  color #434343
  margin-top 30px
  margin-left 60px
  font-size 30px
  line-height 30px
  .location
    font-weight 900
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
.notification-badge
  font-size 10px
  padding 2px 3px
  right -5px
.badge-left
  left -5px
  right auto
.mobile-logo
  width 100px !important
  margin-top 7px
</style>
