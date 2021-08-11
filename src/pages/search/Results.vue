<script>
export default {
  name: 'page-search-results',
  components: {
    Widget: () => import('~/components/common/widget.vue')
  }
}
</script>

<template lang="pug">
q-page.page-search-results
  widget(title="Search Results")
</template>
