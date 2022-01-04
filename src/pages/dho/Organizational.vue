<script>
import { mapActions } from 'vuex'
export default {
  name: 'dho-overview',
  components: {
    Widget: () => import('~/components/common/widget.vue'),
    MetricLink: () => import('~/components/dashboard/metric-link.vue'),
    CirclesWidget: () => import('~/components/organization/circles-widget.vue'),
    BadgesWidget: () => import('~/components/organization/badges-widget.vue'),
    TreasuryWidget: () => import('~/components/organization/treasury-widget.vue'),
    ArchetypesWidget: () => import('~/components/organization/archetypes-widget.vue'),
    PoliciesWidget: () => import('~/components/organization/policies-widget.vue')
  },
  data () {
    return {
      circles: [
        {
          title: 'Anchor',
          description: 'A lot of things are new but the purpose of the DHO remains the same. Govern decentralized organisations.',
          icon: 'fas fa-anchor'
        },
        {
          title: 'Communication',
          description: 'A lot of things are new but the purpose of the DHO remains the same. Govern decentralized organisations.',
          icon: 'far fa-paper-plane'
        },
        {
          title: 'Financial',
          description: 'A lot of things are new but the purpose of the DHO remains the same. Govern decentralized organisations.',
          icon: 'fas fa-chart-line'
        },
        {
          title: 'Movement building',
          description: 'A lot of things are new but the purpose of the DHO remains the same. Govern decentralized organisations.',
          icon: 'fas fa-bullhorn'
        },
        {
          title: 'People',
          description: 'A lot of things are new but the purpose of the DHO remains the same. Govern decentralized organisations.',
          icon: 'fas fa-user-friends'
        },
        {
          title: 'Product',
          description: 'A lot of things are new but the purpose of the DHO remains the same. Govern decentralized organisations.',
          icon: 'fas fa-cube'
        }
      ],
      badges: [
        {
          title: 'Lamp lighter',
          description: 'A lot of things are new but the purpose of the DHO remains the same. Govern decentralized organisations.',
          icon: 'far fa-lightbulb',
          users: [
            {
              name: 'Juan Carlos',
              avatar: undefined
            },
            {
              name: 'Leonie Herma',
              avatar: undefined
            },
            {
              name: 'Luke Gravity',
              avatar: undefined
            }
          ],
          badgeHoldersNumber: '6'
        },
        {
          title: 'Moderator',
          description: 'A lot of things are new but the purpose of the DHO remains the same. Govern decentralized organisations.',
          icon: 'far fa-comments',
          users: [
            {
              name: 'Jose Julio',
              avatar: undefined
            },
            {
              name: 'Julion',
              avatar: undefined
            },
            {
              name: 'Cesar Augusto',
              avatar: undefined
            }
          ],
          badgeHoldersNumber: '2'
        },
        {
          title: 'Ambassador',
          description: 'A lot of things are new but the purpose of the DHO remains the same. Govern decentralized organisations.',
          icon: 'fas fa-medal',
          users: [
            {
              name: 'Massimo',
              avatar: undefined
            },
            {
              name: 'Jose Maria',
              avatar: undefined
            },
            {
              name: 'Max Gravity',
              avatar: undefined
            }
          ],
          badgeHoldersNumber: '5'
        }
      ],
      treasuryTokens: [],
      archetypes: [
        {
          icon: 'far fa-lightbulb',
          title: 'Researching and Architecting'
        },
        {
          icon: 'far fa-lightbulb',
          title: 'Storytelling and Communicating'
        },
        {
          icon: 'far fa-lightbulb',
          title: 'Building and Developing'
        }
      ],
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
  async mounted () {
    this.getTreasuryTokens()
  },
  methods: {
    ...mapActions('treasury', ['getSupply']),
    async getTreasuryTokens () {
      try {
        const tokens = await this.getSupply()
        this.treasuryTokens = Object.entries(tokens).map(token => {
          let logo
          switch (token[0]) {
            case 'husd':
              logo = require('~/assets/icons/husd.svg')
              break
            case 'seeds':
              logo = require('~/assets/icons/seeds.png')
              break
            case 'hypha':
              logo = require('~/assets/icons/hypha.svg')
              break
            default:
              logo = undefined
              break
          }
          return {
            tokenName: token[0],
            amount: token[1],
            logo
          }
        })
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>

<template lang="pug">
.dho-overview
  treasury-widget(:tokens="treasuryTokens")
  .row.full-width
    .col-9.q-px-sm.q-my-md
      .row.full-width
        .col.q-pr-sm
          metric-link(amount="26" link="treasury" title="Active assignments" icon="fas fa-coins")
        .col.q-pr-sm
          metric-link(amount="15" link="treasury" title="Active quests" icon="fas fa-coins")
        .col.q-pr-sm
          metric-link(amount="32" link="treasury" title="Recent payouts" icon="fas fa-coins")
        .col.q-pr-sm
          metric-link(amount="18" link="treasury" title="Active badges" icon="fas fa-coins")
        .col.q-pr-sm
          metric-link(amount="5" link="treasury" title="Recent strategies" icon="fas fa-coins")
      .row.q-my-md
        circles-widget(:circles="circles")
      .row.q-my-md
        badges-widget(:badges="badges")
    .col-3.relative-position.q-my-md.q-pl-sm
      archetypes-widget(:archetypes="archetypes")
      policies-widget.q-my-md(:policies="policies")
</template>
