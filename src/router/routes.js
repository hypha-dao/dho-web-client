
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/roles', component: () => import('pages/Roles.vue') },
      { path: '/members', component: () => import('pages/Members.vue') },
      { path: '/assignments', component: () => import('pages/Assignments.vue') },
      { path: '/payouts', component: () => import('pages/Payouts.vue') }
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
