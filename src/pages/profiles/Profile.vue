<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'page-profile',
  components: {
    PersonalInfo: () => import('~/components/profiles/personal-info.vue'),
    ProfileCard: () => import('~/components/profiles/profile-card.vue'),
    About: () => import('~/components/profiles/about.vue'),
    ActiveAssignments: () => import('~/components/profiles/active-assignments.vue'),
    VotingHistory: () => import('~/components/profiles/voting-history.vue'),
    Wallet: () => import('~/components/profiles/wallet.vue'),
    ContactInfo: () => import('~/components/profiles/contact-info.vue'),
    WalletAdresses: () => import('~/components/profiles/wallet-adresses.vue'),
    BadgesWidget: () => import('~/components/organization/badges-widget.vue')
  },
  apollo: {
    memberBadges: {
      query: require('~/query/badges/member-badges.gql'),
      update: data => {
        return data.getDao?.badge?.map(badge => {
          return {
            title: badge.details_title_s,
            description: badge.details_description_s,
            icon: badge.details_icon_s,
            assignments: badge.assignment
          }
        })
      },
      variables () {
        return {
          daoId: this.selectedDao.docId,
          username: this.username
        }
      },
      skip () {
        return !this.username || !this.selectedDao || !this.selectedDao.docId
      },
      fetchPolicy: 'no-cache'
    },
    member: {
      query: require('../../query/profile/profile-basic-info.gql'),
      update: data => {
        return data.getMember
      },
      variables () {
        return {
          username: this.username
        }
      },
      skip () {
        return !this.username
      }
    },
    votes: {
      query: require('../../query/profile/profile-votes.gql'),
      update: data => {
        return data.getMember?.vote.map(vote => {
          return {
            daoName: vote.voteon[0].dao[0].details_daoName_n,
            document: vote.docId,
            creator: vote.voteon[0].creator,
            timestamp: vote.vote_date_t,
            title: vote.voteon[0].details_title_s,
            type: vote.voteon[0].__typename,
            vote: vote.vote_vote_s,
            vote_power: vote.vote_votePower_a
          }
        })
      },
      variables () {
        return {
          username: this.username,
          first: 5
        }
      },
      skip () {
        return !this.username
      }
    },
    contributions: {
      query: require('../../query/profile/profile-contributions.gql'),
      update: data => {
        return data.queryPayout
      },
      variables () {
        return {
          username: this.username,
          daoId: this.selectedDao.name,
          first: this.contributionsPagination.first,
          offset: 0
        }
      },
      skip () {
        return !this.username || !this.selectedDao || !this.selectedDao.name
      }
    },
    assignments: {
      query: require('../../query/profile/profile-assignments.gql'),
      update: data => {
        return data.queryAssignment
      },
      variables () {
        return {
          username: this.username,
          daoId: this.selectedDao.name,
          first: this.assignmentsPagination.first,
          offset: 0
        }
      },
      skip () {
        return !this.username || !this.selectedDao || !this.selectedDao.name
      }
    }
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
      limit: 5,
      emailInfo: null,
      smsInfo: null,
      commPref: null,
      walletAddressForm: {
        btcAddress: null,
        ethAddress: null,
        eosAccount: null,
        eosMemo: null,
        defaultAddress: null
      },
      assignmentsList: [],
      contributionsList: [],
      contributionsPagination: {
        first: 3,
        offset: 0,
        fetchMore: true
      },
      assignmentsPagination: {
        first: 3,
        offset: 0,
        fetchMore: true
      }
    }
  },

  computed: {
    ...mapGetters('accounts', ['account']),
    ...mapGetters('profiles', ['isConnected', 'profile']),
    ...mapGetters('dao', ['selectedDao', 'daoSettings']),

    isOwner () {
      return this.username === this.account
    }
  },

  created () {
    this.fetchProfile()
    this.contributionsPagination.offset = this.contributions?.length || 0
    this.assignmentsPagination.offset = this.assignments?.length || 0
  },

  async beforeMount () {
    this.setBreadcrumbs([])
  },

  watch: {
    $route: 'fetchProfile',
    contributions: {
      handler () {
        this.contributionsList = this.parseContributions(this.contributions)
      }
    },
    assignments: {
      handler () {
        this.assignmentsList = this.parseAssignments(this.assignments)
      }
    }
  },

  methods: {
    ...mapActions('profiles', ['getPublicProfile', 'connectProfileApi', 'getProfile',
      'saveContactInfo', 'saveBio', 'saveAddresses', 'saveProfileCard', 'getWalletAdresses']),
    ...mapMutations('layout', ['setBreadcrumbs', 'setShowRightSidebar', 'setRightSidebarType']),

    // TODO: Remove this when transitioning to new profile edit
    ...mapMutations('profiles', ['setView']),

    resetPagination () {
      this.contributionsPagination.offset = 0
      this.contributionsPagination.fetchMore = true
      this.assignmentsPagination.offset = 0
      this.assignmentsPagination.fetchMore = true

      this.contributions = []
      this.assignments = []
    },

    loadMoreContributions (loaded) {
      if (this.contributionsPagination.fetchMore) {
        this.contributionsPagination.offset = this.contributionsPagination.offset + this.contributionsPagination.first
        this.$apollo.queries.contributions.fetchMore({
          variables: {
            username: this.username,
            daoId: this.selectedDao.name,
            first: this.contributionsPagination.first,
            offset: this.contributionsPagination.offset
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (fetchMoreResult.queryPayout?.length === 0) this.contributionsPagination.fetchMore = false
            loaded(!this.contributionsPagination.fetchMore)
            return {
              queryPayout: [
                ...(prev?.queryPayout?.filter(n => !fetchMoreResult.queryPayout.some(p => p.docId === n.docId)) || []),
                ...(fetchMoreResult.queryPayout || [])
              ]
            }
          }
        })
      }
      loaded(false)
    },
    loadMoreAssingments (loaded) {
      if (this.assignmentsPagination.fetchMore) {
        this.assignmentsPagination.offset = this.assignmentsPagination.offset + this.assignmentsPagination.first
        this.$apollo.queries.assignments.fetchMore({
          variables: {
            username: this.username,
            daoId: this.selectedDao.name,
            first: this.assignmentsPagination.first,
            offset: this.assignmentsPagination.offset
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (fetchMoreResult.queryAssignment?.length === 0) this.assignmentsPagination.fetchMore = false
            loaded(!this.assignmentsPagination.fetchMore)
            return {
              queryAssignment: [
                ...(prev?.queryAssignment?.filter(n => !fetchMoreResult.queryAssignment.some(p => p.docId === n.docId)) || []),
                ...(fetchMoreResult.queryAssignment || [])
              ]
            }
          }
        })
      }
      loaded(false)
    },

    parseContributions (data) {
      const result = []
      if (Array.isArray(data)) {
        data.forEach((payout) => {
          result.push({
            owner: this.username,
            created: new Date(payout.createdDate),
            recipient: payout.details_recipient_n,
            title: payout.details_title_s,
            state: payout.details_state_s,
            docId: payout.docId
          })
        })
      }
      return result
    },

    parseAssignments (data) {
      const result = []
      if (Array.isArray(data)) {
        data.forEach(async (assignment) => {
          const periodCount = assignment.details_periodCount_i
          let periodResponse = await this.$apollo.query({
            query: require('../../query/periods/dao-periods-range.gql'),
            variables: {
              daoId: this.selectedDao.docId,
              min: assignment.start[0].details_startTime_t,
              max: new Date(new Date(assignment.start[0].details_startTime_t).getTime() +
                (assignment.details_periodCount_i * this.daoSettings.periodDurationSec * 1000)).toISOString()
            }
          })
          periodResponse = periodResponse.data.getDao.period.map((value, index) => {
            return {
              docId: value.docId,
              label: value.details_startTime_t,
              phase: value.details_label_s,
              startDate: value.details_startTime_t,
              endDate: periodResponse.data.getDao.period[index + 1]?.details_startTime_t
            }
          })

          // Calculate start and end time for all periods
          const start = new Date(periodResponse[0].startDate)

          // Add the periods
          const periods = []
          for (let i = 0; i < periodCount; i += 1) {
            const claimed = assignment.claimed
              ? assignment.claimed.some(c => c.docId === periodResponse[i].docId)
              : false
            periods.push({
              start: new Date(periodResponse[i].startDate),
              end: new Date(periodResponse[i].endDate),
              title: ['First Quarter', 'Full Moon', 'New Moon', 'Last Quarter'].includes(periodResponse[i].phase)
                ? periodResponse[i].phase
                : 'First Quarter',
              claimed: claimed
            })
          }

          // Add the assignment
          const commit = { value: 0, min: 0, max: assignment.details_timeShareX100_i }
          if (assignment.lastimeshare) {
            commit.value = assignment.lastimeshare[0].details_timeShareX100_i
          }
          const deferred = {
            value: assignment.details_deferredPercX100_i,
            min: assignment.details_approvedDeferredPercX100_i || assignment.details_deferredPercX100_i,
            max: 100
          }

          const lastEnd = periods[periods.length - 1].end
          // To ensure no disruption in assignment, an extension must be
          // created more than 1 voting period before it expires
          const VOTE_DURATION = this.daoSettings.votingDurationSeconds * 1000
          result.push({
            owner: this.username,
            docId: assignment.docId,
            start,
            end: lastEnd,
            active: start < Date.now() && lastEnd > Date.now(),
            past: lastEnd < Date.now(),
            future: start > Date.now(),
            periods,
            extend: {
              start: new Date(lastEnd - 3 * VOTE_DURATION),
              end: new Date(lastEnd - VOTE_DURATION)
            },
            title: assignment.details_title_s || assignment.role[0].details_title_s,
            description: assignment.details_description_s,
            commit,
            deferred,
            usdEquivalent: Number.parseFloat(assignment.role[0].details_annualUsdSalary_a),

            // Needed for 'extend' functionality
            minDeferred: assignment.role[0].details_minDeferredX100_i,
            roleTitle: assignment.role[0].details_title_s,
            startPeriod: periodResponse[0],
            url: undefined
          })
        })

        result.sort((a, b) => b.end - a.end)
      }
      return result
    },

    /**
     * Refresh the member data after a small timeout
     */
    refresh () {

    },

    /**
     * Kicks off the various fetch operations needed to retrieve this user's data
     */
    async fetchProfile () {
      if (this.username) {
        this.loading = true
        if (this.isOwner) {
          await this.loadProfile()
        } else {
          await this.loadPublicProfile()
        }
        this.loading = false
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
        this.commPref = profile.commPref
      }
      this.walletAddressForm = await this.getWalletAdresses(this.account)
    },

    async onSaveContactInfo (data, success, fail) {
      try {
        await this.saveContactInfo(data)
        this.setView(await this.getProfile(this.account))
        success()
      } catch (error) {
        fail(error)
      }
    },

    async onSaveProfileCard (data, success, fail) {
      try {
        await this.saveProfileCard(data)
        this.setView(await this.getProfile(this.account))
        success()
      } catch (error) {
        console.error(error) // eslint-disable-line no-console
        fail(error)
      }
    },

    async onSaveBio (data, success, fail) {
      try {
        await this.saveBio(data.bio)
        this.setView(await this.getProfile(this.account))
        success()
      } catch (error) {
        console.error(error) // eslint-disable-line no-console
        fail(error)
      }
    },

    async onSaveWalletAddresses (data, success, fail) {
      try {
        await this.saveAddresses({ newData: data, oldData: this.walletAddressForm })
        this.walletAddressForm = data
        this.setView(await this.getProfile(this.account))
        success()
      } catch (error) {
        console.error(error) // eslint-disable-line no-console
        fail(error)
      }
    }
  }
}
</script>

