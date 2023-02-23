<script>
import { mapGetters } from 'vuex'
import { date, colors } from 'quasar'
import ipfsy from '~/utils/ipfsy'
const { getPaletteColor } = colors

export default {
  name: 'dho-home',
  apollo: {
    activeAssignmentsCount: {
      query: require('~/query/assignments/dao-active-assignment-count.gql'),
      update: data => data.aggregateAssignment.count.toString(),
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
      update: data => data.getDao.badgeAggregate.count.toString(),
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
      update: data => data.getDao.proposalAggregate.count.toString(),
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
      query: require('~/query/members/dao-members-active-assignments.gql'),
      update: data => {
        const { badge, role } = data.getDao

        const roleMembers = role.length > 0 ? role.map(r => r.assignment.flat()).flat().map(r => r.creator) : role
        const badgeMembers = badge.length > 0 ? badge.map(b => b.assignment.flat()).flat().map(b => b.creator) : badge
        const members = new Set([...roleMembers, ...badgeMembers])

        return members.size
      },
      skip () { return !this.selectedDao || !this.selectedDao.docId },
      variables () {
        return {
          daoId: this.selectedDao.docId
        }
      }
    },

    daoMembers: {
      query: require('~/query/members/dao-members.gql'),
      update: data => data.getDao,
      skip () { return !this.selectedDao || !this.selectedDao.docId },
      variables () {
        return {
          daoId: this.selectedDao.docId,
          first: 4
        }
      }
    }
  },

  components: {
    BaseBanner: () => import('~/components/common/base-banner.vue'),

    HowItWorks: () => import('~/components/dashboard/how-it-works.vue'),
    MetricLink: () => import('~/components/dashboard/metric-link.vue'),
    NewMembers: () => import('~/components/dashboard/new-members.vue'),
    SupportWidget: () => import('~/components/dashboard/support-widget.vue')
  },

  data () {
    return {
      isPlanBannerVisible: true,
      isWelcomeBannerVisible: true
    }
  },

  async mounted () {
    if (localStorage.getItem('showPlanBanner') === 'false') { this.isPlanBannerVisible = false }
    if (localStorage.getItem('showWelcomeBanner') === 'false') { this.isWelcomeBannerVisible = false }
  },

  computed: {
    ...mapGetters('dao', ['daoSettings', 'selectedDao', 'selectedDaoPlan']),

    banner () {
      return {
        title: this.daoSettings.dashboardTitle,
        description: this.daoSettings.dashboardParagraph,
        background: ipfsy(this.daoSettings.dashboardBackgroundImage),
        color: this.daoSettings.primaryColor,
        pattern: this.daoSettings.pattern,
        patternColor: this.daoSettings.patternColor,
        patternAlpha: this.daoSettings.patternOpacity
      }
    },

    newMembers () {
      if (!this.daoMembers || !this.daoMembers.member) return

      return this.daoMembers.member.map(v => {
        return {
          name: v.details_member_n,
          joinedDate: new Date(v.createdDate).toDateString()
        }
      })
    }
  },

  methods: {
    getPaletteColor,
    hidePlanBanner () {
      localStorage.setItem('showPlanBanner', false)
      this.isPlanBannerVisible = false
    },

    hideWelcomeBanner () {
      localStorage.setItem('showWelcomeBanner', false)
      this.isWelcomeBannerVisible = false
    }
  }
}
</script>

