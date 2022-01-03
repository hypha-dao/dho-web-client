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
        console.log('dao-active response', res)
        this.$store.commit('dao/switchDao', res.data.queryDao)
      },
      variables () {
        return {
          name: this.dhoname
        }
      }
    }
  },

  computed: {
    dho () {
      if (this.dao && this.dao.length) {
        return {
          name: this.dao[0].details_daoName_n,
          title: this.dao[0].settings[0].settings_daoTitle_s
        }
      }

      return undefined
    },

    useMobileProposalLayout () {
      return this.$q.screen.lt.md && this.$route.meta && this.$route.meta.layout === 'proposal'
    }
  }
}
</script>

<template lang="pug">
.dho-selector
  proposal-layout(v-if="useMobileProposalLayout")
  multi-dho-layout(v-else :dho="dho")
</template>
