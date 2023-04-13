export const screenSizes = {
  computed: {
    isMobile () {
      return !this.$q.screen.gt.sm
    },

    isTabletOrGreater () {
      return this.$q.screen.gt.sm
    },

    isTablet () {
      return !this.$q.screen.gt.md
    },

    isDesktop () {
      return this.$q.screen.gt.md
    }
  }
}
