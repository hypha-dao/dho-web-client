
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
      { name: 'profile', path: '@:username', component: () => import('pages/profiles/Profile.vue'), props: true },
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
    path: '/bm',
    component: () => import('layouts/MultiDhoLayout.vue'),
    children: [
      {
        path: 'members',
        component: () => import('pages/members/Members.vue')
      },
      {
        path: 'proposals',
        component: () => import('pages/proposals/Proposals.vue'),
        children: [
          {
            path: 'create',
            component: () => import('pages/proposals/ProposalCreate.vue')
          },
          {
            path: ':uuid',
            component: () => import('pages/proposals/ProposalDetail.vue'),
            props: true
          },
          {
            path: '',
            name: 'active-proposals',
            component: () => import('pages/proposals/ActiveProposals.vue')
          }
        ]
      },
      {
        path: 'organization',
        component: () => import('pages/dho/Overview.vue')
      },
      { path: 'activity', component: () => import('pages/activity/Activity.vue') },
      { path: '@:username', component: () => import('pages/profiles/Profile.vue'), props: true },
      { path: 'wallet', component: () => import('pages/profiles/Payments.vue') },

      { path: 'archetypes', component: () => import('pages/roles/Apply.vue') },
      { path: 'search', component: () => import('pages/search/Results.vue') },
      { path: 'support', component: () => import('pages/support/Support.vue') },
      { path: 'treasury', component: () => import('pages/treasury/treasury.vue') },
      {
        path: '',
        name: 'dho-home',
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
