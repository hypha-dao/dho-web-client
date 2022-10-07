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
    lastEdited: Number
  },

  computed: {
    tags () {
      return [
        { color: 'primary', label: this.category.title || 'Proposal' }
        // { color: 'primary', outline: true, label: 'Circle One' }
      ]
    },

    lastEditedDate () {
      const date = new Date(this.lastEdited)
      const finalDate = `${new Intl.DateTimeFormat('en-Us', { dateStyle: 'full', timeStyle: 'long' }).format(date)}`

      return `Last edited on ${finalDate}`
    }
  }
}
</script>

<template lang="pug">
.proposal-draft.justify-between.items-center(:class="{ 'row':$q.platform.is.desktop }")
  .q-px-md(:class="{ 'col-9':$q.platform.is.desktop }")
    .row.q-mb-sm
      chips(v-if="tags" :tags="tags")
    .text-bold.text-body1.one-line(v-if="title") {{ title }}
    .row.items-center.q-mt-sm
      q-icon.on-left(name="far fa-clock" color="grey-7")
      .text-body.text-caption {{ lastEditedDate }}
  .q-pa-sm(:class="{ 'col-3':$q.platform.is.desktop }")
    q-btn.full-width(color="primary" rounded no-caps @click="$emit('continue')") Continue proposal
    q-btn.q-mt-sm.full-width(flat rounded no-caps @click="$emit('delete')") Delete draft
</template>

<style lang="stylus" scoped>
.proposal-draft
  border-radius 32px
  border 2px dashed rgba(0 0 0 0.25)
</style>
