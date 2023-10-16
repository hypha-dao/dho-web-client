<script>
import { Notify } from 'quasar'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'App',

  apollo: {
    dho: {
      query: require('~/query/main-dho.gql'),
      update: data => data.queryDho,
      result (res) { this.$store.commit('dao/setDho', res.data.queryDho) },
      fetchPolicy: 'no-cache'
    }
  },

  computed: {
    ...mapGetters('accounts', ['account']),
    ...mapGetters('layout', ['alert'])
  },

  watch: {
    account: {
      async handler (value) {
        if (value) {
          await this.getPublicProfile(value)
        }
      },
      immediate: true
    },

    alert: function (value) {
      Notify.create({
        type: value.level,
        message: value.content,
        position: 'top',
        timeout: 9999999999,
        actions: [
          { icon: 'fas fa-times', color: 'white', handler: this.dismissAlert }
        ]
      })
    }
  },

  async beforeMount () {
    await this.autoLogin()
    await this.initConfigs()
    await this.loadAlert()
  },

  async mounted () {
    if (this.$store.$error) {
      this.$router.push({ path: '/error' })
    }
  },

  methods: {
    ...mapActions('accounts', ['autoLogin']),
    ...mapActions('dao', ['initConfigs']),
    ...mapActions('layout', ['loadAlert']),
    ...mapMutations('layout', ['dismissAlert']),
    ...mapActions('profiles', ['getPublicProfile'])
  }

}
</script>

<template lang="pug">
#q-app
  router-view
</template>

<style lang="stylus">
</style>
