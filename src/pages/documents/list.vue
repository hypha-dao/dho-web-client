<script>
import BadgeList from '~/pages/badges/list/badge-list'
import RoleList from '~/pages/roles/list/role-list'
import AssignmentList from '~/pages/assignments/list/assignment-list'

export default {
  name: 'list',
  components: { BadgeList, RoleList, AssignmentList }
}
</script>

<template lang="pug">
q-page.q-pa-lg(:style-fn="breadcrumbsTweak")
  .documents-list
    badge-list(v-if="$route.params.type === 'badge'")
    role-list(v-if="$route.params.type === 'role'")
    assignment-list(v-if="$route.params.type === 'assignment'")
</template>

<style lang="stylus" scoped>

</style>
