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
    onLoad (index, done) {
      this.$emit('loadMore', index, done)
    }
  },

  async mounted () {
    await this.$nextTick()
    this.$refs.scroll?.stop()
  }
}
</script>

<template lang="pug">
.members-list(ref="$refs.scrollContainer")
  div(v-if="!members.length" class="row justify-center q-my-md")
    loading-spinner(color="primary" size="72px")
  q-infinite-scroll(@load="onLoad" :offset=0 :debounce=100  ref="$refs.scroll")
    .row(:class="{'q-mr-md' : view === 'list'}")
      .template(v-for="member in members" :class="{ 'col-6 q-px-xs': $q.screen.md, 'col-4': view === 'card' && !compact, 'col-12': view === 'card' && compact && !$q.screen.md, 'full-width': view === 'list' }").flex.justify-center
          profile-card.q-mb-md(
            :canEnroll="canEnroll"
            :compact="compact"
            :key="member.hash"
            :view="view"
            v-bind="member"
            :style="{width: '100%'}"
            :class="{'q-mr-md' : !compact}"
          )
    template(v-slot:loading)
      .row.justify-center.q-my-md
        loading-spinner(color="primary" size="40px")

</template>
