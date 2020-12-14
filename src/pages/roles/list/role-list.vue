<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import RoleCard from '../components/role-card'

export default {
  name: 'page-role-list',
  components: { RoleCard },
  async beforeMount () {
    this.setBreadcrumbs([{ title: 'Roles' }])
    await this.loadRoles()
  },
  computed: {
    ...mapGetters('roles', ['roles'])
  },
  methods: {
    ...mapMutations('layout', ['setBreadcrumbs']),
    ...mapActions('roles', ['loadRoles'])
  }
}
</script>

<template lang="pug">
.row
  role-card(
    v-for="role in roles"
    :key="role.hash"
    :role="role"
  )
</template>
