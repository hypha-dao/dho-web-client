<script>
export default {
  name: 'assignment-claim-extend',

  props: {
    stacked: Boolean
  }
}
</script>

<template lang="pug">
div
  .row.q-pb-md
    .q-pa-xs(:class="{ 'col-12': stacked, 'col-6': !stacked }")
      q-btn.full-width(color="primary" rounded unelevated)
        .row.full-width.justify-between.items-center
          .spacer(:style="{ width: '20px' }")
          | Claim All
          q-badge(rounded color="white" text-color="primary" label="2")
    .q-pa-xs(:class="{ 'col-12': stacked, 'col-6': !stacked }")
      q-btn.full-width(color="grey-4" text-color="grey-7" disable rounded unelevated) Extend in 24 Days
</template>
