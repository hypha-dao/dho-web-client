<script>
export default {
  name: 'members-list',
  components: {
    ProfileCard: () => import('./profile-card.vue'),
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue')
  },

  props: {
    members: {
      type: Array,
      default: () => []
    },
    view: String,
    compact: Boolean,
    canEnroll: Boolean
  },

  methods: {
    onLoad (index, done) { this.$emit('loadMore', index, done) }
  },

  async mounted () {
    await this.$nextTick()
    this.$refs.scroll?.stop()
  }
}
</script>

<template lang="pug">
.members-list(ref="scrollContainer")
  q-infinite-scroll(@load="onLoad" :offset="compact ? 0 : 250"  ref="scroll")
    .row(:class="{ 'full-width': view === 'list',  }")
      template(v-for="member in members")
        .q-mb-md(:class="{'q-px-xs': $q.screen.sm, 'q-pr-md': $q.screen.gt.sm, 'full-width': view === 'list' || $q.screen.lt.lg && !$q.screen.sm, 'col-6': view === 'card' && $q.screen.sm, 'col-4':!$q.screen.sm}")
          profile-card(
            :canEnroll="canEnroll"
            :compact="compact"
            :key="member.hash"
            :view="view"
            v-bind="member"
          )
    template(v-slot:loading)
      .row.justify-center.q-my-md
        loading-spinner(color="primary" size="40px")

</template>
