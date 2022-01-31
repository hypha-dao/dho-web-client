<script>
import { Notify } from 'quasar'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'page-profile',
  components: {
    PersonalInfo: () => import('~/components/profiles/personal-info.vue'),
    About: () => import('~/components/profiles/about.vue'),
    ActiveAssignments: () => import('~/components/profiles/active-assignments.vue'),
    VotingHistory: () => import('~/components/profiles/voting-history.vue'),
    Wallet: () => import('~/components/profiles/wallet.vue'),
    ContactInfo: () => import('~/components/profiles/contact-info.vue')
  },

  props: {
    username: String
  },

  meta () {
    return {
      title: `${this.username}'s Profile`
    }
  },

  data () {
    return {
      loading: true,
      submitting: false,
      member: null,
      assignments: [],
      contributions: [],
      votes: [],
      limit: 5,
      joined: null,
      emailInfo: null,
      smsInfo: null
    }
  },

  computed: {
    ...mapGetters('accounts', ['account']),
    ...mapGetters('periods', ['periods']),
    ...mapGetters('profiles', ['isConnected', 'profile']),

    isOwner () {
      return this.username === this.account
    }
  },

  created () {
    this.fetchProfile()
  },

  async beforeMount () {
    this.setBreadcrumbs([])
  },

  watch: {
    $route: 'fetchProfile'
  },

  methods: {
    ...mapActions('profiles', ['getPublicProfile', 'connectProfileApi', 'getProfile', 'saveContactInfo']),
    ...mapActions('trail', ['fetchBallot']),
    ...mapMutations('layout', ['setBreadcrumbs', 'setShowRightSidebar', 'setRightSidebarType']),

    // TODO: Remove this when transitioning to new profile edit
    ...mapMutations('profiles', ['setView']),

    /**
     * Refresh the member data after a small timeout
     */
    refresh () {
      setTimeout(() => this.getMember(), 5000)
    },

    /**
     * Kicks off the various fetch operations needed to retrieve this user's data
     */
    async fetchProfile () {
      if (this.username) {
        this.loading = true
        this.getMember()
        this.getJoinDate()

        if (this.isOwner) {
          await this.loadProfile()
        } else {
          await this.loadPublicProfile()
        }
        this.loading = false
        // this.getRecentVotes()
      }
    },

    /**
     * Retrieve the user's data and edges via dgraph
     */
    async getMember () {
      this.assignments = []
      this.contributions = []
      this.votes = []
      this.member = await this.$dgraphQuery('/profile/get', { username: this.username })

      // Get active assignment
      if (Array.isArray(this.member.assigned)) {
        this.member.assigned.forEach((assignment) => {
          const startIdx = this.periods.findIndex(p => p.value === assignment.details.start_period)
          const periodCount = assignment.details.period_count

          // TODO: At the moment we don't show assignments that extend beyond period list...
          // This won't be a problem for now, but will be eventually - sorry future reader
          if (startIdx < 0 || startIdx + periodCount >= this.periods.length) return

          // Calculate start and end time for all periods
          const start = new Date(this.periods[startIdx].startDate)
          let prevEnd = start

          // Add the periods
          const periods = []
          for (let i = 0; i < periodCount; i += 1) {
            const end = new Date(this.periods[startIdx + i].endDate)
            const claimed = assignment.claimed
              ? assignment.claimed.some(c => c.hash === this.periods[startIdx + i].value)
              : false
            periods.push({
              start: prevEnd,
              end,
              title: this.periods[startIdx + i].phase,
              claimed
            })
            prevEnd = end
          }

          // Add the assignment
          const commit = { value: 0, min: 0, max: assignment.details.time_share_x100 }
          if (assignment.lastimeshare) {
            commit.value = assignment.lastimeshare[0].details.time_share_x100
          }
          const deferred = {
            value: assignment.details.deferred_perc_x100,
            min: assignment.details.approved_deferred_perc_x100 || assignment.details.deferred_perc_x100,
            max: 100
          }

          // To ensure no disruption in assignment, an extension must be
          // created more than 1 voting period before it expires
          const VOTE_DURATION = this.$config.contracts.voteDurationSeconds * 1000

          this.assignments.push({
            owner: this.username,
            hash: assignment.hash,
            start,
            end: prevEnd,
            active: start < Date.now() && prevEnd > Date.now(),
            past: prevEnd < Date.now(),
            future: start > Date.now(),
            periods,
            extend: {
              start: new Date(prevEnd - 3 * VOTE_DURATION),
              end: new Date(prevEnd - VOTE_DURATION)
            },
            title: assignment.details.title || assignment.role[0].details.title,
            description: assignment.details.description,
            tokens: [
              {
                label: 'HUSD',
                value: assignment.details.husd_salary_per_phase
                  ? Number.parseFloat(assignment.details.husd_salary_per_phase)
                  : 0,
                icon: 'husd.svg'
              },
              {
                label: 'HVOICE',
                value: assignment.details.hvoice_salary_per_phase
                  ? Number.parseFloat(assignment.details.hvoice_salary_per_phase)
                  : 0,
                icon: 'hvoice.svg'
              },
              {
                label: 'HYPHA',
                value: assignment.details.hypha_salary_per_phase
                  ? Number.parseFloat(assignment.details.hypha_salary_per_phase)
                  : 0,
                icon: 'hypha.svg',
                detail: `${assignment.details.deferred_perc_x100}% deferred`
              }
            ],
            commit,
            deferred,
            usdEquivalent: Number.parseFloat(assignment.role[0].details.annual_usd_salary),

            // Needed for 'extend' functionality
            minDeferred: assignment.role[0].details.min_deferred_x100,
            roleTitle: assignment.role[0].details.title,
            startPeriod: this.periods[startIdx],
            url: assignment.details.url
          })
        })

        this.assignments.sort((a, b) => b.end - a.end)
      }

      // Get contributions
      if (Array.isArray(this.member.payout)) {
        this.member.payout.forEach((payout) => {
          this.contributions.push({
            owner: this.username,
            created: new Date(payout.created_date),
            recipient: payout.details.recipient,
            hash: payout.hash,
            title: payout.details.title,
            tokens: [
              {
                label: 'HUSD',
                value: payout.details.husd_amount
                  ? Number.parseFloat(payout.details.husd_amount)
                  : 0,
                icon: 'husd.svg'
              },
              {
                label: 'HVOICE',
                value: payout.details.hvoice_amount
                  ? Number.parseFloat(payout.details.hvoice_amount)
                  : 0,
                icon: 'hvoice.svg'
              },
              {
                label: 'HYPHA',
                value: payout.details.hypha_amount
                  ? Number.parseFloat(payout.details.hypha_amount)
                  : 0,
                icon: 'hypha.svg',
                detail: payout.details.deferred_perc_x100 ? `${payout.details.deferred_perc_x100}% deferred` : undefined
              }
            ],
            deferred: payout.details.deferred_perc_x100 || 0,
            usdEquivalent: Number.parseFloat(payout.details.usd_amount) || 0
          })
        })
      }

      // Get recent votes
      if (Array.isArray(this.member.vote)) {
        this.member.vote.forEach((vote, i) => {
          const creator = vote.voteon[0].creator
          this.votes.push({
            document: vote.voteon[0].uid,
            creator,
            timestamp: vote.vote.date,
            title: vote.voteon[0].details.title,
            type: vote.voteon[0].system.type,
            vote: vote.vote.vote, // lol
            vote_power: vote.vote.vote_power
          })

          this.getAvatar(creator, i)
        })
      }
    },

    async getAvatar (account, index) {
      const profile = await this.getPublicProfile(account)
      if (profile) {
        this.$set(this.votes[index], 'avatar', profile.publicData.avatar)
        this.$set(this.votes[index], 'name', profile.publicData.name)
      }
    },

    /**
     * Retrieve the user's public profile using the profile service
     * When this data is retrieved, the loading state is canceled
     */
    async loadPublicProfile () {
      this.setView(null)
      // this.publicData = null
      const profile = await this.getPublicProfile(this.username)
      if (profile) {
        this.setView(profile)
        // this.publicData = profile.publicData
      }
    },

    async loadProfile () {
      const profile = await this.getProfile(this.account)
      if (profile) {
        this.setView(profile)
        this.smsInfo = profile.smsInfo
        this.emailInfo = profile.emailInfo
      }
    },

    async saveProfile (data, success, fail) {
      try {
        await this.saveContactInfo(data)
        success()
      } catch (error) {
        fail(error)
      }
    },

    /**
     * Gets the user's join date via the original apply action
     */
    async getJoinDate () {
      const response = await this.$store.$axios.get(
        `https://telos.caleos.io/v2/history/get_actions?limit=1&account=${this.username}&filter=${this.$config.contracts.dao}%3Aapply`
      )
      if (response.data && response.data.actions && response.data.actions.length) {
        this.joined = response.data.actions[0].timestamp
      }
    },

    /**
     * Retrieve the ballot name from the id and pass it to the vote history
     * Currently NOT CALLED
     */
    async getBallot (id) {
      const ballot = await this.fetchBallot(id)
      this.votes.find(v => v.ballot_name === id).ballot = ballot
    },

    /**
     * Retrieves the user's recent votes via the vote contract
     * Currently NOT CALLED
     * If we add a comprehensive vote history page for the user, this will be needed though
     */
    async getRecentVotes () {
      this.votes = []
      const response = await this.$store.$axios.get(
        `https://telos.caleos.io/v2/history/get_actions?limit=${this.limit}&account=${this.username}&filter=${this.$config.contracts.decide}%3Acastvote`
      )
      if (response.data && response.data.actions && response.data.actions.length) {
        response.data.actions.forEach((action) => {
          this.votes.push({
            ballot_name: action.act.data.ballot_name,
            timestamp: action.timestamp,
            trx_id: action.trx_id,
            vote: action.act.data.options[0],
            ballot: null
          })
          this.getBallot(action.act.data.ballot_name)
        })
      }
    },

    /**
     * Validates a connection to the profile service to enable editing
     */
    async onEdit () {
      try {
        if (!this.isConnected) {
          this.submitting = true
          await this.connectProfileApi()
        }
        this.setShowRightSidebar(true)
        this.setRightSidebarType('profileForm')
      } catch (error) {
        Notify.create({
          color: 'red',
          message: 'Unable to get profile for editing. You must sign a login transaction to proceed.',
          position: 'bottom',
          icon: 'fas fa-spinner fa-spin notif-icon',
          timeout: 10000,
          actions: [
            { label: 'Dismiss', color: 'white', handler: () => { /* ... */ } }
          ]
        })
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<template lang="pug">
q-page.full-width.page-profile
  .row.justify-center.items-center(v-if="loading" :style="{ height: '90vh' }")
    q-spinner-dots(color="primary" size="40px")
  .row.justify-center.items-center(v-else-if="!profile" :style="{ height: '90vh' }")
    div(v-if="isOwner")
      .text-subtitle1.q-mb-md Your profile does not exist
      q-btn.col-12(color="primary" style="width:200px;" @click="onEdit" label="Create profile")
    div(v-else)
      .text-subtitle1.text-center.q-mb-md This profile does not exist
      q-btn(color="primary" style="width:200px;" @click="$router.go(-1)" label="Go back")
  .row.justify-center.q-col-gutter-md(v-else)
    .profile-detail-pane.q-gutter-y-md.col-12.col-md-2
      personal-info(v-bind="{ joined, publicData: profile.publicData, username }")
      wallet(ref="wallet" :more="isOwner" :username="username" @set-redeem="onEdit")
    .profile-active-pane.q-gutter-y-md.col-12.col-sm.relative-position
      q-btn.absolute-top-right.q-mt-xl.q-mr-lg.q-pa-xs.edit-btn(
        v-if="isOwner"
        flat round size="sm"
        icon="fas fa-edit"
        color="primary"
        :loading="submitting"
        @click="onEdit"
      )
        q-tooltip Edit Profile
      about.about(:bio="profile.publicData ? profile.publicData.bio : 'Retrieving bio...'")
      active-assignments(
        :assignments="assignments"
        :contributions="contributions"
        :owner="isOwner"
        @claim-all="$refs.wallet.fetchTokens()"
        @change-deferred="refresh"
      )
      voting-history(:name="profile.publicData ? profile.publicData.name : username" :votes="votes")
      contact-info(:emailInfo="emailInfo" :smsInfo="smsInfo" @onSave="saveProfile" v-if="isOwner")
</template>

<style lang="stylus" scoped>
.page-profile
  .about
    min-height 200px

  .profile-detail-pane
    min-width 292px

  .profile-active-pane
    min-width 292px

    .edit-btn
      z-index 1
</style>
