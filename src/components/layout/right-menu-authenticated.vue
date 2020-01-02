<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'right-menu-authenticated',
  computed: {
    ...mapGetters('accounts', ['isAuthenticated', 'isMember', 'account'])
  },
  methods: {
    ...mapActions('accounts', ['logout'])
  }
}
</script>

<template lang="pug">
div
  div(v-if="isAuthenticated && isMember")
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
  div(v-if="isAuthenticated && !isMember")
    q-btn.q-ml-sm(
      label="Become a member"
      color="primary"
      to="/members/add"
    )
    q-btn.q-ml-sm(
      label="Logout"
      color="secondary"
      flat
      @click="logout"
    )
</template>

<style lang="stylus" scoped>

</style>
