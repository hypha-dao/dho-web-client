<script>
import { mapGetters } from 'vuex'
import I18n from '~/utils/i18n'
import { dateToStringShort } from '~/utils/TimeUtils'
import gql from 'graphql-tag'

const ELECTION_DETAILS = `
getDao(docId: $daoId) {
  docId
  ueElection(filter: $filter) {
    docId
    details_roundDuration_i
    ueStartrnd {
      ueGroupLnk {
        ueRdMember {
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
        ueVote {
          details_votedId_i
          details_voterId_i
        }
        ueRdMember {
          docId
          details_member_n
        }
        ueRdMemberAggregate {
          count
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
      dateToStringShort,
      I18n,
      counterdown: undefined,
      delegates: 50,
      headDelegate: 1,
      upvoteElectionData: {},
      selectedUsers: [],
      votedUsers: [],
      votingState: false,
      upvoteWidgetState: 'signup',
      upvoteTimeRemaining: '',
      roundTimeRemaining: '',
      endDate: 'August 22, 2023 19:00:00', // TODO: waiting API
      isRegister: false, // TODO: waiting API
      endRoundTime: 'August 22, 2023 14:00:00', // TODO: waiting API
      waitingTime: 'August 22, 2023 14:00:00', // TODO: waiting API
      displacements: { // TODO: waiting API
        headChiefDelegate: 2.528,
        chiefDelegate: 1.731,
        delegateL2: 512,
        delegateL1: 326
      },
      treasury: 34560, // TODO: waiting API
      showApplications: false,
      showLearnMoreModal: false,
      tab: 'VOTING',
      page: 1,
      signedUp: false,
      votingRounds: [ // TODO: waiting API
        {
          participants: 126,
          groups: [
            {
              myGroup: false,
              votes: [
                {
                  slot: false,
                  consensus: false,
                  vote: true
                },
                {
                  slot: false,
                  consensus: false,
                  vote: true
                },
                {
                  slot: false,
                  consensus: false,
                  vote: true
                },
                {
                  slot: true,
                  consensus: false,
                  vote: false
                },
                {
                  slot: true,
                  consensus: false,
                  vote: false
                },
                {
                  slot: true,
                  consensus: false,
                  vote: false
                }
              ],
              users: [
                {
                  fullName: 'Howard S. Lowe',
                  account: 'accountname',
                  votesCount: 3,
                  telegram: 'telegramhandle'
                },
                {
                  fullName: 'Howard S. Lowe',
                  account: 'accountname',
                  votesCount: 3,
                  telegram: 'telegramhandle'
                },
                {
                  fullName: 'Howard S. Lowe',
                  account: 'accountname',
                  votesCount: 3,
                  telegram: 'telegramhandle'
                },
                {
                  fullName: 'Howard S. Lowe',
                  account: 'accountname',
                  votesCount: 3,
                  telegram: 'telegramhandle'
                },
                {
                  fullName: 'Howard S. Lowe',
                  account: 'accountname',
                  votesCount: 3,
                  telegram: 'telegramhandle'
                },
                {
                  fullName: 'Howard S. Lowe',
                  account: 'accountname',
                  votesCount: 3,
                  telegram: 'telegramhandle'
                }
              ]
            },
            {
              myGroup: true,
              votes: [
                {
                  slot: false,
                  consensus: false,
                  vote: true
                },
                {
                  slot: false,
                  consensus: false,
                  vote: true
                },
                {
                  slot: false,
                  consensus: false,
                  vote: true
                },
                {
                  slot: false,
                  consensus: false,
                  vote: true
                },
                {
                  slot: false,
                  consensus: true,
                  vote: false
                },
                {
                  slot: true,
                  consensus: false,
                  vote: false
                }
              ],
              users: [
                {
                  fullName: 'Howard S. Lowe',
                  account: 'accountname',
                  votesCount: 3,
                  telegram: 'telegramhandle'
                },
                {
                  fullName: 'Howard S. Lowe',
                  account: 'accountname',
                  votesCount: 3,
                  telegram: 'telegramhandle'
                },
                {
                  fullName: 'Howard S. Lowe',
                  account: 'accountname',
                  votesCount: 3,
                  telegram: 'telegramhandle'
                },
                {
                  fullName: 'Howard S. Lowe',
                  account: 'accountname',
                  votesCount: 3,
                  telegram: 'telegramhandle'
                },
                {
                  fullName: 'Howard S. Lowe',
                  account: 'accountname',
                  votesCount: 3,
                  telegram: 'telegramhandle'
                },
                {
                  fullName: 'Howard S. Lowe',
                  account: 'accountname',
                  votesCount: 3,
                  telegram: 'telegramhandle'
                }
              ]
            }
          ],
          l1DelegateBadges: '0/21'
        },
        {
          participants: 126,
          groups: [
            {
              myGroup: true,
              votes: [
                {
                  slot: false,
                  consensus: false,
                  vote: true
                },
                {
                  slot: false,
                  consensus: false,
                  vote: true
                },
                {
                  slot: false,
                  consensus: false,
                  vote: true
                },
                {
                  slot: false,
                  consensus: false,
                  vote: true
                },
                {
                  slot: false,
                  consensus: true,
                  vote: false
                },
                {
                  slot: true,
                  consensus: false,
                  vote: false
                }
              ],
              users: [
                {
                  fullName: 'Howard S. Lowe',
                  account: 'accountname',
                  votesCount: 3,
                  telegram: 'telegramhandle'
                },
                {
                  fullName: 'Howard S. Lowe',
                  account: 'accountname',
                  votesCount: 3,
                  telegram: 'telegramhandle'
                },
                {
                  fullName: 'Howard S. Lowe',
                  account: 'accountname',
                  votesCount: 3,
                  telegram: 'telegramhandle'
                },
                {
                  fullName: 'Howard S. Lowe',
                  account: 'accountname',
                  votesCount: 3,
                  telegram: 'telegramhandle'
                },
                {
                  fullName: 'Howard S. Lowe',
                  account: 'accountname',
                  votesCount: 3,
                  telegram: 'telegramhandle'
                },
                {
                  fullName: 'Howard S. Lowe',
                  account: 'accountname',
                  votesCount: 3,
                  telegram: 'telegramhandle'
                }
              ]
            }
          ],
          l1DelegateBadges: '4/4'
        }
      ],
      currentState: 'signup',
      showGroups: false,
      showResults: false,
      finalRound: { // TODO: waiting API
        participants: 4,
        chiefDelegateBadges: 3,
        headChiefDelegateBadge: 1,
        results: {
          headChiefDelegate: {
            account: 'accountname',
            fullName: 'Howard S. Lowe',
            telegram: 'telegramhandle'
          },
          chiefDelegates: [
            {
              account: 'accountname',
              fullName: 'Howard S. Lowe',
              telegram: 'telegramhandle'
            },
            {
              account: 'accountname',
              fullName: 'Howard S. Lowe',
              telegram: 'telegramhandle'
            },
            {
              account: 'accountname',
              fullName: 'Howard S. Lowe',
              telegram: 'telegramhandle'
            }
          ]
        }
      }
    }
  },
  apollo: {
    electionDetails: {
      query: gql`query electionDetailsQuery ($daoId: String!, $filter: UpvtElectnFilter) { ${ELECTION_DETAILS} }`,
      update: data => {
        return {
          id: data.getDao.ueElection[0].docId,
          roundDuration: data.getDao.ueElection[0].details_roundDuration_i / 60,
          startRound: {
            participantsCount: data.getDao.ueElection[0].ueStartrnd[0].ueGroupLnk.reduce((sum, group) => sum + group.ueRdMemberAggregate.count, 0),
            participants: data.getDao.ueElection[0].ueStartrnd.flatMap(group => group.ueGroupLnk.flatMap(rdMember => rdMember.ueRdMember.map(member => { return { username: member.details_member_n } })))
          },
          rounds: data.getDao.ueElection[0].ueRound.map((round) => {
            return {
              participantsCount: round.ueGroupLnk.reduce((sum, group) => sum + group.ueRdMemberAggregate.count, 0),
              groups: round.ueGroupLnk.map(group => {
                return {
                  members: group.ueRdMember,
                  votes: group.ueVote
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
      skip () { return !this.selectedDao || !this.selectedDao.docId }
    }
  },

  computed: {
    ...mapGetters('dao', ['selectedDao']),
    ...mapGetters('accounts', ['account']),

    widgetTitle() {
      if (this.upvoteWidgetState === 'signup' && this.isRegister) {
        return this.I18n.t('pages.upvote-election.upvoteelection.thanksForRegistering')
      } else if (this.upvoteWidgetState === 'signup') {
        return this.I18n.t('pages.upvote-election.upvoteelection.signUpForThisElection')
      } else if (this.upvoteWidgetState === 'finish') {
        return this.I18n.t('pages.upvote-election.upvoteelection.displacements')
      }
      return ''
    },

    widgetDescription() {
      if (this.upvoteWidgetState === 'signup' && this.isRegister) {
        return this.I18n.t('pages.upvote-election.upvoteelection.theElectionIsAboutToStart')
      } else if (this.upvoteWidgetState === 'active') {
        return this.I18n.t('pages.upvote-election.upvoteelection.youCanVote')
      } else if (this.upvoteWidgetState === 'waiting') {
        return this.I18n.t('pages.upvote-election.upvoteelection.wellDone')
      }
      return ''
    },

    paginatedApplications () {
      return this.electionDetails.startRound.participants.slice((this.page - 1) * 5, this.page * 5)
    },

    isLastPage () {
      if (this.pages === 0) return true
      return this.page === this.pages
    },

    pages () {
      return Math.ceil(this.electionDetails.startRound.participants.length / 5)
    }
  },
  methods: {
    onPrev () {
      this.page--
    },

    onNext () {
      this.page++
    },

    votingTimeLeft () {
      // const end = this.upvoteElectionData.upcomingElection?.length ? new Date(this.upvoteElectionData.startTime) : new Date(this.upvoteElectionData.endTime)
      const end = this.upvoteWidgetState === 'signup' ? new Date(this.endDate) : this.upvoteWidgetState === 'active' ? new Date(this.endRoundTime) : new Date(this.waitingTime)
      const now = Date.now()
      const t = end - now
      // if (t < 0) {
      //   this.$apollo.queries.upvoteElectionQuery.refetch()
      // }
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
    selectUser (user) {
      const existedUser = this.selectedUsers.find(compItem => compItem === user)
      if (!existedUser && !this.votingState) {
        this.selectedUsers.push(user)
      } else {
        if (this.selectedUsers.indexOf(existedUser) > -1) {
          this.selectedUsers.splice(this.selectedUsers.indexOf(existedUser), 1)
        }
      }
    },
    async vote () {
      if (!this.votingState) {
        await this.voteTransact()
        this.selectedUsers.length = 0
        // await this.$apollo.queries.upvoteElectionQuery.refetch()
        // await this.$apollo.queries.upvoteElectionVotedUsers.refetch()
      } else {
        this.selectedUsers.length = 0
        this.votedUsers.length = 0
        this.votingState = false
        this.$forceUpdate()
      }
    },

    async voteTransact () {
      const candidatesIds = []
      this.selectedUsers.forEach(user => {
        candidatesIds.push(user.docId)
      })
      const actions = [{
        account: this.$config.contracts.dao,
        name: 'castelctnvote',
        data: {
          round_id: this.upvoteElectionData.currentRoundDocId,
          voter: this.account,
          voted: candidatesIds
        }
      }]
      return await this.$store.$api.signTransaction(actions)
    }

  },
  async mounted () {
    // if (!this.upvoteElectionData || !this.votedUsers.length) {
    // await this.$apollo.queries.electionDetails.refetch()
    // await this.$apollo.queries.upvoteElectionVotedUsers.refetch()
    // }
    // this.counterdown = setInterval(() => {
    //   this.formatTimeLeft()
    //   this.$forceUpdate()
    // }, 1000)
  },
  created () {
    // this.counterdown = setInterval(() => {
    //   this.formatTimeLeft()
    //   this.$forceUpdate()
    // }, 1000)
  },
  async activated () {
    // this.counterdown = setInterval(() => {
    //   this.formatTimeLeft()
    //   this.$forceUpdate()
    // }, 1000)
    // if (!this.upvoteElectionData || !this.votedUsers.length) {
    // await this.$apollo.queries.electionDetails.refetch()
    // await this.$apollo.queries.upvoteElectionVotedUsers.refetch()
    // }
  },
  deactivated () {
    clearInterval(this.counterdown)
  },
  async updated () {
    if (this.votedUsers.length) {
      this.votingState = true
    }
  }
}
</script>

<template lang="pug">
.upvote-election
  q-dialog(:value="showLearnMoreModal" @hide="showLearnMoreModal = false")
    q-card.q-pa-xl.rounded(:style="{ 'width': '640px' }" flat)
      .h-h3 {{ $t('pages.upvote-election.howCommunityElectionsWork') }}
      .q-my-md
        div Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      q-tabs.q-my-xxl(align="center" active-color="primary" indicator-color="primary" no-caps inline-label mobile-arrows outside-arrows dense v-model="tab")
        q-tab(:style="{ 'margin': '0' }" name="VOTING" :label="$t('pages.upvote-election.voting')" :ripple="false")
        q-tab(:style="{ 'margin': '0' }" name="TIMING" :label="$t('pages.upvote-election.timing')" :ripple="false")
        q-tab(:style="{ 'margin': '0' }" name="RULES" :label="$t('pages.upvote-election.rules')" :ripple="false")
      template(v-if="tab === 'VOTING'")
        .row
          div Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        .col.text-black.text-bold.q-my-md(:style="{ 'font-weight': '600' }")
          .row.q-mb-md.flex.justify-between.items-center
            div {{ $t('pages.dho.election.voteForYourself') }}
            q-icon(name="fas fa-check" color="positive" size="20px")
          .row.flex.justify-between.items-center
            div {{ $t('pages.dho.election.reachConsensus') }}
            q-icon(name="fas fa-check" color="positive" size="20px")
      template(v-if="tab === 'TIMING'")
        .row
          div Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        .col.text-black.text-bold.q-my-md(:style="{ 'font-weight': '600' }")
          .row.q-mb-md.flex.justify-between.items-center
            div {{ $t('pages.dho.election.voteForYourself') }}
            q-icon(name="fas fa-check" color="positive" size="20px")
          .row.flex.justify-between.items-center
            div {{ $t('pages.dho.election.reachConsensus') }}
            q-icon(name="fas fa-check" color="positive" size="20px")
      template(v-if="tab === 'RULES'")
        .row
          div Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        .col.text-black.text-bold.q-my-md(:style="{ 'font-weight': '600' }")
          .row.q-mb-md.flex.justify-between.items-center
            div {{ $t('pages.dho.election.voteForYourself') }}
            q-icon(name="fas fa-check" color="positive" size="20px")
          .row.flex.justify-between.items-center
            div {{ $t('pages.dho.election.reachConsensus') }}
            q-icon(name="fas fa-check" color="positive" size="20px")
  .row.full-width.q-my-md.q-mt-lg
    .col-9
      q-card.q-mr-md.q-mb-md.widget.q-pa-xl.relative-position.rounded-card(v-if="currentState === 'signup'" flat)
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
                      .h-h4 {{ electionDetails?.startRound.participantsCount }}
                    .row {{ $t('pages.upvote-election.participants') }}
            //- .col
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
              template(v-if="paginatedApplications.length")
                .row.q-mb-sm.applicant-row.q-pa-xs(v-for="applicant in paginatedApplications")
                  .col-1
                    profile-picture(:username="applicant.username" size="24px" :key="applicant.username")
                  .col
                    .text-bold {{ applicant.username }}
                  .col @{{ applicant.username }}
                  //- .col
                    .row.flex.items-center
                      q-icon(name="fas fa-paper-plane" size="12px")
                      .q-ml-xs {{ applicant.telegram }}
                  //- .col {{ $t('pages.upvote-election.memberSince', { date: dateToStringShort(applicant.joinDate) } ) }}
                .row.justify-between.q-pt-sm.items-center
                  q-btn(:disable="page === 1" @click="onPrev()" flat rounded icon="fas fa-chevron-left")
                  .row.flex.items-center
                    div.q-ml-xs(v-for="dot, index in pages" :style="{'width': '10px', 'height': '10px', 'background': '#CAC8B0', 'border-radius': '50%'}" :class="{ 'bg-primary': index === page - 1}")
                  q-btn(:disable="isLastPage" @click="onNext()" flat rounded icon="fas fa-chevron-right")
      template(v-for="round, index in electionDetails.rounds" flat)
        round-card.q-mb-md(v-bind="round" :roundNumber="index + 1")
      q-card.q-mr-md.widget.q-pa-xl.relative-position.rounded-card(v-if="currentState === 'finish'" flat)
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
                      .h-h4 {{ finalRound.participants }}
                    .row {{ $t('pages.upvote-election.participants') }}
            .col
              q-card.rounded-card.q-pa-lg.applications-metric
                .row.flex.items-center
                  .col-2
                    img(src="~/assets/icons/chief-delegate.svg")
                  .col.q-ml-sm
                    .row
                      .h-h4 {{ finalRound.chiefDelegateBadges }}
                    .row {{ $t('pages.upvote-election.chiefDelegateBadges') }}
            .col
              q-card.rounded-card.q-pa-lg.applications-metric
                .row.flex.items-center
                  .col-2
                    img(src="~/assets/icons/head-chief.svg")
                  .col.q-ml-sm
                    .row
                      .h-h4 {{ finalRound.headChiefDelegateBadge }}
                    .row {{ $t('pages.upvote-election.headChiefDelegateBadge') }}
        q-slide-transition
          div.q-my-xl.q-pt-xl(v-show="showResults" :style="{ 'border-top': '1px solid #CBCDD1'}")
            q-card.full-width.rounded-card.q-pa-lg.results-block
              .row.q-mb-md
                .h-h5 {{ $t('pages.upvote-election.results') }}
              .row
                .col-4.q-mr-md
                  q-card.rounded-card.q-pa-lg.results-block.flex.justify-center.items-center
                    profile-picture(:username="finalRound.results.headChiefDelegate.account" size="140px")
                    .h-h4.q-mt-md {{ finalRound.results.headChiefDelegate.fullName }}
                    .text-secondary {{ $t('pages.upvote-election.headChiefDelegate') }}
                .col
                  .row.flex.items-center.q-mb-md
                    .col
                      .row
                        .col-1.flex.items-center.q-mr-xs
                          profile-picture(:username="finalRound.results.headChiefDelegate.account" size="24px")
                        .col
                          .row.text-bold.text-black {{ finalRound.results.headChiefDelegate.fullName }}
                          .row(:style="{ 'font-size': '10px' }") {{ finalRound.results.headChiefDelegate.telegram }}
                    .row
                      .row.flex.items-center
                        .text-secondary.q-mr-sm(:style="{ 'font-size': '12px' }") {{ $t('pages.upvote-election.headChiefDelegate') }}
                        img(width="16px" src="~/assets/icons/head-chief.svg")
                  template(v-for="user in finalRound.results.chiefDelegates")
                    .row.flex.items-center.q-mb-md.justify-between
                      .col
                        .row
                          .col-1.flex.items-center.q-mr-xs
                            profile-picture(:username="user.account" size="24px")
                          .col
                            .row.text-bold.text-black {{ user.fullName }}
                            .row(:style="{ 'font-size': '10px' }") {{ user.telegram }}
                      .row
                        .row.flex.items-center
                          .text-secondary.q-mr-sm(:style="{ 'font-size': '12px' }") {{ $t('pages.upvote-election.chiefDelegate') }}
                          img(width="16px" src="~/assets/icons/chief-delegate.svg")
    .col-3
      profile-card.q-mb-md(v-if="signedUp" :electionState="currentState" isElection :style="{'grid-area': 'profile'}" :clickable="false" :username="account" view="card" :compact="!$q.screen.gt.md" :tablet="$q.screen.md")
      widget.q-pa-xxl.bg-primary.q-mb-md(:class="{ 'bg-secondary': upvoteWidgetState === 'waiting' }")
        template(v-if="upvoteWidgetState !== 'active' && upvoteWidgetState !== 'waiting'")
          .h-h4.text-white.q-mb-md {{ widgetTitle }}
        template(v-else-if="upvoteWidgetState === 'active'")
          .row.items-center.q-mb-md
            .h-h4.text-white {{ roundTimeRemaining.mins }}
            .h-h4.q-mx-xxs.text-white(v-if="roundTimeRemaining.mins > 1") {{ $t('pages.upvote-election.upvoteelection.mins') }}
            .h-h4.q-mx-xxs.text-white(v-else) {{ $t('pages.upvote-election.upvoteelection.min') }}
            .h-h4.q-mr-xxs.text-white(v-if="!roundTimeRemaining.days > 0") :
            .h-h4.text-white {{ roundTimeRemaining.sec }}
            .h-h4.q-mx-xxs.text-white(v-if="roundTimeRemaining.sec > 1") {{ $t('pages.upvote-election.upvoteelection.sec') }}
            .h-h4.q-mx-xxs.text-white(v-else) {{ $t('pages.upvote-election.upvoteelection.sec') }}
            .h-h4.text-white.text-weight-400 {{ $t('pages.upvote-election.upvoteelection.left') }}
        template(v-else-if="upvoteWidgetState === 'waiting'")
          .row.q-mb-md
            .h-h4.text-white {{ roundTimeRemaining.sec }}
            .h-h4.q-mx-xxs.text-white(v-if="roundTimeRemaining.sec > 1") {{ $t('pages.upvote-election.upvoteelection.sec') }}
            .h-h4.q-mx-xxs.text-white(v-else) {{ $t('pages.upvote-election.upvoteelection.sec') }}
            .h-h4.text-white.text-weight-400 {{ $t('pages.upvote-election.upvoteelection.toNextRound') }}
        .text-white.q-mb-md {{ widgetDescription }}
        template(v-if="upvoteWidgetState === 'finish'")
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
        template(v-if="!isRegister")
          q-btn.q-px-lg.h-btn1.full-width.q-mb-sm(icon="fas fa-paper-plane" color="white" textColor="grey" :label="$t('pages.upvote-election.upvoteelection.telegramHandle')" no-caps rounded text-color="primary" unelevated)
          q-btn.q-px-lg.h-btn1.full-width(@click="isRegister = true" color="secondary" textColor="white" :label="$t('pages.upvote-election.upvoteelection.signUp')" no-caps rounded text-color="primary" unelevated)
        template(v-else-if="upvoteWidgetState !== 'finish'")
          q-btn.q-px-lg.h-btn1.full-width(@click="showLearnMoreModal = true" outline color="white" textColor="white" :label="$t('pages.upvote-election.upvoteelection.learnMore')" no-caps rounded text-color="primary" unelevated)
          q-btn.q-mt-sm.q-px-lg.h-btn1.full-width(v-if="currentState === 'signup'" @click="upvoteWidgetState = 'active', signedUp = true, currentState='voting'" color="white" textColor="negative" :label="$t('pages.upvote-election.upvoteelection.unsubscribe')" no-caps rounded text-color="primary" unelevated)
        template(v-if="upvoteWidgetState === 'finish'")
          q-btn.q-px-lg.h-btn1.full-width(color="white" textColor="primary" :label="$t('pages.upvote-election.upvoteelection.goToMyBadges')" no-caps rounded text-color="primary" unelevated)
        .timer.row.q-mt-xl.justify-center(v-if="upvoteWidgetState === 'signup'" :style="{ 'color': 'white' }")
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
        div(v-if="upvoteWidgetState === 'active'" @click="upvoteWidgetState = 'waiting'") waiting
        div(v-if="upvoteWidgetState === 'waiting'" @click="upvoteWidgetState = 'finish', currentState = 'finish'") finish
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
