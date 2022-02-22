<script>
export default {
  name: 'policies-widget',
  components: {
    Widget: () => import('../common/widget.vue'),
    PolicyCard: () => import('./policy-card.vue'),
    ComingSoonTag: () => import('~/components/common/coming-soon-tag')
  },
  props: {
    /**
     * Policies Array
     */
    policies: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<template lang="pug">
widget.full-width
    coming-soon-tag(message="IN DEVELOPMENT - COMING SOON")
    .row.justify-between
        .col-8
            .headline-widget Policies
        .col
            q-btn.full-width(
                label="See all"
                flat
                no-caps
                dense
            )
    //- .text-body2.q-mt-sm.text-weight-thin.text-grey-7.q-my-md.text-justify.font-size-w-desc Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
    .row(v-for="policy in policies")
        .col-12
            policy-card(v-bind="policy")
</template>
