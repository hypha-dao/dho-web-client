<script>
import { LEFT_NAVIGATION_TABS } from '~/const'
import { mapGetters } from 'vuex'
import gql from 'graphql-tag'

const IconVotingWhite = require('~/assets/icons/voting-icon-white.svg')
const IconVoting = require('~/assets/icons/voting-icon.svg')

const ELECTIONS = `
getDao(docId: $daoId) {
  docId
  ueElection {
    docId
  }
}
`

export default {
  name: 'left-navigation',
  components: {
    DhoBtn: () => import('./dho-btn.vue')
  },

  apollo: {
    elections: {
      query: gql`query electionsQuery ($daoId: String!) { ${ELECTIONS} }`,
      update: data => data.getDao.ueElection.map(election => {
        return {
          id: election.docId
        }
      }),
      variables () {
        return {
          daoId: this.selectedDao.docId
        }
      },
      fetchPolicy: 'no-cache',
      pollInterval: 1000,
      skip () { return !this.selectedDao || !this.selectedDao.docId }
    }
  },

  props: {
    dho: {
      type: Object,
      default: () => {
        return {
          name: 'hypha',
          title: 'Hypha DAO',
          icon: ''
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
      LEFT_NAVIGATION_TABS,
      expanded: false,
      IconVotingWhite,
      IconVoting
    }
  },

  computed: {
    ...mapGetters('dao', ['selectedDao']),
    activeTab () {
      if (this.$route.name === LEFT_NAVIGATION_TABS.DASHBOARD) return LEFT_NAVIGATION_TABS.DASHBOARD
      if (this.$route.path.includes(LEFT_NAVIGATION_TABS.PROPOSALS)) return LEFT_NAVIGATION_TABS.PROPOSALS
      if (this.$route.path.includes(LEFT_NAVIGATION_TABS.MEMBERS)) return LEFT_NAVIGATION_TABS.MEMBERS
      if (this.$route.path.includes(LEFT_NAVIGATION_TABS.ELECTION)) return LEFT_NAVIGATION_TABS.ELECTION
      if (this.$route.path.includes(LEFT_NAVIGATION_TABS.ORGANIZATION)) return LEFT_NAVIGATION_TABS.ORGANIZATION
      if (this.$route.path.includes(LEFT_NAVIGATION_TABS.EXPLORE)) return LEFT_NAVIGATION_TABS.EXPLORE
      return null
    },
    disabledSelector () {
      if (!this.dhos) {
        return true
      }
      return false
    },
    hasElections () {
      return this.elections.length
    }
  },

  methods: {
    icon (dho) {
      if (dho.isHypha) return 'hypha-logo.svg'
      return dho.icon
    },

    switchDao (url) {
      this.expanded = false
      this.$router.push({ name: this.activeTab || LEFT_NAVIGATION_TABS.DASHBOARD, params: { dhoname: url } })
    },

    expandSwitcher () {
      this.expanded = this.dhos.length > 1 ? !this.expanded : this.expanded
    }
  }
}
</script>

<template lang="pug">
.left-navigation.full-width.full-height
  .col.full-height
    .col.bg-external-bg(:class="{'col': expanded, 'overTop': expanded }")
      .column
        .col-auto.justify-center.q-pt-xl.dho-button--main
          dho-btn(:name="dho.name" :title="dho.title" :logo="dho.icon" :disable="disabledSelector" @click="expandSwitcher")
        .col-auto.q-mt-xs
          .column.dao-container(v-if="expanded")
            .row.full-width(v-for="dao in dhos")
              .full-width(:key="dao.name")
                dho-btn(v-if="dho.name != dao.name" v-bind="dao" :logo="dao.icon" @click="switchDao(dao.url)")
        .full-width.border-bot
    template(v-if="!expanded")
      #nav-buttons.col-4.fixed-center
        .row.justify-center
          q-btn.q-ma-md(:class="{'active': activeTab=== LEFT_NAVIGATION_TABS.DASHBOARD}" :flat="activeTab !== LEFT_NAVIGATION_TABS.DASHBOARD" unelevated rounded padding="12px" icon="fas fa-home" size="sm" :color="activeTab === LEFT_NAVIGATION_TABS.DASHBOARD ? 'primary' : 'disabled'" :to="{ name: LEFT_NAVIGATION_TABS.DASHBOARD }")
          q-btn.q-ma-md(:class="{'active': activeTab=== LEFT_NAVIGATION_TABS.PROPOSALS}" :flat="activeTab !== LEFT_NAVIGATION_TABS.PROPOSALS" unelevated rounded padding="12px" icon="far fa-file-alt" size="sm" :color="activeTab === LEFT_NAVIGATION_TABS.PROPOSALS ? 'primary' : 'disabled'" :to="{ name: LEFT_NAVIGATION_TABS.PROPOSALS }")
            q-tooltip(anchor="center right" self="center left" :content-style="{ 'font-size': '1em' }") {{ $t('navigation.left-navigation.proposals') }}
          q-btn.q-ma-md(:class="{'active': activeTab=== LEFT_NAVIGATION_TABS.MEMBERS}" :flat="activeTab !== LEFT_NAVIGATION_TABS.MEMBERS" unelevated rounded padding="12px" icon="fas fa-users" size="sm" :color="activeTab === LEFT_NAVIGATION_TABS.MEMBERS ? 'primary' : 'disabled'" :to="{ name: LEFT_NAVIGATION_TABS.MEMBERS }")
            q-tooltip(anchor="center right" self="center left" :content-style="{ 'font-size': '1em' }") {{ $t('navigation.left-navigation.members') }}
          q-btn.q-ma-md(v-if="hasElections" :class="{'active': activeTab=== LEFT_NAVIGATION_TABS.ELECTION}" :flat="activeTab !== LEFT_NAVIGATION_TABS.ELECTION" unelevated rounded padding="12px" size="sm" :color="activeTab === LEFT_NAVIGATION_TABS.ELECTION ? 'primary' : 'disabled'" :to="{ name: LEFT_NAVIGATION_TABS.ELECTION }")
            img.no-active(:class="{ 'active-btn': activeTab=== LEFT_NAVIGATION_TABS.ELECTION }" :src="activeTab=== LEFT_NAVIGATION_TABS.ELECTION ? IconVotingWhite : IconVoting")
            q-tooltip(anchor="center right" self="center left" :content-style="{ 'font-size': '1em' }") {{ $t('navigation.left-navigation.election') }}
          q-btn.q-ma-md(:class="{'active': activeTab=== LEFT_NAVIGATION_TABS.ORGANIZATION}" :flat="activeTab !== LEFT_NAVIGATION_TABS.ORGANIZATION" unelevated rounded padding="12px" icon="fas fa-building" size="sm" :color="activeTab === LEFT_NAVIGATION_TABS.ORGANIZATION ? 'primary' : 'disabled'" :to="{ name: LEFT_NAVIGATION_TABS.ORGANIZATION }")
            q-tooltip(anchor="center right" self="center left" :content-style="{ 'font-size': '1em' }") {{ $t('navigation.left-navigation.organization') }}
      .col.fixed-bottom.flex.items-end
        .row.justify-center.items-end.q-pb-lg
          q-btn.q-ma-md(:class="{'active': activeTab=== LEFT_NAVIGATION_TABS.EXPLORE}" :flat="activeTab !== LEFT_NAVIGATION_TABS.EXPLORE" unelevated rounded padding="12px" icon="fas fa-globe" size="sm" :color="activeTab === LEFT_NAVIGATION_TABS.EXPLORE ? 'primary' : 'disabled'" :to="{ name: LEFT_NAVIGATION_TABS.EXPLORE }")
            q-tooltip(anchor="center right" self="center left" :content-style="{ 'font-size': '1em' }") {{ $t('navigation.left-navigation.explore') }}

</template>

<style lang="stylus" scoped>
.q-btn.active:hover
  color: white !important;

#nav-buttons
  height auto
.overTop
  z-index: 2
  overflow: 'auto'
  max-height: 90vh
.dao-container
  overflow: 'auto'
  background: #FFFFFF
.border-bot
  border-bottom 1px solid $internal-bg
@media (max-height: 664px)
  #nav-buttons
    overflow-y: scroll
    height: -webkit-fill-available
  #nav-buttons::-webkit-scrollbar
    display: none
  .dho-button--main
    padding-top: 0
.no-active
  opacity: .5
.active-btn
  opacity: 1 !important
</style>
