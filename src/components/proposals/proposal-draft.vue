<script>
/**
 * A widget containing the details of a draft proposal
 */
export default {
  name: 'proposal-draft',
  components: {
    Chips: () => import('../common/chips.vue')
  },

  props: {
    /**
     * Which category from the creation wizard this draft is
     */
    category: Object,
    /**
     * The title of this draft
     */
    title: String,
    /**
     * When this draft was last editted
     */
    lastEditted: Date
  },

  computed: {
    tags () {
      return [
        { color: 'primary', label: this.category.title || 'Proposal' }
        // { color: 'primary', outline: true, label: 'Circle One' }
      ]
    },

    editString () {
      return 'Last edited '
    }
  }
}
</script>

<template lang="pug">
.proposal-draft.row.justify-between.items-center
  .col-9.q-px-md
    .row.q-mb-sm
      chips(v-if="tags" :tags="tags")
    .text-bold.text-body1.one-line(v-if="title") {{ title }}
    .row.items-center.q-mt-sm
      q-icon.on-left(name="far fa-clock" color="grey-7")
      .text-body.text-caption {{ editString }}
  .col-3.q-pa-sm
    q-btn.full-width(color="primary" rounded no-caps @click="$emit('continue')") Continue proposal
    q-btn.q-mt-sm.full-width(flat rounded no-caps @click="$emit('delete')") Delete draft
</template>

<style lang="stylus" scoped>
.proposal-draft
  border-radius 32px
  border 2px dashed rgba(0 0 0 0.25)
</style>
