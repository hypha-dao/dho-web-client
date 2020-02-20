<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import RightMenuGuest from '~/components/layout/right-menu-guest'
import RightMenuAuthenticated from '~/components/layout/right-menu-authenticated'
import MainFooter from '~/components/layout/footer'
import LeftMenu from '~/components/layout/left-menu'
import HeaderMenu from '~/components/layout/header-menu'
import RightSidebar from '~/components/layout/right-sidebar'

export default {
  name: 'main-layout',
  components: { HeaderMenu, RightMenuGuest, RightMenuAuthenticated, MainFooter, LeftMenu, RightSidebar },
  data () {
    return {
      left: false
    }
  },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated']),
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
    this.initNotifications()
    await this.fetchPeriods()
  }
}
</script>

<template lang="pug">
q-layout.bg(
  view="lHr lpR fFf"
  style="background: url('statics/bg/main.png')"
)
  q-header.bg-none(
    reveal
  )
    q-toolbar
      q-btn(
        icon="fas fa-bars"
        flat
        dense
        round
        color="black"
        @click="left = !left"
      )
      q-toolbar-title
        router-link(to="/")
          img.q-mt-sm(
            src="~assets/logos/hypha-logo.png"
            width="150px;"
          )
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
      right-menu-guest
      right-menu-authenticated
  q-drawer(
    v-model="left"
    bordered

  )
    left-menu
  right-sidebar
  q-page-container
    router-view
  q-footer.bg-grey-8.text-white(elevated)
    main-footer
</template>

<style lang="stylus" scoped>
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
</style>
