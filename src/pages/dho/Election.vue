<script>
import formatNumber from '~/utils/formatNumber'
import I18n from '~/utils/i18n'
import { dateToStringShort } from '~/utils/TimeUtils.js'
import { mapGetters, mapActions } from 'vuex'
import gql from 'graphql-tag'

const ELECTIONS_DATA = `
getDao(docId: $daoId) {
  delegate {
    details_member_n
  }
  docId
  ueElection {
    docId
    details_endDate_t
    details_startDate_t
    ueRound {
      docId
    }
    ueStartrnd {
      ueGroupLnk {
        ueRdMemberAggregate {
          count
        }
        ueRdMember {
          details_member_n
        }
      }
    }
  }
}
`

const ONGOING_ELECTIONS_DATA = `
getDao(docId: $daoId) {
  docId
  ueOngoing {
    docId
  }
}
`

const UPCOMING_ELECTIONS_DATA = `
getDao(docId: $daoId) {
  docId
  ueUpcoming {
    docId
    details_startDate_t
  }
}
`

const ROUND_DURATION = 3600
const UPVOTE_DURATION = 7862400
const EDEN_COMMUNITY_LINK = 'https://eoscommunity.notion.site/Technical-Documentation-For-Running-Elections-7750b500724f43269130744b5c9d0c38'

