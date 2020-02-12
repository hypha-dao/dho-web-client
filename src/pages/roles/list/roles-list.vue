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
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    async onLoad (index, done) {
      await this.fetchData()
      done()
    },
    displayForm () {
      this.setShowRightSidebar(true)
      this.setRightSidebarType('roleForm')
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
  q-page-sticky(
    v-if="isAuthenticated"
    position="bottom-right"
    :offset="[18, 18]"
  )
    q-btn(
      fab
      icon="fas fa-plus"
      color="red"
      size="lg"
      @click="displayForm"
    )
</template>
