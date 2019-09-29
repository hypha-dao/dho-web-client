<script>
export default {
  name: 'layout-left-menu'
}
</script>

<template lang="pug">
  q-scroll-area.fit
    q-list
      q-expansion-item(
        :content-inset-level="0.5"
        expand-separator
        icon="fa fa-user"
        label="Roles"
        default-opened
      )
        q-list
          q-item(
            to="/roles"
            exact
            clickable
            v-ripple
          )
            q-item-section(avatar)
              q-icon(name="fa fa-user-check")
            q-item-section Active roles
          q-item(
            to="/roles/proposals"
            clickable
            v-ripple
          )
            q-item-section(avatar)
              q-icon(name="fas fa-person-booth")
            q-item-section Proposals
          q-item(
            to="/roles/history"
            clickable
            v-ripple
          )
            q-item-section(avatar)
              q-icon(name="fas fa-times-circle")
            q-item-section Closed proposals
      q-separator
      q-expansion-item(
        v-if="false"
        :content-inset-level="0.5"
        expand-separator
        icon="fa fa-tasks"
        label="Assignments"
      )
        q-list
          q-item(
            to="/assignments"
            clickable
            v-ripple
          )
            q-item-section(avatar)
              q-icon(name="fa fa-user-check")
            q-item-section Active assignments
          q-item(
            to="/assignments/proposals"
            clickable
            v-ripple
          )
            q-item-section(avatar)
              q-icon(name="fas fa-person-booth")
            q-item-section Proposals
          q-item(
            to="/assignments/history"
            clickable
            v-ripple
          )
            q-item-section(avatar)
              q-icon(name="fas fa-times-circle")
            q-item-section Closed proposals

</template>

<style lang="stylus" scoped>

</style>
