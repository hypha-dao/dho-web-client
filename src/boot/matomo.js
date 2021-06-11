import VueMatomo from 'vue-matomo'

export default ({ Vue, router }) => {
  Vue.use(VueMatomo, {
    host: 'https://track.hypha.earth',
    siteId: 1,
    router
  })
}
