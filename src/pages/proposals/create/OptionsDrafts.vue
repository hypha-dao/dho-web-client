<script>
export default {
  name: 'options-draft',
  components: {
    ProposalDraft: () => import('~/components/proposals/proposal-draft.vue')
  },

  props: {
    drafts: Array
  }
}
</script>

<template lang="pug">
.options-drafts
  template(v-for="draft in drafts")
    proposal-draft.q-pa-sm(
      v-bind="draft"
      @continue="$emit('continue', draft)"
      @delete="$emit('delete', draft)"
    )
</template>
