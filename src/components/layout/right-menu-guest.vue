<script>
import { mapGetters, mapMutations } from 'vuex'
import DialogLogin from '~/components/wallet/dialog-login'
import DialogRegister from '~/components/wallet/dialog-register'

export default {
  name: 'authentication',
  components: { DialogLogin, DialogRegister },
  computed: {
    ...mapGetters('wallet', ['isAuthenticated'])
  },
  methods: {
    ...mapMutations('wallet', ['setShowLogin', 'setShowRegister'])
  }
}
</script>

<template lang="pug">
div(v-if="!isAuthenticated")
  dialog-login
  dialog-register
  q-btn(
    label="Login"
    dark
    flat
    color="white"
    @click="setShowLogin(true)"
  )
  q-btn(
    label="Register"
    color="secondary"
    @click="setShowRegister(true)"
  )
</template>

<style lang="stylus" scoped>

</style>
