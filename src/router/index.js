import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  Router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('autoLogin')
    const isMember = localStorage.getItem('isMember')
    const daoName = to.params.dhoname

    if (to.matched.some(record => record.meta.requiresAuth) || to.matched.some(record => record.meta.requiresAuthMember)) {
      if (!isAuthenticated) {
        next({ path: `/${daoName}/login` })
      } else {
        if (to.matched.some(record => record.meta.requiresAuthMember)) {
          if (!isMember) {
            return
          } else {
            next()
          }
        } else {
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

  return Router
}
