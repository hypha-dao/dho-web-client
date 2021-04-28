<script>
import { Notify } from 'quasar'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'page-profile',
  components: {
    PersonalInfo: () => import('./components/personal-info.vue'),
    About: () => import('./components/about.vue'),
    VotingHistory: () => import('./components/voting-history.vue'),
    Wallet: () => import('./components/wallet.vue')
  },

  props: {
    username: String
  },

  data () {
    return {
      loading: true,
      submitting: false,
      member: null,
      // titles: [],
      // publicData: null,
      limit: 5,
      votes: [],
      joined: null
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
    ...mapActions('profiles', ['getPublicProfile', 'connectProfileApi']),
    ...mapActions('trail', ['fetchBallot']),
    ...mapMutations('layout', ['setBreadcrumbs', 'setShowRightSidebar', 'setRightSidebarType']),

    // TODO: Remove this when transitioning to new profile edit
    ...mapMutations('profiles', ['setView']),

    /**
     * Kicks off the various fetch operations needed to retrieve this user's data
     */
    async fetchProfile () {
      if (this.username) {
        this.loading = true
        // this.getMember()
        this.getProfile()
        this.getJoinDate()
        this.getRecentVotes()
      }
    },

    /**
     * Retrieve the user's data and edges via dgraph
     */
    async getMember () {
      const query = require('../../query/profile.graphql').default
      const res = await this.$store.$dgraph
        .newTxn({ readOnly: true, bestEffort: true })
        .queryWithVars(query, { $username: this.username })
      if (res.data.profile.length) {
        this.member = res.data.profile[0]
      }
    },

    /**
     * Retrieve the user's public profile using the profile service
     * When this data is retrieved, the loading state is canceled
     */
    async getProfile () {
      this.setView(null)
      // this.publicData = null
      const profile = await this.getPublicProfile(this.username)
      if (profile) {
        this.setView(profile)
        // this.publicData = profile.publicData
      }
      this.loading = false
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
     */
    async getBallot (id) {
      const ballot = await this.fetchBallot(id)
      this.votes.find(v => v.ballot_name === id).ballot = ballot
    },

    /**
     * Retrieves the user's recent votes via the vote contract
     * TODO: This will likely need to be updated once native ballots are deployed
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
          this.submitting = false
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
      }
    }
  }
}
</script>

<template lang="pug">
q-page.page-profile(padding)
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
      wallet(:more="isOwner" :username="username")
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
      about.about(:bio="publicData ? publicData.bio : 'Retrieving bio...'")
      voting-history(:name="profile.publicData ? profile.publicData.name : username" :votes="votes")
</template>

<style lang="stylus" scoped>
.page-profile
  .about
    min-height 200px

  .profile-detail-pane
    min-width 292px
    max-width 800px

  .profile-active-pane
    min-width 400px
    max-width 800px

    .edit-btn
      z-index 1
</style>
