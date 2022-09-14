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
  //- .mobileAlert(v-if="$q.platform.is.mobile")
  //-   .overlay.flex.content-center.justify-center.full-width.full-height
  //-     img.hyphaLogo(src="~assets/logos/hypha-logo-blue.svg")
  //-     .alertText.h-h1.text-center Mobile version in progress. Please visit dao.hypha.earth on a desktop for now.
  proposal-layout(v-if="useMobileProposalLayout && $q.platform.is.desktop")
  multi-dho-layout(v-else :dho="dho" :daoName="dhoname" v-if="$q.platform.is.desktop")
</template>

<style scoped lang="stylus">
.mobileAlert
  height: 100vh
  width: 100vw
  background-image: url('../assets/images/dao-error-bg.jpg')
  background-size: cover
  background-position-x: center
  .alertText
    color: white
  .overlay
    background-color: #00000055
    padding: 25px
  .hyphaLogo
    width: 65%
    padding: 25px 0
    margin-bottom: 35px
</style>
