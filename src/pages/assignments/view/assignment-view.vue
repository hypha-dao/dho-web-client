<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'assignment-view',
  data () {
    return {
      loading: true,
      assignment: null,
      role: null
    }
  },
  async mounted () {
    this.assignment = await this.fetchAssignment(this.$route.params.id)
    this.assignment.startPeriod = this.periods.find(p => p.period_id === this.assignment.start_period)
    this.assignment.endPeriod = this.periods.find(p => p.period_id === this.assignment.end_period)
    this.role = await this.fetchRole(this.assignment.role_id)
    this.loading = false
  },
  computed: {
    ...mapGetters('periods', ['periods'])
  },
  methods: {
    ...mapActions('assignments', ['fetchAssignment']),
    ...mapActions('roles', ['fetchRole'])
  },
  watch: {
    periods (periods) {
      if (periods && (!this.assignment.startPeriod || !this.assignment.endPeriod)) {
        this.assignment.startPeriod = periods.find(p => p.period_id === this.assignment.start_period)
        this.assignment.endPeriod = periods.find(p => p.period_id === this.assignment.end_period)
      }
    }
  }
}
</script>

<template lang="pug">
q-page.q-pa-lg
  .row(v-if="assignment")
    .col-xs-12.col-md-8.offset-md-2
      .q-pa-lg.text-center.bg-assignments.text-white.relative-position
        .text-h4 {{ assignment.title }}
        i.date {{ new Date(assignment.created_date).toDateString()}}
      .row
        .col-xs-12.col-md-8
          q-markdown.fit.q-pa-sm(:src="assignment.content")
        q-card.col-xs-12.col-md-4.q-mt-lg
          q-card-section.text-center
            strong Role
          q-card-section.text-center
            .text-subtitle1 {{ role.title }}
            router-link.link(
              :to="`/@${assignment.assigned_account}`"
            )
              | Assigned to {{ assignment.assigned_account }}
            p.text-italic Time share {{ parseFloat(assignment.time_share * 100).toFixed(0) }}%
          q-card-section.text-center
            strong Starting period
          q-card-section(v-if="assignment.startPeriod")
            p From {{ new Date(assignment.startPeriod.start_date).toLocaleDateString() }} {{ new Date(assignment.startPeriod.start_date).toLocaleTimeString() }}
            p To {{ new Date(assignment.startPeriod.end_date).toLocaleDateString() }} {{ new Date(assignment.startPeriod.end_date).toLocaleTimeString() }}
          q-card-section.text-center
            strong Ending period
          q-card-section(v-if="assignment.endPeriod")
            p From {{ new Date(assignment.endPeriod.start_date).toLocaleDateString() }} {{ new Date(assignment.endPeriod.start_date).toLocaleTimeString() }}
            p To {{ new Date(assignment.endPeriod.end_date).toLocaleDateString() }} {{ new Date(assignment.endPeriod.end_date).toLocaleTimeString() }}
  p(v-else) Unknown role
  q-inner-loading(:showing="loading")
    q-spinner-dots(
      color="primary"
      size="60px"
    )
</template>

<style lang="stylus" scoped>
.date
  position absolute
  bottom 2px
  right 5px
  font-size 11px
.link
  text-decoration none
  color $accent
</style>
