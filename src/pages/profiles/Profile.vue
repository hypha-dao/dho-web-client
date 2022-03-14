<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import slugify from '~/utils/slugify'

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
    BadgesWidget: () => import('~/components/organization/badges-widget.vue'),
    Organizations: () => import('~/components/profiles/organizations.vue'),
    BasePlaceholder: () => import('~/components/placeholders/base-placeholder.vue')
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
            daoName: vote.voteon[0].dao?.[0].details_daoName_n, // TODO: Backend needs to return this also for suspensions?
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
          first: this.votesPagination.first,
          offset: 0
        }
      },
      skip () {
        return !this.username
      },
      fetchPolicy: 'cache-and-network'
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
      },
      fetchPolicy: 'cache-and-network'
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
      },
      fetchPolicy: 'cache-and-network'
    },
    organizations: {
      query: require('../../query/profile/profile-dhos.gql'),
      update (data) {
        this.organizationsPagination.count = data.getMember.memberofAggregate.count
        return data.getMember.memberof
      },
      variables () {
        return {
          username: this.username,
          first: this.organizationsPagination.first,
          offset: 0
        }
      },
      skip () {
        return !this.username
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
      showBioPlaceholder: true,
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

      assignmentsPagination: {
        first: 3,
        offset: 0,
        fetchMore: true
      },
      contributionsPagination: {
        first: 3,
        offset: 0,
        fetchMore: true
      },
      organizationsPagination: {
        first: 3,
        offset: 0,
        fetchMore: true,
        count: 0
      },

      organizationsList: [],
      votesPagination: {
        first: 5,
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

  mounted () {
    this.resetPagination(false)
    this.fetchProfile()
  },

  async beforeMount () {
    this.setBreadcrumbs([])
  },

  watch: {
    $route: 'fetchProfile',
    organizations: {
      handler () {
        if (this.organizations.length === this.organizationsPagination.count) {
          this.organizationsPagination.fetchMore = false
        }

        this.organizationsList = this.parseOrganizations(this.organizations)
      }
    }
  },

  methods: {
    ...mapActions('profiles', ['getPublicProfile', 'connectProfileApi', 'getProfile',
      'saveContactInfo', 'saveBio', 'saveAddresses', 'saveProfileCard', 'getWalletAdresses']),
    ...mapMutations('layout', ['setBreadcrumbs', 'setShowRightSidebar', 'setRightSidebarType']),

    // TODO: Remove this when transitioning to new profile edit
    ...mapMutations('profiles', ['setView']),

    resetPagination (forceOffset) {
      if (forceOffset) {
        this.contributionsPagination.offset = 0
        this.assignmentsPagination.offset = 0
        this.votesPagination.offset = 0
        this.organizationsPagination.offset = 0
        this.contributions = []
        this.assignments = []
        this.votes = []
        this.organizations = []
      } else {
        this.contributionsPagination.offset = this.contributions?.length || 0
        this.assignmentsPagination.offset = this.assignments?.length || 0
        this.votesPagination.offset = this.votes?.length || 0
        this.organizationsPagination.offset = this.organizations?.length || 0
      }
      this.contributionsPagination.fetchMore = true
      this.assignmentsPagination.fetchMore = true
      this.votesPagination.fetchMore = true
      this.organizationsPagination.fetchMore = true
    },

    loadMoreOrganizations (loaded) {
      if (this.organizationsPagination.fetchMore) {
        this.organizationsPagination.offset = this.organizationsPagination.offset + this.organizationsPagination.first
        this.$apollo.queries.organizations.fetchMore({
          variables: {
            first: this.organizationsPagination.first,
            offset: this.organizationsPagination.offset,
            username: this.username
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            const member = prev?.getMember
            const prevOrganisations = prev?.getMember.memberof
            const organizations = fetchMoreResult?.getMember.memberof

            const memberof = [
              ...prevOrganisations.filter(n => !organizations.some(p => p.docId === n.docId)),
              ...organizations
            ]

            if (memberof?.length === this.organizationsPagination.count) this.organizationsPagination.fetchMore = false

            return {
              getMember: {
                ...member,
                memberof
              }
            }
          }
        })
      }
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
            loaded(false)
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
            loaded(false)
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
    loadMoreVotes (loaded) {
      if (this.votesPagination.fetchMore) {
        this.votesPagination.offset = this.votesPagination.offset + this.votesPagination.first
        this.$apollo.queries.votes.fetchMore({
          variables: {
            username: this.username,
            first: this.votesPagination.first,
            offset: this.votesPagination.offset
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (fetchMoreResult.getMember?.vote.length === 0) this.votesPagination.fetchMore = false
            loaded(false)
            return {
              getMember: {
                ...prev.getMember,
                vote: [
                  ...(prev?.getMember?.vote.filter(n => !fetchMoreResult.getMember.vote.some(p => p.docId === n.docId)) || []),
                  ...(fetchMoreResult.getMember.vote || [])
                ]
              }
            }
          }
        })
      }
      loaded(false)
    },

    parseOrganizations (data) {
      const result = []
      if (Array.isArray(data)) {
        data.forEach((dho) => {
          const name = dho.details_daoName_n
          const title = dho.settings.settings_daoTitle_s
          // TODO: Move this to the backend?
          const slug = slugify(name, '-')

          // Currently there is no way to get DHO logo because the creation form is not developed yet.
          // TODO: Change this to consume data from backend when backend is ready.
          const logo = 'app-logo-128x128.png'

          result.push({ name, title, slug, logo })
        })
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
      if (!this.profile?.publicData?.bio) {
        this.showBioPlaceholder = true
      }
    },

    onCancelBio () {
      if (!this.profile?.publicData?.bio) {
        this.showBioPlaceholder = true
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
  .row.justify-center.q-col-gutter-md(v-else)
    .profile-detail-pane.q-gutter-y-md
      profile-card.info-card(:clickable="false" :username="username" :joinedDate="member && member.createdDate" isApplicant = false view="card" :editButton = "isOwner" @onSave="onSaveProfileCard")
      base-placeholder(v-if="!memberBadges && isOwner" title= "Badges" :subtitle=" isOwner ? 'No Badges yet - apply for a Badge here' : 'No badges to see here.'"
        icon= "fas fa-id-badge" :actionButtons="isOwner ? [{label: 'Apply', color: 'primary', onClick: () => $router.push(`/${this.selectedDao.name}/organization/assets/badge`)}] : []" )
      badges-widget(:badges="memberBadges" compact v-if="memberBadges")
      wallet(ref="wallet" :more="isOwner" :username="username")
      wallet-adresses(:walletAdresses = "walletAddressForm" @onSave="onSaveWalletAddresses" v-if="isOwner")
      organizations(:organizations="organizationsList" :hasMore="organizationsPagination.fetchMore" @onSeeMore="loadMoreOrganizations")
    .profile-active-pane.q-gutter-y-md.col-12.col-sm.relative-position
      base-placeholder(v-if="!assignments.length" title= "Assignments" :subtitle=" isOwner ? `Looks like you don't have any active assignments. You can browse all Role Archetypes.` : 'No active or archived assignments to see here.'"
        icon= "fas fa-file-medical" :actionButtons="isOwner ? [{label: 'Create Assignment', color: 'primary', onClick: () => $router.push(`/${this.selectedDao.name}/proposals/create`)}] : [] " )
      active-assignments(
        v-if="assignments.length"
        :daoName="selectedDao.name"
        :assignments="assignments"
        :owner="isOwner"
        @claim-all="$refs.wallet.fetchTokens()"
        @change-deferred="refresh"
        @onMore="loadMoreAssingments"
      )
      base-placeholder(v-if="!contributions.length && isOwner" title= "Contributions" :subtitle=" isOwner ? `Looks like you don't have any contributions yet. You can create a new contribution in the Proposal Creation Wizard.` : 'No contributions to see here.'"
        icon= "fas fa-file-medical" :actionButtons="isOwner ? [{label: 'Create Contribution', color: 'primary', onClick: () => $router.push(`/${this.selectedDao.name}/proposals/create`)}] : []" )
      active-assignments(
        v-if="contributions.length"
        :daoName="selectedDao.name"
        :contributions="contributions"
        :owner="isOwner"
        @claim-all="$refs.wallet.fetchTokens()"
        @change-deferred="refresh"
        @onMore="loadMoreContributions"
      )
      base-placeholder(v-if="!(profile && profile.publicData && profile.publicData.bio) && showBioPlaceholder" title= "Biography" :subtitle=" isOwner ? `Write something about yourself here and let other users know about your purpose.` : `Looks like ${this.username} didn't write anything about their purpose in this DAO yet.`"
        icon= "fas fa-user-edit" :actionButtons="isOwner ? [{label: 'Write biography', color: 'primary', onClick: () => {$refs.about.openEdit(); showBioPlaceholder = false }}] : []" )
      about.about(v-show="(profile && profile.publicData && profile.publicData.bio) || (!showBioPlaceholder)" :bio="(profile && profile.publicData) ? (profile.publicData.bio || '') : 'Retrieving bio...'" @onSave="onSaveBio" @onCancel="onCancelBio" :editButton="isOwner" ref="about")
      base-placeholder(v-if="!votes.length" title= "Recent votes" :subtitle=" isOwner ? `You haven't cast any votes yet. Go and take a look at all proposals` : 'No votes casted yet.'"
        icon= "fas fa-vote-yea" :actionButtons="isOwner ? [{label: 'Vote', color: 'primary', onClick: () => $router.push(`/${this.selectedDao.name}/organization/proposals`)}] : []" )
      voting-history(v-if="votes.length" :name="(profile && profile.publicData) ? profile.publicData.name : username" :votes="votes" @onMore="loadMoreVotes")
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
