<script>
export default {
  name: 'header-menu'
}
</script>

<template lang="pug">
q-tabs(
  class="text-grey"
  active-color="primary"
  indicator-color="primary"
)
  q-route-tab(
    label="Dashboard"
    exact
    to="/"
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
