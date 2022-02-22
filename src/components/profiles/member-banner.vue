<script>

export default {
  name: 'member-banner',
  props: {
    isApplied: Boolean
  }
}
</script>

<template lang="pug">
.member-banner.full-width.bg-primary
  .q-pa-xl
    .row
      .col-7
        .column.justify-between
          .text-white.text-h4
            span.h2.text-white.q-mb-lg Great vision
            span.h1.text-white.on-right without great people
            span.h2.text-white.q-mb-lg.on-right is irrelevant
          .text-white.text-body2.q-my-lg Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          .row.q-gutter-sm
            q-btn.q-px-lg.h7(color="secondary" no-caps unelevated rounded label="Become a member" @click="$emit('onApply')" :disable="isApplied")
            q-btn(class="h7" color="white" no-caps flat rounded label="Copy invite link"  @click="$emit('onCoppyLink')")
</template>

<style lang="stylus" scoped>
.member-banner
  border-radius 32px
  height 300px
</style>
