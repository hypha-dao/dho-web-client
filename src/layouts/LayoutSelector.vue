<script>
export default {
  name: 'layout-selector',
  components: {
    MultiDhoLayout: () => import('./MultiDhoLayout.vue'),
    ProposalLayout: () => import('./ProposalLayout.vue')
  },

  computed: {
    useMobileProposalLayout () {
      return this.$q.screen.lt.md && this.$route.meta && this.$route.meta.layout === 'proposal'
    }
  }
}
</script>

<template lang="pug">
.layout-selector
  proposal-layout(v-if="useMobileProposalLayout")
  multi-dho-layout(v-else)
</template>
