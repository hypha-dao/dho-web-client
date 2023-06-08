<script>
import { mapGetters } from 'vuex'
export default {
  name: 'guest-menu',

  props: {
    daoName: String
  },
  methods: {
    openHelp () {
      window.open(process.env.DOCUMENTATION, '_blank')
    },

    onLogin () {
      if (this.$router.currentRoute.path !== '/login') {
        this.$router.push({ path: `/${this.daoName}/login?returnUrl=${this.$route.path}` })
      }
    }
  },
  computed: {
    ...mapGetters('dao', ['daoSettings'])
  }
}
</script>

<template lang="pug">
.row.items-center.q-gutter-x-sm
  q-btn.text-bold.gt-sm(
    label="Login"
    color="primary"
    text-color="white"
    rounded
    unelevated
    no-caps
    size="md"
    @click="onLogin"
  )
  div
    q-btn.text-bold.gt-sm(
      @click="onLogin"
      label="Register"
      color="primary"
      text-color="white"
      rounded
      unelevated
      no-caps
      :disable="false"
      size="md"
    )
    q-tooltip(v-if="!daoSettings.registrationEnabled") Registration is temporarily disabled
  q-btn.q-pa-xs.lt-md(
    icon="fas fa-ellipsis-v"
    color="white"
    flat
    dense
    round
    size="sm"
  )
    q-menu
      q-list(dense)
        q-item(@click="onLogin" clickable v-close-popup)
          q-item-section Login
        q-item(:to="`/register`" clickable v-close-popup)
          q-item-section Register
        q-separator
        q-item(@click="openHelp" clickable v-close-popup)
          q-item-section Help
</template>
