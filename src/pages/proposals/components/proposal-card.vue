<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import removeMd from 'remove-markdown'
import { format } from '~/mixins/format'

export default {
  name: 'proposal-card',
  mixins: [format],
  props: {
    proposal: { type: Object, required: true },
    readonly: { type: Boolean, required: false, default: () => false }
  },
  data () {
    return {
      loading: true,
      details: false,
      profile: null,
      ballot: null,
      percentage: 0,
      quorum: 0,
      fail: null,
      pass: null,
      votesOpened: false,
      canCloseProposal: false,
      voting: false,
      userVote: null,
      role: null
    }
  },
  computed: {
    ...mapGetters('accounts', ['account']),
    type () {
      const data = this.proposal.names.find(o => o.key === 'type')
      let type = (data && data.value) || ''
      if (type === 'payout') {
        type = 'contribution'
      }
      return type
    },
    owner () {
      const data = this.proposal.names.find(o => o.key === 'owner')
      return (data && data.value) || ''
    },
    roleId () {
      const data = this.proposal.ints.find(o => o.key === 'role_id')
      return (data && data.value) || ''
    },
    title () {
      if (this.type === 'assignment') {
        if (this.role) {
          return this.role.strings.find(o => o.key === 'title').value
        }
      }
      const data = this.proposal.strings.find(o => o.key === 'title')
      return (data && data.value) || ''
    },
    description () {
      const obj = this.proposal.strings.find(o => o.key === 'description')
      if (obj) {
        return removeMd(obj.value).replace(/\n/g, ' ')
      }
      return ''
    },
    url () {
      const data = this.proposal.strings.find(o => o.key === 'url')
      return data && data.value
    }
  },
  async mounted () {
    await this.loadBallot(this.proposal.names.find(o => o.key === 'ballot_id').value)
    this.profile = await this.getPublicProfile(this.owner)
    if (this.type === 'assignment') {
      this.role = await this.fetchRole(this.roleId)
    }
    this.loading = false
  },
  watch: {
    async account (val) {
      if (val && this.ballot) {
        this.userVote = await this.getUserVote({
          user: val,
          ballot: this.ballot.ballot_name
        })
      }
    }
  },
  methods: {
    ...mapActions('trail', ['fetchBallot', 'castVote', 'getSupply', 'getUserVote']),
    ...mapActions('profiles', ['getPublicProfile']),
    ...mapActions('roles', ['fetchRole']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    openUrl () {
      window.open(this.url)
    },
    async loadBallot (id) {
      const result = await this.fetchBallot(id)
      if (result) {
        this.ballot = result
        const now = new Date(Date.now() + new Date().getTimezoneOffset() * 60 * 1000)
        this.votesOpened = now >= new Date(result.begin_time).getTime() && now <= new Date(result.end_time).getTime()
        this.canCloseProposal = now > new Date(result.end_time).getTime()
        this.pass = result.options.find(o => o.key === 'pass').value
        this.fail = result.options.find(o => o.key === 'fail').value
        if (parseFloat(this.pass) + parseFloat(this.fail) > 0) {
          this.percentage = parseFloat((parseFloat(this.pass) / (parseFloat(this.pass) + parseFloat(this.fail))) * 100).toFixed(2)
        } else {
          this.percentage = 0
        }
        const supply = parseFloat(await this.getSupply())
        if (supply > 0) {
          this.quorum = parseFloat(this.ballot.total_raw_weight) * 100 / supply
        }
        if (this.timeout) {
          clearInterval(this.timeout)
        }
        this.timeout = setInterval(this.updateCountdown, 1000)
        if (this.account) {
          this.userVote = await this.getUserVote({
            user: this.account,
            ballot: this.ballot.ballot_name
          })
        }
      }
    },
    async onCastVote (vote) {
      this.voting = true
      await this.castVote({
        id: this.ballot.ballot_name,
        vote
      })
      await this.loadBallot(this.ballot.ballot_name)
      this.voting = false
      this.userVote = vote
    },
    showCardFullContent () {
      this.setShowRightSidebar(true)
      this.setRightSidebarType({
        type: `${this.type}ProposalView`,
        data: {
          proposal: this.proposal,
          ballot: this.ballot
        }
      })
    }
  }
}
</script>

<template lang="pug">
q-card.proposal
  .ribbon(v-if="!readonly")
    span.text-white.bg-hire(v-if="type === 'assignment'") APPLYING
    span.text-white.bg-proposal(v-else) PROPOSING
  .url(v-if="url && url !== 'null'")
    q-btn(
      icon="fas fa-bookmark"
      @click="openUrl"
      flat
      color="proposal"
      unelevated
      dense
    )
  q-img.owner-avatar(
    v-if="profile && profile.publicData.avatar"
    :src="profile.publicData.avatar"
    @click="$router.push({ path: `/@${owner}`})"
  )
    q-tooltip {{ (profile.publicData && profile.publicData.name) || owner }}
  q-avatar.owner-avatar(
    v-else
    size="40px"
    color="accent"
    text-color="white"
    @click="$router.push({ path: `/@${owner}`})"
  )
    | {{ owner.slice(0, 2).toUpperCase() }}
    q-tooltip {{ (profile && profile.publicData && profile.publicData.name) || owner }}
  q-card-section.text-center.q-pb-sm.cursor-pointer(@click="showCardFullContent")
    img.icon(v-if="type === 'role'" src="~assets/icons/roles.svg")
    img.icon(v-if="type === 'assignment'" src="~assets/icons/assignments.svg")
    img.icon(v-if="type === 'contribution'" src="~assets/icons/past.svg")
  q-card-section
    .type(@click="showCardFullContent") {{ type }}
    .title(@click="details = !details") {{ title }}
  q-card-section.description(v-show="details")
    p {{ description | truncate(150) }}
  q-card-section.vote-section
    q-linear-progress.vote-bar.vote-bar-endorsed(
      rounded
      size="25px"
      :value="percentage / 100"
      color="light-green-6"
      track-color="red"
    )
      .absolute-full.flex.flex-center
        .vote-text.text-white {{ percentage }}% endorsed
    q-linear-progress.vote-bar(
      rounded
      stripe
      size="25px"
      :value="quorum / 100"
      :color="quorum < 20 ? 'red' : 'light-green-6'"
      track-color="grey-8"
    )
      .absolute-full.flex.flex-center
        .vote-text.text-white {{ parseFloat(quorum).toFixed(2) }}% voted
  q-card-actions.q-pb-lg.q-px-lg.flex.justify-around.proposal-actions(v-if="!readonly")
    q-btn(
      :disable="!votesOpened"
      :icon="userVote === 'pass' ? 'fas fa-check-square' : null"
      label="Endorse"
      color="light-green-6"
      :loading="voting"
      @click="onCastVote('pass')"
      rounded
      dense
      unelevated
    )
    q-btn(
      :disable="!votesOpened"
      :icon="userVote === 'fail' ? 'fas fa-check-square' : null"
      label="reject"
      color="red"
      :loading="voting"
      @click="onCastVote('fail')"
      rounded
      dense
      unelevated
    )
</template>

<style lang="stylus" scoped>
.proposal
  width 300px
  border-radius 1rem
  margin 10px
.proposal:hover
  transition transform 0.3s cubic-bezier(0.005, 1.65, 0.325, 1) !important
  transform scale(1.2) translate(0px, 40px) !important
  -moz-transform scale(1.2) translate(0px, 40px)
  -webkit-transform scale(1.2) translate(0px, 40px)
  z-index 100
  box-shadow 0 4px 8px rgba(0,0,0,0.2), 0 5px 3px rgba(0,0,0,0.14), 0 3px 3px 3px rgba(0,0,0,0.12)
  .owner-avatar
    z-index 110
.owner-avatar
  cursor pointer
  position absolute
  border-radius 50% !important
  right 10px
  top 10px
  width 40px
.description
  white-space pre-wrap
  max-height 55px
  overflow auto
.type
  cursor pointer
  text-transform capitalize
  text-align center
  font-weight 800
  font-size 28px
.title
  cursor pointer
  text-align center
  font-size 20px
  color $grey-6
  line-height 22px
.icon
  margin-top 20px
  width 100%
  max-width 100px
.url
  position absolute
  top -4px
  right 50px
  z-index 12
.proposal-actions
  button
    width 45%
    font-weight 700
    /deep/i
      font-size 16px
.vote-section
  padding 0 28px 10px
.vote-bar
  border-radius 14px
  /deep/.q-linear-progress__track
    opacity 1
.vote-bar-endorsed
  margin-bottom 5px
</style>
