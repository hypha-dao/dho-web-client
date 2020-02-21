<script>
import { mapMutations } from 'vuex'

export default {
  name: 'layout-left-menu',
  methods: {
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    displayRoleForm () {
      this.setShowRightSidebar(true)
      this.setRightSidebarType('roleForm')
      this.$emit('close')
    }
  }
}
</script>

<template lang="pug">
  q-scroll-area.fit.bg-grey-3
    q-list(
      :bordered="false"
      dense
    )
      q-item
        q-item-section
        q-item-section(side)
          q-btn(
            icon="fas fa-times"
            round
            dense
            unelevated
            color="white"
            text-color="black"
            @click="$emit('close')"
          )
      q-item.text-black(to="/")
        q-item-section(avatar)
          q-icon(name="fa fa-home")
        q-item-section
          strong My Actions
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
          strong Members
      q-item(
        to="/applicants"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section Enroll Registrants
      q-separator.q-my-sm
      q-item(to="/roles")
        q-item-section(avatar)
          q-icon(name="fas fa-suitcase")
        q-item-section
          strong Roles
        q-item-section(side)
          q-btn(
            color="red"
            text-color="white"
            icon="fas fa-plus"
            round
            dense
            unelevated
            size="xs"
            @click="displayRoleForm"
          )
      q-item(
        to="/proposals/role"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
        q-item-section Vote on Roles

</template>

<style lang="stylus" scoped>

</style>
