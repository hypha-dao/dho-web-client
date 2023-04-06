<script>
import { mapActions, mapGetters } from 'vuex'
import { date, openURL } from 'quasar'
import { daoRouting } from '~/mixins/dao-routing'
import ipfsy from '~/utils/ipfsy'

export default {
  name: 'dho-overview',
  mixins: [daoRouting],
  components: {
    Widget: () => import('~/components/common/widget.vue'),
    MetricLink: () => import('~/components/dashboard/metric-link.vue'),
    CirclesWidget: () => import('~/components/organization/circles-widget.vue'),
    BadgesWidget: () => import('~/components/organization/badges-widget.vue'),
    TreasuryWidget: () => import('~/components/organization/treasury-widget.vue'),
    ArchetypesWidget: () => import('~/components/organization/archetypes-widget.vue'),
    PoliciesWidget: () => import('~/components/organization/policies-widget.vue'),
    BasePlaceholder: () => import('~/components/placeholders/base-placeholder.vue'),
    BaseBanner: () => import('~/components/common/base-banner.vue'),
    BadgesAssignmentsWidget: () => import('~/components/organization/badge-assignments-widget.vue'),
    RoleAssignmentsWidget: () => import('~/components/organization/role-assignments-widget.vue'),
    PayoutsWidget: () => import('~/components/organization/payouts-widget.vue')

  },
  data () {
    return {
      isShowingOrganizationalBanner: true,
      circles: [
        {
          title: 'Anchor',
          description: 'A lot of things are new but the purpose of the DAO remains the same. Govern decentralized organisations.',
          icon: 'fas fa-anchor'
        },
        {
          title: 'Communication',
          description: 'A lot of things are new but the purpose of the DAO remains the same. Govern decentralized organisations.',
          icon: 'far fa-paper-plane'
        },
        {
          title: 'Financial',
          description: 'A lot of things are new but the purpose of the DAO remains the same. Govern decentralized organisations.',
          icon: 'fas fa-chart-line'
        },
        {
          title: 'Movement building',
          description: 'A lot of things are new but the purpose of the DAO remains the same. Govern decentralized organisations.',
          icon: 'fas fa-bullhorn'
        },
        {
          title: 'People',
          description: 'A lot of things are new but the purpose of the DAO remains the same. Govern decentralized organisations.',
          icon: 'fas fa-user-friends'
        },
        {
          title: 'Product',
          description: 'A lot of things are new but the purpose of the DAO remains the same. Govern decentralized organisations.',
          icon: 'fas fa-cube'
        }
      ],
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
      ],
      finalDate: date.formatDate(new Date(), 'YYYY-MM-DDTHH:mm:ss.SZ'),
      initDate: date.formatDate(date.subtractFromDate(new Date(), { days: 7 }), 'YYYY-MM-DDTHH:mm:ss.SZ')
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
        return data.getDao.role.map(role => {
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
        const { count } = data.getDao.payoutAggregate
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
        title: this.daoSettings.organisationTitle,
        description: this.daoSettings.organisationParagraph,
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
  base-banner(
    :compact="!$q.screen.gt.sm"
    @onClose="hideOrganizationalBanner"
    :split="$q.screen.gt.md"
    v-bind="banner"
    v-if="isShowingOrganizationalBanner"
  )
    template(v-slot:buttons)
      q-btn.q-px-lg.h-btn1(
        @click="openDocumentation"
        color="secondary"
        label="Documentation"
        no-caps
        rounded
        unelevated
      )

  treasury-widget.q-mt-md(v-if="!$q.screen.md" :vertical="!$q.screen.gt.sm" :daoLogo="daoSettings.logo" :tokens="treasuryTokens" more @more-clicked="$router.push({name: 'treasury', params: { dhoname: $route.params.dhoname}})")
  //- Desktop
  .row.full-width(v-if="$q.screen.gt.md")
    .col-9.q-gutter-md
      .row.full-width.q-gutter-md
        .col
          metric-link(:amount="activeAssignments" title="Active assignments" icon="fas fa-coins" :link="{ link: 'search', query: { q: '', filter: 'Active', type: '4' } }")
        .col
          metric-link(:amount="recentPayouts" title="Payouts" icon="fas fa-coins" :link="daoSettings.isHypha ? 'treasury': null")
        .col
          metric-link(:amount="activeBadges" title="Active badges" icon="fas fa-coins" :link="{ link: 'organization/assets', params: { type: 'badge' } }")
        //- .col.q-pr-sm
          //- metric-link(amount="5" link="treasury" title="Recent strategies" icon="fas fa-coins")
      //- .row.q-my-md
      //-   circles-widget(:circles="circles")
      //- .row
        badges-widget(v-if="daoBadges && daoBadges.length" :badges="daoBadges").full-width
        base-placeholder(v-if="!(daoBadges && daoBadges.length)" title= "Badges" subtitle="Your organization has no badges yet. You can create one by clicking on the button below."
          icon= "fas fa-id-badge" :actionButtons="[{label: 'Create a new badge', color: 'primary', onClick: () => $router.push(`/${this.selectedDao.name}/proposals/create`), disable: !this.isMember, disableTooltip: 'You must be a member'}]" ).full-width
      //- .row
      //-   badges-assignments-widget(:assignments="daoBadgeAssignments")
      //-     template(v-slot:empty)
      //-       base-placeholder(subtitle="Your organization has no badges assignments yet. You can create one by clicking on the button below."
      //-         icon= "fas fa-id-badge" :actionButtons="[{label: 'Create a new badge assignment', color: 'primary', onClick: () => $router.push(`/${selectedDao.name}/proposals/create`), disable: !isMember, disableTooltip: 'You must be a member'}]" ).full-width.no-padding
      .row
        role-assignments-widget(:assignments="daoRoleAssignments")
          template(v-slot:empty)
            base-placeholder(subtitle="Your organization has no role assignments yet. You can create one by clicking on the button below."
              icon= "fas fa-id-badge" :actionButtons="[{label: 'Create a new role assignment', color: 'primary', onClick: () => routeTo('proposals/create'), disable: !isMember, disableTooltip: 'You must be a member'}]" ).full-width.no-padding
      .row
        payouts-widget(:payouts="daoPayouts")
          template(v-slot:empty)
            base-placeholder(subtitle="Your organization has no payouts yet. You can create one by clicking on the button below."
              icon= "fas fa-id-badge" :actionButtons="[{label: 'Create a new Contribution', color: 'primary', onClick: () => routeTo('proposals/create'), disable: !isMember, disableTooltip: 'You must be a member'}]" ).full-width.no-padding
    .col-3.q-ml-md.q-mt-md
      .row
        archetypes-widget(:archetypes="daoArchetypes" v-if="daoArchetypes && daoArchetypes.length")
        base-placeholder(compact v-if="!(daoArchetypes && daoArchetypes.length)" title= "Archetypes" subtitle="Your organization has no archetypes yet. You can create one by clicking on the button below."
          icon= "fas fa-id-badge" :actionButtons="[{label: 'Create a new archetype', color: 'primary', onClick: () => routeTo('proposals/create'), disable: !this.isMember, disableTooltip: 'You must be a member'}]" ).full-width
      .row.q-mt-xl
        badges-widget(v-if="daoBadges && daoBadges.length" :badges="daoBadges" compact).full-width
        base-placeholder(v-if="!(daoBadges && daoBadges.length)" title= "Badges" subtitle="Your organization has no badges yet. You can create one by clicking on the button below."
          icon= "fas fa-id-badge" :actionButtons="[{label: 'Create a new badge', color: 'primary', onClick: () => routeTo('proposals/create'), disable: !this.isMember, disableTooltip: 'You must be a member'}]" ).full-width
      //- policies-widget.q-my-md(:policies="policies")
  //- Tablet
  .row.full-width(v-else-if="$q.screen.md").q-col-gutter-mdsd
    .col-6.q-gutter-y-md.q-pr-xs.q-pt-md
      treasury-widget.q-mt-md(:vertical="!$q.screen.gt.md" :daoLogo="daoSettings.logo" :tokens="treasuryTokens" more @more-clicked="$router.push({name: 'treasury', params: { dhoname: $route.params.dhoname}})").full-width
      archetypes-widget(:archetypes="daoArchetypes" v-if="daoArchetypes && daoArchetypes.length" compact isMobile)
      base-placeholder(compact v-if="!(daoArchetypes && daoArchetypes.length)" title= "Archetypes" subtitle="Your organization has no archetypes yet. You can create one by clicking on the button below."
        icon= "fas fa-id-badge" :actionButtons="[{label: 'Create a new archetype', color: 'primary', onClick: () => routeTo('proposals/create'), disable: !this.isMember, disableTooltip: 'You must be a member'}]" ).full-width
      badges-widget(v-if="daoBadges && daoBadges.length" :badges="daoBadges" compact isMobile).full-width
      base-placeholder(v-if="!(daoBadges && daoBadges.length)" title= "Badges" subtitle="Your organization has no badges yet. You can create one by clicking on the button below."
        icon= "fas fa-id-badge" :actionButtons="[{label: 'Create a new badge', color: 'primary', onClick: () => routeTo('proposals/create'), disable: !this.isMember, disableTooltip: 'You must be a member'}]" ).full-width
    .col-6.q-gutter-y-md.q-pl-xs.q-pt-md
      metric-link(:amount="activeAssignments" title="Active assignments" icon="fas fa-coins" :link="{ link: 'search', query: { q: '', filter: 'Active', type: '4' } }").full-width
      metric-link(:amount="recentPayouts" title="Payouts" icon="fas fa-coins" :link="daoSettings.isHypha ? 'treasury': null").full-width
      metric-link(:amount="activeBadges" title="Active badges" icon="fas fa-coins" :link="{ link: 'organization/assets', params: { type: 'badge' } }").full-width
      role-assignments-widget(:assignments="daoRoleAssignments" compact isMobile)
        template(v-slot:empty)
          base-placeholder(subtitle="Your organization has no role assignments yet. You can create one by clicking on the button below."
            icon= "fas fa-id-badge" :actionButtons="[{label: 'Create a new role assignment', color: 'primary', onClick: () => routeTo('proposals/create'), disable: !isMember, disableTooltip: 'You must be a member'}]" ).full-width.no-padding
      payouts-widget(:payouts="daoPayouts" compact isMobile)
        template(v-slot:empty)
          base-placeholder(subtitle="Your organization has no payouts yet. You can create one by clicking on the button below."
            icon= "fas fa-id-badge" :actionButtons="[{label: 'Create a new Contribution', color: 'primary', onClick: () => routeTo('proposals/create'), disable: !isMember, disableTooltip: 'You must be a member'}]" ).full-width.no-padding
  //- Mobile
  .full-width(v-else)
    .scroll-metrics-wrapper
      .row.q-mt-md.scroll-metrics
        .col.q-mx-xs
          metric-link(:amount="activeAssignments" title="Active assignments" icon="fas fa-coins" :link="{ link: 'search', query: { q: 'Assignment', filter: 'Active', type: '6' } }")
        .col.q-mx-xs
          metric-link(:amount="recentPayouts" title="Payouts" icon="fas fa-coins" :link="daoSettings.isHypha ? 'treasury': null")
        .col.q-mx-xs
          metric-link(:amount="activeBadges" title="Active badges" icon="fas fa-coins" :link="{ link: 'organization/assets', params: { type: 'badge' } }")
    .row.q-mt-md
      role-assignments-widget(:assignments="daoRoleAssignments" compact isMobile)
        template(v-slot:empty)
          base-placeholder(subtitle="Your organization has no role assignments yet. You can create one by clicking on the button below."
            icon= "fas fa-id-badge" :actionButtons="[{label: 'Create a new role assignment', color: 'primary', onClick: () => routeTo('proposals/create'), disable: !isMember, disableTooltip: 'You must be a member'}]" ).full-width.no-padding
    .row.q-mt-md
      payouts-widget(:payouts="daoPayouts" compact isMobile)
        template(v-slot:empty)
          base-placeholder(subtitle="Your organization has no payouts yet. You can create one by clicking on the button below."
            icon= "fas fa-id-badge" :actionButtons="[{label: 'Create a new Contribution', color: 'primary', onClick: () => routeTo('proposals/create'), disable: !isMember, disableTooltip: 'You must be a member'}]" ).full-width.no-padding
    .row.q-mt-md
      archetypes-widget(:archetypes="daoArchetypes" v-if="daoArchetypes && daoArchetypes.length" compact isMobile)
      base-placeholder(compact v-if="!(daoArchetypes && daoArchetypes.length)" title= "Archetypes" subtitle="Your organization has no archetypes yet. You can create one by clicking on the button below."
        icon= "fas fa-id-badge" :actionButtons="[{label: 'Create a new archetype', color: 'primary', onClick: () => routeTo('proposals/create'), disable: !this.isMember, disableTooltip: 'You must be a member'}]" ).full-width
    .row.q-mt-md
      badges-widget(v-if="daoBadges && daoBadges.length" :badges="daoBadges" compact isMobile).full-width
      base-placeholder(v-if="!(daoBadges && daoBadges.length)" title= "Badges" subtitle="Your organization has no badges yet. You can create one by clicking on the button below."
        icon= "fas fa-id-badge" :actionButtons="[{label: 'Create a new badge', color: 'primary', onClick: () => routeTo('proposals/create'), disable: !this.isMember, disableTooltip: 'You must be a member'}]" ).full-width
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
