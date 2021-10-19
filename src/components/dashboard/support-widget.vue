<script>
export default {
  name: 'support-widget',
  components: {
    Widget: () => import('../common/widget.vue')
  }
}
</script>

<template lang="pug">
widget.full-height(title="Need support?")
  .text-caption.q-pl-sm.q-mt-lg Lorem ipsum dolor sit amet, consectetur adipiscing
  .row.justify-between.q-mt-lg
    .col-auto
      q-btn.q-mt-md.q-px-sm.text-white(rounded color="primary" type="a" href="https://notepad.hypha.earth/5dC66nNXRVGpb1aTHaRJXw" target="blank") Documentation
    .col
      q-btn.q-mt-md.q-ml-sm(round color="primary" icon="fab fa-discord" size="0.7rem")
</template>
