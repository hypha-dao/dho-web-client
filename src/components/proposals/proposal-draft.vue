<script>
/**
 * A widget containing the details of a draft proposal
 */
export default {
  name: 'proposal-draft',
  components: {
    Chips: () => import('../common/chips.vue'),
    Widget: () => import('../common/widget.vue')
  },

  props: {
    /**
     * Which category from the creation wizard this draft is
     */
    category: String,
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
        { color: 'primary', label: this.category },
        { color: 'primary', outline: true, label: 'Circle One' }
      ]
    },

    editString () {
      return 'Last edited '
    }
  }
}
</script>

<template lang="pug">
widget(dashed).cursor-pointer
  .row.justify-between.items-center
    .col-9.q-pa-sm
      .row.q-mb-sm
        chips(v-if="tags" :tags="tags")
      .text-bold.text-body1.one-line(v-if="title") {{ title }}
      .row.items-center.q-mt-sm
        q-icon.on-left(name="far fa-clock" color="grey-7")
        .text-grey-6.text-caption {{ editString }}
    .col-3.q-pa-sm
      q-btn.full-width(color="primary" rounded no-caps) Continue proposal
      q-btn.q-mt-sm.full-width(flat rounded no-caps) Delete draft
</template>
