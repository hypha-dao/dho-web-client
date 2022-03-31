<script>
export default {
  name: 'contribution-header',
  components: {
    Chips: () => import('../common/chips.vue'),
    ProposalCardChips: () => import('../proposals/proposal-card-chips.vue')
  },

  props: {
    title: String,
    state: String,
    created: Date,
    accepted: Boolean,
    votingExpired: Boolean,
    compensation: String
  },

  computed: {

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
.row.full-width.flex.items-center.justify-between
  .col-12.col-md-8
    .row.items-end
      proposal-card-chips(type="Payout" :state="state" :showVotingState="true" :accepted="accepted" :votingExpired="votingExpired" :compensation="compensation")
    .q-mt-xxs
      .h-h5.text-bold.ellipsis {{ title }}
      .row.q-mt-xs
        q-icon.q-mr-sm(name="fas fa-calendar-alt")
        .h-b2.text-italic(:style="{ 'font-size': '13px' }") {{ dateString(created) }}
  .col-12.col-md-4
    slot(name="right")
</template>

<style lang="stylus" scoped>
.nudge-left
  margin-left -6px
</style>
