<script>
export default {
  name: 'left-navigation',

  props: {
    dho: {
      type: Object,
      default: () => {
        return {
          name: 'Hypha DHO',
          img: 'app-logo-128x128.png'
        }
      }
    },
    width: {
      type: Number,
      default: 80
    }
  },

  methods: {
    isActive (tab) {
      switch (tab) {
        case 'dashboard': return this.$route.name === 'dho-home'
        case 'proposals': return this.$route.path.includes('proposals')
        case 'members': return this.$route.path.includes('members')
        case 'organization': return this.$route.path.includes('organization')
      }

      return false
    }
  }
}
</script>

<template lang="pug">
.left-navigation(:style="{ width: `${width}px` }")
  .column.window-height
    .col
      .row.justify-center.q-pt-xl
        q-btn.q-ma-sm(round :to="{ name: 'dho-home' }")
          q-avatar(size="48px")
            img(:src="dho.img")
          q-tooltip(
            anchor="center right"
            self="center left"
            :content-style="{ 'font-size': '1em' }"
          ) {{ dho.name }}
    .col
      .row.justify-center
        q-btn.q-ma-md(:flat="!isActive('dashboard')" padding="12px" icon="fas fa-home" :color="isActive('dashboard') ? 'primary' : 'grey-5'" :to="{ name: 'dho-home' }")
          q-tooltip(anchor="center right" self="center left" :content-style="{ 'font-size': '1em' }") Dashboard
        q-btn.q-ma-md(:flat="!isActive('proposals')" padding="12px" icon="far fa-file-alt" :color="isActive('proposals') ? 'primary' : 'grey-5'" :to="{ name: 'active-proposals' }")
          q-tooltip(anchor="center right" self="center left" :content-style="{ 'font-size': '1em' }") Proposals
        q-btn.q-ma-md(:flat="!isActive('members')" padding="12px" icon="fas fa-users" :color="isActive('members') ? 'primary' : 'grey-5'"  :to="{ name: 'members' }")
          q-tooltip(anchor="center right" self="center left" :content-style="{ 'font-size': '1em' }") Members
        q-btn.q-ma-md(:flat="!isActive('organization')" padding="12px" icon="fas fa-globe" :color="isActive('organization') ? 'primary' : 'grey-5'"  :to="{ name: 'organization' }")
          q-tooltip(anchor="center right" self="center left" :content-style="{ 'font-size': '1em' }") Organization
    .col
      .row.full-height.justify-center.items-end.q-pb-xl
        q-btn(fab flat icon="fas fa-plus" color="primary")
</template>
