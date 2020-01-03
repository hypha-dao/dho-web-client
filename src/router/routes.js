
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/members/add', component: () => import('pages/members/add/members-add.vue') },
      { path: '/members/add/success', component: () => import('pages/members/add/success.vue') },
      { path: '/members', component: () => import('pages/members/list/members-list.vue') },
      { path: '/applicants', component: () => import('~/pages/applicants/list/applicants-list.vue') },

      { path: '/@:username', component: () => import('pages/profiles/view/profile-view.vue') },
      { path: '/@:username/edit', component: () => import('pages/profiles/edit/profile-edit.vue') },

      { path: '/proposals', component: () => import('pages/proposals/list/proposals-list.vue') },
      { path: '/proposals/add', component: () => import('pages/proposals/add/proposals-add.vue') },

      { path: '/proposals/roles/add', component: () => import('pages/roles/add/roles-add.vue') },
      { path: '/roles', component: () => import('~/pages/roles/list/roles-list.vue') },
      { path: '/roles/:id', component: () => import('pages/roles/view/role-view.vue') },

      { path: '/proposals/assignments/add', component: () => import('pages/assignments/add/assignments-add.vue') },
      { path: '/assignments', component: () => import('~/pages/assignments/list/assignments-list.vue') },
      { path: '/assignments/:id', component: () => import('pages/assignments/view/assignment-view.vue') },

      { path: '/proposals/payouts/add', component: () => import('pages/payouts/add/payouts-add.vue') },
      { path: '/proposals/:type/:id', component: () => import('pages/proposals/view/proposal-view.vue') }
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
