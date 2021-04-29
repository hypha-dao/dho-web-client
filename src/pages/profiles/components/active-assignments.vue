<script>
export default {
  name: 'active-assignments',
  components: {
    Widget: () => import('~/components/widget.vue')
  }
}
</script>

<template lang="pug">
widget(bar title="Active Assignments")
  .text-body2.q-px-sm You have no active assignments
</template>
