<script>
import RightMenuGuest from '~/components/layout/right-menu-guest'
import RightMenuAuthenticated from '~/components/layout/right-menu-authenticated'
import LeftMenu from '~/components/layout/left-menu'
import RightSidebar from '~/components/layout/right-sidebar'
import { Notify } from 'quasar'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'main-layout',
  components: {
    RightMenuGuest,
    RightMenuAuthenticated,
    LeftMenu,
    RightSidebar
  },

  data () {
    return {
      left: false
    }
  },

  computed: {
    ...mapGetters('accounts', ['isAuthenticated', 'account']),
    ...mapGetters('layout', ['rightSidebarType', 'breadcrumbs'])
  },

  methods: {
    ...mapMutations('notifications', ['initNotifications', 'unmarkRead']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
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
  }
}
</script>

<template lang="pug">
q-layout(view="lHr LpR fFf" ref="layout")
  q-header
    .row.justify-between
      q-toolbar.col.bg-primary.q-pl-sm
        q-btn.q-pa-xs(flat round dense icon="fas fa-bars" size="sm" color="white" @click="left = !left")
      q-toolbar.col-auto.bg-primary.justify-center
        router-link.row.items-center(to="/")
          q-avatar(size="36px")
            img(src="app-logo-128x128.png")
          q-toolbar-title.text-white Hypha DHO
      q-toolbar.col.bg-primary.q-pr-sm.justify-end
        right-menu-authenticated(v-if="isAuthenticated")
        right-menu-guest(v-else)
  q-drawer(v-model="left" bordered)
    left-menu(@close="left = false")
  right-sidebar
  q-page-container.page-background
    q-breadcrumbs.crumbs.q-mx-lg.q-mt-md(v-if="breadcrumbs.length")
      template(v-slot:separator)
        q-icon(size="1.5em" name="fas fa-chevron-right" color="primary")
      template(v-for="bc in breadcrumbs")
        q-breadcrumbs-el(:label="bc.title" :key="bc.title")
    router-view
</template>

<style lang="stylus" scoped>
a
  text-decoration none

.crumbs
  font-size 30px
  line-height 30px
  font-weight 800
</style>
