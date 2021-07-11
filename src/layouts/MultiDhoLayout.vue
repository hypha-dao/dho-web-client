<script>
import { mapGetters } from 'vuex'

export default {
  name: 'multi-dho-layout',
  components: {
    DhoSwitcher: () => import('~/components/navigation/dho-switcher.vue'),
    NavigationHeader: () => import('~/components/navigation/navigation-header.vue'),
    ProfileSidebar: () => import('~/components/navigation/profile-sidebar.vue')
  },

  data () {
    return {
      left: true,
      right: true
    }
  },

  computed: {
    ...mapGetters('accounts', ['isAuthenticated', 'account'])
  }
}
</script>

<template lang="pug">
q-layout(:style="{ 'min-height': 'inherit' }" view="lHr Lpr lFr" ref="layout")
  dho-switcher.fixed-left
  q-page-container.bg-grey-4.content(:style="{ 'margin-right': right ? '280px' : '20px' }")
    .scroll-background.full-height
      q-scroll-area.scroll-height(:thumb-style=" { 'border-radius': '6px' }")
        .row.full-width.items-center.q-my-lg.q-px-xl
          .col
            navigation-header
          q-btn.q-ml-xl(v-if="!right" flat dense round @click="right = true")
            q-avatar(size="36px" color="accent")
        router-view
  profile-sidebar.fixed-right(v-if="right" @close="right = false")
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
</style>
