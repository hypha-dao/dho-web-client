<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import DialogMember from '~/components/account/dialog-become-member'

export default {
  name: 'right-menu-authenticated',
  components: { DialogMember },
  data () {
    return {
      show: false,
      profile: null
    }
  },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated', 'isMember', 'account'])
  },
  watch: {
    account: {
      immediate: true,
      async handler (val) {
        this.profile = await this.getPublicProfile(val)
      }
    }
  },
  methods: {
    ...mapActions('accounts', ['logout']),
    ...mapActions('profiles', ['getPublicProfile']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    showNotifications () {
      this.setShowRightSidebar(true)
      this.setRightSidebarType('notifications')
    }
  }
}
</script>

<template lang="pug">
div
  .auth-menu(v-if="isAuthenticated && isMember")
    .avatar-container
      q-img.avatar(
        v-if="profile && profile.publicData.avatar"
        :src="profile.publicData.avatar"
        @click="$router.push({ path: `/@${account}`})"
      )
      q-avatar.avatar(
        v-else
        size="36px"
        color="accent"
        text-color="white"
        @click="$router.push({ path: `/@${account}`})"
      )
        | {{ account.slice(0, 2).toUpperCase() }}
    q-btn(
      icon="fas fa-ellipsis-v"
      color="white"
      flat
      dense
      round
      no-caps
      style="width:40px;margin: 4px"
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
            @click="showNotifications"
            clickable
            v-close-popup
          )
            q-item-section Transactions
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
.auth-menu
  width 90px
  margin-left 10px
  .avatar-container
    display inline-block
    padding-top 2px
    padding-left 2px
    background white
    width 40px
    height 40px
    border-radius 50% !important
    .avatar
      cursor pointer
      border-radius 50% !important
      width 36px
</style>
