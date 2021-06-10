import VueMatomo from 'vue-matomo'

export default ({ Vue, router }) => {
  Vue.use(VueMatomo, {
    host: 'https://track.hypha.earth/',
    siteId: process.env.NODE_ENV === 'production' ? 1 : 2,
    router
  })
}
