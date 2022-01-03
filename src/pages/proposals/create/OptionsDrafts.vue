<script>
export default {
  name: 'options-draft',
  components: {
    ProposalDraft: () => import('~/components/proposals/proposal-draft.vue')
  },

  props: {
    draft: Object
  }
}
</script>

<template lang="pug">
.options-drafts
  proposal-draft.q-pa-sm(
    v-bind="draft"
    @continue="$emit('continue', draft)"
    @delete="$emit('delete', draft)"
  )
</template>
