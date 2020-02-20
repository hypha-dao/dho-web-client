<script>
export default {
  name: 'layout-left-menu'
}
</script>

<template lang="pug">
  q-scroll-area.fit
    q-list
      q-expansion-item(
        expand-separator
        label="Roles"
        default-opened
      )
        q-item(
          to="/proposals/role"
          exact
          clickable
          v-ripple
        )
          q-item-section(avatar)
            q-icon(name="fa fa-lightbulb")
          q-item-section Endorse Roles
      q-expansion-item(
        expand-separator
        label="Assignments"
        default-opened
      )
        q-item(
          to="/roles"
          exact
          clickable
          v-ripple
        )
          q-item-section(avatar)
            q-icon(name="fa fa-user-tag")
          q-item-section Roles
      q-expansion-item(
        expand-separator
        label="Members"
        default-opened
      )
        q-item(
          to="/applicants"
          exact
          clickable
          v-ripple
        )
          q-item-section(avatar)
            q-icon(name="fa fa-user")
          q-item-section Enroll Registrants
</template>

<style lang="stylus" scoped>

</style>
