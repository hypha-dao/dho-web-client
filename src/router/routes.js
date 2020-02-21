
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', component: () => import('~/pages/dashboard/dashboard.vue') },
      { path: '/members/add', component: () => import('pages/members/add/members-add.vue') },
      { path: '/members/add/success', component: () => import('pages/members/add/success.vue') },
      { path: '/members', component: () => import('pages/members/list/members-list.vue'), meta: { title: 'Members' } },
      { path: '/applicants', component: () => import('pages/applicants/list/applicants-list.vue'), meta: { title: 'Enroll Registrants' } },

      { path: '/@:username', component: () => import('pages/profiles/view/profile-view.vue') },
      { path: '/@:username/edit', component: () => import('pages/profiles/edit/profile-edit.vue') },

      { path: '/proposals/history', component: () => import('pages/proposals/history/proposals-history.vue'), meta: { title: 'Proposals History' } },

      { path: '/proposals/payouts/add', component: () => import('pages/payouts/add/payouts-add.vue') },
      { path: '/proposals/:type/:id?', component: () => import('pages/proposals/list/proposals-list.vue'), meta: { title: 'Vote on Roles' } },

      { path: '/roles', component: () => import('pages/roles/list/roles-list.vue'), meta: { title: 'Apply for Role' } },

      { path: '/assignments', component: () => import('pages/assignments/list/assignments-list.vue') },

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
