<script>
import { mapActions, mapGetters } from 'vuex'
import RoleCard from '../components/role-card'

export default {
  name: 'page-roles-list',
  components: { RoleCard },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated']),
    ...mapGetters('roles', ['roles', 'rolesLoaded'])
  },
  methods: {
    ...mapActions('roles', ['fetchRoles']),
    async onLoad (index, done) {
      await this.fetchRoles()
      done()
    }
  }
}
</script>

<template lang="pug">
q-page.q-pa-lg
  .roles-list(ref="rolesListRef")
    q-infinite-scroll(
      :disable="rolesLoaded"
      @load="onLoad"
      :offset="250"
      :scroll-target="$refs.rolesListRef"
    )
      .row.q-col-gutter-md
        .col-xs-12.col-sm-6.col-md-4(v-for="role in roles")
          role-card(:role="role")
      template(v-slot:loading)
        .row.justify-center.q-my-md
          q-spinner-dots(
            color="primary"
            size="40px"
          )
  q-page-sticky(
    v-if="isAuthenticated"
    position="bottom-right"
    :offset="[18, 18]"
  )
    q-btn(
      fab
      icon="fas fa-plus"
      color="accent"
      to="/proposals/roles/add"
    )
</template>

<style lang="stylus" scoped>

</style>
