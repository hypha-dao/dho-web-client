<script>
export default {
  name: 'left-navigation',
  components: {
    DhoBtn: () => import('./dho-btn.vue')
  },

  props: {
    dho: {
      type: Object,
      default: () => {
        return {
          name: 'Hypha DHO',
          icon: 'hypha-logo.svg'
        }
      }
    },
    width: {
      type: Number,
      default: 80
    }
  },

  data () {
    return {
      expanded: false
    }
  },

  methods: {
    imgSrc (img) {
      return require('~/assets/logos/' + img)
    },

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
.left-navigation(:style="{ width: `${width}px` }")
  .column.window-height
    .col-4.q-px-sm(:class="{'col-8': expanded }")
      .column.full-height
        .col-auto.justify-center.q-pt-xl
          dho-btn(v-bind="dho" @click="expanded=!expanded")
        .col-auto.q-mt-xs
          .column(v-if="expanded")
            .col-auto
              dho-btn(v-bind="dho" @click="expanded=!expanded")
            .col-auto
              dho-btn(v-bind="dho")
            .col-auto
              dho-btn(v-bind="dho")
        .col-auto.q-my-sm.q-px-sm
          .full-width.border-bot
    .col-4(v-if="!expanded")
      .row.justify-center
        q-btn.q-ma-md(:flat="!isActive('dashboard')" unelevated rounded padding="12px" icon="fas fa-home"  size="sm" :color="isActive('dashboard') ? 'primary' : 'grey-5'" :to="{ name: 'dho-home' }")
          q-tooltip(anchor="center right" self="center left" :content-style="{ 'font-size': '1em' }") Dashboard
        q-btn.q-ma-md(:flat="!isActive('proposals')" unelevated rounded padding="12px" icon="far fa-file-alt"  size="sm" :color="isActive('proposals') ? 'primary' : 'grey-5'" :to="{ name: 'active-proposals' }")
          q-tooltip(anchor="center right" self="center left" :content-style="{ 'font-size': '1em' }") Proposals
        q-btn.q-ma-md(:flat="!isActive('members')" unelevated rounded padding="12px" icon="fas fa-users"  size="sm" :color="isActive('members') ? 'primary' : 'grey-5'"  :to="{ name: 'members' }")
          q-tooltip(anchor="center right" self="center left" :content-style="{ 'font-size': '1em' }") Members
        q-btn.q-ma-md(:flat="!isActive('organization')" unelevated rounded padding="12px" icon="far fa-flag"  size="sm" :color="isActive('organization') ? 'primary' : 'grey-5'"  :to="{ name: 'organization' }")
          q-tooltip(anchor="center right" self="center left" :content-style="{ 'font-size': '1em' }") Organization
    .col-4
      .row.full-height.justify-center.items-end.q-pb-xl
        q-btn.q-ma-md(:flat="!isActive('explore')" rounded padding="12px" icon="fas fa-globe" :color="isActive('explore') ? 'primary' : 'grey-5'"  :to="{ name: 'explore' }")
          q-tooltip(anchor="center right" self="center left" :content-style="{ 'font-size': '1em' }") Explore
</template>

<style lang="stylus" scoped>
.border-bot
  border-bottom 1px solid $grey-4
</style>
