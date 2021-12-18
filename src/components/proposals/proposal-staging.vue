<script>
/**
 * Proposal status view shown when a proposal is in staging
 */
export default {
  name: 'proposal-staging'
}
</script>

<template lang="pug">
.proposal-staging
  .text-h6.text-white Your proposal is on staging
  .row.q-my-xl.gt-sm
    .text-body.text-grey-5 Publishing your proposal on staging means that it is not live or on chain yet. But other members can see it on the Proposal Overview Page and leave comments. Once everyone has clarity over the proposal you can make changes to it and publish it on chain anytime. Once it is published, members will be able to vote during a period of 7 days.
  .row.justify-center.q-my-lg.q-px-lg
    q-btn.full-width(no-caps rounded color="white" text-color="primary") Publish
    q-btn.q-mt-md.full-width(no-caps rounded flat color="white") Edit proposal
</template>
