<script>
export default {
  name: 'open-proposals',
  components: {
    Widget: () => import('~/components/common/widget.vue')
  }
}
</script>

<template lang="pug">
widget(:title="$t('profiles.open-proposals.openProposals')")
  .flex.q-gutter-md
</template>
