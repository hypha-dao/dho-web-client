<script>
import { mapActions, mapGetters } from 'vuex'
import { format } from '~/mixins/format'

export default {
  name: 'role-card',
  mixins: [format],
  props: {
    role: { type: Object, required: true }
  },
  data () {
    return {
      submitting: false
    }
  },
  computed: {
    ...mapGetters('trail', ['ballots']),
    ...mapGetters('periods', ['periods'])
  },
  methods: {
    ...mapActions('trail', ['castVote']),
    isVoteEnabled () {
      const date = this.ballots.find(b => b.ballot_id === this.role.ballot_id)
      if (!date || !date.end_time) return false
      return date.end_time * 1000 > Date.now()
    },
    getBallotStart () {
      const date = this.ballots.find(b => b.ballot_id === this.role.ballot_id)
      if (!date || !date.begin_time) return false
      return new Date(date.begin_time * 1000).toLocaleDateString()
    },
    getBallotEnd () {
      const date = this.ballots.find(b => b.ballot_id === this.role.ballot_id)
      if (!date || !date.end_time) return false
      return new Date(date.end_time * 1000).toLocaleDateString()
    },
    getPeriodStart () {
      const period = this.periods.find(p => p.period_id === this.role.start_period)
      if (period) {
        return `${new Date(period.start_date).toLocaleDateString()} - ${new Date(period.end_date).toLocaleDateString()}`
      }
    },
    getPeriodEnd () {
      const period = this.periods.find(p => p.period_id === this.role.end_period)
      if (period) {
        return `${new Date(period.start_date).toLocaleDateString()} - ${new Date(period.end_date).toLocaleDateString()}`
      }
    },
    async onCastVote (direction) {
      this.submitting = true
      await this.castVote({
        direction,
        ballot: this.role.ballot_id
      })
      this.submitting = false
    }
  }
}
</script>

<template lang="pug">
q-item(

)
  q-item-section.flex.column
    router-link.role-link(
      :to="`/roles/${role.proposal_id}`"
    )
      strong {{ role.role_name }}
    router-link.proposer-link(
      :to="`/@${role.proposer}`"
    )
      i.proposer by {{ role.proposer }}
  q-item-section.flex.column(v-if="getPeriodStart() && getPeriodEnd()")
    div Role starts {{ getPeriodStart() }}
    div Role ends {{ getPeriodEnd() }}
  q-item-section.flex.column(v-if="getBallotStart() && getBallotEnd()")
    div Vote starts the {{ getBallotStart() }}
    div Vote ends the {{ getBallotEnd() }}
  q-item-section.flex.column(v-else)
    q-spinner-dots(
      color="primary"
      size="40px"
    )
  q-item-section(side)
    q-chip(dense, color="primary", text-color="white") {{ role.hypha_salary | tokenValue }} {{ role.hypha_salary | tokenName }}
    q-chip(dense, color="secondary") {{ role.preseeds_salary | tokenValue }} {{ role.preseeds_salary | tokenName }}
    q-chip(dense, color="accent") {{ role.voice_salary | tokenValue }} {{ role.voice_salary | tokenName }}
  q-item-section(
    v-if="isVoteEnabled()"
    side
  )
    q-btn-dropdown(
      color="primary"
      label="Cast my vote"
      dense
      :loading="submitting"
    )
      q-list(dense)
        q-item(
          clickable
          v-close-popup
          @click="onCastVote(2)"
        )
          q-item-section
            q-item-label Approve
        q-item(
          clickable
          v-close-popup
          @click="onCastVote(1)"
        )
          q-item-section
            q-item-label No Opinion
        q-item(
          clickable
          v-close-popup
          @click="onCastVote(1)"
        )
          q-item-section
            q-item-label Needs Improvement (unavailable)
        q-item(
          clickable
          v-close-popup
          @click="onCastVote(0)"
        )
          q-item-section
            q-item-label Disapprove
</template>

<style lang="stylus" scoped>
.description
  white-space pre-wrap
.proposer
  font-size 12px
.role-link
  text-decoration none
  color $primary
.proposer-link
  text-decoration none
  color $secondary
</style>
