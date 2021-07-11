<script>
export default {
  name: 'page-activity',
  components: {
    Widget: () => import('~/components/common/widget.vue')
  }
}
</script>

<template lang="pug">
q-page.page-activity
  widget(title="Activity")
</template>
