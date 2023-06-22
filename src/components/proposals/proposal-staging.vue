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
  .text-h6.text-white {{ $t('proposals.proposal-staging.yourProposalIs') }}
  .row.q-my-xl.gt-sm
    .text-body.text-disabled {{ $t('proposals.proposal-staging.publishingYourProposal') }}
  .row.justify-center.q-my-lg.q-px-lg
    q-btn.full-width(no-caps="no-caps" rounded="rounded" color="white" text-color="primary") {{ $t('proposals.proposal-staging.publish') }}
    q-btn.q-mt-md.full-width(no-caps="no-caps" rounded="rounded" flat="flat" color="white") {{ $t('proposals.proposal-staging.editProposal') }}

</template>
