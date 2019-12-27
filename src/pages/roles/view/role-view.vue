<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'role-view',
  data () {
    return {
      loading: true,
      role: null
    }
  },
  async mounted () {
    this.role = await this.fetchRole(this.$route.params.id)
    this.role.startPeriod = this.periods.find(p => p.period_id === this.role.start_period)
    this.role.endPeriod = this.periods.find(p => p.period_id === this.role.end_period)
    this.loading = false
  },
  computed: {
    ...mapGetters('periods', ['periods'])
  },
  methods: {
    ...mapActions('roles', ['fetchRole'])
  },
  watch: {
    periods (periods) {
      if (periods && (!this.role.startPeriod || !this.role.endPeriod)) {
        this.role.startPeriod = periods.find(p => p.period_id === this.role.start_period)
        this.role.endPeriod = periods.find(p => p.period_id === this.role.end_period)
      }
    }
  }
}
</script>

<template lang="pug">
q-page.q-pa-lg
  .row(v-if="role")
    .col-xs-12.col-md-8.offset-md-2
      .q-pa-lg.text-center.bg-roles.text-white.relative-position
        .text-h4 {{ role.title }}
        i.date {{ new Date(role.created_date).toDateString()}}
      .row
        .col-xs-12.col-md-8
          q-markdown.fit.q-pa-sm(:src="role.content")
        q-card.col-xs-12.col-md-4.q-mt-lg
          q-card-section.text-center
            strong Salary
          q-card-section
            .text-subtitle1 {{ role.hypha_salary }}
            .text-subtitle1 {{ role.seeds_salary }}
            .text-subtitle1 {{ role.voice_salary }}
          q-card-section.text-center
            strong Starting period
          q-card-section(v-if="role.startPeriod")
            p From {{ new Date(role.startPeriod.start_date).toLocaleDateString() }} {{ new Date(role.startPeriod.start_date).toLocaleTimeString() }}
            p To {{ new Date(role.startPeriod.end_date).toLocaleDateString() }} {{ new Date(role.startPeriod.end_date).toLocaleTimeString() }}
          q-card-section.text-center
            strong Ending period
          q-card-section(v-if="role.endPeriod")
            p From {{ new Date(role.endPeriod.start_date).toLocaleDateString() }} {{ new Date(role.endPeriod.start_date).toLocaleTimeString() }}
            p To {{ new Date(role.endPeriod.end_date).toLocaleDateString() }} {{ new Date(role.endPeriod.end_date).toLocaleTimeString() }}
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
</style>
