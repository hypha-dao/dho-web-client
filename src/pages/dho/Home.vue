<script>
import { mapGetters } from 'vuex'
import { date, openURL } from 'quasar'

import ipfsy from '~/utils/ipfsy'

const ordersMap = [{ asc: 'createdDate' }, { desc: 'createdDate' }, { asc: 'details_title_s' }]

export default {
  name: 'dashboard',
  components: {
    BaseBanner: () => import('~/components/common/base-banner.vue'),
    HowItWorks: () => import('~/components/dashboard/how-it-works.vue'),
    Members: () => import('~/components/organization/members.vue'),
    MetricLink: () => import('~/components/dashboard/metric-link.vue'),
    SupportWidget: () => import('~/components/dashboard/support-widget.vue'),
    CirclesWidget: () => import('~/components/organization/circles-widget.vue')
  },

  apollo: {
    activeAssignmentsCount: {
      query: require('~/query/assignments/dao-active-assignment-count.gql'),
      update: data => data?.aggregateAssignment?.count?.toString(),
      skip () { return !this.selectedDao || !this.selectedDao.docId },
      variables () {
        return {
          filter: {
            details_dao_i: { eq: this.selectedDao.docId },
            details_state_s: { regexp: '/.*approved.*/i' }
          }
        }
      }
    },

    activeBadgesCount: {
      query: require('~/query/badges/dao-active-badge-count.gql'),
      update: data => data?.getDao?.badgeAggregate?.count.toString(),
      skip () { return !this.selectedDao || !this.selectedDao.docId },
      variables () {
        return {
          daoId: this.selectedDao.docId,
          filter: { details_state_s: { regexp: '/.*approved.*/i' } }
        }
      }
    },

    activeProposalsCount: {
      query: require('~/query/proposals/dao-active-proposal-count.gql'),
      update: data => data?.getDao?.proposalAggregate?.count.toString(),
      skip () { return !this.selectedDao || !this.selectedDao.docId },
      variables () {
        return {
          daoId: this.selectedDao.docId,
          finalDate: date.formatDate(new Date(), 'YYYY-MM-DDTHH:mm:ss.SZ'),
          initDate: date.formatDate(date.subtractFromDate(new Date(), { days: 7 }), 'YYYY-MM-DDTHH:mm:ss.SZ')
        }
      }
    },

    activeMembersCount: {
      query: require('~/query/members/dao-members-count.gql'),
      update: data => data?.getDao?.memberAggregate?.count,
      skip () { return !this.selectedDao || !this.selectedDao.docId },
      variables () { return { daoId: this.selectedDao.docId } }
    },

    daoBadges: {
      query: require('~/query/badges/dao-badges.gql'),
      update: data => {
        return data.getDao.badge?.map(badge => {
          return {
            title: badge.details_title_s,
            description: badge.details_description_s,
            icon: badge.details_icon_s,
            docId: badge.docId,
            assignmentAggregate: badge.assignmentAggregate,
            assignment: badge.assignment.map((ownedby) => {
              return {
                username: ownedby.details_assignee_n,
                daoName: ownedby.dao[0].details_daoName_n
              }
            })
          }
        })
      },
      skip () { return !this.selectedDao || !this.selectedDao.docId },
      variables () {
        return {
          first: this.pagination.first,
          offset: 0,
          daoId: this.selectedDao.docId,
          order: this.order,
          filter: this.textFilter ? { details_title_s: { regexp: `/.*${this.textFilter}.*/i` } } : null
        }
      },

      debounce: 500,
      loadingKey: 'loadingQueriesCount',
      result ({ data, loading, networkStatus }) {
        if (this.pagination.offset === 0) {
          this.$refs.scroll?.resume()
        }
      }
    },

    daoMembers: {
      query: require('~/query/members/dao-members.gql'),
      update: data => {
        const dao = data?.getDao

        return dao?.member?.map(v => ({
          name: v.details_member_n,
          joinedDate: new Date(v.createdDate).toDateString()
        }))
      },
      skip () { return !this.selectedDao || !this.selectedDao.docId },
      variables () { return { daoId: this.selectedDao.docId, first: 4 } }
    },

    circles: {
      query: require('~/query/circles/dao-circles.gql'),
      update: data => {
        return data.getDao.circle.map(circle => {
          return {
            ...circle
          }
        })
      },
      skip () { return !this.selectedDao || !this.selectedDao.docId },
      variables () { return { daoId: this.selectedDao.docId } }
    }
  },

  data () {
    return {
      openURL,
      pagination: {
        first: 6,
        offset: 0,
        fetchMore: true
      },
      textFilter: null,
      order: ordersMap[0]
    }
  },

  computed: {
    ...mapGetters('dao', ['daoSettings', 'selectedDao', 'selectedDaoPlan']),

    isWelcomeBannerVisible () { return true },

    welcomeBanner () {
      return {
        title: this.daoSettings?.settings_daoTitle_s || this.$t('pages.dho.home.welcomeToHyphaEvolution'),
        description: this.daoSettings?.settings_daoDescription_s || this.$t('pages.dho.home.atHyphaWere'),
        background: ipfsy(this.daoSettings?.dashboardBackgroundImage),
        color: this.daoSettings?.primaryColor,
        pattern: this.daoSettings?.pattern,
        patternColor: this.daoSettings?.patternColor,
        patternAlpha: this.daoSettings?.patternOpacity
      }
    }

  },

  methods: {
  }
}
</script>

