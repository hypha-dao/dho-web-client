<script>
export default {
  name: 'contribution-header',
  components: {
    Chips: () => import('../common/chips.vue'),
    PeriodCalendar: () => import('../assignments/period-calendar.vue')
  },

  props: {
    title: String,
    state: String,
    created: Date,
    expanded: Boolean,
    claiming: Boolean,
    owner: Boolean
  },

  computed: {
    tags () {
      const result = [
        {
          label: this.state.toUpperCase(),
          color: (this.state === 'proposed') ? 'secondary' : (this.state === 'approved' ? 'positive' : 'negative'),
          text: 'white'
        }
      ]

      result.push({
        label: 'CONTRIBUTION',
        color: 'primary'
      })

      return result
    }
  },

  methods: {
    dateString () {
      const options = { year: 'numeric', month: 'short', day: 'numeric' }
      return `${this.created.toLocaleDateString('en-US', options)}`
    }
  }
}
</script>

<template lang="pug">
.full-width.flex.items-center.justify-between
  .col-12.col-md-8
    .row.items-end
      chips(:tags="tags" chipSize="sm")
    .q-ma-xs
      .text-bold(:style="{ 'font-size': '19px' }") {{ title }}
      .row.q-mt-sm
        q-icon.q-mr-sm(name="fas fa-calendar-alt")
        .text-caption.text-italic(:style="{ 'font-size': '13px' }") {{ dateString(created) }}
  .col-12.col-md-4
    .q-mt-md(v-if="$q.screen.sm")
    q-btn.q-mr-md.view-proposa-btn(
      v-if="!owner"
      label="View proposal"
      color="primary"
      rounded
      unelevated
      no-caps
      outline
      @click="$emit('view-proposal')"
    )
</template>

<style lang="stylus" scoped>
.nudge-left
  margin-left -6px
.view-proposa-btn
  width 271px
</style>
