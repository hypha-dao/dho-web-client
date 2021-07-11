<script>
export default {
  name: 'page-support',
  components: {
    Widget: () => import('~/components/common/widget.vue')
  }
}
</script>

<template lang="pug">
q-page.page-support
  widget(title="Support")
</template>
