<script>
export default {
  name: 'proposal-banner'
}
</script>

<template lang="pug">
q-card.proposal-banner.full-width(flat)
  .q-px-xl.q-py-lg
    .row.items-center
      .col-8
        .text-white
          .text-h4.text-bold.q-mb-lg Every vote counts
          .text-body2 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      .col-4
        .row.items-center.q-ma-md
          q-btn.q-mr-md(unelevated color="white" text-color="primary" icon="fas fa-vote-yea")
          .col.text-white
            span.text-h6 Unity
            span.text-overline.on-right (80% min)
            .text-body2 Of all votes cast on a proposal, 80% must be in favor for a proposal to pass
        .row.items-center.q-ma-md
          q-btn.q-mr-md(unelevated color="white" text-color="primary" icon="fas fa-users")
          .col.text-white
            span.text-h6 Quorum
            span.text-overline.on-right (20% min)
            .text-body2 The minimum % of the total vote supply that must be cast for a proposal to be considered
</template>

<style lang="stylus" scoped>
.proposal-banner
  background linear-gradient(90deg, #3e3b46 0%, #575261 100%);
  border-radius 32px
</style>
