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
    ...mapGetters('accounts', ['isMember', 'isApplicant', 'account'])
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
    },
    openHelp () {
      window.open(process.env.DOCUMENTATION, '_blank')
    }
  }
}
</script>

<template lang="pug">
div
  .row.items-center
    q-btn.gt-xs.q-pa-xs(flat round dense icon="far fa-life-ring" size="md" color="black" @click="openHelp")
      q-tooltip Help
    .row(v-if="isMember")
      q-btn.bg-white.q-px-sm(flat dense round)
        q-img(
          v-if="profile && profile.publicData.avatar"
          :src="profile.publicData.avatar"
        )
        q-avatar(
          v-else
          size="36px"
          color="accent"
          text-color="white"
        )
          | {{ account.slice(0, 2).toUpperCase() }}
        q-menu
          q-list(dense)
            q-item(:to="`/@${account}`" clickable v-close-popup)
              q-item-section Profile
            q-item(to="/wallet" clickable v-close-popup)
              q-item-section Wallet
            q-item(:to="`/documents/assignment/${account}`" clickable v-close-popup)
              q-item-section Assignments
            q-item(:to="`/documents/payout/${account}`" clickable v-close-popup)
              q-item-section Contributions
            q-item(@click="showNotifications" clickable v-close-popup)
              q-item-section Transactions
            q-item(@click="logout" clickable v-close-popup)
              q-item-section Logout
            q-separator
            q-item(@click="openHelp" clickable v-close-popup)
              q-item-section Help
    div(v-else)
      dialog-member(:show.sync="show")
      .row.items-center.gt-sm
        q-btn.text-bold(
          v-if="!isApplicant"
          label="Apply"
          color="white"
          text-color="black"
          rounded
          unelevated
          size="md"
          @click="show = true"
        )
        q-btn.text-bold(
          v-else
          label="Applied"
          color="white"
          text-color="black"
          rounded
          unelevated
          size="md"
          to="/applicants"
        )
          q-tooltip You have a pending application
        q-btn.text-bold.q-ml-sm(
          label="Logout"
          color="secondary"
          text-color="white"
          rounded
          unelevated
          size="md"
          @click="logout"
        )
      q-btn.q-pa-xs.lt-md(
        icon="fas fa-ellipsis-v"
        color="black"
        flat
        dense
        round
        size="sm"
      )
        q-menu
          q-list(dense)
            q-item(v-if="!isApplicant" @click="show = true" clickable v-close-popup)
              q-item-section Apply
            q-item(v-else to="/applicants" clickable v-close-popup)
              q-item-section View Application
            q-item(@click="logout" clickable v-close-popup)
              q-item-section Logout
            q-separator
            q-item(@click="openHelp" clickable v-close-popup)
              q-item-section Help
</template>
