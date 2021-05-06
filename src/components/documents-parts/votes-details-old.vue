<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'votes-details-old',
  props: {
    ballotId: { type: String, required: true },
    size: { type: Number }
  },
  data () {
    return {
      columns: [
        { name: 'date', label: 'Date', field: 'date', sortable: true, align: 'left' },
        { name: 'user', label: 'User', field: 'user', sortable: true, align: 'left' },
        { name: 'vote', label: 'Vote', field: 'vote', sortable: true, align: 'left' },
        { name: 'voteWeight', label: '%voice', field: 'voteWeight', sortable: true, align: 'left' }
      ],
      votes: [],
      pagination: {
        sortBy: 'date',
        descending: false,
        page: 1,
        rowsPerPage: this.size || 10
      }
    }
  },
  async beforeMount () {
    if (!this.supply && !this.supplyLoading) {
      await this.getSupply()
    }
    const result = await this.getUsersVote(this.ballotId)
    const totalPass = result.reduce((acc, vote) => {
      const passVote = vote.weighted_votes.find(w => w.key === 'pass')
      if (passVote) {
        return acc + parseFloat(passVote.value)
      }
      return acc + 0
    }, 0)
    const totalFail = result.reduce((acc, vote) => {
      const passVote = vote.weighted_votes.find(w => w.key === 'fail')
      if (passVote) {
        return acc + parseFloat(passVote.value)
      }
      return acc + 0
    }, 0)
    this.votes = result.map(vote => {
      let voteWeight
      let voteLabel
      if (vote.weighted_votes[0].key === 'pass') {
        voteLabel = 'yes'
        voteWeight = ((parseFloat(vote.weighted_votes[0].value) * 100) / totalPass).toFixed(2)
      } else if (vote.weighted_votes[0].key === 'fail') {
        voteLabel = 'no'
        voteWeight = ((parseFloat(vote.weighted_votes[0].value) * 100) / totalFail).toFixed(2)
      } else {
        voteLabel = 'abstain'
      }
      return {
        date: new Date(`${vote.vote_time}Z`),
        user: vote.voter,
        rawWeight: vote.raw_votes,
        vote: voteLabel,
        voteWeight
      }
    })
  },
  methods: {
    ...mapActions('ballots', ['getUsersVote', 'getSupply']),
    getDays (date) {
      return parseInt((date.getTime() - Date.now() + new Date().getTimezoneOffset() * 60000) / (24 * 60 * 60 * 1000))
    }
  },
  computed: {
    ...mapGetters('ballots', ['supply', 'supplyLoading']),
    intl () {
      let lang
      if (navigator.languages !== undefined) { lang = navigator.languages[0] } else { lang = navigator.language }
      return new Intl.RelativeTimeFormat(lang.slice(0, 2), { style: 'narrow' })
    }
  }
}
</script>

<template lang="pug">
q-table(
  title="User votes"
  :data="votes"
  :columns="columns"
  row-key="user"
  :pagination.sync="pagination"
)
  template(v-slot:body="props")
    q-tr(:props="props")
      q-td.text-grey-8
        span(v-if="props.row.date && getDays(props.row.date) === 0 ") Today
        span(v-if="props.row.date && getDays(props.row.date) !== 0 && getDays(props.row.date) > -3") {{ intl.format(getDays(props.row.date), 'day') }}
        span(v-if="props.row.date && getDays(props.row.date) <= -3") {{ new Date(props.row.date).toLocaleDateString() }}
      q-td
        router-link.user-link(:to="`/@${props.row.user}`") {{ props.row.user }}
      q-td(:class="{ [props.row.vote]: true }")
        strong {{ props.row.vote }}
      q-td(:class="{ [props.row.vote]: true }")
        strong(v-if="props.row.vote !== 'abstain'") {{ props.row.voteWeight }}%
          q-tooltip {{ props.row.rawWeight }}
</template>

<style lang="stylus" scoped>
.user-link
  text-decoration none
  color #000
.yes
  color $light-green-6
  text-transform capitalize
.no
  color $red
  text-transform capitalize
.abstain
  color $orange
  text-transform capitalize
</style>
