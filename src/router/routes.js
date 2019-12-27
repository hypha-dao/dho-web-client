
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/@:username', component: () => import('pages/profiles/view/profile-view.vue') },
      { path: '/@:username/edit', component: () => import('pages/profiles/edit/profile-edit.vue') },

      { path: '/proposals', component: () => import('pages/proposals/list/proposals-list.vue') },
      { path: '/proposals/add', component: () => import('pages/proposals/add/proposals-add.vue') },

      { path: '/proposals/roles/add', component: () => import('pages/roles/add/roles-add.vue') },
      { path: '/roles', component: () => import('~/pages/roles/list/roles-list.vue') },
      { path: '/roles/:id', component: () => import('pages/roles/view/role-view.vue') },

      { path: '/proposals/assignments/add', component: () => import('pages/assignments/add/assignments-add.vue') },
      { path: '/assignments', component: () => import('~/pages/assignments/list/assignments-list.vue') },

      { path: '/proposals/payouts/add', component: () => import('pages/payouts/add/payouts-add.vue') }
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
