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
  .text-caption.q-pl-sm Lorem ipsum dolor sit amet, consectetur adipiscing
  q-btn.q-mt-md.q-px-lg.text-white(rounded color="primary") Click Here
</template>
