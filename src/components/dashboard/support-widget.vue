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
  .text-caption.q-pl-sm Coming Soon
</template>
