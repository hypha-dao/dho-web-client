<script>
import BadgeProposalsList from '~/pages/badges/list/badge-proposal-list'
import BadgeAssignmentProposalsList from '~/pages/badges/list/badge-assignment-proposal-list'
export default {
  name: 'list',
  components: { BadgeProposalsList, BadgeAssignmentProposalsList }
}
</script>

<template lang="pug">
q-page.q-pa-lg(:style-fn="breadcrumbsTweak")
  .proposals-list
    badge-proposals-list(v-if="$route.params.type === 'badge'")
    badge-assignment-proposals-list(v-if="$route.params.type === 'badgeAssignment'")
</template>

<style lang="stylus" scoped>

</style>
