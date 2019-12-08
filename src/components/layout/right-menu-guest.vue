<script>
import { mapGetters } from 'vuex'
import DialogRegister from '~/components/account/dialog-register'
import DialogLogin from '~/components/account/dialog-login'

export default {
  name: 'authentication',
  data () {
    return {
      showLogin: false,
      showRegister: false
    }
  },
  components: { DialogLogin, DialogRegister },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated'])
  }
}
</script>

<template lang="pug">
div(v-if="!isAuthenticated")
  dialog-login(:show.sync="showLogin")
  dialog-register(:show.sync="showRegister")
  q-btn(
    label="Login"
    dark
    flat
    color="white"
    @click="showLogin = true"
  )
  q-btn(
    label="Register"
    color="secondary"
    @click="showRegister = true"
  )
</template>
