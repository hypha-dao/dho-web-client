
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // { path: '', component: () => import('pages/dashboard/dashboard.vue') },
      { path: '/roles', component: () => import('pages/roles/roles-list.vue') },
      { path: '/roles/form', component: () => import('pages/roles/role-form.vue') },
      { path: '/roles/proposals', component: () => import('pages/roles/roles-proposals-list.vue') },
      { path: '/roles/history', component: () => import('pages/roles/roles-history-list.vue') },
      { path: '/roles/:id', component: () => import('pages/roles/role-view.vue') },
      { path: '/assignments', component: () => import('pages/assignments/assignments-list.vue') },
      { path: '/proposals/assignments', component: () => import('pages/assignments/proposals-assignments-list.vue') }

      /*
      { path: '/dashboard', component: () => import('pages/dashboard/dashboard.vue') },
      { path: '/proposals', component: () => import('pages/proposals/proposals.vue') },

      { path: '/members', component: () => import('pages/MembersFeed.vue') },
      { path: '/old-roles', component: () => import('pages/RolesFeed.vue') },
      { path: '/old-proposals', component: () => import('pages/ProposalTables.vue') }
      */
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
