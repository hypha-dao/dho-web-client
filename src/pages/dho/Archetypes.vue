<script>
import RoleList from '~/pages/roles/list/role-list'

export default {
  name: 'archetypes',
  components: { RoleList }
}
</script>

<template lang="pug">
q-page.q-pa-lg
  .documents-list
    role-list
</template>
