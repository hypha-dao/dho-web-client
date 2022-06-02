<script>
export default {
  name: 'dho-selector',
  components: {
    MultiDhoLayout: () => import('./MultiDhoLayout.vue'),
    ProposalLayout: () => import('./ProposalLayout.vue')
  },
  props: {
    dhoname: String
  },
  apollo: {
    dao: {
      query: require('../query/dao-active.gql'),
      update: data => data.queryDao,
      result (res) {
        this.$store.commit('dao/switchDao', res.data.queryDao)
        this.$store.dispatch('accounts/checkMembership')
        if (!(res.data?.queryDao?.length)) {
          this.$router.push({ path: '/not-found' })
        }
      },
      variables () {
        return {
          regexp: this.daoRegexp
        }
      },
      skip () {
        return !this.dhoname
      },
      fetchPolicy: 'no-cache'
    },
    dho: {
      query: require('../query/main-dho.gql'),
      update: data => data.queryDho,
      result (res) {
        this.$store.commit('dao/setDho', res.data.queryDho)
      },
      fetchPolicy: 'no-cache'
    }
  },
  computed: {
    daoRegexp () {
      return '/^' + this.dhoname + '$/i'
    },
    dho () {
      if (this.dao && this.dao.length) {
        return {
          name: this.dao[0].details_daoName_n,
          title: this.dao[0].settings[0].settings_daoTitle_s,
          icon: this.dao[0].settings[0].settings_logo_s,
          isHypha: this.dao[0].settings[0].settings_isHypha_i
        }
      }
      return undefined
    },
    useMobileProposalLayout () {
      return this.$q.screen.lt.md && this.$route.meta && this.$route.meta.layout === 'proposal'
    }
  },
  updated () {
  }
}
</script>
<template lang="pug">
.dho-selector
  proposal-layout(v-if="useMobileProposalLayout")
  multi-dho-layout(v-else :dho="dho" :daoName="dhoname")
</template>
