<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'quick-links',

  props: {
    username: String
  },

  methods: {
    ...mapActions('accounts', ['logout'])
  },
  computed: {
    ...mapGetters('dao', ['selectedDao'])
  }
}
</script>

<template lang="pug">
.quick-links.full-width
  .row.q-px-lg
    .col-6.q-pa-sm
      q-btn.fit(:to="{ name: 'proposal-create', params: { dhoname: selectedDao.name } }" rounded unelevated color="grey-4" size="0.9em")
        .column.items-center.q-py-sm
          q-icon.q-pa-md(color="primary" size="md" name="fas fa-file-medical")
          .text-caption.text-no-wrap.text-primary.text-bold New Proposal
    .col-6.q-pa-sm
      q-btn.fit(:to="{ name: 'profile', params: { username } }" rounded unelevated color="grey-4" size="0.9em")
        .column.items-center.q-py-sm
          q-icon.q-pa-md(color="primary" size="md" name="far fa-user")
          .text-caption.text-no-wrap.text-primary.text-bold My Profile
    .col-6.q-pa-sm
      q-btn.fit(:to="{ name: 'profile', params: { username } }" rounded unelevated color="grey-4" size="0.9em")
        .column.items-center.q-py-sm
          q-icon.q-pa-md(color="primary" size="md" name="fas fa-wallet")
          .text-caption.text-no-wrap.text-primary.text-bold My Wallet
    .col-6.q-pa-sm
      q-btn.fit(@click="logout" rounded unelevated color="grey-4" size="0.9em")
        .column.items-center.q-py-sm
          q-icon.q-pa-md(color="primary" size="md" name="fas fa-sign-out-alt")
          .text-caption.text-no-wrap.text-primary.text-bold Logout
</template>
