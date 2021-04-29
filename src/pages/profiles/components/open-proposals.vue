<script>
export default {
  name: 'open-proposals',
  components: {
    Widget: () => import('~/components/widget.vue')
  }
}
</script>

<template lang="pug">
widget(bar title="Open Proposals")
  .flex.q-gutter-md.q-px-sm
</template>
