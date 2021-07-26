<script>
export default {
  name: 'proposal-create',
  components: {
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    step: String
  },

  data () {
    return {
      draft: {
        type: 'contribution',
        title: '',
        objective: '',
        results: [],
        description: '',
        url: ''
      }
    }
  }
}
</script>

<template lang="pug">
.proposal-create.q-px-xl
  .row.full-width.q-my-md
    .col-9.q-pr-sm
      widget
        router-view(v-bind="draft")
    .col-3.q-pl-sm
      widget
        q-list
          q-item(:to="{ name: 'create-type' }" clickable v-ripple)
            q-item-section(avatar)
              q-avatar(color="primary" text-color="white") 1
            q-item-section Proposal type
          q-item(:to="{ name: 'create-description' }" clickable v-ripple)
            q-item-section(avatar)
              q-avatar(color="primary" text-color="white") 2
            q-item-section Description
          q-item(:to="{ name: 'create-compensation' }" clickable v-ripple)
            q-item-section(avatar)
              q-avatar(color="primary" text-color="white") 3
            q-item-section Compensation
          q-item(:to="{ name: 'create-date' }" lickable v-ripple)
            q-item-section(avatar)
              q-avatar(color="primary" text-color="white") 4
            q-item-section Date / Duration
          q-item(:to="{ name: 'create-review' }" clickable v-ripple)
            q-item-section(avatar)
              q-avatar(color="primary" text-color="white") 5
            q-item-section Review
        q-btn Save as Draft
        q-btn Publish
</template>