export default {
  name: 'election',

  components: {
    BaseBanner: () => import('~/components/common/base-banner.vue'),
    Widget: () => import('~/components/common/widget.vue'),
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue')
  },

  apollo: {
    elections: {
      query: gql`query electionsQuery ($daoId: String!) { ${ELECTIONS_DATA} }`,
      update: data => data.getDao.ueElection.map(election => {
        return {
          delegatesList: data.getDao.delegate,
          endDate: election.details_endDate_t,
          rounds: election.ueRound.length,
          participants: election.ueStartrnd?.ueGroupLnk?.length ? election.ueStartrnd.reduce((count, group) => count + group.ueGroupLnk.reduce((count, link) => count + link.ueRdMember.filter(member => member.details_member_n).length, 0), 0) : data.getDao.delegate?.length,
          id: election.docId
        }
      }).reverse(),
      variables() {
        return {
          daoId: this.selectedDao.docId
        }
      },
      fetchPolicy: 'no-cache',
      pollInterval: 1000, // THIS IS JUST TEMPORARY UNTIL GRAPHQL SUBSCRIPTION IS READY
      skip() { return !this.selectedDao || !this.selectedDao.docId }
    },
    ongoingElection: {
      query: gql`query electionsQuery ($daoId: String!) { ${ONGOING_ELECTIONS_DATA} }`,
      update: data => data.getDao.ueOngoing,
      variables() {
        return {
          daoId: this.selectedDao.docId
        }
      },
      fetchPolicy: 'no-cache',
      pollInterval: 1000, // THIS IS JUST TEMPORARY UNTIL GRAPHQL SUBSCRIPTION IS READY
      skip() { return !this.selectedDao || !this.selectedDao.docId }
    },
    upcomingElection: {
      query: gql`query electionsQuery ($daoId: String!) { ${UPCOMING_ELECTIONS_DATA} }`,
      update: data => data.getDao.ueUpcoming?.[0],
      variables() {
        return {
          daoId: this.selectedDao.docId
        }
      },
      fetchPolicy: 'no-cache',
      pollInterval: 1000, // THIS IS JUST TEMPORARY UNTIL GRAPHQL SUBSCRIPTION IS READY
      skip() { return !this.selectedDao || !this.selectedDao.docId }
    }
  },

  data() {
    return {
      I18n,
      formatNumber,
      dateToStringShort,
      timeRemaining: {},
      counterdown: undefined,
      isUpVoteElectionBannerVisible: true,
      slide: '1',
      titles: [
        this.$t('pages.dho.election.howCommunityElectionsWork'),
        this.$t('pages.dho.election.howCommunityElectionsWork'),
        this.$t('pages.dho.election.howCommunityElectionsWork')
      ]
    }
  },

  computed: {
    ...mapGetters('dao', ['selectedDao', 'daoSettings']),
    ...mapGetters('accounts', ['account', 'isAdmin']),
    canStartElection() {
      return (!this.upcomingElection || !this.ongoingElection) && this.isAdmin
    },

    upvoteElectionBanner() {
      return {
        title: this.hasNextElection ? this.I18n.t('pages.dho.home.joinAsADelegate') : this.canStartElection ? this.I18n.t('pages.dho.home.startNewElections') : this.I18n.t('pages.dho.home.communityElectionsAreAbout'),
        description: this.canStartElection ? '' : this.I18n.t('pages.dho.home.weUseAFairAndInclusive')
      }
    },

    hasNextElection: {
      get() {
        return new Date() < new Date(this.upcomingElection?.details_startDate_t)
      }
    },

    widgetTitle() {
      return this.titles[Number.parseInt(this.slide) - 1]
    }
  },

  created() {
    if (localStorage.getItem('showUpvoteBanner') === 'false') {
      this.isUpVoteElectionBannerVisible = false
    }
    this.counterdown = setInterval(() => {
      this.formatTimeLeft()
      this.$forceUpdate()
    }, 1000)
  },

  async activated() {
    await this.$apollo.queries.elections.refetch()
  },

  beforeDestroy() {
    clearInterval(this.counterdown)
  },

  methods: {
    ...mapActions('dao', ['createElection']),
    formatTimeLeft() {
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
        this.timeRemaining = {
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

    votingTimeLeft() {
      const end = new Date(this.upcomingElection?.details_startDate_t)
      const now = Date.now()
      const t = end - now
      return t
    },

    hideUpvoteBanner() {
      localStorage.setItem('showUpvoteBanner', false)
      this.isUpVoteElectionBannerVisible = false
    },

    getSaturdayTimestamp() {
      const now = new Date()
      now.setDate(now.getDate() + (6 - now.getDay() + 7) % 7)
      now.setUTCHours(17)
      now.setUTCMinutes(0)
      now.setUTCSeconds(0)
      now.setUTCMilliseconds(0)
      const startDate = new Date(now).toISOString()
      return startDate
    },

    getLastElectionEndDate() {
      const dateString = this.elections[0].endDate
      const date = new Date(dateString)
      const timestamp = date.getTime()
      const seconds = timestamp + UPVOTE_DURATION * 1000
      if (seconds > new Date().getTime()) {
        return new Date(seconds).toISOString()
      } else {
        return this.getSaturdayTimestamp()
      }
    },

    async _createElection() {
      const startDate = !this.elections.length ? this.getSaturdayTimestamp() : this.getLastElectionEndDate()
      await this.createElection({
        startDate: startDate,
        upvoteDuration: UPVOTE_DURATION,
        duration: ROUND_DURATION,
        daoId: this.selectedDao.docId
      })
    },

    visitToEden() {
      window.open(EDEN_COMMUNITY_LINK, '_blank')
    }
  }
}
</script>
<template lang="pug">
q-page.page-election
  base-banner.q-mb-md(v-bind="upvoteElectionBanner" @onClose="hideUpvoteBanner" upvoteBanner :background="require('~/assets/images/election-banner-bg.jpeg')" v-if="isUpVoteElectionBannerVisible && (upcomingElection || canStartElection)")
    template(v-if="hasNextElection" v-slot:right)
      .flex.full-width.full-height.items-center.justify-center
        q-card.q-pa-xl(v-if="!canStartElection" :style="{ 'width': '350px', 'opacity': '.7', 'border-radius': '15px' }")
          .col
            .row.full-width.justify-center.q-pb-md(:style="{ 'border-bottom': '1px solid #242f5d'}")
              .row
                .time.row
                  .row.items-center(v-if="timeRemaining.days > 0")
                    .h-h4 {{ timeRemaining.days }}
                    .h-h4.q-mx-xxs(v-if="timeRemaining.days > 1") {{ $t('pages.dho.home.days') }} :
                    .h-h4.q-mx-xxs(v-else) {{ $t('pages.dho.home.day') }} :
                  .row.items-center
                    .h-h4 {{ timeRemaining.hours }}
                    .h-h4.q-mx-xxs(v-if="timeRemaining.hours > 1") {{ $t('pages.dho.home.hours') }} :
                    .h-h4.q-mx-xxs(v-else) {{ $t('pages.dho.home.hour') }} :
                  .row.items-center
                    .h-h4 {{ timeRemaining.mins }}
                    .h-h4.q-mx-xxs(v-if="timeRemaining.mins > 1") {{ $t('pages.dho.home.mins') }}
                    .h-h4.q-mx-xxs(v-else) {{ $t('pages.dho.home.min') }}
                    .h-h4.q-mr-xxs(v-if="!timeRemaining.days > 0") :
                  .row.items-center(v-if="!timeRemaining.days > 0")
                    .h-h4 {{ timeRemaining.sec }}
                    .h-h4.q-mx-xxs(v-if="timeRemaining.sec > 1") {{ $t('pages.dho.home.sec') }}
                    .h-h4.q-mx-xxs(v-else) {{ $t('pages.dho.home.sec') }}
              .row
                .text-secondary {{ $t('pages.dho.home.timeLeftForSigningUp') }}
            .row.q-pt-md
              //- Temporarily hidden
              //- .col.flex.justify-center(:style="{ 'border-right': '1px solid #242f5d' }")
              //- .h-h6 {{ participants }}
              .full-width.flex.justify-center.text-secondary {{ $t('pages.dho.home.participants') }}
              //- .col.flex.justify-center
                .h-h6 $ {{ formatNumber(treasury) }}
                .full-width.flex.justify-center.text-secondary {{ $t('pages.dho.home.treasury') }}
    template(v-slot:buttons)
      .row.justify-start
        .flex(:class=" { 'q-mt-md': $q.screen.lt.md, 'justify-end': $q.screen.gt.sm }")
        q-btn.q-px-lg.h-btn1(v-if="canStartElection" @click="_createElection" :class="{ 'q-mt-sm': $q.screen.lt.xs || $q.screen.xs }" no-caps rounded unelevated :label="$t('pages.dho.home.start')" color="secondary" text-color="white")
        q-btn.q-px-lg.h-btn1(v-else @click="$router.push({ path: `/${$store.state.dao.settings.settings_daoUrl_s}/election/${upcomingElection.docId}` })" :disable="!upcomingElection" :class="{ 'q-mt-sm': $q.screen.lt.xs || $q.screen.xs }" no-caps rounded unelevated :label="$t('pages.dho.home.signup')" color="secondary" text-color="white")
        a(:href="daoSettings.settings_documentationUrl_s || 'https://help.hypha.earth/hc/2431449449'" target="_blank")
          q-btn.q-px-lg.h-btn1.q-ml-sm(color="white" flat :label="$t('pages.dho.home.learnMore')" no-caps rounded)
    //- template(v-slot:buttons)
      .row.justify-start
        q-btn.q-px-lg.h-btn1(disable :class="{ 'q-mt-sm': $q.screen.lt.xs || $q.screen.xs }" no-caps rounded unelevated :label="$t('pages.dho.home.nextElection', { date: dateToStringShort(nextElectionStartDate) })" color="white" text-color="primary")
  .row
    .col-9.q-mr-md
      template(v-for="election in elections")
        q-card.full-width.q-pa-xl.rounded.q-mb-md(flat)
          .row.flex.items-center
            .col.flex.justify-start
              .h-h5 {{ dateToStringShort(election.endDate) }}
            .col.flex.justify-center.text-black(:style="{ 'font-size': '17px' }")
              div {{ election.rounds }} {{ $t('pages.dho.election.rounds') }}
            .col.flex.justify-center.text-black(:style="{ 'font-size': '17px' }")
              div {{ election.participants }} {{ $t('pages.dho.election.participants') }}
            .col.flex.justify-end
              q-btn.q-px-lg.h-btn1(@click="$router.push({ path: `/${$store.state.dao.settings.settings_daoUrl_s}/election/${election.id}` })" :class="{ 'q-mt-sm': $q.screen.lt.xs || $q.screen.xs }" no-caps rounded unelevated :label="$t('pages.dho.election.seeResults')" color="primary" text-color="white")
    .col
      widget(:title="widgetTitle")
        q-carousel.b2.q-mt-md(v-model="slide" swipeable="swipeable" animated="animated" navigation="navigation" :padding="false" height="240px" control-color="primary" ref="carousel")
          q-carousel-slide.no-padding(name="1")
            .h-b2 {{ $t('pages.dho.election.thereAreThreeRounds') }}
          q-carousel-slide.no-padding(name="2")
            .h-b2 {{ $t('pages.dho.election.thereAreThreeVoting') }}
          q-carousel-slide.no-padding(name="3")
            .h-b2 {{ $t('pages.dho.election.ifYouNeedMore') }}
            .row.flex.justify-end.q-mt-lg
              q-btn.h-btn1.q-px-sm(@click="visitToEden()" :color="'secondary'" no-caps rounded unelevated) {{ $t('pages.dho.election.visitEdenCommunity') }}
          template(v-slot:control)
            q-carousel-control(position="bottom-right")
              q-btn.q-mt-md.round-circle(flat unelevated padding="13px" icon="fas fa-chevron-right" size="xxs" color="primary" @click="$refs.carousel.next()")
            q-carousel-control(position="bottom-left")
              q-btn.q-mt-md.round-circle(flat unelevated padding="13px" icon="fas fa-chevron-left" size="xxs" color="primary" @click="$refs.carousel.previous()")

</template>
<style lang="stylus" scoped>
.rounded
  border-radius: 15px
</style>
