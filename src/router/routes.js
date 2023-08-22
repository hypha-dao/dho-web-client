import I18n from '../utils/i18n'
const routes = [
  {
    path: '/',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      {
        path: '/',
        name: 'root',
        meta: {
          title: I18n.t('routes.exploreDAOs'),
          subtitle: I18n.t('routes.findOutMoreAboutHowToSetUp')
        },
        component: () => import('pages/dho/Explore.vue')
      }
      // { path: 'alert-manager', component: () => import('pages/alert-manager/alert-manager-form.vue') },
    ]
  },
  {
    path: '/not-found',
    name: 'dao-not-found',
    meta: {
      title: I18n.t('routes.404NotFound')
    },
    component: () => import('pages/Error404DHO.vue')
  },
  {
    path: '/:dhoname',
    component: () => import('layouts/DhoSelector.vue'),
    props: true,
    children: [
      {
        path: 'create-your-dao',
        name: 'create-your-dao',
        meta: {
          title: I18n.t('routes.createYourDao'),
          hideForAuth: false
        },
        component: () => import('pages/onboarding/NLogin.vue')
      },
      {
        path: 'finflow',
        name: 'finflow-tools',
        meta: {
          title: I18n.t('routes.finflow')
        },
        component: () => import('pages/dho/Finflow.vue')
      },
      {
        path: '/',
        name: 'dashboard',
        meta: {
          title: I18n.t('routes.dashboard')
        },
        component: () => import('pages/dho/Home.vue')
      },
      {
        path: 'create',
        name: 'dao-launcher',
        meta: {
          breadcrumbs: {
            tab: {
              name: I18n.t('routes.explore'),
              link: { name: 'explore' }
            }
          },
          layout: {
            desktop: 'default',
            mobile: 'create'
          },
          title: I18n.t('routes.createANewDao')
          // requiresAuth: true,
          // requiresAuthMember: true
        },
        component: () => import('pages/onboarding/create.vue'),
        props: true
      },
      {
        path: 'demo-ipfs',
        name: 'ipfs',
        component: () => import('pages/dho/DemoIpfs.vue')
      },
      {
        path: 'login',
        name: 'login',
        meta: {
          title: I18n.t('routes.login'),
          hideForAuth: true
        },
        component: () => import('pages/onboarding/NLogin.vue')
      },
      {
        path: 'members',
        name: 'members',
        meta: {
          title: I18n.t('routes.members')
        },
        component: () => import('pages/dho/Members.vue')
      },
      {
        path: 'proposals',
        meta: {
          title: I18n.t('routes.proposals')
        },
        component: () => import('pages/proposals/Proposals.vue'),
        children: [
          {
            path: 'create',
            name: 'proposal-create',
            meta: {
              breadcrumbs: {
                tab: {
                  name: I18n.t('routes.dashboard'),
                  link: { name: 'dashboard' }
                }
              },
              props: true,
              requiresAuth: true,
              requiresAuthMember: true,
              title: I18n.t('routes.createProposal')
            },
            component: () => import('pages/proposals/ProposalCreate.vue')
          },
          {
            path: 'history',
            name: 'proposal-history',
            meta: {
              title: I18n.t('routes.proposalHistory'),
              breadcrumbs: {
                tab: {
                  name: I18n.t('routes.proposals'),
                  link: { name: 'proposals' }
                }
              }
            },
            component: () => import('pages/proposals/ProposalHistory.vue')
          },
          {
            path: ':docId',
            name: 'proposal-detail',
            meta: {
              breadcrumbs: {
                tab: {
                  name: I18n.t('routes.proposals'),
                  link: { name: 'proposals' }
                }
              },
              layout: 'proposal',
              title: I18n.t('routes.proposalDetails')
            },
            component: () => import('pages/proposals/ProposalDetail.vue'),
            props: true
          },
          {
            path: '',
            name: 'proposals',
            meta: {
              title: I18n.t('routes.proposals')
            },
            component: () => import('pages/proposals/ProposalList.vue')
          }
        ]
      },
      {
        path: 'organization',
        name: 'organization',
        meta: {
          title: I18n.t('routes.organization')
        },
        component: () => import('pages/dho/Organization.vue')
      },
      {
        path: 'organization/assets/:type',
        name: 'organization/assets',
        meta: {
          title: I18n.t('routes.organizationAssets'),
          breadcrumbs: {
            tab: {
              name: I18n.t('routes.organization'),
              link: { name: 'organization' }
            }
          }
        },
        component: () => import('pages/dho/OrganizationalAssets.vue')
      },
      {
        path: 'organization/assets/badge/:docId',
        name: 'organization/assets/badge',
        meta: {
          title: I18n.t('routes.organizationBadges')
        },
        component: () => import('pages/proposals/ProposalDetail.vue'),
        props: true
      },
      {
        path: 'organization/assets/role/:docId',
        name: 'organization/assets/role',
        meta: {
          title: I18n.t('routes.organizationRoles')
        },
        component: () => import('pages/proposals/ProposalDetail.vue'),
        props: true
      },
      {
        path: 'explore',
        name: 'explore',
        meta: {
          title: I18n.t('routes.exploreDAOs')
        },
        component: () => import('pages/dho/Explore.vue')
      },
      {
        path: '@:username',
        name: 'profile',
        meta: {
          title: I18n.t('routes.profile')
        },
        component: () => import('pages/profiles/Profile.vue'),
        props: true
      },
      {
        path: '@:username/create',
        name: 'profile-creation',
        meta: {
          breadcrumbs: {
            tab: {
              name: I18n.t('routes.dashboard'),
              link: { name: 'dashboard' }
            }
          },
          title: I18n.t('routes.profileCreation'),
          requiresAuth: true,
          requiresAuthMember: true
        },
        component: () => import('pages/profiles/profile-creation.vue'),
        props: true
      },
      {
        path: '@:username/wallet',
        name: 'wallet',
        meta: {
          breadcrumbs: {
            tab: {
              name: I18n.t('routes.dashboard'),
              link: { name: 'dashboard' }
            }
          },
          title: I18n.t('routes.wallet'),
          requiresAuth: true
          // requiresAuthMember: true
        },
        component: () => import('pages/profiles/Wallet.vue'),
        props: true
      },
      {
        path: 'circles/:id',
        name: 'circle',
        meta: {
          breadcrumbs: {
            tab: {
              name: I18n.t('routes.organization'),
              link: 'organization'
            }
          },
          title: I18n.t('routes.circles')
        },
        component: () => import('pages/dho/Circle.vue')

      },
      {
        path: 'search',
        name: 'search',
        meta: {
          breadcrumbs: {
            tab: {
              name: I18n.t('routes.searchResults'),
              link: 'explore'
            }
          },
          title: I18n.t('routes.search')
        },
        component: () => import('pages/search/Results.vue')
      },
      {
        path: 'support',
        name: 'support',
        meta: {
          title: I18n.t('routes.support')
        },
        component: () => import('pages/support/Support.vue')
      },
      {
        path: 'treasury',
        name: 'treasury',
        meta: {
          breadcrumbs: {
            tab: {
              name: I18n.t('routes.organization'),
              link: 'organization'
            }
          },
          title: I18n.t('routes.treasury')
        },
        component: () => import('pages/dho/Treasury.vue')
      },
      {
        path: 'multi-sig',
        name: 'multi-sig',
        meta: {
          breadcrumbs: {
            tab: {
              name: I18n.t('routes.dashboard'),
              link: { name: 'dashboard' }
            }
          },
          title: I18n.t('routes.multiSig')
        },
        component: () => import('pages/dho/MultiSig.vue')
      },
      {
        path: 'configuration',
        name: 'configuration',
        meta: {
          breadcrumbs: {
            tab: {
              name: I18n.t('routes.dashboard'),
              link: { name: 'dashboard' }
            }
          },
          title: I18n.t('routes.configurationSettings')
        },
        component: () => import('pages/dho/Configuration.vue')
      },
      {
        path: 'ecosystem',
        name: 'ecosystem',
        meta: {
          breadcrumbs: {
            tab: {
              name: I18n.t('routes.dashboard'),
              link: { name: 'dashboard' }
            }
          },
          title: I18n.t('routes.ecosystemDashboard')
        },
        component: () => import('pages/dho/Ecosystem.vue')
      },

      {
        path: 'ecosystem/checkout',
        name: 'ecosystem-checkout',
        meta: {
          breadcrumbs: {
            tab: {
              name: I18n.t('routes.dashboard'),
              link: { name: 'dashboard' }
            }
          },
          title: I18n.t('routes.checkout')
        },
        component: () => import('pages/ecosystem/EcosystemChekout.vue')

      },
      {
        path: 'home',
        name: 'dashboard',
        meta: {
          title: I18n.t('routes.dashboard')
        },
        component: () => import('pages/dho/Home.vue')
      },
      {
        path: 'election/:id',
        name: 'election-details',
        meta: {
          title: I18n.t('routes.upvoteElection')
        },
        component: () => import('pages/upvote-election/UpvoteElection.vue')
      },
      {
        path: 'election',
        name: 'election',
        meta: {
          title: I18n.t('routes.election')
        },
        component: () => import('pages/dho/Election.vue')
      },
      {
        path: 'upvote-election',
        name: 'upvote-election',
        meta: {
          breadcrumbs: {
            tab: {
              name: I18n.t('routes.dashboard'),
              link: { name: 'dashboard' }
            }
          },
          title: I18n.t('routes.upvoteElection')
        },
        component: () => import('pages/upvote-election/UpvoteElection.vue')
      },
      {
        path: '*',
        name: '404-not-found',
        meta: {
          title: I18n.t('routes.404NotFound')
        },
        component: () => import('pages/Error404Page.vue')
      }
    ]
  }
]

if (process.env.PPP_ENV === 'test') {
  routes[0].children.push(
    {
      path: '/dev/dao',
      name: 'min-explore',
      component: () => import('~/pages/dho/MinExplore.vue')
    }
  )
}

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