<template lang="pug">
q-page.page-home
  base-banner.q-mb-md(
    title="Your Plan has expired!"
    description="We are allowing you a grace period of 7 days for you to resolve this issue before we will regrettably have to suspend your DAO account. Once suspended, you will not be able to perform any actions on the DAO until you renew your Plan, or downgrade to the Free Plan. Click the ‘Manage Plan’ button and renew your plan today."
    :gradient="false"
    :color="getPaletteColor('negative')"
    :compact="!$q.screen.gt.sm"
    v-if="selectedDaoPlan.isExpiring"
  )
    template(v-slot:header)
      header.full-width.q-mb-xl.row.h-h4.text-white(:class="{'justify-between h-h5': !$q.screen.gt.sm }")
        div(:class="{'q-pr-md': $q.screen.gt.sm }") {{selectedDaoPlan.name}} plan
          span.text-weight-500.q-pl-xxs expired
        div(:class="{'q-px-sm': $q.screen.gt.sm }")
          div.full-height(:style="{'width': '2px', 'background': 'rgba(255, 255, 255, .2)' }")
        div(:class="{'q-px-md': $q.screen.gt.sm }") {{selectedDaoPlan.daysLeft}}
          span.text-xs.text-weight-500.q-pl-xxs days left
        .q-px-sm(v-if="$q.screen.gt.sm")
          div.full-height(:style="{'width': '2px', 'background': 'rgba(255, 255, 255, .2)' }")
        div.row.items-center.q-gutter-x-sm(v-if="$q.screen.gt.sm" :class="{'q-pl-xl': $q.screen.gt.sm }")
          q-icon(name="fas fa-exclamation-triangle" size='sm')
          span Action Required
    template(v-slot:buttons)
      q-btn.q-px-lg.h-btn1(
        :to="{ name: 'configuration', query: { tab: 'PLAN' } }"
        color="white"
        label="Manage Plan"
        no-caps
        rounded
        text-color="negative"
        unelevated
      )

  base-banner.q-mb-md(
    title="Get all the benefits of a Hypha DAO"
    description="We’ve activated your DAO on a default free plan. This has limited features even though it’s a full fledged DAO. To benefit from the full potential of Hypha DAO modules, such as circles, badges, custom governance, additional users, and much more, click “Manage Plan” and subscribe to one of our pricing plans today."
    :gradient="false"
    :color="getPaletteColor('secondary')"
    :compact="!$q.screen.gt.sm"
    @onClose="hidePlanBanner"
    v-if="selectedDaoPlan.isActivated && isPlanBannerVisible"
  )
    template(v-slot:header)
      header.full-width.q-mb-xl.row.h-h4.text-white(:class="{ 'justify-between h-h5': !$q.screen.gt.sm }")
        .q-pr-sm(:class="{'q-pr-md': $q.screen.gt.sm }") {{selectedDaoPlan.name}} plan
          span.text-weight-500.q-pl-xxs(v-if="$q.screen.gt.sm") active
        div(:class="{'q-px-sm': $q.screen.gt.sm }")
          div.full-height(:style="{'width': '2px', 'background': 'rgba(255, 255, 255, .2)' }")
        .q-pl-sm(:class="{'q-pl-md': $q.screen.gt.sm }")
          router-link.text-white(:to="{ name: 'configuration', query: { tab: 'PLAN' } }") Upgrade plan
    template(v-slot:buttons)
      q-btn.q-px-lg.h-btn1(
        :to="{ name: 'configuration', query: { tab: 'PLAN' } }"
        color="white"
        label="Manage Plan"
        no-caps
        rounded
        text-color="secondary"
        unelevated
      )

  base-banner(
    :compact="!$q.screen.gt.sm"
    @onClose="hideWelcomeBanner"
    :split="$q.screen.gt.md"
    v-bind="banner"
    v-if="isWelcomeBannerVisible"
  )
    template(v-slot:buttons)
      router-link(:to="{ name: 'organization' }")
        q-btn.q-px-lg.h-btn1(
          color="secondary"
          label="Discover More"
          no-caps
          rounded
          unelevated
        )

  .row
    .row.q-col-gutter-md.q-mt-xxs
      .col-12.col-md-6.col-lg-2
        metric-link(:amount="activeAssignmentsCount" title="Active assignments" icon="fas fa-coins" :link="{ link: 'search', query: { q: '', filter: 'Active', type: '4' } }").full-width
      .col-12.col-md-6.col-lg-2
        metric-link(:amount="activeProposalsCount" link="proposals" title="New Proposals" ).full-height.full-width
      .col-12.col-md-6.col-lg-2
        metric-link(:amount="activeBadgesCount" title="Active badges" icon="fas fa-coins" :link="{ link: 'organization/assets', params: { type: 'badge' } }").full-width
      .col-12.col-md-6.col-lg-2
        metric-link(:amount="activeMembersCount" link="members" title="Active Members").full-height.full-width
      .col-12.col-md-6(v-if="!$q.screen.gt.md")
        new-members(:members="newMembers").full-width
      .flex-break(v-if="$q.screen.gt.md")
      .col-12.col-md-6.col-lg-4
        support-widget(:documentationURL="daoSettings.documentationURL" :socialChat="daoSettings.socialChat" :documentationButtonText="daoSettings.documentationButtonText").full-height.full-width
      .col-12.col-lg-4
        how-it-works.full-height
      .col-3
    .row.absolute.full-width.q-pl-xxxl.q-pt-lg(v-if="$q.screen.gt.md")
      .col-lg-4.offset-8
        new-members(:members="newMembers").full-width

</template>

<style lang="stylus" scoped>
</style>
