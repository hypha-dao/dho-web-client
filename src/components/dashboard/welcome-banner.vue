<script>
export default {
  name: 'welcome-banner',
  components: {
    Widget: () => import('../common/widget.vue')
  }
}
</script>

<template lang="pug">
widget.full-width
  .text-h3.q-mt-xl Welcome to Hypha
  .text-body2.q-my-md The DHO is a third generation DAO, a Decentralized Human Organization that rapidly unfolds coordination, payroll, accounting and governance processes for virtual organizations. Our goal is to help organizations that want to move beyond outdated hierarchical structures towards more transparent, participatory and open protocols and tools in line with our networked and interconnected world.
  .row.q-mt-md.q-mb-xl
    q-btn.q-px-lg(rounded color="primary" :to="{ name: 'organization' }") Discover
    q-btn.q-px-lg.q-ml-md(rounded outline color="primary") Documentation
</template>
