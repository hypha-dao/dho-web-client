<script>
import BadgeList from '~/pages/badges/list/badge-list'
export default {
  name: 'list',
  components: { BadgeList }
}
</script>

<template lang="pug">
q-page.q-pa-lg(:style-fn="breadcrumbsTweak")
  .documents-list
    badge-list(v-if="$route.params.type === 'badge'")
</template>

<style lang="stylus" scoped>

</style>
