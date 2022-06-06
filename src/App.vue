<script>
import { Notify } from 'quasar'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { profileRequired } from '~/mixins/profile-required'

export default {
  name: 'App',
  mixins: [profileRequired],

  computed: {
    ...mapGetters('layout', ['alert'])
  },

  watch: {
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
    await this.loadAlert()
  },

  async mounted () {
    if (this.$store.$error) {
      this.$router.push({ path: '/error' })
      return
    }
    await this.autoLogin()
  },

  methods: {
    ...mapActions('accounts', ['autoLogin']),
    ...mapActions('layout', ['loadAlert']),
    ...mapMutations('layout', ['dismissAlert'])
  }
}
</script>

<template lang="pug">
#q-app
  router-view
</template>

<style lang="stylus">

</style>
