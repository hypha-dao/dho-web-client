<script>
export default {
  name: 'active-assignments',
  components: {
    AssignmentClaimExtend: () => import('./assignment-claim-extend.vue'),
    AssignmentHeader: () => import('./assignment-header.vue'),
    PeriodCalendar: () => import('~/components/contributions/period-calendar.vue'),
    SalaryFieldset: () => import('~/components/contributions/salary-fieldset.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    assignment: {
      type: Object,
      default: function () {
        return {
          periods: []
        }
      }
    },
    expandable: Boolean
  },

  data () {
    return {
      expanded: false
    }
  },

  methods: {
    onClick () {
      if (this.expandable) {
        this.expanded = !this.expanded
      }
    }
  }
}
</script>

<template lang="pug">
widget(shadow :class="{ 'cursor-pointer': expandable }" @click.native="onClick()")
  assignment-header(v-bind="assignment" calendar :expanded="expanded" :show-buttons="expandable")
  q-slide-transition
    div(v-show="expanded")
      .col-12.q-my-md
        salary-fieldset(v-bind="assignment")
      .col-12
        assignment-claim-extend(:stacked="$q.screen.xs")
  .row.justify-center(v-if="expandable")
    q-icon.expand-icon(:name="'fas fa-chevron-down' + (expanded ? ' fa-rotate-180' : '')" color="grey-7")
</template>

<style lang="stylus" scoped>
.expand-icon
  margin-top 16px
  margin-bottom -12px
  transition transform 0.5s
</style>
