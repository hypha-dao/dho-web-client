<script>
export default {
  name: 'period-calendar',
  components: {
    PeriodCard: () => import('./period-card.vue')
  },

  props: {
    now: {
      type: Date,
      default: new Date()
    },
    periods: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<template lang="pug">
.row.q-gutter-sm
  template(v-for="period in periods")
    period-card(v-bind="period" :now="now")
</template>
