<script>
import BadgeProposalsList from '~/pages/badges/list/badge-proposal-list'
export default {
  name: 'list',
  components: { BadgeProposalsList }
}
</script>

<template lang="pug">
q-page.q-pa-lg(:style-fn="breadcrumbsTweak")
  .proposals-list
    badge-proposals-list(v-if="$route.params.type === 'badge'")
</template>

<style lang="stylus" scoped>

</style>
