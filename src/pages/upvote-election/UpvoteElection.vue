<script>
import { mapGetters, mapActions } from 'vuex'
import I18n from '~/utils/i18n'
import { dateToStringShort } from '~/utils/TimeUtils'
import gql from 'graphql-tag'
import { ELECTION_STATE, ELECTION_BADGES } from '~/const'

const ELECTION_DETAILS = `
getDao(docId: $daoId) {
  docId
  delegate {
    details_member_n
    createdDate
  }
  ueUpcoming {
    docId
    details_startDate_t
  }
  ueOngoing {
    docId
    details_startDate_t
  }
  ueElection(filter: $filter) {
    details_status_s
    docId
    details_roundDuration_i
    details_startDate_t
    ueCurrnd {
      docId
      details_endDate_t
    }
    ueStartrnd {
      ueGroupLnk {
        ueRdMember {
          createdDate
          details_member_n
        }
        ueRdMemberAggregate {
          count
        }
      }
    }
    ueRound {
      docId
      ueGroupLnk {
        docId
        ueVote {
          details_votedId_i
          details_voterId_i
        }
        ueRdMember {
          docId
          details_member_n
          ...on Member {
            holdsbadge {
              details_title_s
            }
          }
        }
        ueRdMemberAggregate {
          count
        }
        ueGroupWin {
          docId
          details_member_n
          ...on Member {
            holdsbadge {
              details_title_s
            }
          }
        }
      }
    }
  }
}
`

