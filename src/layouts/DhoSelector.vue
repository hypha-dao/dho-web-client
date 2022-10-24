<script>
export default {
  name: 'dho-selector',
  components: {
    MultiDhoLayout: () => import('./MultiDhoLayout.vue'),
    ProposalLayout: () => import('./ProposalLayout.vue'),
    LoginLayout: () => import('./LoginLayout.vue')
  },

  props: {
    dhoname: String
  },

  apollo: {
    // $subscribe: {
    //   tags: {
    //     query: require('~/graphql/subscription/dao-active.subscription.gql'),
    //     variables () {
    //       return {
    //         regexp: this.daoRegexp
    //       }
    //     },
    //     result ({ data }) {
    //     }
    //   }
    // },

    dao: {
      query: require('~/query/dao-active.gql'),
      // subscribeToMore: {
      //   document: require('~/graphql/subscription/dao-active.subscription.gql'),
      //   updateQuery: (previousResult, { subscriptionData }) => {
      //     // this.$store.commit('dao/switchDao', subscriptionData.data.queryDao)
      //   },
      //   variables () {
      //     return {
      //       regexp: this.daoRegexp
      //     }
      //   }
      // },
      update: data => data.queryDao,
      result (res) {
        if (!(res.data?.queryDao?.length)) {
          this.$router.push({ path: '/not-found' })
        }

        this.$store.dispatch('accounts/checkMembership')
        this.$store.commit('dao/switchDao', res.data.queryDao)
        this.$store.dispatch('dao/setTheme')
      },
      variables () {
        return {
          regexp: this.daoRegexp
        }
      },
      skip () {
        return !this.dhoname || !this.daoRegexp
      },
      fetchPolicy: 'no-cache',
      pollInterval: 1000 // THIS IS JUST TEMPORARY UNTIL GRAPHQL SUBSCRIPTION IS READY
    },

    dho: {
      query: require('~/query/main-dho.gql'),
      update: data => data.queryDho,
      result (res) {
        this.$store.commit('dao/setDho', res.data.queryDho)
      },
      fetchPolicy: 'no-cache'
    }

  },

  mounted () {
    this.isLoginRoute = this.$router.currentRoute.name === 'login'
  },

  data () {
    return {
      isLoginRoute: false
    }
  },

  watch: {
    $route (to, from) {
      this.isLoginRoute = this.$router.currentRoute.name === 'login'
    }
  },

  computed: {
    daoRegexp () { return '/^' + this.dhoname + '$/i' },

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

    useMobileProposalLayout () { return this.$q.screen.lt.md && this.$route.meta && this.$route.meta.layout === 'proposal' }
  }
}
</script>
<template lang="pug">
.dho-selector
  proposal-layout(v-if="useMobileProposalLayout && $q.platform.is.desktop")
  multi-dho-layout(v-if="!isLoginRoute" :dho="dho" :daoName="dhoname")
  login-layout(v-if="isLoginRoute")
</template>

<style scoped lang="stylus">
</style>
