<script>
import { mapActions, mapGetters } from 'vuex'
import RoleItem from './components/role-item'

export default {
  name: 'page-roles-list',
  components: { RoleItem },
  computed: {
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
          role-item(:role="role")
      template(v-slot:loading)
        .row.justify-center.q-my-md
          q-spinner-dots(
            color="primary"
            size="40px"
          )
</template>

<style lang="stylus" scoped>

</style>
