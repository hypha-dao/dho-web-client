<script>
import { mapActions, mapGetters } from 'vuex'
import RoleItem from './components/role-item'

export default {
  name: 'page-proposals-roles-list',
  components: { RoleItem },
  computed: {
    ...mapGetters('roles', ['historyRoleProposals', 'roleProposalsLoaded'])
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
  .role-proposals-list(ref="roleProposalsListRef")
    q-infinite-scroll(
      :disable="roleProposalsLoaded"
      @load="onLoad"
      :offset="250"
      :scroll-target="$refs.roleProposalsListRef"
    )
      q-list.full-width(
        dense
        bordered
        separator
      )
        role-item(
          v-for="role in historyRoleProposals"
          :role="role"
          :key="role.proposal_id"
        )
      template(v-slot:loading)
        .row.justify-center.q-my-md
          q-spinner-dots(
            color="primary"
            size="40px"
          )
</template>

<style lang="stylus" scoped>

</style>
