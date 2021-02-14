<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import RoleCard from '../components/role-card'

export default {
  name: 'page-role-list',
  components: { RoleCard },
  data () {
    return {
      pagination: {
        first: 10,
        offset: 0
      },
      loaded: false
    }
  },
  async beforeMount () {
    this.clearRoles()
    this.setBreadcrumbs([{ title: 'Roles' }])
  },
  computed: {
    ...mapGetters('roles', ['roles'])
  },
  methods: {
    ...mapMutations('layout', ['setBreadcrumbs']),
    ...mapMutations('roles', ['clearRoles']),
    ...mapActions('roles', ['loadRoles']),
    async onLoad (index, done) {
      this.loaded = await this.loadRoles(this.pagination)
      if (!this.loaded) {
        this.pagination.offset += this.pagination.first
      }
      done()
    }
  }
}
</script>

<template lang="pug">
q-infinite-scroll(
  :disable="loaded"
  @load="onLoad"
  :offset="250"
)
  .row
    role-card(
      v-for="role in roles"
      :key="role.hash"
      :role="role"
    )
  template(v-slot:loading)
    .row.justify-center.q-my-md
      q-spinner-dots(
        color="primary"
        size="40px"
      )
</template>
