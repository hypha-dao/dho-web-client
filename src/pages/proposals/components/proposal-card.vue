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
      role: null,
      titleHash: null
    }
  },
  computed: {
    ...mapGetters('accounts', ['isMember', 'account']),
    ...mapGetters('search', ['search']),
    isFiltered () {
      if (this.search) {
        if (this.role) {
          if (
            this.getObjValue(this.role, 'names', 'owner').includes(this.search) ||
            this.getObjValue(this.role, 'strings', 'title').includes(this.search) ||
            this.getObjValue(this.role, 'strings', 'description').includes(this.search)
          ) {
            return true
          }
        }
        return this.getObjValue(this.proposal, 'names', 'owner').includes(this.search) ||
          this.getObjValue(this.proposal, 'names', 'proposer').includes(this.search) ||
          this.getObjValue(this.proposal, 'names', 'recipient').includes(this.search) ||
          this.getObjValue(this.proposal, 'strings', 'title').includes(this.search) ||
          this.getObjValue(this.proposal, 'strings', 'description').includes(this.search)
      } else if (this.$route.params.status) {
        if (this.$route.params.status === 'all') {
          return true
        } else if (this.$route.params.status === 'passed') {
          return this.percentage >= 80 && this.quorum >= 20
        } else if (this.$route.params.status === 'failed') {
          return this.percentage < 80 || this.quorum < 20
        }
      }
      return true
    },
    origin () {
      const data = this.proposal.names.find(o => o.key === 'original_scope')
      let type = (data && data.value) || ''
      if (type === 'payout') {
        type = 'contribution'
      }
      return type
    },
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
    },
    salaryBucket () {
      let asset = this.proposal.assets.find(o => o.key === 'annual_usd_salary')
      if (this.role) {
        asset = this.role.assets.find(o => o.key === 'annual_usd_salary')
      }
      if (!asset) return null
      const amount = parseInt(asset.value)
      if (amount <= 80000) {
        return 'B1'
      } else if (amount > 80000 && amount <= 100000) {
        return 'B2'
      } else if (amount > 100000 && amount <= 120000) {
        return 'B3'
      } else if (amount > 120000 && amount <= 140000) {
        return 'B4'
      } else if (amount > 140000 && amount <= 160000) {
        return 'B5'
      } else if (amount > 160000 && amount <= 180000) {
        return 'B6'
      } else if (amount > 180000) {
        return 'B7'
      }
      return null
    }
  },
  async mounted () {
    await this.loadBallot(this.proposal.names.find(o => o.key === 'ballot_id').value)
    this.profile = await this.getPublicProfile(this.owner)
    if (this.roleId) {
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
    },
    title: {
      immediate: true,
      async handler (val) {
        if (val) {
          this.titleHash = await this.toSHA256(val)
        }
      }
    }
  },
  methods: {
    ...mapActions('proposals', ['closeProposal']),
    ...mapActions('trail', ['fetchBallot', 'castVote', 'getSupply', 'getUserVote']),
    ...mapActions('profiles', ['getPublicProfile']),
    ...mapActions('roles', ['fetchRole']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    ...mapMutations('proposals', ['removeProposal']),
    openUrl () {
      window.open(this.url)
    },
    async onCloseProposal () {
      this.voting = true
      await this.closeProposal(this.proposal.id)
      await this.removeProposal(this.proposal.id)
      this.voting = false
    },
    async loadBallot (id) {
      const result = await this.fetchBallot(id)
      if (result) {
        this.ballot = result
        const now = Date.now() + new Date().getTimezoneOffset() * 60000
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
        // Origin prevails on the type as it can be edit or suspend
        type: `${this.origin || this.type}ProposalView`,
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
q-card.proposal(v-if="isFiltered")
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
  img.icon(v-if="origin === 'role' || type === 'role'" src="~assets/icons/roles.svg")
  img.icon(v-if="origin === 'assignment' || type === 'assignment'" src="~assets/icons/assignments.svg")
  img.icon(v-if="origin === 'contribution' || type === 'contribution'" src="~assets/icons/past.svg")
  q-card-section.text-center.q-pb-sm.cursor-pointer.relative-position(@click="showCardFullContent")
    q-img.owner-avatar(
      v-if="origin === 'role' || type === 'role'"
      :src="`https://api.adorable.io/avatars/100/${titleHash}`"
    )
    q-img.owner-avatar(
      v-if="origin !== 'role' && type !== 'role' && profile && profile.publicData && profile.publicData.avatar"
      :src="profile.publicData.avatar"
      @click="$router.push({ path: `/@${owner}`})"
    )
    q-avatar.owner-avatar(
      v-if="origin !== 'role' && type !== 'role' && (!profile || !profile.publicData || !profile.publicData.avatar)"
      size="150px"
      color="accent"
      text-color="white"
      @click="$router.push({ path: `/@${owner}`})"
    )
      | {{ owner.slice(0, 2).toUpperCase() }}
    .salary-bucket.bg-proposal(v-if="salaryBucket") {{ salaryBucket }}
  q-card-section
    .type(@click="showCardFullContent") {{ (profile && profile.publicData && profile.publicData.name) || owner }}
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
      v-if="votesOpened"
      :disable="!isMember"
      :icon="userVote === 'pass' ? 'fas fa-check-square' : null"
      :label="type === 'assignment' ? 'Enroll' : 'Endorse'"
      color="light-green-6"
      :loading="voting"
      @click="onCastVote('pass')"
      rounded
      dense
      unelevated
    )
    q-btn(
      v-if="votesOpened"
      :disable="!isMember"
      :icon="userVote === 'fail' ? 'fas fa-check-square' : null"
      label="reject"
      color="red"
      :loading="voting"
      @click="onCastVote('fail')"
      rounded
      dense
      unelevated
    )
    .vote-info(v-if="!votesOpened && !userVote && owner !== account")
      q-icon.q-mr-sm(name="fas fa-exclamation-triangle" size="sm")
      | Voting period ended
    .vote-info(v-if="!votesOpened && userVote === 'pass' && owner !== account")
      q-icon.q-mr-sm(name="fas fa-exclamation-triangle" size="sm")
      | You endorsed this proposal
    .vote-info(v-if="!votesOpened && userVote === 'fail' && owner !== account")
      q-icon.q-mr-sm(name="fas fa-exclamation-triangle" size="sm")
      | You rejected this proposal
    q-btn.q-mt-sm(
      v-if="canCloseProposal && owner === account && ballot && ballot.status !== 'closed'"
      :label="percentage >= 80 && quorum >= 20 ? 'Activate' : 'Deactivate'"
      :color="percentage >= 80 && quorum >= 20 ? 'light-green-6' : 'red'"
      :loading="voting"
      @click="onCloseProposal"
      :style="{width: '200px'}"
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
  z-index 100
  box-shadow 0 8px 12px rgba(0,0,0,0.2), 0 9px 7px rgba(0,0,0,0.14), 0 7px 7px 7px rgba(0,0,0,0.12)
  .owner-avatar, .salary-bucket
    z-index 110
.owner-avatar
  cursor pointer
  border-radius 50% !important
  margin-top 20px
  width 100%
  max-width 150px
  height 150px
.salary-bucket
  position absolute
  bottom 10px
  right 80px
  color white
  font-size 28px
  font-weight 700
  border-radius 50%
  width 45px
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
  line-height 1
.title
  cursor pointer
  text-align center
  font-size 20px
  color $grey-6
  line-height 22px
.icon
  position absolute
  right 10px
  top 10px
  width 40px
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
