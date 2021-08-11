<script>
import { mapActions } from 'vuex'

export default {
  name: 'quick-links',

  props: {
    username: String
  },

  methods: {
    ...mapActions('accounts', ['logout'])
  }
}
</script>

<template lang="pug">
.quick-links.full-width
  .row.q-col-gutter-md.q-pa-md
    .col-6
      q-btn.fit(:to="{ path: '/preview/wallet' }" unelevated color="grey-4" size="0.9em")
        q-icon.q-pa-md(color="primary" size="lg" name="fas fa-wallet")
        .item-subtitle2.text-no-wrap.text-primary My Wallet
    .col-6
      q-btn.fit(:to="{ path: `/preview/@${username}` }" unelevated color="grey-4" size="0.9em")
        q-icon.q-pa-md(color="primary" size="lg" name="far fa-user")
        .item-subtitle2.text-no-wrap.text-primary My Profile
    .col-6
      q-btn.fit(@click="logout" unelevated color="grey-4" size="0.9em")
        q-icon.q-pa-md(color="primary" size="lg" name="fas fa-door-open")
        .item-subtitle2.text-no-wrap.text-primary Logout
    .col-6
      q-btn.fit(:to="{ path: '/preview/proposals/create' }" unelevated color="grey-4" size="0.9em")
        q-icon.q-pa-md(color="primary" size="lg" name="fas fa-file-medical")
        .item-subtitle2.text-no-wrap.text-primary New Proposal
</template>
