
const routes = [
  {
    path: '/',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      {
        path: '/',
        component: () => import('pages/dho/Explore.vue'),
        meta: {
          title: 'Explore all DAOs in the Hypha Universe',
          subtitle: 'Find out more about how to set up your own DAO and Hypha here: https://hypha.earth'
        }
      }
      // { path: 'alert-manager', component: () => import('pages/alert-manager/alert-manager-form.vue') },
    ]
  },
  {
    path: '/not-found',
    name: 'dao-not-found',
    component: () => import('pages/Error404DHO.vue')
  },
  {
    path: '/:dhoname',
    component: () => import('layouts/DhoSelector.vue'),
    props: true,
    children: [
      {
        path: '/',
        name: 'dashboard',
        meta: {
          title: 'Dashboard'
        },
        component: () => import('pages/dho/Home.vue')
      },
      {
        path: 'create',
        name: 'dho-creation',
        meta: {
          breadcrumbs: {
            tab: {
              name: 'Explore',
              link: { name: 'explore' }
            }
          },
          title: 'Create a new DHO'
          // requiresAuth: true
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
          hideForAuth: true
        },
        component: () => import('pages/onboarding/NLogin.vue')
      },
      {
        path: 'members',
        name: 'members',
        meta: {
          title: 'Members'
        },
        component: () => import('pages/dho/Members.vue')
      },
      {
        path: 'proposals',
        component: () => import('pages/proposals/Proposals.vue'),
        children: [
          {
            path: 'create',
            name: 'proposal-create',
            meta: {
              breadcrumbs: {
                tab: {
                  name: 'Dashboard',
                  link: { name: 'dashboard' }
                }
              },
              props: true,
              requiresAuth: true,
              requiresAuthMember: true
              // title: 'Create New Proposal'
            },
            component: () => import('pages/proposals/ProposalCreate.vue')
          },
          {
            path: ':docId',
            name: 'proposal-detail',
            meta: {
              breadcrumbs: {
                tab: {
                  name: 'Proposals',
                  link: { name: 'proposals' }
                }
              },
              layout: 'proposal',
              title: 'Proposal Details'
            },
            component: () => import('pages/proposals/ProposalDetail.vue'),
            props: true
          },
          {
            path: '',
            name: 'proposals',
            meta: {
              title: 'Proposals'
            },
            component: () => import('pages/proposals/ProposalList.vue')
          }
        ]
      },
      {
        path: 'organization',
        name: 'organization',
        meta: {
          title: 'Organization'
        },
        component: () => import('pages/dho/Organizational.vue')
      },
      {
        path: 'organization/assets/:type',
        name: 'organization/assets',
        component: () => import('pages/dho/OrganizationalAssets.vue')
      },
      {
        path: 'organization/assets/badge/:docId',
        name: 'organization/assets/badge',
        component: () => import('pages/proposals/ProposalDetail.vue'),
        props: true
      },
      {
        path: 'organization/assets/role/:docId',
        name: 'organization/assets/role',
        component: () => import('pages/proposals/ProposalDetail.vue'),
        props: true
      },
      {
        path: 'explore',
        name: 'explore',
        meta: {
          status: 'red',
          title: 'Explore'
        },
        component: () => import('pages/dho/Explore.vue')
      },
      {
        path: '@:username',
        name: 'profile',
        meta: {
          status: 'yellow',
          title: 'Profile'
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
              name: 'Dashboard',
              link: { name: 'dashboard' }
            }
          },
          title: 'Profile creation',
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
              name: 'Dashboard',
              link: { name: 'dashboard' }
            }
          },
          title: 'Wallet',
          requiresAuth: true,
          requiresAuthMember: true
        },
        component: () => import('pages/profiles/Wallet.vue'),
        props: true
      },
      {
        path: 'circles',
        name: 'circles',
        meta: {
          breadcrumbs: {
            tab: {
              name: 'Organization',
              link: 'organization'
            }
          },
          status: 'red',
          title: 'Circles'
        },
        component: () => import('pages/dho/Circles.vue')
      },
      // This Code was temporal commented for MVP
      {
        path: 'search',
        name: 'search',
        meta: {
          breadcrumbs: {
            tab: {
              name: 'Search results',
              link: 'explore'
            }
          },
          status: 'red',
          title: 'Search'
        },
        component: () => import('pages/search/Results.vue')
      },
      {
        path: 'support',
        name: 'support',
        meta: {
          title: 'Support'
        },
        component: () => import('pages/support/Support.vue')
      },
      {
        path: 'treasury',
        name: 'treasury',
        meta: {
          breadcrumbs: {
            tab: {
              name: 'Organization',
              link: 'organization'
            }
          },
          status: 'yellow',
          title: 'Treasury'
        },
        component: () => import('pages/treasury/treasury.vue')
      },
      {
        path: 'multi-sig',
        name: 'multi-sig',
        meta: {
          breadcrumbs: {
            tab: {
              name: 'Dashboard',
              link: { name: 'dashboard' }
            }
          },
          title: 'Multi sig'
        },

        component: () => import('pages/dho/MultiSig.vue')
      },

      {
        path: 'configuration',
        name: 'configuration',
        meta: {
          breadcrumbs: {
            tab: {
              name: 'Dashboard',
              link: { name: 'dashboard' }
            }
          },
          title: 'Configuration settings'
        },

        component: () => import('pages/dho/Configuration.vue')
      },

      {
        path: 'home',
        name: 'dashboard',
        meta: {
          title: 'Dashboard'
        },
        component: () => import('pages/dho/Home.vue')
      },
      {
        path: '*',
        name: '404-not-found',
        meta: {
          title: 'Error page'
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
