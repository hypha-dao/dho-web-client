<script>
export default {
  name: 'step-proposal-type',
  props: {
    type: String
  }
}
</script>

<template lang="pug">
.column
  .text-h6 Choose a contribution type
  .row.q-col-gutter-md.q-pa-md
    .col-3
      q-btn.fit(unelevated color="grey-4" size="0.9em")
        q-icon.q-pa-md(color="primary" size="lg" name="fas fa-wallet")
        .item-subtitle2.text-no-wrap.text-primary Contribution
    .col-3
      q-btn.fit(unelevated color="grey-4" size="0.9em")
        q-icon.q-pa-md(color="primary" size="lg" name="far fa-user")
        .item-subtitle2.text-no-wrap.text-primary Assignment
    .col-3
      q-btn.fit(unelevated color="grey-4" size="0.9em")
        q-icon.q-pa-md(color="primary" size="lg" name="fas fa-door-open")
        .item-subtitle2.text-no-wrap.text-primary Badge
    .col-3
      q-btn.fit(unelevated color="grey-4" size="0.9em")
        q-icon.q-pa-md(color="primary" size="lg" name="fas fa-file-medical")
        .item-subtitle2.text-no-wrap.text-primary Suspension

</template>
