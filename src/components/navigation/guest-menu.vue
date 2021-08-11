<script>
export default {
  name: 'guest-menu',

  methods: {
    openHelp () {
      window.open(process.env.DOCUMENTATION, '_blank')
    },

    onLogin () {
      if (this.$router.currentRoute.path !== '/login') {
        this.$router.push({ path: `/login?returnUrl=${this.$route.path}` })
      }
    }
  }
}
</script>

<template lang="pug">
.row.items-center.q-gutter-x-sm
  q-btn.text-bold.gt-sm(
    label="LOGIN"
    color="white"
    text-color="primary"
    rounded
    size="md"
    @click="onLogin"
  )
  q-btn.text-bold.gt-sm(
    to="/register"
    label="REGISTER"
    color="white"
    text-color="primary"
    rounded
    size="md"
  )
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
