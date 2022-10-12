<script>
export default {
  name: 'bottom-navigation',

  methods: {
    isActive (tab) {
      switch (tab) {
        case 'dashboard': return this.$route.name === 'dashboard'
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
    q-btn.q-my-md(:flat="!isActive('dashboard')" unelevated rounded padding="12px" icon="fas fa-home"  size="sm" :color="isActive('dashboard') ? 'primary' : 'disabled'" :to="{ name: 'dashboard' }")
    q-btn.q-my-md(:flat="!isActive('proposals')" unelevated rounded padding="12px" icon="far fa-file-alt"  size="sm" :color="isActive('proposals') ? 'primary' : 'disabled'" :to="{ name: 'proposals' }")
    q-btn.q-my-md(:flat="!isActive('members')" unelevated rounded padding="12px" icon="fas fa-users"  size="sm" :color="isActive('members') ? 'primary' : 'disabled'"  :to="{ name: 'members' }")
    q-btn.q-my-md(:flat="!isActive('organization')" unelevated rounded padding="12px" icon="fas fa-building"  size="sm" :color="isActive('organization') ? 'primary' : 'disabled'"  :to="{ name: 'organization' }")
    q-btn.q-my-md(:flat="!isActive('explore')" unelevated rounded padding="12px" icon="fas fa-globe" size="sm" :color="isActive('explore') ? 'primary' : 'disabled'"  :to="{ name: 'explore' }")
</template>

<style lang="stylus" scoped>
a:hover{
  color: white !important;
}

</style>
