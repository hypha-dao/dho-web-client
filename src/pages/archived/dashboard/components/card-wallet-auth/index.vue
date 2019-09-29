<script>
import { mapActions, mapGetters } from 'vuex'
import DialogUpdateProfile from './dialog-update-profile'

export default {
  name: 'card-wallet-auth',
  components: {
    DialogUpdateProfile
  },
  data () {
    return {
      dialogs: {
        profile: false,
        member: false
      }
    }
  },
  computed: {
    ...mapGetters('wallet', ['isConnected']),
    ...mapGetters('profile', ['accountName', 'profile'])
  },
  methods: {
    ...mapActions('wallet', ['closeWallet'])
  }
}
</script>

<template lang="pug">
  div
    dialog-update-profile(
      :show="dialogs.profile"
      @close="dialogs.profile = false"
    )
    q-card(v-if="isConnected")
      q-card-section
        q-item
          q-item-section(avatar)
            q-avatar
              img(:src="profile.avatar || 'statics/avatar-placeholder.png'")
          q-item-section
            .text-h6 {{ profile.fullName ? profile.fullName : accountName }}
            .text-subtitle2 {{ profile.fullName ? accountName : '' }}
          q-item-section.q-gutter-sm
            q-btn(
              color="secondary"
              label="Update Profile"
              @click="dialogs.profile = true"
            )
            q-btn(
              v-if="!profile.isMember"
              color="secondary"
              label="Become Member"
              @click="dialogs.member = true"
            )
            q-btn(
              color="secondary"
              label="Close wallet"
              @click="closeWallet()"
            )

      q-card-section
        q-item
          q-item-section
            | {{ profile.description }}
</template>
