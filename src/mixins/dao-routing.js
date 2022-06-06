import { mapGetters } from 'vuex'
export const daoRouting = {
  computed: {
    ...mapGetters('dao', ['daoSettings'])
  },
  methods: {
    routeTo (route) {
      this.$router.push(`/${this.daoSettings.url}/${route}`)
    },
    routeToProposal (proposalId) {
      this.$router.push(`/${this.daoSettings.url}/proposals/${proposalId}`)
    }
  }
}
