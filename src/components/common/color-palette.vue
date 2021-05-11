<script>
/**
 * This component is only used by storybook to document the custom colors used.
 */
export default {
  name: 'color-palette'
}
</script>

<template lang="pug">
.q-gutter-sm
  .row.q-gutter-sm
    .box.bg-primary
    .box.bg-secondary
    .box.bg-accent
    .box.bg-positive
    .box.bg-negative
    .box.bg-info
    .box.bg-warning
  .row.q-gutter-sm
    // .box.bg-assignment UNUSED
    .box.bg-hire
    // .box.bg-hire-light UNUSED
    .box.bg-proposal
    // .box.bg-proposal-light UNUSED
    // .box.bg-payment UNUSED
    // .box.bg-deferred UNUSED
    .box.bg-liquid
    .box.bg-seeds
    .box.bg-draft
</template>

<style lang="stylus" scoped>
.box
  width 40px
  height 40px
</style>
