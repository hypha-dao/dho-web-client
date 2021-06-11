<script>
export default {
  name: 'period-calendar',
  components: {
    PeriodCard: () => import('./period-card.vue')
  },

  props: {
    periods: {
      type: Array,
      default: () => []
    },
    mini: Boolean,
    moons: Boolean,
    now: {
      type: Date,
      default: () => new Date()
    }
  }
}
</script>

<template lang="pug">
.row(:class="{ 'q-gutter-xs': mini, 'q-gutter-sm': !mini }")
  template(v-for="period in periods")
    period-card(v-bind="period" :mini="mini" :moon="moons" :now="now")
</template>
