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
      .headline-widget {{ $t('organization.policies-widget.policies') }}
    .col
      q-btn.full-width(:label="$t('organization.policies-widget.seeAll')" flat="flat" no-caps="no-caps" dense="dense")
  .row(v-for="policy in policies")
    .col-12
      policy-card(v-bind="policy")

</template>
