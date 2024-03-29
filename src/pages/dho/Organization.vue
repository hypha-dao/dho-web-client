<script>
import { mapActions, mapGetters } from 'vuex'
import { openURL } from 'quasar'
import { daoRouting } from '~/mixins/dao-routing'
import ipfsy from '~/utils/ipfsy'

export default {
  name: 'dho-overview',
  mixins: [daoRouting],
  components: {
    ArchetypesWidget: () => import('~/components/organization/archetypes-widget.vue'),
    BadgesAssignmentsWidget: () => import('~/components/organization/badge-assignments-widget.vue'),
    BadgesWidget: () => import('~/components/organization/badges-widget.vue'),
    BaseBanner: () => import('~/components/common/base-banner.vue'),
    BasePlaceholder: () => import('~/components/placeholders/base-placeholder.vue'),
    CirclesWidget: () => import('~/components/organization/circles-widget.vue'),
    MetricLink: () => import('~/components/dashboard/metric-link.vue'),
    PayoutsWidget: () => import('~/components/organization/payouts-widget.vue'),
    PoliciesWidget: () => import('~/components/organization/policies-widget.vue'),
    RoleAssignmentsWidget: () => import('~/components/organization/role-assignments-widget.vue'),
    Tokens: () => import('~/components/organization/tokens.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },
  data () {
    return {
      isShowingOrganizationalBanner: true,
      treasuryTokens: [],
      policies: [
        {
          title: 'Title of Policy',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt'
        },
        {
          title: 'Title of Policy',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt'
        },
        {
          title: 'Title of Policy',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt'
        }
      ]
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
          daoId: this.selectedDao.docId,
          first: 3
        }
      }
    },
    daoPayouts: {
      query: require('~/query/payouts/dao-payouts.gql'),
      update: data => {
        return data.getDao.payout.map(payout => {
          return {
            title: payout.details_title_s,
            description: payout.details_description_s,
            docId: payout.docId
            // payments: payout.payment
          }
        })
      },
      skip () {
        return !this.selectedDao || !this.selectedDao.docId
      },
      variables () {
        return {
          daoId: this.selectedDao.docId,
          first: 3,
          order: { desc: 'createdDate' }
        }
      },
      fetchPolicy: 'no-cache'
    },
    daoBadgeAssignments: {
      query: require('~/query/assignments/dao-badge-assignments.gql'),
      update: data => {
        return data.queryAssignbadge.map(assignment => {
          return {
            title: assignment.details_title_s,
            description: assignment.details_description_s,
            docId: assignment.docId,
            icon: assignment.badge[0].details_icon_s
          }
        })
      },
      skip () {
        return !this.selectedDao || !this.selectedDao.name
      },
      variables () {
        return {
          daoName: this.selectedDao.name,
          first: 3
        }
      }
    },
    daoRoleAssignments: {
      query: require('~/query/assignments/dao-role-assignments.gql'),
      update: data => {
        return data.queryAssignment.map(assignment => {
          return {
            title: assignment.details_title_s,
            description: assignment.details_description_s,
            docId: assignment.docId
          }
        })
      },
      skip () {
        return !this.selectedDao || !this.selectedDao.name
      },
      variables () {
        return {
          daoName: this.selectedDao.name,
          first: 3
        }
      },
      fetchPolicy: 'no-cache'
    },
    daoArchetypes: {
      query: require('~/query/archetypes/dao-archetypes.gql'),
      update: data => {
        return data.getDao.role?.map(role => {
          return {
            title: role.details_title_s,
            description: role.details_description_s,
            docId: role.docId
          }
        })
      },
      skip () {
        return !this.selectedDao || !this.selectedDao.docId
      },
      variables () {
        return {
          daoId: this.selectedDao.docId,
          offset: 0,
          first: 3
        }
      }
    },

    activeAssignments: {
      query: require('~/query/assignments/dao-active-assignment-count.gql'),
      update: data => {
        const { count } = data.aggregateAssignment
        return count.toString()
      },
      skip () {
        return !this.selectedDao || !this.selectedDao.docId
      },
      variables () {
        return {
          filter: {
            details_dao_i: { eq: this.selectedDao.docId },
            details_state_s: { regexp: '/.*approved.*/i' }
          }
        }
      }
    },
    activeBadges: {
      query: require('~/query/badges/dao-active-badge-count.gql'),
      update: data => {
        const { count } = data.getDao.badgeAggregate
        return count.toString()
      },
      skip () {
        return !this.selectedDao || !this.selectedDao.docId
      },
      variables () {
        return {
          daoId: this.selectedDao.docId,
          filter: { details_state_s: { regexp: '/.*approved.*/i' } }
        }
      }
    },
    recentPayouts: {
      query: require('~/query/payouts/dao-recent-payouts.gql'),
      update: data => {
        const { count } = data.queryDao?.[0].treasury?.[0].redemptionAggregate
        return count.toString()
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
  async mounted () {
    if (localStorage.getItem('showOrganizationalBanner') === 'false') {
      this.isShowingOrganizationalBanner = false
    }
    this.getTreasuryTokens()
  },
  watch: {
    selectedDao () {
      this.getTreasuryTokens()
    }
  },

  computed: {
    ...mapGetters('accounts', ['isMember']),
    ...mapGetters('dao', ['daoSettings', 'selectedDao']),

    banner () {
      return {
        title: this.daoSettings.organisationTitle || this.$t('pages.dho.organization.createMeaningfulImpact'),
        description: this.daoSettings.organisationParagraph || this.$t('pages.dho.organization.allOfHypha'),
        background: ipfsy(this.daoSettings.organisationBackgroundImage),
        color: this.daoSettings.primaryColor,
        pattern: this.daoSettings.pattern,
        patternColor: this.daoSettings.patternColor,
        patternAlpha: this.daoSettings.patternOpacity
      }
    }
  },

  methods: {
    ...mapActions('treasury', ['getSupply']),

    async getTreasuryTokens () {
      try {
        const tokens = await this.getSupply()
        delete tokens.SEEDS
        this.treasuryTokens = Object.entries(tokens).map((token, i) => {
          return {
            tokenName: token[0],
            amount: token[1],
            type: ['utility', 'cash', 'voice'][i]
          }
        })
      } catch (e) {}
    },

    hideOrganizationalBanner () {
      localStorage.setItem('showOrganizationalBanner', false)
      this.isShowingOrganizationalBanner = false
    },

    openDocumentation () {
      openURL(this.daoSettings.documentationURL)
    }
  }
}
</script>

<template lang="pug">
q-page.page-organization
  base-banner(:compact="!$q.screen.gt.sm" @onClose="hideOrganizationalBanner" :split="$q.screen.gt.md" v-bind="banner" v-if="isShowingOrganizationalBanner")
    template(v-slot:buttons)
      q-btn.q-px-lg.h-btn1(@click="openDocumentation" color="secondary" :label="$t('pages.dho.organization.documentation')" no-caps rounded unelevated)
  tokens.q-mt-md(v-if="!$q.screen.md" :vertical="!$q.screen.gt.sm" :daoLogo="daoSettings.logo" :tokens="treasuryTokens" more @more-clicked="$router.push({name: 'treasury', params: { dhoname: $route.params.dhoname}})")
  .row.full-width(v-if="$q.screen.gt.md")
    .col-9.q-gutter-md
      .row.full-width.q-gutter-md
        .col
          metric-link(:amount="activeAssignments" :title="$t('pages.dho.organization.activeAssignments')" icon="fas fa-coins" :link="{ link: 'search', query: { q: '', filter: 'Active', type: '4' } }")
        .col
          metric-link(:amount="recentPayouts" :title="$t('pages.dho.organization.payouts')" icon="fas fa-coins" link="treasury")
        .col
          metric-link(:amount="activeBadges" :title="$t('pages.dho.organization.activeBadges')" icon="fas fa-coins" :link="{ link: 'organization/assets', params: { type: 'badge' } }")
      .row.q-my-md
        circles-widget(:circles="circles" :title="$t('pages.dho.organization.daoCircles')")
      .row
        role-assignments-widget(:assignments="daoRoleAssignments")
          template(v-slot:empty)
            base-placeholder.full-width.no-padding(subtitle="Your organization has no role assignments yet. You can create one by clicking on the button below." icon="fas fa-id-badge" :actionButtons="[{label: 'Create a new role assignment', color: 'primary', onClick: () => routeTo('proposals/create'), disable: !isMember, disableTooltip: 'You must be a member'}]")
      .row
        payouts-widget(:payouts="daoPayouts")
          template(v-slot:empty)
            base-placeholder.full-width.no-padding(subtitle="Your organization has no payouts yet. You can create one by clicking on the button below." icon="fas fa-id-badge" :actionButtons="[{label: 'Create a new Contribution', color: 'primary', onClick: () => routeTo('proposals/create'), disable: !isMember, disableTooltip: 'You must be a member'}]")
    .col-3.q-ml-md.q-mt-md
      .row
        archetypes-widget(:archetypes="daoArchetypes" v-if="daoArchetypes && daoArchetypes.length")
        base-placeholder.full-width(compact v-if="!(daoArchetypes && daoArchetypes.length)" :title="$t('pages.dho.organization.archetypes')" subtitle="Your organization has no archetypes yet. You can create one by clicking on the button below." icon="fas fa-id-badge" :actionButtons="[{label: 'Create a new archetype', color: 'primary', onClick: () => routeTo('proposals/create'), disable: !this.isMember, disableTooltip: 'You must be a member'}]")
      .row.q-mt-xl
        badges-widget.full-width(v-if="daoBadges && daoBadges.length" :badges="daoBadges" compact)
        base-placeholder.full-width(v-if="!(daoBadges && daoBadges.length)" :title="$t('pages.dho.organization.badges')" subtitle="Your organization has no badges yet. You can create one by clicking on the button below." icon="fas fa-id-badge" :actionButtons="[{label: 'Create a new badge', color: 'primary', onClick: () => routeTo('proposals/create'), disable: !this.isMember, disableTooltip: 'You must be a member'}]")
  .row.full-width.q-col-gutter-mdsd(v-else-if="$q.screen.md")
    .col-6.q-gutter-y-md.q-pr-xs.q-pt-md
      tokens.q-mt-md.full-width(:vertical="!$q.screen.gt.md" :daoLogo="daoSettings.logo" :tokens="treasuryTokens" more @more-clicked="$router.push({name: 'treasury', params: { dhoname: $route.params.dhoname}})")
      circles-widget(:circles="circles" :title="$t('pages.dho.organization.daoCircles1')")
      archetypes-widget(:archetypes="daoArchetypes" v-if="daoArchetypes && daoArchetypes.length" compact isMobile="isMobile")
      base-placeholder.full-width(compact v-if="!(daoArchetypes && daoArchetypes.length)" :title="$t('pages.dho.organization.archetypes1')" subtitle="Your organization has no archetypes yet. You can create one by clicking on the button below." icon="fas fa-id-badge" :actionButtons="[{label: 'Create a new archetype', color: 'primary', onClick: () => routeTo('proposals/create'), disable: !this.isMember, disableTooltip: 'You must be a member'}]")
      badges-widget.full-width(v-if="daoBadges && daoBadges.length" :badges="daoBadges" compact isMobile="isMobile")
      base-placeholder.full-width(v-if="!(daoBadges && daoBadges.length)" :title="$t('pages.dho.organization.badges1')" subtitle="Your organization has no badges yet. You can create one by clicking on the button below." icon="fas fa-id-badge" :actionButtons="[{label: 'Create a new badge', color: 'primary', onClick: () => routeTo('proposals/create'), disable: !this.isMember, disableTooltip: 'You must be a member'}]")
    .col-6.q-gutter-y-md.q-pl-xs.q-pt-md
      metric-link.full-width(:amount="activeAssignments" :title="$t('pages.dho.organization.activeAssignments1')" icon="fas fa-coins" :link="{ link: 'search', query: { q: '', filter: 'Active', type: '4' } }")
      metric-link.full-width(:amount="recentPayouts" :title="$t('pages.dho.organization.payouts1')" icon="fas fa-coins" link="treasury")
      metric-link.full-width(:amount="activeBadges" :title="$t('pages.dho.organization.activeBadges1')" icon="fas fa-coins" :link="{ link: 'organization/assets', params: { type: 'badge' } }")
      role-assignments-widget(:assignments="daoRoleAssignments" compact isMobile="isMobile")
        template(v-slot:empty)
          base-placeholder.full-width.no-padding(subtitle="Your organization has no role assignments yet. You can create one by clicking on the button below." icon="fas fa-id-badge" :actionButtons="[{label: 'Create a new role assignment', color: 'primary', onClick: () => routeTo('proposals/create'), disable: !isMember, disableTooltip: 'You must be a member'}]")
      payouts-widget(:payouts="daoPayouts" compact isMobile="isMobile")
        template(v-slot:empty)
          base-placeholder.full-width.no-padding(subtitle="Your organization has no payouts yet. You can create one by clicking on the button below." icon="fas fa-id-badge" :actionButtons="[{label: 'Create a new Contribution', color: 'primary', onClick: () => routeTo('proposals/create'), disable: !isMember, disableTooltip: 'You must be a member'}]")
  .full-width(v-else)
    .scroll-metrics-wrapper
      .row.q-mt-md.scroll-metrics
        .col.q-mx-xs
          metric-link(:amount="activeAssignments" :title="$t('pages.dho.organization.activeAssignments2')" icon="fas fa-coins" :link="{ link: 'search', query: { q: 'Assignment', filter: 'Active', type: '6' } }")
        .col.q-mx-xs
          metric-link(:amount="recentPayouts" :title="$t('pages.dho.organization.payouts2')" icon="fas fa-coins" link="treasury")
        .col.q-mx-xs
          metric-link(:amount="activeBadges" :title="$t('pages.dho.organization.activeBadges2')" icon="fas fa-coins" :link="{ link: 'organization/assets', params: { type: 'badge' } }")
    .row.q-my-md
      circles-widget(:circles="circles" :title="$t('pages.dho.organization.daoCircles2')")
    .row.q-mt-md
      role-assignments-widget(:assignments="daoRoleAssignments" compact isMobile="isMobile")
        template(v-slot:empty)
          base-placeholder.full-width.no-padding(subtitle="Your organization has no role assignments yet. You can create one by clicking on the button below." icon="fas fa-id-badge" :actionButtons="[{label: 'Create a new role assignment', color: 'primary', onClick: () => routeTo('proposals/create'), disable: !isMember, disableTooltip: 'You must be a member'}]")
    .row.q-mt-md
      payouts-widget(:payouts="daoPayouts" compact isMobile="isMobile")
        template(v-slot:empty)
          base-placeholder.full-width.no-padding(subtitle="Your organization has no payouts yet. You can create one by clicking on the button below." icon="fas fa-id-badge" :actionButtons="[{label: 'Create a new Contribution', color: 'primary', onClick: () => routeTo('proposals/create'), disable: !isMember, disableTooltip: 'You must be a member'}]")
    .row.q-mt-md
      archetypes-widget(:archetypes="daoArchetypes" v-if="daoArchetypes && daoArchetypes.length" compact isMobile="isMobile")
      base-placeholder.full-width(compact v-if="!(daoArchetypes && daoArchetypes.length)" :title="$t('pages.dho.organization.archetypes2')" subtitle="Your organization has no archetypes yet. You can create one by clicking on the button below." icon="fas fa-id-badge" :actionButtons="[{label: 'Create a new archetype', color: 'primary', onClick: () => routeTo('proposals/create'), disable: !this.isMember, disableTooltip: 'You must be a member'}]")
    .row.q-mt-md
      badges-widget.full-width(v-if="daoBadges && daoBadges.length" :badges="daoBadges" compact isMobile="isMobile")
      base-placeholder.full-width(v-if="!(daoBadges && daoBadges.length)" :title="$t('pages.dho.organization.badges2')" subtitle="Your organization has no badges yet. You can create one by clicking on the button below." icon="fas fa-id-badge" :actionButtons="[{label: 'Create a new badge', color: 'primary', onClick: () => routeTo('proposals/create'), disable: !this.isMember, disableTooltip: 'You must be a member'}]")

</template>

<style scoped lang="stylus">
.scroll-metrics-wrapper
  width: 100%
  overflow-x: scroll
.scroll-metrics-wrapper::-webkit-scrollbar
  display: none
.scroll-metrics
  width: 800px

</style>
