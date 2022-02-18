<script>

export default {
  name: 'member-banner'
}
</script>

<template lang="pug">
.member-banner.full-width.bg-primary
  .q-pa-xl
    .row
      .col-7
        .column.justify-between
          .text-white.text-h4
            span.text-weight-thin.q-mb-lg Great vision
            span.text-bold.on-right without great people
            span.text-weight-thin.q-mb-lg.on-right is irrelevant
          .text-white.text-body2.q-my-lg Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          .row.q-gutter-sm
            q-btn.q-px-lg(color="secondary" no-caps unelevated rounded label="Become a member" @click="$emit('onApply')")
            q-btn(color="white" no-caps flat rounded label="Copy invite link"  @click="$emit('onCoppyLink')")
</template>

<style lang="stylus" scoped>
.member-banner
  border-radius 32px
  height 300px
</style>