<template lang="pug">
q-page.full-width.page-profile
  .row.justify-center.items-center(v-if="loading" :style="{ height: '90vh' }")
    q-spinner-dots(color="primary" size="40px")
  .row.justify-center.items-center(v-else-if="(!profile && !isOwner)" :style="{ height: '90vh' }")
    .text-subtitle1.text-center.q-mb-md This profile does not exist
    q-btn(color="primary" style="width:200px;" @click="$router.go(-1)" label="Go back")
  .row.justify-center.q-col-gutter-md(v-else)
    .profile-detail-pane.q-gutter-y-md
      profile-card.info-card( :username="username" :joinedDate="member && member.createdDate" isApplicant = false view="card" :editButton = "isOwner" @onSave="onSaveProfileCard")
      wallet(ref="wallet" :more="isOwner" :username="username")
      wallet-adresses(:walletAdresses = "walletAddressForm" @onSave="onSaveWalletAddresses" v-if="isOwner")
    .profile-active-pane.q-gutter-y-md.col-12.col-sm.relative-position
      active-assignments(
        :assignments="assignmentsList"
        :owner="isOwner"
        @claim-all="$refs.wallet.fetchTokens()"
        @change-deferred="refresh"
        @onSeeMore="loadMoreAssingments"
      )
      active-assignments(
        :contributions="contributionsList"
        :owner="isOwner"
        @claim-all="$refs.wallet.fetchTokens()"
        @change-deferred="refresh"
        @onSeeMore="loadMoreContributions"
      )
      about.about(:bio="(profile && profile.publicData) ? profile.publicData.bio : 'Retrieving bio...'" @onSave="onSaveBio" :editButton="isOwner")
      .row
        badges-widget(:badges="memberBadges")
      voting-history(:name="(profile && profile.publicData) ? profile.publicData.name : username" :votes="votes")
      contact-info(:emailInfo="emailInfo" :smsInfo="smsInfo" :commPref="commPref" @onSave="onSaveContactInfo" v-if="isOwner")
</template>

<style lang="stylus" scoped>
.page-profile
  // .info-card
  //   height: 374px
  .about
    min-height 200px

  .profile-detail-pane
    min-width 302px

  .profile-active-pane
    min-width 292px

    .edit-btn
      z-index 1
</style>
