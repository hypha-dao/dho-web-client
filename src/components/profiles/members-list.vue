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
    compact: Boolean
  },
  methods: {
    onLoad (index, done) {
      this.$emit('loadMore', index, done)
    },
    stop () {
      this.$refs.scroll.stop()
    },
    resume () {
      this.$refs.scroll.resume()
    },
    trigger () {
      this.$refs.scroll.trigger()
    }
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
        .col-4.q-mb-md(:class="{'q-pr-md' : !compact, 'full-width': view === 'list' || $q.screen.lt.lg}")
          profile-card(:username="member.username" :joinedDate="member.joinedDate" :isApplicant = "member.isApplicant" :view="view" :key="member.hash" :compact="compact")
    template(v-slot:loading)
      .row.justify-center.q-my-md
        loading-spinner(color="primary" size="40px")

</template>
