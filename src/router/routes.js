
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/dashboard/dashboard.vue') },
      { path: 'dashboard', component: () => import('pages/dashboard/dashboard.vue') },
      { path: 'alert-manager', component: () => import('pages/alert-manager/alert-manager-form.vue') },
      // { path: 'members/add', component: () => import('pages/members/add/members-add.vue') },
      // { path: 'members/add/success', component: () => import('pages/members/add/success.vue') },
      { path: 'members', component: () => import('pages/members/list/members-list.vue') },
      { path: 'applicants', component: () => import('pages/applicants/list/applicants-list.vue') },
      { path: 'old/@:username', component: () => import('pages/profiles/view/profile-view.vue') },
      { path: '@:username', component: () => import('pages/profiles/Profile.vue'), props: true },
      { path: '@:username/edit', component: () => import('pages/profiles/edit/profile-edit.vue') },
      { path: 'old/wallet', component: () => import('pages/profiles/view/wallet-view.vue') },
      { path: 'wallet', component: () => import('pages/profiles/Payments.vue') },
      { path: 'roles', component: () => import('pages/roles/Apply.vue') },
      { path: 'treasury', component: () => import('pages/treasury/treasury.vue') },
      { path: 'multi-sig', component: () => import('pages/multi-sig/multi-sig-list.vue') },
      { path: 'documents-proposal/:type/:user?', component: () => import('pages/documents-proposal/list.vue') },
      { path: 'documents/:type/:user?', component: () => import('pages/documents/list.vue') }
    ]
  },
  {
    path: '/preview',
    component: () => import('layouts/MultiDhoLayout.vue'),
    children: [
      {
        path: 'demo-ipfs',
        name: 'ipfs',
        component: () => import('pages/dho/DemoIpfs.vue')
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/onboarding/NLogin.vue')
      },
      {
        path: 'members',
        name: 'members',
        meta: {
          breadcrumbs: {
            tab: {
              name: 'Members'
            }
          }
        },
        component: () => import('pages/members/Members.vue')
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
                  name: 'Proposals',
                  link: 'active-proposals'
                },
                detail: {
                  name: 'Create New Proposal'
                }
              }
            },
            component: () => import('pages/proposals/ProposalCreate.vue')
          },
          {
            path: ':hash',
            name: 'proposal-detail',
            meta: {
              breadcrumbs: {
                tab: {
                  name: 'Proposals',
                  link: 'active-proposals'
                },
                detail: {
                  name: 'Proposal Details'
                }
              }
            },
            component: () => import('pages/proposals/ProposalDetail.vue'),
            props: true
          },
          {
            path: '',
            name: 'active-proposals',
            meta: {
              breadcrumbs: {
                tab: {
                  name: 'Proposals'
                }
              }
            },
            component: () => import('pages/proposals/ActiveProposals.vue')
          }
        ]
      },
      {
        path: 'organization',
        name: 'organization',
        meta: {
          breadcrumbs: {
            tab: {
              name: 'Organization'
            }
          }
        },
        component: () => import('pages/dho/Organizational.vue')
      },
      {
        path: 'activity',
        name: 'activity',
        component: () => import('pages/activity/Activity.vue')
      },
      {
        path: '@:username',
        name: 'profile',
        meta: {
          status: 'yellow'
        },
        component: () => import('pages/profiles/Profile.vue'),
        props: true
      },
      {
        path: 'wallet',
        name: 'wallet',
        meta: {
          status: 'yellow'
        },
        component: () => import('pages/profiles/Payments.vue')
      },
      {
        path: 'archetypes',
        name: 'archetypes',
        meta: {
          status: 'yellow'
        },
        component: () => import('pages/roles/Apply.vue')
      },
      { path: 'search', component: () => import('pages/search/Results.vue') },
      { path: 'support', component: () => import('pages/support/Support.vue') },
      {
        path: 'treasury',
        name: 'treasury',
        meta: {
          status: 'yellow',
          breadcrumbs: {
            tab: {
              name: 'Organization',
              link: 'organization'
            },
            detail: {
              name: 'Treasury'
            }
          }
        },
        component: () => import('pages/treasury/treasury.vue')
      },
      {
        path: 'multi-sig',
        name: 'multi-sig',
        meta: {
          status: 'yellow'
        },
        component: () => import('pages/multi-sig/multi-sig-list.vue')
      },
      {
        path: '',
        name: 'dho-home',
        meta: {
          breadcrumbs: {
            tab: {
              name: 'Dashboard'
            }
          }
        },
        component: () => import('pages/dho/Home.vue')
      }
    ]
  },
  { path: '/welcome', component: () => import('pages/onboarding/welcome.vue') },
  { path: '/login', component: () => import('pages/onboarding/login.vue') },
  { path: '/register', component: () => import('pages/onboarding/register.vue') },
  { path: '/error', component: () => import('pages/onboarding/down.vue') }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
