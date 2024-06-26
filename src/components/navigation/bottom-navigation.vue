<script>
import { mapGetters } from 'vuex'
import { NAVIGATION } from '~/const'
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
  name: 'bottom-navigation',

  data () {
    return {
      NAVIGATION,
      IconVotingWhite,
      IconVoting
    }
  },

  apollo: {
    elections: {
      query: gql`query electionsQuery ($daoId: String!) { ${ELECTIONS} }`,
      update: data => data?.getDao?.ueElection 
        ? data.getDao.ueElection.map(election => {
            return {
              id: election.docId
            }
          })
        : [],
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

  computed: {
    ...mapGetters('dao', ['daoSettings', 'selectedDao']),
    ...mapGetters('accounts', ['isAdmin']),
    hasElections() {
      return this.elections?.length
    }
  },

  methods: {
    isActive (tab) {
      switch (tab) {
        case NAVIGATION.DASHBOARD: return this.$route.name === NAVIGATION.DASHBOARD
        case NAVIGATION.AGREEMENTS: return this.$route.path.includes(NAVIGATION.AGREEMENTS)
        case NAVIGATION.PEOPLE: return this.$route.path.includes(NAVIGATION.PEOPLE)
        case NAVIGATION.TREASURY: return this.$route.path.includes(NAVIGATION.TREASURY)
        case NAVIGATION.EXPLORE: return this.$route.path.includes(NAVIGATION.EXPLORE)
        case NAVIGATION.ELECTION: return this.$route.path.includes(NAVIGATION.ELECTION)
      }

      return false
    }
  }
}
</script>

<template lang="pug">
.bottom-navigation.full-width.full-height
  .row.justify-evenly
    q-btn.q-my-md(:flat="!isActive(NAVIGATION.DASHBOARD)" unelevated rounded padding="12px" icon="fas fa-home" size="sm" :color="isActive(NAVIGATION.DASHBOARD) ? 'primary' : 'disabled'" :to="{ name: NAVIGATION.DASHBOARD }")
    q-btn.q-my-md(:flat="!isActive(NAVIGATION.AGREEMENTS)" unelevated rounded padding="12px" icon="far fa-file-alt" size="sm" :color="isActive(NAVIGATION.AGREEMENTS) ? 'primary' : 'disabled'" :to="{ name: NAVIGATION.AGREEMENTS }")
    q-btn.q-my-md(:flat="!isActive(NAVIGATION.PEOPLE)" unelevated rounded padding="12px" icon="fas fa-users" size="sm" :color="isActive(NAVIGATION.PEOPLE) ? 'primary' : 'disabled'" :to="{ name: NAVIGATION.PEOPLE }")
    q-btn.q-my-md(v-if="(hasElections || isAdmin) && daoSettings.showUpvoteElection" :flat="!isActive(NAVIGATION.ELECTION)" unelevated rounded padding="12px" size="sm" :color="isActive(NAVIGATION.ELECTION) ? 'primary' : 'disabled'" :to="{ name: NAVIGATION.ELECTION }")
      img.no-active(:class="{ 'active-btn': isActive(NAVIGATION.ELECTION) }" :src="isActive(NAVIGATION.ELECTION) ? IconVotingWhite : IconVoting")
    q-btn.q-my-md(:flat="!isActive(NAVIGATION.TREASURY)" unelevated rounded padding="12px" icon="fas fa-building" size="sm" :color="isActive(NAVIGATION.TREASURY) ? 'primary' : 'disabled'" :to="{ name: NAVIGATION.TREASURY }")
    q-btn.q-my-md(:flat="!isActive(NAVIGATION.EXPLORE)" unelevated rounded padding="12px" icon="fas fa-globe" size="sm" :color="isActive(NAVIGATION.EXPLORE) ? 'primary' : 'disabled'" :to="{ name: NAVIGATION.EXPLORE }")

</template>

<style lang="stylus" scoped>
a:hover{
  color: white !important;
}

.no-active
  opacity: .5
.active-btn
  opacity: 1 !important
</style>
