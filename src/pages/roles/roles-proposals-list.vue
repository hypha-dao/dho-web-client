<script>
import { mapActions, mapGetters } from 'vuex'
import RoleItem from './components/role-item'

export default {
  name: 'page-proposals-roles-list',
  components: { RoleItem },
  computed: {
    ...mapGetters('wallet', ['isAuthenticated']),
    ...mapGetters('roles', ['activeRoleProposals', 'roleProposalsLoaded'])
  },
  methods: {
    ...mapActions('roles', ['fetchRoleProposals']),
    async onLoad (index, done) {
      await this.fetchRoleProposals()
      done()
    }
  }
}
</script>

<template lang="pug">
q-page.q-pa-lg
  .flex.justify-end.q-mb-sm(v-if="isAuthenticated")
    q-btn(
      label="Create a proposal"
      color="primary"
      to="/roles/form"
    )
  .role-proposals-list(ref="roleProposalsListRef")
    q-infinite-scroll(
      :disable="roleProposalsLoaded"
      @load="onLoad"
      :offset="250"
      :scroll-target="$refs.roleProposalsListRef"
    )
      q-list.full-width(
        v-if="activeRoleProposals.length"
        dense
        bordered
        separator
      )
        role-item(
          v-for="role in activeRoleProposals"
          :role="role"
          :key="role.proposal_id"
        )
      template(v-slot:loading)
        .row.justify-center.q-my-md
          q-spinner-dots(
            color="primary"
            size="40px"
          )
      .text-h6.text-center(v-if="activeRoleProposals.length === 0") There are no proposals opened for votes
</template>

<style lang="stylus" scoped>

</style>
