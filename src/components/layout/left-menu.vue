<script>
export default {
  name: 'layout-left-menu'
}
</script>

<template lang="pug">
  q-scroll-area.fit
    q-list
      q-item(
        to="/proposals"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
          q-icon(name="fa fa-lightbulb")
        q-item-section Proposals
      q-item(
        to="/roles"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
          q-icon(name="fa fa-user-tag")
        q-item-section Roles
      q-item(
        to="/assignments"
        exact
        clickable
        v-ripple
      )
        q-item-section(avatar)
          q-icon(name="fa fa-tasks")
        q-item-section Assignments
</template>

<style lang="stylus" scoped>

</style>
