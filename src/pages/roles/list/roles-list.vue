<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import RoleCard from '../components/role-card'
import DraftProposalCard from '../../proposals/components/draft-proposal-card'

export default {
  name: 'page-roles-list',
  components: { RoleCard, DraftProposalCard },
  data () {
    return {
      right: false,
      roleId: null
    }
  },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated']),
    ...mapGetters('roles', ['roles', 'rolesLoaded']),
    ...mapGetters('profiles', ['drafts'])
  },
  beforeMount () {
    this.clearData()
    this.setBreadcrumbs([{ title: 'Apply for Role' }])
  },
  beforeDestroy () {
    this.clearData()
  },
  methods: {
    ...mapActions('roles', ['fetchData']),
    ...mapMutations('roles', ['clearData']),
    ...mapMutations('layout', ['setBreadcrumbs']),
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
        draft-proposal-card(
          v-for="draft in drafts.filter(d => d.type === 'assignment')"
          :key="draft.draft.id"
          :draft="draft.draft"
          :type="draft.type"
        )
        role-card(
          v-for="role in roles"
          :key="role.id"
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
