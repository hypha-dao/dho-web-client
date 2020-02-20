<script>
import { mapGetters } from 'vuex'
import DashboardAnonymous from '~/pages/dashboard/dashboard-anonymous'
import DashboardAuthenticated from '~/pages/dashboard/dashboard-authenticated'

export default {
  name: 'dashboard',
  components: { DashboardAuthenticated, DashboardAnonymous },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated'])
  }
}
</script>

<template lang="pug">
q-page.q-pa-lg
  dashboard-anonymous(v-if="!isAuthenticated")
  dashboard-authenticated(v-else)
</template>

<style lang="stylus" scoped>
</style>
