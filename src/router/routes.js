
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', component: () => import('~/pages/Index.vue'), meta: { single: true } },
      { path: '/welcome', component: () => import('~/pages/onboarding/welcome.vue'), meta: { single: true } },
      { path: '/login', component: () => import('~/pages/onboarding/login.vue'), meta: { single: true } },
      { path: '/register', component: () => import('~/pages/onboarding/register.vue'), meta: { single: true } },
      { path: '/dashboard', component: () => import('~/pages/dashboard/dashboard.vue') },
      { path: '/members/add', component: () => import('pages/members/add/members-add.vue') },
      { path: '/members/add/success', component: () => import('pages/members/add/success.vue') },
      { path: '/members', component: () => import('pages/members/list/members-list.vue') },
      { path: '/applicants', component: () => import('pages/applicants/list/applicants-list.vue') },

      { path: '/@:username', component: () => import('pages/profiles/view/profile-view.vue') },
      { path: '/@:username/edit', component: () => import('pages/profiles/edit/profile-edit.vue') },
      { path: '/wallet', component: () => import('pages/profiles/view/wallet-view.vue') },

      { path: '/proposals/history', component: () => import('pages/proposals/history/proposals-history.vue') },
      { path: '/proposals/history/:type/:status/:username?', component: () => import('pages/proposals/history/proposals-history-filtered.vue') },

      { path: '/proposals/:type/:id?', component: () => import('pages/proposals/list/proposals-list.vue') },

      { path: '/roles', component: () => import('pages/roles/list/roles-list.vue') },

      { path: '/assignments/:username?', component: () => import('pages/assignments/list/assignments-list.vue') },

      { path: '/payouts', component: () => import('pages/payouts/list/payouts-list.vue') },

      { path: '/proposal/:scope/:id', component: () => import('pages/proposals/view/proposal-view.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
