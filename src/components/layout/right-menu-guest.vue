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
  q-btn.q-mr-sm(
    icon="fas fa-sign-in-alt"
    color="white"
    text-color="black"
    round
    unelevated
    @click="showLogin = true"
    style="width:40px;height:40px;margin: 4px"
  )
  q-btn(
    icon="fas fa-user-plus"
    color="white"
    text-color="black"
    round
    unelevated
    @click="showRegister = true"
    style="width:40px;height:40px;margin: 4px"
  )
</template>
