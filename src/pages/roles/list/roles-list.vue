<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import RoleCard from '../components/role-card'
import RoleForm from '../components/role-form'

export default {
  name: 'page-roles-list',
  components: { RoleCard, RoleForm },
  data () {
    return {
      right: false
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
        )
      template(v-slot:loading)
        .row.justify-center.q-my-md
          q-spinner-dots(
            color="primary"
            size="40px"
          )
  q-drawer(
    v-model="right"
    side="right"
    overlay
    bordered
    :width="400"
  )
    role-form(
      @close="right=!right"
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
      @click="right = true"
    )
</template>
