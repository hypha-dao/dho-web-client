<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import DialogMember from '~/components/account/dialog-become-member'

export default {
  name: 'right-menu-authenticated',
  components: { DialogMember },
  data () {
    return {
      show: false,
      profile: null,
      searchExpanded: false
    }
  },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated', 'isMember', 'account']),
    ...mapGetters('search', ['searchInput'])
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
    ...mapMutations('search', ['setSearch', 'clearSearch']),
    showNotifications () {
      this.setShowRightSidebar(true)
      this.setRightSidebarType('notifications')
    },
    openHelp () {
      window.open(process.env.DOCUMENTATION, '_blank')
    }
  }
}
</script>

<template lang="pug">
div
  .auth-menu.flex.items-center(v-if="isAuthenticated && isMember")
    q-input.search(
      ref="search"
      :value="searchInput"
      @input="setSearch"
      placeholder="Search"
      rounded
      outlined
      bg-color="white"
      dense
      :class="{ 'search-expanded': searchExpanded, 'search-collapsed': !searchExpanded }"
    )
      template(v-slot:append)
        q-icon(
          v-if="!searchExpanded"
          name="fas fa-search"
          color="black"
          @click="() => { searchExpanded = !searchExpanded; $refs.search.focus() }"
        )
        q-icon(
          v-if="searchExpanded"
          name="fas fa-times"
          color="black"
          @click="() => { searchExpanded = !searchExpanded; clearSearch() }"
        )
    q-btn(
      v-if="$q.platform.is.desktop || (!$q.platform.is.desktop && !searchExpanded)"
      icon="far fa-life-ring"
      color="white"
      text-color="black"
      round
      unelevated
      style="width:40px;height:40px;margin: 4px"
      @click="openHelp"
    )
      q-tooltip Help
    .avatar-container(
      v-if="$q.platform.is.desktop || (!$q.platform.is.desktop && !searchExpanded)"
    )
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
      v-if="$q.platform.is.desktop || (!$q.platform.is.desktop && !searchExpanded)"
      icon="fas fa-ellipsis-v"
      color="white"
      flat
      dense
      round
      no-caps
      style="width:40px;height:40px;margin: 4px;"
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
            to="/wallet"
            clickable
            v-close-popup
          )
            q-item-section Wallet
          q-item(
            :to="`/assignments/${account}`"
            clickable
            v-close-popup
          )
            q-item-section Assignments
          q-item(
            :to="`/proposals/history/payout/passed/${account}`"
            clickable
            v-close-popup
          )
            q-item-section Contributions
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
.search
  height 42px
  /deep/.q-field__control:before
    border none
  i
    cursor pointer
.search-collapsed
  width 42px
  transition width 200ms
  i
    padding-right 18px
.search-expanded
  width 200px
  transition width 200ms
</style>
