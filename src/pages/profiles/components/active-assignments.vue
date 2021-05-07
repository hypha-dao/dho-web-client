<script>
export default {
  name: 'active-assignments',
  components: {
    Widget: () => import('~/components/widget.vue')
  }
}
</script>

<template lang="pug">
widget(title="Active Assignments")
  .text-body2 You have no active assignments
</template>
