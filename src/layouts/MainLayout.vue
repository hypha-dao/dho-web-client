<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import RightMenuGuest from '~/components/layout/right-menu-guest'
import RightMenuAuthenticated from '~/components/layout/right-menu-authenticated'
import RightMenuNotifications from '~/components/layout/right-menu-notifications'
import MainFooter from '~/components/layout/footer'
import LeftMenu from '~/components/layout/left-menu'
import HeaderMenu from '~/components/layout/header-menu'

export default {
  name: 'main-layout',
  components: { HeaderMenu, RightMenuGuest, RightMenuAuthenticated, RightMenuNotifications, MainFooter, LeftMenu },
  data () {
    return {
      left: false,
      right: false
    }
  },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated']),
    ...mapGetters('notifications', ['successCount', 'errorCount'])
  },
  methods: {
    ...mapMutations('notifications', ['initNotifications', 'unmarkRead', 'unmarkNew']),
    ...mapActions('periods', ['fetchPeriods']),
    toggleNotifications () {
      if (this.right) {
        this.unmarkRead()
      }
      this.right = !this.right
    }
  },
  async mounted () {
    this.initNotifications()
    await this.fetchPeriods()
  }
}
</script>

<template lang="pug">
q-layout(view="hHh lpR fFf")
  q-header.bg-white(
    reveal
    elevated
  )
    q-toolbar
      q-toolbar-title
        img(
          src="~assets/logos/header.jpg"
          width="150px;"
        )
      q-btn(
        v-if="isAuthenticated"
        color="primary"
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
    q-toolbar
      header-menu
  q-drawer(
    v-model="right"
    side="right"
    overlay
    bordered
  )
    right-menu-notifications
  q-page-container
    router-view

  q-footer.bg-grey-8.text-white(elevated)
    main-footer
</template>

<style lang="stylus" scoped>
.notification-badge
  font-size 10px
  padding 2px 3px
  right -5px
.badge-left
  left -5px
  right auto
</style>
