<script>
import { mapGetters, mapMutations } from 'vuex'
import RightMenuNotifications from '~/components/layout/right-menu-notifications'
import RoleForm from '~/pages/roles/components/role-form'
import RoleProposalView from '~/pages/roles/components/role-proposal-view'
import RoleView from '~/pages/roles/components/role-view'
import AssignmentForm from '~/pages/assignments/components/assignment-form'
import AssignmentProposalView from '~/pages/assignments/components/assignment-proposal-view'

export default {
  name: 'right-sidebar',
  components: { RightMenuNotifications, RoleForm, RoleProposalView, RoleView, AssignmentForm, AssignmentProposalView },
  data () {
    return {
      display: false
    }
  },
  computed: {
    ...mapGetters('layout', ['isShowRightSidebar', 'rightSidebarType', 'contentData'])
  },
  methods: {
    ...mapMutations('layout', ['setShowRightSidebar'])
  },
  watch: {
    isShowRightSidebar: {
      immediate: true,
      handler (val) {
        this.display = val
      }
    }
  }
}
</script>

<template lang="pug">
q-drawer(
  v-model="display"
  side="right"
  overlay
  bordered
  :width="400"
  behavior="mobile"
  @hide="setShowRightSidebar(false)"
)
  right-menu-notifications(v-show="rightSidebarType === 'notifications'")
  role-form(v-if="rightSidebarType === 'roleForm'")
  role-proposal-view(
    v-if="rightSidebarType === 'roleProposalView'"
    :role="contentData"
  )
  role-view(
    v-if="rightSidebarType === 'roleView'"
    :role="contentData"
  )
  assignment-form(
    v-if="rightSidebarType === 'assignmentForm'"
    :role="contentData"
  )
  assignment-proposal-view(
    v-if="rightSidebarType === 'assignmentProposalView'"
    :assignment="contentData"
  )
</template>

<style lang="stylus" scoped>

</style>
