<script>
export default {
  name: 'navigation-header'
}
</script>

<template lang="pug">
.navigation-header.bg-white.full-width
  q-toolbar.full-width
    q-tabs(align="justify").full-width
      q-route-tab.q-ml-md(:to="{ name: 'dho-home' }") Home
      q-route-tab(:to="{ name: 'active-proposals' }") Proposals
      q-route-tab(:to="{ name: 'members' }") Members
      q-route-tab.q-mr-md(:to="{ name: 'organization' }")
        .row.items-center.justify-center
          .on-left Organization
          q-btn-dropdown(auto-close flat)
            q-list
              q-item(clickable) Circles
              q-item(clickable :to="{ name: 'archetypes' }") Archetypes
              q-item(clickable) Badges
              q-item(clickable) Policies
              q-item(clickable) Alliances
              q-item(clickable) Treasury
              q-item(clickable) Admin
</template>

<style lang="stylus" scoped>
.navigation-header
  border-radius 46px
</style>
