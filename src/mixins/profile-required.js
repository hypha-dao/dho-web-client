import { mapGetters } from 'vuex'

export const profileRequired = {
  computed: {
    ...mapGetters('accounts', ['account', 'isAuthenticated']),
    ...mapGetters('profiles', ['profiles'])
  },

  updated () {
    if (
      this.isAuthenticated &&
      this.$router.currentRoute.name !== 'profile-creation' &&
      !this.profiles[this.account]
    ) {
      this.$router.push({ name: 'profile-creation', params: { username: this.account } })
    }
  }
}
