<script>
import { mapGetters } from 'vuex'

export default {
  name: 'card-wallet-guest',
  data () {
    return {
      dialogs: {
        login: false,
        register: false
      }
    }
  },
  computed: {
    ...mapGetters('wallet', ['isConnected'])
  }
}
</script>

<template lang="pug">
  div
    dialog-login(
      :show="dialogs.login"
      @close="dialogs.login = false"
    )
    dialog-register(
      :show="dialogs.register"
      @close="dialogs.register = false"
    )
    q-card(v-if="!isConnected")
      q-card-section.q-gutter-y-sm
        .text-h6 Welcome to the Hypha DAO
        .text-subtitle2 The DAO is the way to enlightenment (the TAO). It is also a Decentralized Autonomous Organization
        .text-body2 Hypha is the global, open organization that's launching SEEDS and other decentralized applications. Our mission is to create digial tools for our Regenerative Society
        .text-body2 SEEDS wouldn't be decentralized if the team behind it was centralized. For this reason and many more we've opened up the organization for all to participate and direct
        .text-body2 Hypha DAO is an experiment in the future of organizations. Not only are you participating in co-creating SEEDS but you're also participating in co-creating Hypha. You can have a direct impact in how this organization evolves
        .text-subtitle2 If you have a Telos mainnet account - just login. Or, create an account. *Ensure you safely store your private key!*
      q-card-actions.q-gutter-sm(align="right")
        q-btn(
          color="secondary"
          label="Create wallet"
          @click="dialogs.register = true"
        )
        q-btn(
          color="secondary"
          label="Open wallet"
          @click="dialogs.login = true"
        )
</template>
