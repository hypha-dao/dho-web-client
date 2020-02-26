export default ({ Vue }) => {
  Vue.mixin({
    methods: {
      breadcrumbsTweak () {
        const offset = 105
        return { minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh' }
      }
    }
  })
}
