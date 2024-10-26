<script>
import { mapActions, mapGetters } from 'vuex'
import ipfsy from '~/utils/ipfsy'
import { daoRouting } from '~/mixins/dao-routing'
import { screenSizes } from '~/mixins/screen-sizes'

const Tabs = Object.freeze({
  CONTRIBUTIONS: 'CONTRIBUTIONS',
  ASSIGNMENTS: 'ASSIGNMENTS',
  QUESTS: 'QUESTS',
  INFO: 'INFO',
  PROJECTS: 'PROJECTS',
  VOTES: 'VOTES',
  ABOUT: 'ABOUT'
})

export default {
  name: 'page-profile',
  mixins: [daoRouting, screenSizes],
  components: {
    About: () => import('~/components/profiles/about.vue'),
    ActiveAssignments: () => import('~/components/profiles/active-assignments.vue'),
    BadgesWidget: () => import('~/components/organization/badges-widget.vue'),
    BasePlaceholder: () => import('~/components/placeholders/base-placeholder.vue'),
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue'),
    MultiSig: () => import('~/components/profiles/multi-sig.vue'),
    Organizations: () => import('~/components/profiles/organizations.vue'),
    ProfileCard: () => import('~/components/profiles/profile-card.vue'),
    VotingHistory: () => import('~/components/profiles/voting-history.vue'),
    Wallet: () => import('~/components/profiles/wallet.vue'),
    WalletAdresses: () => import('~/components/profiles/wallet-adresses.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },
  apollo: {
    memberBadges: {
      query: require('~/query/badges/member-badges.gql'),
      update: data => {
        return data.getDao?.badge?.map(badge => {
          return {
            title: badge.details_title_s ?? badge.system_nodeLabel_s,
            description: badge.details_description_s,
            icon: badge.details_icon_s,
            docId: badge.assignment[0]?.docId,
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
            proposalId: vote.voteon[0].docId,
            document: vote.docId,
            creator: vote.voteon[0].creator,
            timestamp: vote.vote_date_t,
            title: vote.voteon[0].details_title_s,
            type: vote.voteon[0].__typename,
            vote: vote.vote_vote_s,
            vote_power: vote.vote_votePower_a,
            settingsTitle: vote?.voteon[0].dao?.[0].settings?.[0].settings_daoTitle_s
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
          daoId: this.selectedDao.docId,
          first: this.contributionsPagination.first,
          offset: 0
        }
      },
      skip () {
        return !this.username || !this.selectedDao || !this.selectedDao.docId
      },
      fetchPolicy: 'cache-and-network'
    },
    assignments: {
      query: require('../../query/profile/profile-assignments.gql'),
      update: data => {
        return data.getDao.votable
      },
      variables () {
        return {
          username: this.username,
          daoId: this.selectedDao.docId,
          first: this.assignmentsPagination.first,
          offset: 0
        }
      },
      skip () {
        return !this.username || !this.selectedDao || !this.selectedDao.docId
      },
      fetchPolicy: 'cache-and-network'
    },
    quests: {
      query: require('../../query/profile/profile-quests.gql'),
      update: data => {
        return [...data.queryQueststart, ...data.queryQuestcomplet]
      },
      variables () {
        return {
          username: this.username,
          daoId: this.selectedDao.docId,
          first: this.questsPagination.first,
          offset: 0
        }
      },
      skip () {
        return !this.username || !this.selectedDao || !this.selectedDao.docId
      },
      fetchPolicy: 'cache-and-network'
    },
    organizations: {
      query: require('../../query/profile/profile-dhos.gql'),
      update (data) {
        const member = data.getMember
        if (member) {
          this.organizationsPagination.count = member?.memberofAggregate?.count || 0
          return member.memberof
        }
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
    },
    profileStats: {
      query: require('~/query/profile/profile-stats.gql'),
      update: data => {
        return {
          payoutAggregate: data?.getMember?.payoutAggregate,
          votableAggregate: data?.getDao?.votableAggregate
        }
      },
      variables () {
        return {
          daoId: this.selectedDao.docId.toString(),
          daoName: this.selectedDao.docId,
          username: this.username
        }
      },
      skip () {
        return !this.username || !this.selectedDao || !this.selectedDao.docId
      },
      result (data) {
        const assignmentCount = data?.data?.getDao?.votableAggregate?.count
        const payoutCount = data?.data?.getMember?.payoutAggregate?.count
        if (assignmentCount <= this.assignmentsPagination.first + this.assignmentsPagination.offset) {
          this.assignmentsPagination.fetchMore = false
        }
        if (payoutCount <= this.contributionsPagination.first + this.contributionsPagination.offset) {
          this.contributionsPagination.fetchMore = false
        }
      },
      fetchPolicy: 'no-cache'
    }
  },

  props: {
    username: String
  },

  data () {
    return {
      Tabs,
      tab: this.$q.screen.gt.sm ? Tabs.ASSIGNMENTS : Tabs.INFO,
      showBioPlaceholder: true,
      loading: true,
      submitting: false,
      limit: 5,
      walletAddressForm: {
        btcAddress: null,
        ethAddress: null,
        eosAccount: null,
        eosMemo: null,
        defaultAddress: null
      },

      assignmentsPagination: {
        first: 4,
        offset: 0,
        fetchMore: true
      },
      contributionsPagination: {
        first: 3,
        offset: 0,
        fetchMore: true
      },
      questsPagination: {
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
      },

      multiSigProposals: [],
      numberOfPRToSign: 0
    }
  },

  computed: {
    ...mapGetters('accounts', ['account', 'isHyphaOwner']),
    ...mapGetters('profiles', ['isConnected', 'profile']),
    ...mapGetters('dao', ['selectedDao', 'daoSettings', 'votingPercentages']),
    ...mapGetters('ballots', ['supply']),

    isOwner () { return this?.username === this?.account },
    isMember () { return this.organizations.length > 0 }
  },

  async mounted () {
    this.fetchProfile()
  },

  watch: {

    organizations: {
      handler () {
        if (this.organizations.length === this.organizationsPagination.count) {
          this.organizationsPagination.fetchMore = false
        }

        this.organizationsList = this.parseOrganizations(this.organizations)
      }
    },

    profile: {
      handler (profile) {
        if (profile.publicData.name) {
          document.title = `${this.profile.publicData.name}'s Profile`
        }
      }
    }
  },

  methods: {
    ...mapActions('profiles', [
      'connectProfileApi',
      'getProfile',
      'getPublicProfile',
      'getWalletAdresses',
      'saveAddresses',
      'saveBio',
      'saveProfileCard'
    ]),

    resetPagination (forceOffset) {
      if (forceOffset) {
        this.contributionsPagination.offset = 0
        this.assignmentsPagination.offset = 0
        this.questsPagination.offset = 0
        this.votesPagination.offset = 0
        this.organizationsPagination.offset = 0
        this.contributions = []
        this.assignments = []
        this.votes = []
        this.organizations = []
      } else {
        this.contributionsPagination.offset = this.contributions?.length || 0
        this.assignmentsPagination.offset = this.assignments?.length || 0
        this.questsPagination.offset = this.quests?.length || 0
        this.votesPagination.offset = this.votes?.length || 0
        this.organizationsPagination.offset = this.organizations?.length || 0
      }
      this.contributionsPagination.fetchMore = true
      this.assignmentsPagination.fetchMore = true
      this.questsPagination.fetchMore = true
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

    loadMoreQuests (loaded) {
      if (this.questsPagination.fetchMore) {
        this.questsPagination.offset = this.questsPagination.offset + this.questsPagination.first
        this.$apollo.queries.quests.fetchMore({
          variables: {
            username: this.username,
            daoId: this.selectedDao.docId,
            first: this.questsPagination.first,
            offset: this.questsPagination.offset
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (fetchMoreResult.queryAssignment?.length === 0 ||
                this.profileStats.payoutAggregate.count <= (this.questsPagination.offset + this.questsPagination.first)) {
              this.questsPagination.fetchMore = false
            }
            loaded(!this.questsPagination.fetchMore)
            return {
              queryQuestcomplet: [
                ...(prev?.queryQuestcomplet?.filter(n => !fetchMoreResult.queryQuestcomplet.some(p => p.docId === n.docId)) || []),
                ...(fetchMoreResult.queryQuestcomplet || [])
              ]
            }
          }
        })
      }
      loaded(false)
    },

    loadMoreContributions (loaded) {
      if (this.contributionsPagination.fetchMore) {
        this.contributionsPagination.offset = this.contributionsPagination.offset + this.contributionsPagination.first
        this.$apollo.queries.contributions.fetchMore({
          variables: {
            username: this.username,
            daoId: this.selectedDao.docId,
            first: this.contributionsPagination.first,
            offset: this.contributionsPagination.offset
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (fetchMoreResult.queryAssignment?.length === 0 ||
                this.profileStats.payoutAggregate.count <= (this.contributionsPagination.offset + this.contributionsPagination.first)) {
              this.contributionsPagination.fetchMore = false
            }
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
            daoId: this.selectedDao.docId,
            first: this.assignmentsPagination.first,
            offset: this.assignmentsPagination.offset
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (fetchMoreResult.queryAssignment?.length === 0 ||
                this.profileStats.votableAggregate.count <= (this.assignmentsPagination.offset + this.assignmentsPagination.first)) {
              this.assignmentsPagination.fetchMore = false
            }
            loaded(!this.assignmentsPagination.fetchMore)
            return {
              getDao: {
                ...fetchMoreResult.getDao,
                votable: [
                  ...(prev?.getDao?.votable?.filter(n => !fetchMoreResult.getDao?.votable?.some(p => p.docId === n.docId)) || []),
                  ...(fetchMoreResult.getDao?.votable || [])
                ]
              }
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
            loaded(!this.votesPagination.fetchMore)
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
          const name = dho.settings[0].settings_daoTitle_s
          const logo = ipfsy(dho.settings[0].settings_logo_s)
          const url = dho.settings[0].settings_daoUrl_s
          result.push({ name, url, logo })
        })
      }
      return result
    },

    /**
     * Kicks off the various fetch operations needed to retrieve this user's data
     */
    async fetchProfile () {
      if (this.username) {
        this.loading = true

        if (this.isOwner) {
          await this.getProfile(this.account)

          try {
            this.walletAddressForm = await this.getWalletAdresses(this.account)
          } catch (error) {
          }
        } else {
          await this.getPublicProfile(this.username)
        }

        this.loading = false
      }
    },

    async onSaveProfileCard (data, success, fail) {
      try {
        await this.saveProfileCard(data)
        success()
      } catch (error) {
        fail('Something went wrong ' + error)
      }
    },

    async onSaveBio (data, success, fail) {
      try {
        await this.saveBio(data.bio)
        success()
      } catch (error) {
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
        success()
      } catch (error) {
        fail(error)
      }
    }
  }

}
</script>

<template lang="pug">
q-page.full-width.page-profile
  .row.justify-center.items-center(v-if="loading" :style="{ height: '90vh' }")
    loading-spinner(color="primary" size="40px")
  .content.grid(v-else)
    q-tabs(v-if="isMobile" active-color="primary" indicator-color="primary" no-caps inline-label mobile-arrows outside-arrows dense v-model="tab")
      q-tab(:name="Tabs.INFO" :label="$t('pages.profiles.profile.personalInfo')" :ripple="false")
      q-tab(:name="Tabs.ABOUT" :label="$t('pages.profiles.profile.about')" :ripple="false")
      q-tab(:name="Tabs.PROJECTS" :label="$t('pages.profiles.profile.myProjects')" :ripple="false")
      q-tab(:name="Tabs.VOTES" :label="$t('pages.profiles.profile.votes')" :ripple="false")
    .left.q-gutter-md(:style="$q.screen.gt.md && {'grid-area': 'left'}")
      profile-card.profile(v-if="tab === Tabs.INFO || isTabletOrGreater" :style="{'grid-area': 'profile'}" :clickable="false" :username="username" :joinedDate="member && member.createdDate" view="card" :editButton="isOwner" @onSave="onSaveProfileCard" :compact="!$q.screen.gt.md" :tablet="$q.screen.md")
      organizations.org(v-if="tab === Tabs.INFO || isTabletOrGreater && organizationsList.length" :organizations="organizationsList" @onSeeMore="loadMoreOrganizations" :hasMore="organizationsPagination.fetchMore" :tablet="$q.screen.md" :style="$q.screen.md? {'grid-area': 'org', 'height': '100px'} : {'grid-area': 'org'}")
      .badges(v-if="tab === Tabs.INFO || isTabletOrGreater" :style="{'grid-area': 'badges'}")
        base-placeholder(
          :actionButtons="isOwner ? [{label: $t('pages.profiles.profile.apply'), disable: !isMember, color: 'primary', onClick: () => routeTo('agreements/create')}] : []"
          :subtitle=" isOwner ? $t('pages.profiles.profile.noBadgesYesApplyFor') : $t('pages.profiles.profile.noBadgesToSeeHere')"
          :title="$t('pages.profiles.profile.badges')"
          compact
          icon="fas fa-id-badge"
          v-if="!memberBadges && isOwner"
        )
        badges-widget(:badges="memberBadges" compact v-if="memberBadges" fromProfile)
      wallet.wallet(v-if="isMember && (tab === Tabs.INFO || isTabletOrGreater)" :style="{'grid-area': 'wallet'}" ref="wallet" :more="isOwner" :username="username")
      //- wallet-adresses.walletadd(:style="{'grid-area': 'walletadd'}" :walletAdresses="walletAddressForm" @onSave="onSaveWalletAddresses" v-if="isOwner && (tab==='INFO' || isTabletOrGreater)" :isHypha="daoSettings.isHypha")
      multi-sig.msig(v-if="tab==='INFO' || isTabletOrGreater" :style="{'grid-area': 'msig'}" v-show="isHyphaOwner" :numberOfPRToSign="numberOfPRToSign")
    .right.q-gutter-md(:style="$q.screen.gt.md && {'grid-area': 'right'}")
      component.q-gutter-y-md(:is="isTabletOrGreater ? 'widget' : 'div'" :style="{'grid-area': 'projects'}" v-if="tab===Tabs.PROJECTS || isTabletOrGreater" :title="isTabletOrGreater ? $t('pages.profiles.profile.myProjects') : ''")
        q-tabs.q-mt-xxl(v-if="isTabletOrGreater" active-color="primary" indicator-color="primary" no-caps inline-label mobile-arrows outside-arrows dense v-model="tab" ref="ASSIGNMENTS")
          q-tab.full-width(:name="Tabs.ASSIGNMENTS" :label="$t('pages.profiles.profile.assignments')" :ripple="false")
          q-tab.full-width(:name="Tabs.CONTRIBUTIONS" :label="$t('pages.profiles.profile.contributions')" :ripple="false")
          q-tab.full-width(:name="Tabs.QUESTS" :label="$t('pages.profiles.profile.quests')" :ripple="false")
        .assignments(v-if="tab === Tabs.ASSIGNMENTS || tab === Tabs.PROJECTS" :style="{'grid-area': 'assignments'}")
          base-placeholder(
            :actionButtons="isOwner ? [{label: $t('pages.profiles.profile.createAssignment'), color: 'primary', disable: !isMember, onClick: () => routeTo('agreements/create')}] : [] "
            :compact="isMobile"
            :subtitle=" isOwner ? $t('pages.profiles.profile.looksLikeYouDontHaveAnyActiveAssignments') : $t('pages.profiles.profile.noActiveOrArchivedAssignments')"
            :title="isTabletOrGreater ? '' : $t('pages.profiles.profile.assignments')"
            icon="fas fa-file-medical"
            v-if="!(assignments && assignments.length)"
          )
          active-assignments(v-if="assignments && assignments.length" :assignments="assignments" :owner="isOwner" :hasMore="assignmentsPagination.fetchMore" @claim-all="$refs.wallet.fetchTokens()" @change-deferred="refresh" @onMore="loadMoreAssingments" :daoSettings="daoSettings" :selectedDao="selectedDao" :supply="supply" :votingPercentages="votingPercentages" :compact="isMobile")
        .contributions(v-if="tab === Tabs.CONTRIBUTIONS || tab === Tabs.PROJECTS" :style="{'grid-area': 'contributions'}")
          base-placeholder(
            :actionButtons="isOwner ? [{label: $t('pages.profiles.profile.createContribution'), color: 'primary', disable: !isMember, onClick: () => routeTo('agreements/create')}] : []"
            :compact="isMobile"
            :subtitle=" isOwner ? $t('pages.profiles.profile.looksLikeYouDontHaveAnyContributions') : $t('pages.profiles.profile.noContributionsToSeeHere')"
            :title="isTabletOrGreater ? '' : $t('pages.profiles.profile.contributions')"
            icon="fas fa-file-medical"
            v-if="!(contributions && contributions.length)"
          )
          active-assignments(v-if="contributions && contributions.length" :contributions="contributions" :owner="isOwner" :hasMore="contributionsPagination.fetchMore" @claim-all="$refs.wallet.fetchTokens()" @change-deferred="refresh" @onMore="loadMoreContributions" :daoSettings="daoSettings" :selectedDao="selectedDao" :supply="supply" :votingPercentages="votingPercentages" :compact="isMobile")
        .quests(v-if="tab === Tabs.QUESTS" :style="{'grid-area': 'quests'}")
          base-placeholder(
            :actionButtons="isOwner ? [{label: $t('pages.profiles.profile.createQuest'), color: 'primary', disable: !isMember, onClick: () => routeTo('agreements/create')}] : []"
            :compact="isMobile"
            :subtitle=" isOwner ? $t('pages.profiles.profile.looksLikeYouDontHaveAnyQuests') : $t('pages.profiles.profile.noQuestsToSeeHere')"
            :title="isTabletOrGreater ? '' : $t('pages.profiles.profile.quests')"
            icon="fas fa-file-medical"
            v-if="!(quests && quests.length)"
          )
          active-assignments(v-if="quests && quests.length" :contributions="quests" :owner="isOwner" :hasMore="questsPagination.fetchMore" @claim-all="$refs.wallet.fetchTokens()" @change-deferred="refresh" @onMore="loadMoreQuests" :daoSettings="daoSettings" :selectedDao="selectedDao" :supply="supply" :votingPercentages="votingPercentages" :compact="isMobile")
      .about(v-if="tab === Tabs.ABOUT || isTabletOrGreater" :style="{'grid-area': 'about'}")
        base-placeholder(
          :actionButtons="isOwner ? [{label: $t('pages.profiles.profile.writeBiography'), color: 'primary', onClick: () => {$refs.about.openEdit(); showBioPlaceholder = false }}] : []"
          :compact="isMobile"
          :subtitle=" isOwner ? $t('pages.profiles.profile.writeSomethingAboutYourself') : $t('pages.profiles.profile.looksLikeDidntWrite', { username: this.username })"
          :title="$t('pages.profiles.profile.biography')"
          icon="fas fa-user-edit"
          v-if="!(profile && profile.publicData && profile.publicData.bio) && showBioPlaceholder"
        )
        about.about(v-show="(profile && profile.publicData && profile.publicData.bio) || (!showBioPlaceholder)" :bio="(profile && profile.publicData) ? (profile.publicData.bio || '') : $t('pages.profiles.profile.retrievingBio')" @onSave="onSaveBio" @onCancel="onCancelBio" :editButton="isOwner" ref="about")
      .votes(v-if="tab === Tabs.VOTES || isTabletOrGreater" :style="{'grid-area': 'votes'}")
        base-placeholder(
          :actionButtons="isOwner ? [{label: $t('pages.profiles.profile.vote'), color: 'primary', disable: !isMember, onClick: () => routeTo('proposals')}] : []"
          :compact="isMobile"
          :subtitle=" isOwner ? $t('pages.profiles.profile.youHaventCast') : $t('pages.profiles.profile.noVotesCastedYet')"
          :title="$t('pages.profiles.profile.recentVotes')"
          icon="fas fa-vote-yea"
          v-if="!(votes && votes.length)"
        )
        voting-history(v-if="votes && votes.length" :name="(profile && profile.publicData) ? profile.publicData.name : username" :votes="votes" @onMore="loadMoreVotes")

</template>

<style lang="stylus" scoped>
.grid
  display: grid;
  grid-column-gap: $space-md.x;
  grid-row-gap: $space-md.y;
  min-height: 0;
  min-width: 0;
  grid-template-columns: 292px 1fr;
  grid-template-rows: auto;
  grid-template-areas "left right";

  @media (max-width: $breakpoint-md-max)
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    grid-template-areas "profile"\
                        "org"\
                        "projects"\
                        "wallet"\
                        "walletaddr"\
                        "bio"\
                        "votes"

  @media (max-width: $breakpoint-sm-max)
    grid-template-columns: 100%;
    grid-template-rows: auto;
    grid-template-areas "profile"\
                        "org"\
                        "wallet"\
                        "walletaddr"\
                        "bio"\
                        "projects"\
                        "votes"

.q-tab
  padding: 0
  margin: 0
.page-profile
  .about
    min-height 200px

  .profile-detail-pane
    min-width 302px

  .profile-active-pane
    min-width 292px

    .edit-btn
      z-index 1
.tablet-container
  overflow-x: hidden
</style>
