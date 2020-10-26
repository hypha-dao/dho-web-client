<script>
import { mapGetters, mapMutations } from 'vuex'
import RightMenuNotifications from '~/components/layout/right-menu-notifications'
import RoleForm from '~/pages/roles/components/role-form'
import RoleProposalView from '~/pages/roles/components/role-proposal-view'
import RoleView from '~/pages/roles/components/role-view'
import AssignmentForm from '~/pages/assignments/components/assignment-form'
import AssignmentProposalView from '~/pages/assignments/components/assignment-proposal-view'
import AssignmentView from '~/pages/assignments/components/assignment-view'
import ProfileForm from '~/pages/profiles/edit/profile-edit'
import PayoutForm from '~/pages/payouts/components/payout-form'
import PayoutProposalView from '~/pages/payouts/components/payout-proposal-view'
import PaymentView from '~/pages/payments/components/payment-view'
import ProfileRequired from '~/pages/profiles/components/profile-required-side'
import BadgeForm from '~/pages/badges/components/badge-form'
import BadgeProposalView from '~/pages/badges/components/badge-proposal-view'

export default {
  name: 'right-sidebar',
  components: {
    RightMenuNotifications,
    RoleForm,
    RoleProposalView,
    RoleView,
    AssignmentForm,
    AssignmentProposalView,
    AssignmentView,
    ProfileForm,
    PayoutForm,
    PayoutProposalView,
    PaymentView,
    ProfileRequired,
    BadgeForm,
    BadgeProposalView
  },
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
  :width="$q.platform.is.desktop ? 500 : '100%'"
  behavior="mobile"
  @hide="setShowRightSidebar(false)"
  no-swipe-close
  no-swipe-open
)
  right-menu-notifications(v-show="rightSidebarType === 'notifications'")
  role-form(
    v-if="rightSidebarType === 'roleForm'"
    :draft="contentData"
  )
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
    :draft="contentData"
  )
  assignment-proposal-view(
    v-if="rightSidebarType === 'assignmentProposalView'"
    :assignment="contentData"
  )
  assignment-view(
    v-if="rightSidebarType === 'assignmentView'"
    :data="contentData"
  )
  profile-form(v-if="rightSidebarType === 'profileForm'")
  payout-form(
    v-if="rightSidebarType === 'payoutForm'"
    :draft="contentData"
  )
  payout-proposal-view(
    v-if="rightSidebarType === 'payoutProposalView'"
    :payout="contentData"
  )
  payment-view(
    v-if="rightSidebarType === 'paymentView'"
    :payment="contentData"
  )
  profile-required(
    v-if="rightSidebarType === 'profileRequired'"
  )
  badge-form(
    v-if="rightSidebarType === 'badgeForm'"
    :draft="contentData"
  )
  badge-proposal-view(
    v-if="rightSidebarType === 'badgeProposalView'"
    :proposal="contentData"
  )
</template>

<style lang="stylus" scoped>

</style>
