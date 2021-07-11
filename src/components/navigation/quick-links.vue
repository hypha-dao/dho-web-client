<script>
export default {
  name: 'quick-links'
}
</script>

<template lang="pug">
.quick-links.full-width
  .row.q-col-gutter-md.q-pa-md
    .col-6
      q-btn.fit(:to="{ path: '/bm/wallet' }" unelevated color="grey-4" size="0.9em")
        q-icon.q-pa-md(color="primary" size="lg" name="fas fa-wallet")
        .item-subtitle2.text-no-wrap.text-primary My Wallet
    .col-6
      q-btn.fit(:to="{ path: '/bm/@johnnyhypha1' }" unelevated color="grey-4" size="0.9em")
        q-icon.q-pa-md(color="primary" size="lg" name="far fa-user")
        .item-subtitle2.text-no-wrap.text-primary My Profile
    .col-6
      q-btn.fit(:to="{ path: '/bm/support' }" unelevated color="grey-4" size="0.9em")
        q-icon.q-pa-md(color="primary" size="lg" name="far fa-file-alt")
        .item-subtitle2.text-no-wrap.text-primary Support
    .col-6
      q-btn.fit(:to="{ path: '/bm/proposals/create' }" unelevated color="grey-4" size="0.9em")
        q-icon.q-pa-md(color="primary" size="lg" name="fas fa-file-medical")
        .item-subtitle2.text-no-wrap.text-primary New Proposal
</template>
