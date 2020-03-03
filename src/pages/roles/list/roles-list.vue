<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import RoleCard from '../components/role-card'

export default {
  name: 'page-roles-list',
  components: { RoleCard },
  data () {
    return {
      right: false,
      roleId: null
    }
  },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated']),
    ...mapGetters('roles', ['roles', 'rolesLoaded'])
  },
  mounted () {
    this.clearData()
  },
  methods: {
    ...mapActions('roles', ['fetchData']),
    ...mapMutations('roles', ['clearData']),
    async onLoad (index, done) {
      await this.fetchData()
      done()
    }
  }
}
</script>

<template lang="pug">
q-page.q-pa-lg(:style-fn="breadcrumbsTweak")
  .roles-list(ref="rolesListRef")
    q-infinite-scroll(
      :disable="rolesLoaded"
      @load="onLoad"
      :offset="250"
      :scroll-target="$refs.rolesListRef"
    )
      .row.text-center
        role-card(
          v-for="role in roles"
          :key="role.role_id"
          :role="role"
          @open="() => { right = true; roleId = role.id }"
        )
      template(v-slot:loading)
        .row.justify-center.q-my-md
          q-spinner-dots(
            color="primary"
            size="40px"
          )
</template>
