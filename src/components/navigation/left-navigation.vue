<script>
import { mapGetters } from 'vuex'
import gql from 'graphql-tag'
import { NAVIGATION } from '~/const'

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
      variables() {
        return {
          daoId: this.selectedDao.docId
        }
      },
      fetchPolicy: 'no-cache',
      pollInterval: 1000,
      skip() { return !this.selectedDao || !this.selectedDao.docId }
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

  data() {
    return {
      NAVIGATION,
      expanded: false,
      IconVotingWhite,
      IconVoting
    }
  },

  computed: {
    ...mapGetters('dao', ['selectedDao', 'daoSettings']),
    ...mapGetters('accounts', ['account', 'isAdmin']),
    activeTab() {
      if (this.$route.name === NAVIGATION.DASHBOARD) return NAVIGATION.DASHBOARD
      if (this.$route.path.includes(NAVIGATION.AGREEMENTS)) return NAVIGATION.AGREEMENTS
      if (this.$route.path.includes(NAVIGATION.PEOPLE)) return NAVIGATION.PEOPLE
      if (this.$route.path.includes(NAVIGATION.TREASURY)) return NAVIGATION.TREASURY
      if (this.$route.path.includes(NAVIGATION.EXPLORE)) return NAVIGATION.EXPLORE
      if (this.$route.path.includes(NAVIGATION.ELECTION)) return NAVIGATION.ELECTION
      return null
    },
    disabledSelector() {
      if (!this.dhos) {
        return true
      }
      return false
    },
    hasElections() {
      return this.elections?.length
    }
  },

  methods: {
    icon(dho) {
      if (dho.isHypha) return 'hypha-logo.svg'
      return dho.icon
    },

    switchDao(url) {
      this.expanded = false
      this.$router.push({ name: this.activeTab || NAVIGATION.DASHBOARD, params: { dhoname: url } })
    },

    expandSwitcher() {
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
          q-btn.q-ma-md(:class="{'active': activeTab=== NAVIGATION.DASHBOARD}" :flat="activeTab !== NAVIGATION.DASHBOARD" unelevated rounded padding="12px" icon="fas fa-home" size="sm" :color="activeTab === NAVIGATION.DASHBOARD ? 'primary' : 'disabled'" :to="{ name: NAVIGATION.DASHBOARD }")
          q-btn.q-ma-md(:class="{'active': activeTab=== NAVIGATION.AGREEMENTS}" :flat="activeTab !== NAVIGATION.AGREEMENTS" unelevated rounded padding="12px" icon="far fa-file-alt" size="sm" :color="activeTab === NAVIGATION.AGREEMENTS ? 'primary' : 'disabled'" :to="{ name: NAVIGATION.AGREEMENTS }")
            q-tooltip(anchor="center right" self="center left" :content-style="{ 'font-size': '1em' }") {{ $t('navigation.left-navigation.agreements') }}
          q-btn.q-ma-md(:class="{'active': activeTab=== NAVIGATION.PEOPLE}" :flat="activeTab !== NAVIGATION.PEOPLE" unelevated rounded padding="12px" icon="fas fa-users" size="sm" :color="activeTab === NAVIGATION.PEOPLE ? 'primary' : 'disabled'" :to="{ name: NAVIGATION.PEOPLE }")
            q-tooltip(anchor="center right" self="center left" :content-style="{ 'font-size': '1em' }") {{ $t('navigation.left-navigation.people') }}
          q-btn.q-ma-md(v-if="(hasElections || isAdmin) && daoSettings.showUpvoteElection" :class="{'active': activeTab=== NAVIGATION.ELECTION}" :flat="activeTab !== NAVIGATION.ELECTION" unelevated rounded padding="12px" size="sm" :color="activeTab === NAVIGATION.ELECTION ? 'primary' : 'disabled'" :to="{ name: NAVIGATION.ELECTION }")
            img.no-active(:class="{ 'active-btn': activeTab=== NAVIGATION.ELECTION }" :src="activeTab=== NAVIGATION.ELECTION ? IconVotingWhite : IconVoting")
            q-tooltip(anchor="center right" self="center left" :content-style="{ 'font-size': '1em' }") {{ $t('navigation.left-navigation.election') }}
          q-btn.q-ma-md(:class="{'active': activeTab=== NAVIGATION.TREASURY}" :flat="activeTab !== NAVIGATION.TREASURY" unelevated rounded padding="12px" icon="fas fa-building" size="sm" :color="activeTab === NAVIGATION.TREASURY ? 'primary' : 'disabled'" :to="{ name: NAVIGATION.TREASURY }")
            q-tooltip(anchor="center right" self="center left" :content-style="{ 'font-size': '1em' }") {{ $t('navigation.left-navigation.treasury') }}
      .col.fixed-bottom.flex.items-end
        .row.justify-center.items-end.q-pb-lg
          q-btn.q-ma-md(:class="{'active': activeTab=== NAVIGATION.EXPLORE}" :flat="activeTab !== NAVIGATION.EXPLORE" unelevated rounded padding="12px" icon="fas fa-globe" size="sm" :color="activeTab === NAVIGATION.EXPLORE ? 'primary' : 'disabled'" :to="{ name: NAVIGATION.EXPLORE }")
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
