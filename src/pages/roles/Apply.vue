<script>
import RoleList from '~/pages/roles/list/role-list'

export default {
  name: 'page-apply-role',
  components: { RoleList }
}
</script>

<template lang="pug">
q-page.q-pa-lg
  .documents-list
    role-list
</template>
