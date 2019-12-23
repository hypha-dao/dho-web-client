
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // { path: '', component: () => import('pages/dashboard/dashboard.vue') },
      { path: '/roles/form', component: () => import('pages/roles/role-form.vue') },
      { path: '/roles/:id', component: () => import('pages/roles/role-view.vue') },
      { path: '/assignments', component: () => import('pages/assignments/assignments-list.vue') },
      { path: '/proposals/assignments', component: () => import('pages/assignments/proposals-assignments-list.vue') },

      { path: '/@:username', component: () => import('pages/profiles/view/profile-view.vue') },
      { path: '/@:username/edit', component: () => import('pages/profiles/edit/profile-edit.vue') },
      { path: '/proposals', component: () => import('pages/proposals/list/proposals-list.vue') },
      { path: '/proposals/add', component: () => import('pages/proposals/add/proposals-add.vue') },
      { path: '/proposals/roles/add', component: () => import('pages/roles/add/roles-add.vue') },
      { path: '/roles', component: () => import('~/pages/roles/list/roles-list.vue') }
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