export default {
  name: 'upvote-election',
  components: {
    Widget: () => import('~/components/common/widget.vue'),
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue'),
    ProfileCard: () => import('~/components/profiles/profile-card.vue'),
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue'),
    RoundCard: () => import('./RoundCard.vue')
  },
  data () {
    return {
      ELECTION_STATE,
      ELECTION_BADGES,
      dateToStringShort,
      I18n,
      counterdown: undefined,
      upvoteWidgetState: ELECTION_STATE.LOADING,
      currentState: ELECTION_STATE.LOADING,
      upvoteTimeRemaining: '',
      roundTimeRemaining: '',
      isRegistered: false,
      showApplications: false,
      showLearnMoreModal: false,
      tab: 'VOTING',
      page: 1,
      showGroups: false,
      showResults: false
    }
  },
  apollo: {
    daoBadges: {
      query: require('~/query/badges/dao-badges.gql'),
      update: data => {
        return data.getDao.badge.map(badge => {
          return {
            title: badge.details_title_s,
            description: badge.details_description_s,
            icon: badge.details_icon_s,
            assignments: badge.assignment,
            docId: badge.docId
          }
        })
      },
      skip () {
        return !this.selectedDao || !this.selectedDao.docId
      },
      variables () {
        return {
          daoId: this.selectedDao.docId
        }
      }
    },
    memberBadges: {
      query: require('~/query/badges/member-badges.gql'),
      update: data => {
        return data.getDao?.badge?.map(badge => {
          return {
            title: badge.details_title_s,
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
          username: this.account
        }
      },
      skip () {
        return !this.account || !this.selectedDao || !this.selectedDao.docId
      },
      pollInterval: 1000,
      fetchPolicy: 'no-cache',
      result (res) {
        if (res.data.getDao?.badge?.find(badge => badge.details_title_s === ELECTION_BADGES.DELEGATE)) {
          this.isRegistered = true
        }
      }
    },
    electionDetails: {
      query: gql`query electionDetailsQuery ($daoId: String!, $filter: UpvtElectnFilter) { ${ELECTION_DETAILS} }`,
      update: data => {
        return {
          currentElections: {
            startDate: data.getDao.ueOngoing[0]?.details_startDate_t
          },
          nextElections: {
            startDate: data.getDao.ueUpcoming[0]?.details_startDate_t
          },
          startDate: data.getDao.ueElection[0]?.details_startDate_t,
          delegatesList: data.getDao.delegate,
          status: data.getDao.ueElection[0].details_status_s,
          id: data.getDao.ueElection[0].docId,
          roundDuration: data.getDao.ueElection[0].details_roundDuration_i / 60,
          chiefDelegates: data.getDao.ueElection[0].ueRound.slice(-1).flatMap(r => r.ueGroupLnk.flatMap(g => g.ueRdMember.flatMap(w => w.holdsbadge.filter(b => b.details_title_s === ELECTION_BADGES.CHIEF_DELEGATE).map(b => ({ ...b, member: w.details_member_n }))))),
          headDelegates: data.getDao.ueElection[0].ueRound.slice(-1).flatMap(r => r.ueGroupLnk.flatMap(g => g.ueGroupWin.flatMap(w => w.holdsbadge.filter(b => b.details_title_s === ELECTION_BADGES.HEAD_DELEGATE).map(b => ({ ...b, member: w.details_member_n }))))),
          currentRound: {
            id: data.getDao.ueElection[0].ueCurrnd?.[0]?.docId,
            endDate: data.getDao.ueElection[0].ueCurrnd?.[0]?.details_endDate_t
          },
          startRound: {
            participantsCount: data.getDao.ueElection[0].ueStartrnd[0].ueGroupLnk.reduce((sum, group) => sum + group.ueRdMemberAggregate.count, 0),
            participants: data.getDao.ueElection[0].ueStartrnd.flatMap(group => group.ueGroupLnk.flatMap(rdMember => rdMember.ueRdMember.map(member => { return { username: member?.details_member_n, createdDate: member.createdDate } })))
          },
          rounds: data.getDao.ueElection[0].ueRound.map((round) => {
            return {
              id: round.docId,
              participantsCount: round.ueGroupLnk.reduce((sum, group) => sum + group.ueRdMemberAggregate.count, 0),
              groups: round.ueGroupLnk.map(group => {
                return {
                  id: group.docId,
                  members: group.ueRdMember,
                  votes: group.ueVote,
                  winner: group.ueGroupWin?.[0]?.details_member_n
                }
              })
            }
          })
        }
      },
      variables () {
        return {
          daoId: this.selectedDao.docId,
          filter: {
            docId: {
              eq: this.$router.currentRoute.params.id
            }
          }
        }
      },
      fetchPolicy: 'no-cache',
      pollInterval: 1000, // THIS IS JUST TEMPORARY UNTIL GRAPHQL SUBSCRIPTION IS READY
      skip () { return !this.selectedDao || !this.selectedDao.docId },
      result (res) {
        this.statusSetUp()
        this.$forceUpdate()
      }
    }
  },

  computed: {
    ...mapGetters('dao', ['selectedDao']),
    ...mapGetters('accounts', ['account']),

    isLoading () {
      return this.upvoteWidgetState === ELECTION_STATE.LOADING || this.currentState === ELECTION_STATE.LOADING
    },

    widgetTitle() {
      if (this.upvoteWidgetState === ELECTION_STATE.SIGNUP && this.isRegistered) {
        return this.I18n.t('pages.upvote-election.upvoteelection.thanksForRegistering')
      } else if (this.upvoteWidgetState === ELECTION_STATE.SIGNUP) {
        return this.I18n.t('pages.upvote-election.upvoteelection.signUpForThisElection')
      } else if (this.upvoteWidgetState === ELECTION_STATE.FINISH) {
        return this.I18n.t('pages.upvote-election.upvoteelection.displacements')
      }
      return ''
    },

    widgetDescription() {
      if (this.upvoteWidgetState === ELECTION_STATE.SIGNUP && this.isRegistered) {
        return this.I18n.t('pages.upvote-election.upvoteelection.theElectionIsAboutToStart')
      } else if (this.upvoteWidgetState === ELECTION_STATE.ACTIVE) {
        return this.I18n.t('pages.upvote-election.upvoteelection.youCanVote')
      } else if (this.upvoteWidgetState === ELECTION_STATE.WAITING) {
        return this.I18n.t('pages.upvote-election.upvoteelection.wellDone')
      }
      return ''
    },

    paginatedApplications () {
      return this.electionDetails?.delegatesList.slice((this.page - 1) * 5, this.page * 5)
    },

    isLastPage () {
      if (this.pages === 0) return true
      return this.page === this.pages
    },

    pages () {
      return Math.ceil(this.electionDetails?.delegatesList?.length / 5)
    }
  },

  methods: {
    ...mapActions('proposals', ['saveDraft', 'applyForBadge']),
    async signUp() {
      const delegateDocId = this.daoBadges.find(badge => badge.title === ELECTION_BADGES.DELEGATE).docId
      await this.applyForBadge({ type: ELECTION_BADGES.DELEGATE, docId: delegateDocId })
    },
    statusSetUp() {
      if (this.electionDetails.status === 'finished' || this.electionDetails.status === 'canceled') {
        this.upvoteWidgetState = ELECTION_STATE.FINISH
        this.currentState = ELECTION_STATE.FINISH
        this.$forceUpdate()
      } else if (new Date(this.electionDetails.startDate) > new Date()) {
        this.upvoteWidgetState = ELECTION_STATE.SIGNUP
        this.currentState = ELECTION_STATE.SIGNUP
        this.$forceUpdate()
      } else if (this.electionDetails.rounds?.length >= 1) {
        this.upvoteWidgetState = ELECTION_STATE.ACTIVE
        this.currentState = ELECTION_STATE.VOTING
        this.$forceUpdate()
      }
    },
    onPrev () {
      this.page--
    },

    onNext () {
      this.page++
    },

    votingTimeLeft () {
      const end = new Date(this.electionDetails?.currentRound?.endDate ? this.electionDetails?.currentRound?.endDate : this.electionDetails?.startDate)
      const now = Date.now()
      const t = end - now
      return t
    },

    formatTimeLeft () {
      const MS_PER_DAY = 1000 * 60 * 60 * 24
      const MS_PER_HOUR = 1000 * 60 * 60
      const MS_PER_MIN = 1000 * 60
      const MS = 1000
      const timeRemaining = this.votingTimeLeft()
      if (timeRemaining > 0) {
        const days = Math.floor(timeRemaining / MS_PER_DAY)
        let lesstime = timeRemaining - (days * MS_PER_DAY)
        const hours = Math.floor(lesstime / MS_PER_HOUR)
        lesstime = lesstime - (hours * MS_PER_HOUR)
        const min = Math.floor(lesstime / MS_PER_MIN)
        lesstime = lesstime - (min * MS_PER_MIN)
        const sec = Math.floor(lesstime / MS)
        this.roundTimeRemaining = {
          days: days,
          hours: hours,
          mins: min,
          sec: sec
        }
        this.upvoteTimeRemaining = {
          days: days,
          hours: hours,
          mins: min,
          sec: sec
        }
        return {
          days: days,
          hours: hours,
          mins: min,
          sec: sec
        }
      }
      return 0
    },
    async voteTransact (votedId, groupId) {
      const actions = [{
        account: this.$config.contracts.dao,
        name: 'castupvote',
        data: {
          round_id: this.electionDetails.currentRound.id,
          group_id: groupId,
          voter: this.account,
          voted_id: votedId
        }
      }]
      return await this.$store.$api.signTransaction(actions)
    }

  },
  async mounted () {
    this.counterdown = setInterval(() => {
      this.formatTimeLeft()
      this.$forceUpdate()
    }, 1000)
  },
  created () {
    this.counterdown = setInterval(() => {
      this.formatTimeLeft()
      this.$forceUpdate()
    }, 1000)
  },
  async activated () {
    this.counterdown = setInterval(() => {
      this.formatTimeLeft()
      this.$forceUpdate()
    }, 1000)
  },
  deactivated () {
    clearInterval(this.counterdown)
  }
}
</script>

<template lang="pug">
.upvote-election
  q-dialog(:value="showLearnMoreModal" @hide="showLearnMoreModal = false")
    q-card.q-pa-xl.rounded(:style="{ 'width': '640px' }" flat)
      .h-h3 {{ $t('pages.upvote-election.howCommunityElectionsWork') }}
      .q-my-md
        div {{ $t('pages.upvote-election.thisElectionProcessWillHelp') }}
      q-tabs.q-my-xxl(align="center" active-color="primary" indicator-color="primary" no-caps inline-label mobile-arrows outside-arrows dense v-model="tab")
        q-tab(:style="{ 'margin': '0' }" name="VOTING" :label="$t('pages.upvote-election.voting')" :ripple="false")
        q-tab(:style="{ 'margin': '0' }" name="TIMING" :label="$t('pages.upvote-election.timing')" :ripple="false")
        q-tab(:style="{ 'margin': '0' }" name="RULES" :label="$t('pages.upvote-election.rules')" :ripple="false")
      template(v-if="tab === 'VOTING'")
        .row
          div {{ $t('pages.upvote-election.thereAreThreeRounds') }}
        .col.text-black.text-bold.q-my-md(:style="{ 'font-weight': '600' }")
          .row.q-mb-md.flex.justify-between.items-center
            div {{ $t('pages.dho.election.voteForYourself') }}
            q-icon(name="fas fa-check" color="positive" size="20px")
          .row.flex.justify-between.items-center
            div {{ $t('pages.dho.election.reachConsensus') }}
            q-icon(name="fas fa-check" color="positive" size="20px")
      template(v-if="tab === 'TIMING'")
        .row
          div {{ $t('pages.upvote-election.thereAreThreeVoting') }}
      template(v-if="tab === 'RULES'")
        .row
          div {{ $t('pages.upvote-election.ifYouNeedMoreInformation') }}
          .row.flex.justify-end.q-mt-lg.full-width
            q-btn.h-btn1.q-px-sm(:color="'secondary'" no-caps rounded unelevated) {{ $t('pages.dho.election.visitEdenCommunity') }}
  .row.full-width.flex.justify-center(v-if="isLoading")
    loading-spinner(size="80px")
  .row.full-width.q-my-md.q-mt-lg(v-else)
    .col-9
      q-card.q-mr-md.q-mb-md.widget.q-pa-xl.relative-position.rounded-card(v-if="currentState === ELECTION_STATE.SIGNUP" flat)
        .title
          .row.flex.items-center.justify-between
            .col.flex.items-center
              q-icon(name="fas fa-users")
              .h-h4.q-ml-md {{ $t('pages.upvote-election.applications') }}
            q-btn(@click="showApplications = !showApplications" flat rounded :icon="showApplications ? 'fas fa-chevron-up' : 'fas fa-chevron-down'")
          .row.q-mt-md {{ $t('pages.upvote-election.youCanViewTheMembersWho') }}
          .row.q-mt-md.q-gutter-sm
            .col
              q-card.rounded-card.q-pa-xl.applications-metric
                .row.flex.items-center
                  .col-2
                    q-icon(name="fas fa-users" size="24px")
                  .col.q-ml-sm
                    .row
                      .h-h4 {{ electionDetails?.delegatesList?.length }}
                    .row {{ $t('pages.upvote-election.participants') }}
            //- .col // TODO: Waiting api for treasury
              q-card.rounded-card.q-pa-xl.applications-metric
                .row.flex.items-center
                  .col-2
                    q-icon(name="fas fa-university" size="24px")
                  .col.q-ml-sm
                    .row
                      .h-h4 $ {{ treasury }}
                    .row {{ $t('pages.upvote-election.treasury') }}
            .col
              q-card.rounded-card.q-pa-xl.applications-metric
                .row.flex.items-center
                  .col-2
                    q-icon(name="far fa-clock" size="24px")
                  .col.q-ml-sm
                    .row
                      .h-h4 {{ electionDetails?.roundDuration }} {{ $t('pages.upvote-election.upvoteelection.min') }}
                    .row {{ $t('pages.upvote-election.eachRound') }}
          q-slide-transition
            div.q-my-xl.q-pt-xl(v-show="showApplications" :style="{ 'border-top': '1px solid #CBCDD1'}")
              template(v-if="paginatedApplications?.length")
                .row.q-mb-sm.applicant-row.q-pa-xs(v-for="applicant in paginatedApplications")
                  .col-1
                    profile-picture(:username="applicant.details_member_n" size="24px" :key="applicant.details_member_n")
                  .col
                    .text-bold {{ applicant.details_member_n }}
                  .col @{{ applicant.details_member_n }}
                  //- .col // TODO: Waiting api for telegram integration
                    .row.flex.items-center
                      q-icon(name="fas fa-paper-plane" size="12px")
                      .q-ml-xs {{ applicant.telegram }}
                  .col {{ $t('pages.upvote-election.memberSince', { date: dateToStringShort(applicant.createdDate) } ) }}
                .row.justify-between.q-pt-sm.items-center
                  q-btn(:disable="page === 1" @click="onPrev()" flat rounded icon="fas fa-chevron-left")
                  .row.flex.items-center
                    div.q-ml-xs(v-for="dot, index in pages" :style="{'width': '10px', 'height': '10px', 'background': '#CAC8B0', 'border-radius': '50%'}" :class="{ 'bg-primary': index === page - 1}")
                  q-btn(:disable="isLastPage" @click="onNext()" flat rounded icon="fas fa-chevron-right")
      template(v-if="upvoteWidgetState !== ELECTION_STATE.SIGNUP" v-for="round, index in electionDetails?.rounds" flat)
        round-card.q-mb-md(v-bind="round" :roundNumber="index + 1" :electionStatus="electionDetails?.status")
      q-card.q-mr-md.widget.q-pa-xl.relative-position.rounded-card(v-if="currentState === ELECTION_STATE.FINISH" flat)
        .title
          .row.flex.items-center.justify-between
            .col.flex.items-center
              img(src="~/assets/icons/voting-icon.svg")
              .h-h4.q-ml-md {{ $t('pages.upvote-election.finalVotingRound') }}
            q-btn(@click="showResults = !showResults" flat rounded :icon="showResults ? 'fas fa-chevron-up' : 'fas fa-chevron-down'")
          .row.q-mt-md {{ $t('pages.upvote-election.youAreInTheFinalRound') }}
          .row.q-mt-md.q-gutter-sm
            .col
              q-card.rounded-card.q-pa-lg.applications-metric
                .row.flex.items-center
                  .col-2
                    q-icon(name="fas fa-users" size="24px")
                  .col.q-ml-sm
                    .row
                      .h-h4 {{ electionDetails.rounds[electionDetails.rounds?.length - 1].participantsCount }}
                    .row {{ $t('pages.upvote-election.participants') }}
            .col
              q-card.rounded-card.q-pa-lg.applications-metric
                .row.flex.items-center
                  .col-2
                    img(src="~/assets/icons/chief-delegate.svg")
                  .col.q-ml-sm
                    .row
                      .h-h4 {{ electionDetails.chiefDelegates.filter(item => item?.member !== electionDetails.headDelegates?.[0]?.member).length }}
                    .row {{ $t('pages.upvote-election.chiefDelegateBadges') }}
            .col
              q-card.rounded-card.q-pa-lg.applications-metric
                .row.flex.items-center
                  .col-2
                    img(src="~/assets/icons/head-chief.svg")
                  .col.q-ml-sm
                    .row
                      .h-h4 {{ electionDetails.headDelegates?.length }}
                    .row {{ $t('pages.upvote-election.headChiefDelegateBadge') }}
        q-slide-transition
          div.q-my-xl.q-pt-xl(v-show="showResults" :style="{ 'border-top': '1px solid #CBCDD1'}")
            q-card.full-width.rounded-card.q-pa-lg.results-block
              .row.q-mb-md
                .h-h5 {{ $t('pages.upvote-election.results') }}
              .row
                .col-4.q-mr-md
                  q-card.rounded-card.q-pa-lg.results-block.flex.justify-center.items-center
                    profile-picture(:username="electionDetails.headDelegates?.[0]?.member" size="140px")
                    .h-h4.q-mt-md {{ electionDetails.headDelegates?.[0]?.member }}
                    .text-secondary {{ $t('pages.upvote-election.headChiefDelegate') }}
                .col
                  .row.flex.items-center.q-mb-md
                    .col
                      .row
                        .col-1.flex.items-center.q-mr-xs
                          profile-picture(:username="electionDetails.headDelegates?.[0]?.member" size="24px")
                        .col
                          .row.text-bold.text-black {{ electionDetails.headDelegates?.[0]?.member }}
                          //- .row(:style="{ 'font-size': '10px' }") {{ electionDetails.rounds[electionDetails.rounds.length - 1].results.headChiefDelegate.telegram }} // TODO: Waiting api for telegram integration
                    .row
                      .row.flex.items-center
                        .text-secondary.q-mr-sm(:style="{ 'font-size': '12px' }") {{ $t('pages.upvote-election.headChiefDelegate') }}
                        img(width="16px" src="~/assets/icons/head-chief.svg")
                  template(v-for="user in electionDetails.chiefDelegates.filter(item => item?.member !== electionDetails.headDelegates?.[0]?.member)")
                    .row.flex.items-center.q-mb-md.justify-between
                      .col
                        .row
                          .col-1.flex.items-center.q-mr-xs
                            profile-picture(:username="user?.member" size="24px")
                          .col
                            .row.text-bold.text-black {{ user?.member }}
                            //- .row(:style="{ 'font-size': '10px' }") {{ user.telegram }}
                      .row
                        .row.flex.items-center
                          .text-secondary.q-mr-sm(:style="{ 'font-size': '12px' }") {{ $t('pages.upvote-election.chiefDelegate') }}
                          img(width="16px" src="~/assets/icons/chief-delegate.svg")
    .col-3
      //- profile-card.q-mb-md(v-if="signedUp" :electionState="currentState" isElection :style="{'grid-area': 'profile'}" :clickable="false" :username="account" view="card" :compact="!$q.screen.gt.md" :tablet="$q.screen.md") // TODO: Temporarily hide
      widget.q-pa-xxl.bg-primary.q-mb-md(v-if="electionDetails?.status !== 'finished' && upvoteWidgetState !== ELECTION_STATE.FINISH" :class="{ 'bg-secondary': upvoteWidgetState === ELECTION_STATE.WAITING }")
        template(v-if="upvoteWidgetState !== ELECTION_STATE.ACTIVE && upvoteWidgetState !== ELECTION_STATE.WAITING")
          .h-h4.text-white.q-mb-md {{ widgetTitle }}
        template(v-else-if="upvoteWidgetState === ELECTION_STATE.ACTIVE")
          .row.items-center.q-mb-md
            .h-h4.text-white {{ roundTimeRemaining.mins }}
            .h-h4.q-mx-xxs.text-white(v-if="roundTimeRemaining.mins > 1") {{ $t('pages.upvote-election.upvoteelection.mins') }}
            .h-h4.q-mx-xxs.text-white(v-else) {{ $t('pages.upvote-election.upvoteelection.min') }}
            .h-h4.q-mr-xxs.text-white(v-if="!roundTimeRemaining.days > 0") :
            .h-h4.text-white {{ roundTimeRemaining.sec }}
            .h-h4.q-mx-xxs.text-white(v-if="roundTimeRemaining.sec > 1") {{ $t('pages.upvote-election.upvoteelection.sec') }}
            .h-h4.q-mx-xxs.text-white(v-else) {{ $t('pages.upvote-election.upvoteelection.sec') }}
            .h-h4.text-white.text-weight-400 {{ $t('pages.upvote-election.upvoteelection.left') }}
        template(v-else-if="upvoteWidgetState === ELECTION_STATE.WAITING")
          .row.q-mb-md
            .h-h4.text-white {{ roundTimeRemaining.sec }}
            .h-h4.q-mx-xxs.text-white(v-if="roundTimeRemaining.sec > 1") {{ $t('pages.upvote-election.upvoteelection.sec') }}
            .h-h4.q-mx-xxs.text-white(v-else) {{ $t('pages.upvote-election.upvoteelection.sec') }}
            .h-h4.text-white.text-weight-400 {{ $t('pages.upvote-election.upvoteelection.toNextRound') }}
        .text-white.q-mb-md {{ widgetDescription }}
        //- template(v-if="upvoteWidgetState === ELECTION_STATE.FINISH") // TODO: Waiting api for treasury
          .row.q-mb-md.flex.items-center
            .col-2.flex.items-center.justify-center
              img(src="~/assets/icons/head-chief.svg")
            .col.text-white.q-ml-xs {{ $t('pages.upvote-election.upvoteelection.headChiefDelegate') }}
            .col-3.flex.items-center.justify-end.text-white $ {{ displacements.headChiefDelegate }}
          .row.q-mb-md.flex.items-center
            .col-2.flex.items-center.justify-center
              img(src="~/assets/icons/chief-delegate.svg")
            .col.text-white.q-ml-xs {{ $t('pages.upvote-election.upvoteelection.chiefDelegate') }}
            .col-3.flex.items-center.justify-end.text-white $ {{ displacements.chiefDelegate }}
          .row.q-mb-md.flex.items-center
            .col-2.flex.items-center.justify-center
              img(src="~/assets/icons/delegate-l2.svg")
            .col.text-white.q-ml-xs {{ $t('pages.upvote-election.upvoteelection.delegatel2') }}
            .col-3.flex.items-center.justify-end.text-white $ {{ displacements.delegateL2 }}
          .row.q-mb-md.flex.items-center
            .col-2.flex.items-center.justify-center
              img(src="~/assets/icons/delegate-l1.svg")
            .col.text-white.q-ml-xs {{ $t('pages.upvote-election.upvoteelection.delegatel1') }}
            .col-3.flex.items-center.justify-end.text-white $ {{ displacements.delegateL1 }}
        template(v-if="!memberBadges?.find(badge => badge.title === ELECTION_BADGES.DELEGATE) && upvoteWidgetState === ELECTION_STATE.SIGNUP")
          //- q-btn.q-px-lg.h-btn1.full-width.q-mb-sm(icon="fas fa-paper-plane" color="white" textColor="grey" :label="$t('pages.upvote-election.upvoteelection.telegramHandle')" no-caps rounded text-color="primary" unelevated) // TODO: Waiting api for telegram integration
          q-btn.q-px-lg.h-btn1.full-width(:disable="memberBadges?.findIndex(badge => badge.title === ELECTION_BADGES.DELEGATE) >= 0" @click="signUp()" color="secondary" textColor="white" :label="$t('pages.upvote-election.upvoteelection.signUp')" no-caps rounded text-color="primary" unelevated)
        template(v-else-if="upvoteWidgetState !== ELECTION_STATE.FINISH")
          q-btn.q-px-lg.h-btn1.full-width(@click="showLearnMoreModal = true" outline color="white" textColor="white" :label="$t('pages.upvote-election.upvoteelection.learnMore')" no-caps rounded text-color="primary" unelevated)
          //- q-btn.q-mt-sm.q-px-lg.h-btn1.full-width(v-if="currentState === ELECTION_STATE.SIGNUP &&  memberBadges.findIndex(badge => badge.title === ELECTION_BADGES.DELEGATE)" @click="upvoteWidgetState = ELECTION_STATE.ACTIVE, signedUp = true, currentState=ELECTION_STATE.VOTING" color="white" textColor="negative" :label="$t('pages.upvote-election.upvoteelection.unsubscribe')" no-caps rounded text-color="primary" unelevated) // TODO: Waiting api for unsubscribe action
        template(v-if="upvoteWidgetState === ELECTION_STATE.FINISH")
          q-btn.q-px-lg.h-btn1.full-width(color="white" textColor="primary" :label="$t('pages.upvote-election.upvoteelection.goToMyBadges')" no-caps rounded text-color="primary" unelevated)
        .timer.row.q-mt-xl.justify-center(v-if="upvoteWidgetState === ELECTION_STATE.SIGNUP" :style="{ 'color': 'white' }")
          .row.items-center(v-if="upvoteTimeRemaining.days > 0")
            div {{ upvoteTimeRemaining.days }}
            .q-mx-xxs(v-if="upvoteTimeRemaining.days > 1") {{ $t('pages.upvote-election.upvoteelection.days') }} :
            .q-mx-xxs(v-else) {{ $t('pages.upvote-election.upvoteelection.day') }} :
          .row.items-center
            div {{ upvoteTimeRemaining.hours }}
            .q-mx-xxs(v-if="upvoteTimeRemaining.hours > 1") {{ $t('pages.upvote-election.upvoteelection.hours') }} :
            .q-mx-xxs(v-else) {{ $t('pages.upvote-election.upvoteelection.hour') }} :
          .row.items-center
            div {{ upvoteTimeRemaining.mins }}
            .q-mx-xxs(v-if="upvoteTimeRemaining.mins > 1") {{ $t('pages.upvote-election.upvoteelection.mins') }}
            .q-mx-xxs(v-else) {{ $t('pages.upvote-election.upvoteelection.min') }}
            .q-mr-xxs(v-if="!upvoteTimeRemaining.days > 0") :
          .row.items-center(v-if="!upvoteTimeRemaining.days > 0")
            div {{ upvoteTimeRemaining.sec }}
            .q-mx-xxs(v-if="upvoteTimeRemaining.sec > 1") {{ $t('pages.upvote-election.upvoteelection.sec') }}
            .q-mx-xxs(v-else) {{ $t('pages.upvote-election.upvoteelection.sec') }}
</template>

<style lang="sass" scoped>
.applicant-row:hover
  background: #f1f1f3
  border-radius: 15px
.applications-metric, .results-block
  box-shadow: 0px 0px 16px -3px rgba(34, 60, 80, 0.2)
.rounded-card
  border-radius: 15px

.rounded
  border-radius: 26px
.counter
  display: flex
  font-family: 'Lato', sans-serif
  font-weight: 600
  color: #3F64EE
  font-size: 18px
  .title
    margin-right: 25px
  .time
    .subtext
      font-size: 12px
      padding-bottom: 2px
      margin-right: 4px
</style>
