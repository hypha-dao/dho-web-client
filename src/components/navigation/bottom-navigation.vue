<script>
import { NAVIGATION } from '~/const'

export default {
  name: 'bottom-navigation',

  data () {
    return {
      NAVIGATION
    }
  },

  methods: {
    isActive (tab) {
      switch (tab) {
        case NAVIGATION.DASHBOARD: return this.$route.name === NAVIGATION.DASHBOARD
        case NAVIGATION.AGREEMENTS: return this.$route.path.includes(NAVIGATION.AGREEMENTS)
        case NAVIGATION.PEOPLE: return this.$route.path.includes(NAVIGATION.PEOPLE)
        case NAVIGATION.TREASURY: return this.$route.path.includes(NAVIGATION.TREASURY)
        case NAVIGATION.EXPLORE: return this.$route.path.includes(NAVIGATION.EXPLORE)
      }

      return false
    }
  }
}
</script>

<template lang="pug">
.bottom-navigation.full-width.full-height
  .row.justify-evenly
    q-btn.q-my-md(:flat="!isActive(NAVIGATION.DASHBOARD)" unelevated rounded padding="12px" icon="fas fa-home" size="sm" :color="isActive(NAVIGATION.DASHBOARD) ? 'primary' : 'disabled'" :to="{ name: NAVIGATION.DASHBOARD }")
    q-btn.q-my-md(:flat="!isActive(NAVIGATION.AGREEMENTS)" unelevated rounded padding="12px" icon="far fa-file-alt" size="sm" :color="isActive(NAVIGATION.AGREEMENTS) ? 'primary' : 'disabled'" :to="{ name: NAVIGATION.AGREEMENTS }")
    q-btn.q-my-md(:flat="!isActive(NAVIGATION.PEOPLE)" unelevated rounded padding="12px" icon="fas fa-users" size="sm" :color="isActive(NAVIGATION.PEOPLE) ? 'primary' : 'disabled'" :to="{ name: NAVIGATION.PEOPLE }")
    q-btn.q-my-md(:flat="!isActive(NAVIGATION.TREASURY)" unelevated rounded padding="12px" icon="fas fa-building" size="sm" :color="isActive(NAVIGATION.TREASURY) ? 'primary' : 'disabled'" :to="{ name: NAVIGATION.TREASURY }")
    q-btn.q-my-md(:flat="!isActive(NAVIGATION.EXPLORE)" unelevated rounded padding="12px" icon="fas fa-globe" size="sm" :color="isActive(NAVIGATION.EXPLORE) ? 'primary' : 'disabled'" :to="{ name: NAVIGATION.EXPLORE }")

</template>

<style lang="stylus" scoped>
a:hover{
  color: white !important;
}

</style>
