import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function ({ store }) {
  const scrollPositions = Object.create(null)
  const defaultPath = process.env.APP_DEFAULT_ROUTE || '/hypha/explore'

  const Router = new VueRouter({
    scrollBehavior (to, from, savedPosition) {
      // To fix scrolling up when changing query params
      let element = null
      element = document.getElementById('multi-dho-scroll-area') ? document.getElementById('multi-dho-scroll-area').children[0] : null
      if (element !== null && from.name in scrollPositions) {
        element.scrollTop = scrollPositions[from.name]
      }
      return { x: 0, y: 0 }
    },
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  Router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('autoLogin')
    const isMember = Boolean(localStorage.getItem('isMember'))
    const daoName = to.params.dhoname
    // Temporal redirection for hypha explorer page
    if (to.name && to.name === 'root') {
      next({ path: defaultPath })
    }

    if (to.matched.some(record => record.meta.requiresAuth) || to.matched.some(record => record.meta.requiresAuthMember)) {
      if (!isAuthenticated) {
        next({ path: `/${daoName}/login` })
      } else {
        if (to.matched.some(record => record.meta.requiresAuthMember)) {
          if (isMember) {
            return
          } else {
            next()
          }
        } else {
          // To fix scrolling top when changing query params
          const element = document.getElementById('multi-dho-scroll-area').children[0]
          if (element !== null) {
            scrollPositions[from.name] = element.scrollTop
          }
          next()
        }
      }
      return
    }
    if (to.matched.some(record => record.meta.hideForAuth)) {
      if (isAuthenticated) {
        next({ path: `/${daoName}/` })
      } else {
        next()
      }
      return
    }
    next()
  })

  Router.afterEach((to, from) => {
    const selectedDao = store.getters['dao/selectedDao']
    const title = (selectedDao && selectedDao.title) ? `${to.meta.title} - ${selectedDao.title}` : to.meta.title
    const DEFAULT_TITLE = 'DAO'

    Vue.nextTick(() => {
      document.title = title || DEFAULT_TITLE
    })
  })

  return Router
}
