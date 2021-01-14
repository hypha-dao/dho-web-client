<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import BadgeCard from '../components/badge-card'

export default {
  name: 'page-badge-list',
  components: { BadgeCard },
  data () {
    return {
      pagination: {
        first: 10,
        offset: 0
      },
      loaded: false
    }
  },
  async beforeMount () {
    this.clearBadges()
    this.setBreadcrumbs([{ title: 'Badges' }])
  },
  computed: {
    ...mapGetters('badges', ['badges'])
  },
  methods: {
    ...mapMutations('layout', ['setBreadcrumbs']),
    ...mapMutations('badges', ['clearBadges']),
    ...mapActions('badges', ['loadBadges']),
    async onLoad (index, done) {
      this.loaded = await this.loadBadges(this.pagination)
      if (!this.loaded) {
        this.pagination.offset += this.pagination.first
      }
      done()
    }
  }
}
</script>

<template lang="pug">
q-infinite-scroll(
  :disable="loaded"
  @load="onLoad"
  :offset="250"
)
  .row
    badge-card(
      v-for="badge in badges"
      :key="badge.hash"
      :badge="badge"
    )
  template(v-slot:loading)
    .row.justify-center.q-my-md
      q-spinner-dots(
        color="primary"
        size="40px"
      )
</template>
