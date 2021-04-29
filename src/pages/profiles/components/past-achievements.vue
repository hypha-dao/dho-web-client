<script>
export default {
  name: 'past-achievements',
  components: {
    Widget: () => import('~/components/widget.vue')
  }
}
</script>

<template lang="pug">
widget(bar title="Past Achievements")
  .text-body2.q-px-sm You have no past achievements
</template>
