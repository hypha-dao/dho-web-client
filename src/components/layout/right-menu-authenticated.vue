<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'right-menu-authenticated',
  computed: {
    ...mapGetters('accounts', ['isAuthenticated', 'account'])
  },
  methods: {
    ...mapActions('accounts', ['logout'])
  }
}
</script>

<template lang="pug">
div(v-if="isAuthenticated")
  q-btn(
    :label="account"
    flat
    no-caps
  )
    q-menu
      q-list(dense)
        q-item(
          :to="`/@${account}`"
          clickable
          v-close-popup
        )
          q-item-section Profile
        q-item(
          @click="logout"
          clickable
          v-close-popup
        )
          q-item-section Logout
</template>

<style lang="stylus" scoped>

</style>
