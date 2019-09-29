<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'right-menu-authenticated',
  computed: {
    ...mapGetters('wallet', ['isAuthenticated', 'accountName'])
  },
  methods: {
    ...mapActions('wallet', ['logout'])
  }
}
</script>

<template lang="pug">
div(v-if="isAuthenticated")
  q-btn(
    :label="accountName"
    flat
    no-caps
  )
    q-menu
      q-list(dense)
        q-item(
          :to="`/@${accountName}`"
          clickable
          v-close-popup
        )
          q-item-section My profile
        q-separator
        q-item(
          @click="logout"
          clickable
          v-close-popup
        )
          q-item-section Logout
</template>

<style lang="stylus" scoped>

</style>
