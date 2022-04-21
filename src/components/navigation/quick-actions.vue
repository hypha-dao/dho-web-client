<script>
export default {
  name: 'quick-actions'
}
</script>

<template lang="pug">
.quick-actions.full-width.q-px-lg
  .row
    .text-h6.text-bold Quick Actions
  .row.items-center.q-my-lg
    q-btn.q-mr-md(rounded unelevated color="primary" icon="far fa-file-alt" padding="12px" size="sm")
    .text-body2
      .text-bold Complete draft
      .text-body You have a draft proposal to complete
  .row.items-center.q-my-lg
    q-btn.q-mr-md(rounded unelevated color="primary" icon="far fa-calendar-alt" padding="12px" size="sm")
      q-badge(floating rounded color="red" label="2")
    .text-body2
      .text-bold Claim periods
      .text-body You have 2 periods to claim
  .row.items-center.q-my-lg
    q-btn.q-mr-md(rounded unelevated color="primary" icon="fas fa-sliders-h" padding="12px" size="sm")
    .text-body2
      .text-bold Adjust commitment
      .text-body.text-ellipsis For a specific period of time
  .row.items-center.q-mt-lg
    q-btn.q-mr-md(disable unelevated rounded color="internal-bg" text-color="grey-7" icon="far fa-clock" padding="12px" size="sm")
    .text-body2
      .text-bold Extend assignment
      .text-body Extend your assignment in 24 days
</template>
