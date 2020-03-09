<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'layout-left-menu',
  computed: {
    ...mapGetters('accounts', ['isAuthenticated', 'isMember'])
  },
  methods: {
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    displayForm (type) {
      this.setShowRightSidebar(true)
      this.setRightSidebarType(`${type}Form`)
      this.$emit('close')
    }
  }
}
</script>

<template lang="pug">
  q-scroll-area.fit.bg-grey-3
    q-list.menu(
      :bordered="false"
      dense
    )
      q-item.q-mt-md.text-black(to="/")
        q-item-section(avatar)
          q-icon(name="fa fa-home")
        q-item-section
          strong Activities
      q-item(
        to="/roles"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section Apply for Role
      q-separator.q-my-sm
      q-item.text-black(to="/members")
        q-item-section(avatar)
          q-icon(name="fas fa-user-friends")
        q-item-section
          strong Participants
      q-item(
        to="/applicants"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section Enroll Org Members
      q-item(
        to="/proposals/assignment"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section Enroll Role Applicants
      q-separator.q-my-sm
      q-item
        q-item-section(avatar)
          q-icon(name="fas fa-suitcase")
        q-item-section
          strong Proposals
      q-item(
        to="/proposals/role"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section Endorse Roles
      q-item(
        to="/proposals/contribution"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section Endorse Contributions
      q-separator.q-my-sm
      q-item
        q-item-section(avatar)
          q-icon(name="fas fa-handshake")
        q-item-section
          strong Agreements
      q-item(
        to="/roles"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section Browse Roles
      q-item(
        to="/assignments"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section Browse Assignments

</template>

<style lang="stylus" scoped>
.close-btn
  margin-top 10px
.btn-add
  margin-right 17px
.menu
  font-size 16px
</style>
