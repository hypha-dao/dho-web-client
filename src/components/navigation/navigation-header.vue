<script>
export default {
  name: 'navigation-header'
}
</script>

<template lang="pug">
.navigation-header.bg-white.full-width
  q-toolbar.full-width
    q-tabs.full-width(align="justify")
      q-route-tab.q-ml-md(:to="{ name: 'dashboard' }") {{ $t('navigation.navigation-header.home') }}
      q-route-tab(:to="{ name: 'proposals' }") {{ $t('navigation.navigation-header.proposals') }}
      q-route-tab(:to="{ name: 'members' }") {{ $t('navigation.navigation-header.members') }}
      q-route-tab.q-mr-md(:to="{ name: 'organization' }")
        .row.items-center.justify-center
          .on-left {{ $t('navigation.navigation-header.organization') }}
          q-btn-dropdown(auto-close="auto-close" flat="flat")
            q-list
              q-item(clickable="clickable") {{ $t('navigation.navigation-header.circles') }}
              q-item(clickable="clickable" :to="{ name: 'archetypes' }") {{ $t('navigation.navigation-header.archetypes') }}
              q-item(clickable="clickable") {{ $t('navigation.navigation-header.badges') }}
              q-item(clickable="clickable") {{ $t('navigation.navigation-header.policies') }}
              q-item(clickable="clickable") {{ $t('navigation.navigation-header.alliances') }}
              q-item(clickable="clickable") {{ $t('navigation.navigation-header.treasury') }}
              q-item(clickable="clickable") {{ $t('navigation.navigation-header.admin') }}

</template>

<style lang="stylus" scoped>
.navigation-header
  border-radius 46px
</style>
