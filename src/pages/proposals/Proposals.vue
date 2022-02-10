<script>
export default {
  name: 'page-proposals'
}
</script>

<template lang="pug">
q-page.page-proposals
  keep-alive(include="active-proposals")
    router-view
</template>
