<script>
/**
 * Proposal status view shown when a proposal is suspended
 */
export default {
  name: 'proposal-suspended'
}
</script>

<template lang="pug">
div
  .row.q-my-xl.gt-sm
    .text-body.text-disabled {{ $t('proposals.proposal-suspended.thatMeansThat') }}
  .row.justify-center.q-my-lg.q-px-lg
    q-btn.full-width(no-caps="no-caps" rounded="rounded" color="white" text-color="primary" @click="$emit('publish')") {{ $t('proposals.proposal-suspended.publish') }}
    q-btn.q-mt-md.full-width(no-caps="no-caps" rounded="rounded" flat="flat" color="white" @click="$emit('changed')") {{ $t('proposals.proposal-suspended.iChangedMyMind') }}

</template>
