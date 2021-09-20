<script>
export default {
  name: 'new-members',
  components: {
    Widget: () => import('../common/widget.vue')
  },

  props: {
    members: Array
  }
}
</script>

<template lang="pug">
widget(title="New Members")
  .text-caption.q-pl-sm Coming Soon
</template>
