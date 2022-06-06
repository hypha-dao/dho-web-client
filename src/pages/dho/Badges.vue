<script>
import BadgeList from '~/pages/badges/list/badge-list'

export default {
  name: 'badges',
  components: { BadgeList }
}
</script>

<template lang="pug">
q-page.q-pa-lg
  .documents-list
    badge-list
</template>
