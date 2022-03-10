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
          name: 'hypha',
          title: 'Hypha DHO',
          icon: 'hypha-logo.svg'
        }
      }
    },
    dhos: {
      type: Array,
      default: () => []
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

  computed: {
    activeTab () {
      if (this.$route.name === 'dashboard') return 'dashboard'
      if (this.$route.path.includes('proposals')) return 'proposals'
      if (this.$route.path.includes('members')) return 'members'
      if (this.$route.path.includes('organization')) return 'organization'
      if (this.$route.path.includes('explore')) return 'explore'
      return null
    },
    disabledSelector () {
      if (!this.dhos || this.dhos.length <= 1) {
        return true
      }
      return false
    }
  },

  methods: {
    imgSrc (img) {
      return require('~/assets/logos/' + img)
    },

    switchDao (name) {
      this.expanded = false
      this.$router.push({ name: this.activeTab || 'dashboard', params: { dhoname: name } })
    }
  }
}
</script>

<template lang="pug">
.left-navigation.full-width.full-height
  .column.full-height
    .col.bg-external-bg(:class="{'col': expanded, 'overTop': expanded }")
      .column
        .col-auto.justify-center.q-pt-xl
          dho-btn(:name="dho.name" :title="dho.title" :icon="dho.icon" :disable="disabledSelector"  @click="expanded=!expanded")
        .col-auto.q-mt-xs
          .column.dao-container(v-if="expanded")
            .row.full-width(v-for="dao in dhos")
              .full-width(:key="dao.name")
                dho-btn(v-bind="dao" @click="switchDao(dao.name)")
        .col-auto.q-my-sm.q-px-sm
          .full-width.border-bot
    .col-4.fixed-center
      .row.justify-center
        q-btn.q-ma-md(:flat="activeTab !== 'dashboard'" unelevated rounded padding="12px" icon="fas fa-home"  size="sm" :color="activeTab === 'dashboard' ? 'primary' : 'disabled'" :to="{ name: 'dashboard' }")
          q-tooltip(anchor="center right" self="center left" :content-style="{ 'font-size': '1em' }") Dashboard
        q-btn.q-ma-md(:flat="activeTab !== 'proposals'" unelevated rounded padding="12px" icon="far fa-file-alt"  size="sm" :color="activeTab === 'proposals' ? 'primary' : 'disabled'" :to="{ name: 'proposals' }")
          q-tooltip(anchor="center right" self="center left" :content-style="{ 'font-size': '1em' }") Proposals
        q-btn.q-ma-md(:flat="activeTab !== 'members'" unelevated rounded padding="12px" icon="fas fa-users"  size="sm" :color="activeTab === 'members' ? 'primary' : 'disabled'"  :to="{ name: 'members' }")
          q-tooltip(anchor="center right" self="center left" :content-style="{ 'font-size': '1em' }") Members
        q-btn.q-ma-md(:flat="activeTab !== 'organization'" unelevated rounded padding="12px" icon="far fa-flag"  size="sm" :color="activeTab === 'organization' ? 'primary' : 'disabled'"  :to="{ name: 'organization' }")
          q-tooltip(anchor="center right" self="center left" :content-style="{ 'font-size': '1em' }") Organization
    .col-4.fixed-bottom
      .row.full-height.justify-center.items-end.q-pb-lg
        q-btn.q-ma-md(:flat="activeTab !== 'explore'" unelevated rounded padding="12px" icon="fas fa-globe" size="sm" :color="activeTab === 'explore' ? 'primary' : 'disabled'"  :to="{ name: 'explore' }")
          q-tooltip(anchor="center right" self="center left" :content-style="{ 'font-size': '1em' }") Explore
</template>

<style lang="stylus" scoped>
.overTop
  z-index: 2
  overflow: 'auto'
  max-height: 90vh
.dao-container
  overflow: 'auto'
.border-bot
  border-bottom 1px solid $internal-bg
</style>
