<script>
import { mapActions, mapGetters } from 'vuex'
import DialogMember from '~/components/account/dialog-become-member'

export default {
  name: 'right-menu-authenticated',
  components: { DialogMember },
  data () {
    return {
      show: false
    }
  },
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
      color="black"
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
            :to="'/proposals/payout'"
            clickable
            v-close-popup
          )
            q-item-section Wallet
          q-item(
            @click="logout"
            clickable
            v-close-popup
          )
            q-item-section Logout
  div(v-if="isAuthenticated && !isMember")
    dialog-member(:show.sync="show")
    q-btn.q-ml-sm(
      label="Become a member"
      color="primary"
      @click="show = true"
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