<template lang="pug">
q-page.page-dashboard
  base-banner(:compact="!$q.screen.gt.sm" :split="$q.screen.gt.md" v-bind="welcomeBanner" v-if="isWelcomeBannerVisible")
    template(v-slot:buttons)
      q-btn.q-px-lg.h-btn1(color="secondary" :label="$t('pages.dho.home.discoverMore')" no-caps rounded unelevated @click="openURL(daoSettings.settings_documentationUrl_s || 'https://help.hypha.earth/hc/2431449449')")
  section.q-mt-md.grid
    metric-link(:link="{ link: 'agreements', params: { type: 'badge' } }" :amount="activeAssignmentsCount || '...'"  :style="{'grid-area': 'assignments'}" :title="$t('pages.dho.home.assignments')")
    metric-link(:link="{ link: 'organization/assets', params: { type: 'badge' } }" :amount="activeBadgesCount || '...'"  :style="{'grid-area': 'badges'}" :title="$t('pages.dho.home.badges')")
    metric-link(:link="{ link: 'people', params: { type: 'badge' } }" :amount="activeMembersCount || '...'"  :style="{'grid-area': 'members'}" :title="$t('pages.dho.home.members')")
    metric-link(:link="{ link: 'agreements', params: { type: 'badge' } }" :amount="activeProposalsCount || '...'"  :style="{'grid-area': 'proposals'}" :title="$t('pages.dho.home.proposals')")
    members(:title="$t('pages.dho.home.members')" :members="daoMembers || []" :style="{'grid-area': 'new'}")
    support-widget(:documentationButtonText="daoSettings.documentationButtonText" :documentationURL="daoSettings.settings_documentationUrl_s || 'https://help.hypha.earth/hc/2431449449'" :socialChat="daoSettings.socialChat" :style="{'grid-area': 'support'}")
    how-it-works(:style="{'grid-area': 'how'}")
  section.q-mt-md
    circles-widget(:circles="circles" :title="$t('pages.dho.organization.daoCircles1')")
</template>

<style lang="stylus" scoped>
.grid
  display: grid;
  grid-column-gap: $space-md.x;
  grid-row-gap: $space-md.y;
  min-height: 0;
  min-width: 0;
  grid-template-columns: repeat(4, 1fr) 2fr;
  grid-template-rows: minmax(0, 1fr);
  grid-template-areas "assignments badges members proposals new new"\
                      "support support how how new new"
  @media (max-width: $breakpoint-md-max)
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: minmax(0, 1fr);
    grid-template-areas "assignments badges"\
                        "members proposals"\
                        "new new"\
                        "support support"\
                        "how how"
</style>
