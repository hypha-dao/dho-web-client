import { mapGetters } from 'vuex'

export const profileRequired = {
  computed: {
    ...mapGetters('accounts', ['account', 'isAuthenticated', 'isMember']),
    ...mapGetters('profiles', ['profiles'])
  },

  methods: {
    checkProfileRequiredRoute () {
      if (
        this.isMember &&
        this.account &&
        this.isAuthenticated &&
        this.$router.currentRoute.name !== 'profile-creation' &&
        !this.profiles[this.account]
      ) {
        this.$router.push({ name: 'profile-creation', params: { username: this.account } })
      }
    }
  },

  watch: {
    account: {
      handler () {
        this.checkProfileRequiredRoute()
      },
      immediate: false
    },
    isMember: {
      handler () {
        this.checkProfileRequiredRoute()
      },
      immediate: false
    }
  },

  updated () {
    this.checkProfileRequiredRoute()
  }
}
