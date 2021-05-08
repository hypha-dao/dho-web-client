<script>
export default {
  name: 'past-achievements',
  components: {
    Widget: () => import('~/components/common/widget.vue')
  }
}
</script>

<template lang="pug">
widget(title="Past Achievements")
  .text-body2 You have no past achievements
</template>
