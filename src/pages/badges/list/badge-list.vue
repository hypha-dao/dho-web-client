<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import BadgeCard from '../components/badge-card'

export default {
  name: 'page-badge-list',
  components: { BadgeCard },
  async beforeMount () {
    this.setBreadcrumbs([{ title: 'Badges' }])
    await this.loadBadges()
  },
  computed: {
    ...mapGetters('badges', ['badges'])
  },
  methods: {
    ...mapMutations('layout', ['setBreadcrumbs']),
    ...mapActions('badges', ['loadBadges'])
  }
}
</script>

<template lang="pug">
.row
  badge-card(
    v-for="badge in badges"
    :key="badge.hash"
    :badge="badge"
  )
</template>
