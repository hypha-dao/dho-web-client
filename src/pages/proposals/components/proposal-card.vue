<script>
import { format } from '~/mixins/format'
import { mapActions } from 'vuex'

export default {
  name: 'proposal-card',
  mixins: [format],
  props: {
    proposal: { type: Object, required: true }
  },
  data () {
    return {
      loading: true,
      details: false,
      percentage: 'pending',
      profile: null,
      ballot: null,
      votesOpened: false,
      voting: false,
      fail: null,
      pass: null
    }
  },
  computed: {
    type () {
      const type = this.proposal.names.find(o => o.key === 'proposal_type')
      return type.value
    }
  },
  async mounted () {
    this.ballot = this.proposal.names.find(o => o.key === 'ballot_id')
    if (this.ballot) {
      const result = await this.fetchBallot(this.ballot.value)
      if (result) {
        const now = new Date(Date.now() + new Date().getTimezoneOffset() * 60 * 1000)
        this.votesOpened = now >= new Date(result.begin_time).getTime() && now <= new Date(result.end_time).getTime() && result.status === 'voting'
        this.pass = result.options.find(o => o.key === 'pass').value
        this.fail = result.options.find(o => o.key === 'fail').value
        if (parseInt(this.pass) + parseInt(this.fail) > 0) {
          this.percentage = parseInt((parseInt(this.pass) / (parseInt(this.pass) + parseInt(this.fail))) * 100)
        }
      }
    }
    this.profile = await this.getPublicProfile(this.proposal.proposer)
    this.loading = false
  },
  methods: {
    ...mapActions('trail', ['fetchBallot', 'castVote']),
    ...mapActions('profiles', ['getPublicProfile']),
    async onCastVote (vote) {
      this.voting = true
      await this.castVote({
        id: this.ballot.value,
        vote
      })
      this.voting = false
    }
  }
}
</script>

<template lang="pug">
q-card.proposal
  .ribbon
    span.text-white.bg-proposal PROPOSING
  q-img.proposer-avatar(
    v-if="profile && profile.publicData.avatar"
    :src="profile.publicData.avatar"
    @click="$router.push({ path: `/@${proposal.proposer}`})"
  )
    q-tooltip {{ proposal.proposer }}
  q-avatar.proposer-avatar(
    v-else
    size="30px"
    color="accent"
    text-color="white"
    @click="$router.push({ path: `/@${proposal.proposer}`})"
  )
    | {{ proposal.proposer.slice(0, 2).toUpperCase() }}
    q-tooltip {{ proposal.proposer }}
  q-card-section.text-center
    img.icon(v-if="type === 'roles'" src="~assets/icons/roles.svg")
    img.icon(v-if="type === 'assignments'" src="~assets/icons/assignments.svg")
    img.icon(v-if="type === 'payouts'" src="~assets/icons/payouts.svg")
  q-card-section
    .type {{ type.slice(0, -1) }}
    .title(@click="details = !details") {{ proposal.strings.find(o => o.key === 'title').value }}
  q-card-section.description(v-show="details")
    p {{ proposal.strings.find(o => o.key === 'description').value  }}
  q-card-actions.q-pa-md.flex.justify-between.proposal-actions
    q-btn(
      :disable="!votesOpened"
      label="reject"
      color="proposal-light"
      :loading="voting"
      @click="onCastVote('fail')"
      rounded
    )
    q-btn(
      :disable="!votesOpened"
      label="Endorse"
      color="proposal"
      :loading="voting"
      @click="onCastVote('pass')"
      rounded
    )
</template>

<style lang="stylus" scoped>
.proposal:hover
  transition transform 0.3s cubic-bezier(0.005, 1.65, 0.325, 1) !important
  transform scale(1.2) translate(0px, 40px) !important
  -moz-transform scale(1.2) translate(0px, 40px)
  -webkit-transform scale(1.2) translate(0px, 40px)
  z-index 10
  .proposer-avatar
    z-index 11
.proposer-avatar
  cursor pointer
  position absolute
  border-radius 50% !important
  right 5px
  top 5px
  width 30px
.description
  white-space pre-wrap
.type
  text-transform capitalize
  text-align center
  font-weight bolder
  font-size 28px
.title
  cursor pointer
  text-align center
  font-size 20px
  color $grey-6
.icon
  margin-top 20px
  width 100%
  max-width 100px
.proposal-actions
  button
    width 45%
</style>
