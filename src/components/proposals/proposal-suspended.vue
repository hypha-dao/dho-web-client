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
    .text-body.text-disabled That means that the assignment will end and claims are no longer possible, however any previously fulfilled periods remain claimable.
  .row.justify-center.q-my-lg.q-px-lg
    q-btn.full-width(no-caps rounded color="white" text-color="primary" @click="$emit('publish')") Publish
    q-btn.q-mt-md.full-width(no-caps rounded flat color="white" @click="$emit('changed')") I changed my mind
</template>
