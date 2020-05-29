import { mapGetters, mapMutations } from 'vuex'

export const profileRequired = {
  computed: {
    ...mapGetters('profiles', ['profiles']),
    ...mapGetters('accounts', ['account'])
  },
  methods: {
    ...mapMutations('layout', ['setRightSidebarType'])
  },
  beforeMount () {
    if (!this.profiles[this.account]) {
      this.setRightSidebarType('profileRequired')
    }
  }
}
