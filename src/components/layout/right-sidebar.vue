<script>
import { mapGetters } from 'vuex'
import RightMenuNotifications from '~/components/layout/right-menu-notifications'
import RoleForm from '~/pages/roles/components/role-form'
import RoleProposalView from '~/pages/roles/components/role-proposal-view'

export default {
  name: 'right-sidebar',
  components: { RightMenuNotifications, RoleForm, RoleProposalView },
  computed: {
    ...mapGetters('layout', ['isShowRightSidebar', 'rightSidebarType', 'contentData'])
  }
}
</script>

<template lang="pug">
q-drawer(
  v-model="isShowRightSidebar"
  side="right"
  overlay
  bordered
  :width="400"
)
  right-menu-notifications(v-show="rightSidebarType === 'notifications'")
  role-form(v-if="rightSidebarType === 'roleForm'")
  role-proposal-view(
    v-if="rightSidebarType === 'rolesProposalView'"
    :role="contentData"
  )
</template>

<style lang="stylus" scoped>

</style>
