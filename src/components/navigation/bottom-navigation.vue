<script>
export default {
  name: 'bottom-navigation',

  methods: {
    isActive (tab) {
      switch (tab) {
        case 'dashboard': return this.$route.name === 'dho-home'
        case 'proposals': return this.$route.path.includes('proposals')
        case 'members': return this.$route.path.includes('members')
        case 'organization': return this.$route.path.includes('organization')
        case 'explore': return this.$route.path.includes('explore')
      }

      return false
    }
  }
}
</script>

<template lang="pug">
.bottom-navigation.full-width.full-height
  .row.justify-evenly
    q-btn.q-my-md(:flat="!isActive('dashboard')" unelevated rounded padding="12px" icon="fas fa-home"  size="sm" :color="isActive('dashboard') ? 'primary' : 'grey-5'" :to="{ name: 'dho-home' }")
      q-tooltip(anchor="top middle" self="bottom middle" :content-style="{ 'font-size': '1em' }") Dashboard
    q-btn.q-my-md(:flat="!isActive('proposals')" unelevated rounded padding="12px" icon="far fa-file-alt"  size="sm" :color="isActive('proposals') ? 'primary' : 'grey-5'" :to="{ name: 'active-proposals' }")
      q-tooltip(anchor="top middle" self="bottom middle" :content-style="{ 'font-size': '1em' }") Proposals
    q-btn.q-my-md(:flat="!isActive('members')" unelevated rounded padding="12px" icon="fas fa-users"  size="sm" :color="isActive('members') ? 'primary' : 'grey-5'"  :to="{ name: 'members' }")
      q-tooltip(anchor="top middle" self="bottom middle" :content-style="{ 'font-size': '1em' }") Members
    q-btn.q-my-md(:flat="!isActive('organization')" unelevated rounded padding="12px" icon="far fa-flag"  size="sm" :color="isActive('organization') ? 'primary' : 'grey-5'"  :to="{ name: 'organization' }")
      q-tooltip(anchor="top middle" self="bottom middle" :content-style="{ 'font-size': '1em' }") Organization
    q-btn.q-my-md(:flat="!isActive('explore')" unelevated rounded padding="12px" icon="fas fa-globe" size="sm" :color="isActive('explore') ? 'primary' : 'grey-5'"  :to="{ name: 'explore' }")
      q-tooltip(anchor="top middle" self="bottom middle" :content-style="{ 'font-size': '1em' }") Explore
</template>
