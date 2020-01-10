<script>
import { mapGetters } from 'vuex'

export default {
  name: 'header-menu',
  computed: {
    ...mapGetters('accounts', ['isAuthenticated'])
  }
}
</script>

<template lang="pug">
q-tabs(
  class="text-grey"
  active-color="primary"
  indicator-color="primary"
)
  q-route-tab(
    v-if="isAuthenticated"
    label="Dashboard"
    exact
    to="/dashboard"
  )
  q-route-tab(
    label="Member requests"
    exact
    to="/applicants"
  )
  q-route-tab(
    label="Members"
    exact
    to="/members"
  )
  q-route-tab(
    label="Proposals"
    exact
    to="/proposals"
  )
  q-route-tab(
    label="Roles"
    exact
    to="/roles"
  )
  q-route-tab(
    label="Assignments"
    exact
    to="/assignments"
  )
</template>

<style lang="stylus" scoped>

</style>
