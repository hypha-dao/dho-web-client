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
    canEnroll: Boolean,
    compact: Boolean,
    loading: Boolean,
    view: {
      type: String,
      default: 'card'
    }
  },

  methods: {
    onLoad (index, done) {
      this.$emit('loadMore', index, done)
    }
  }

}
</script>

<template lang="pug">
.members-list
  .row.justify-center.q-my-md(v-if="loading")
    loading-spinner(color="primary" size="72px")
  .row.justify-center.q-my-md(v-if="!loading && members?.length === 0")
    .h-b4 {{ $t('profiles.members-list.noMembersAt') }}
  q-infinite-scroll(@load="onLoad" :offset="1000")
    .row(:class="{'q-mr-md' : view === 'list'}")
      .template.flex.justify-center(
        v-for="member in members"
        :class="{ 'col-6 q-px-xs': $q.screen.md, 'col-4': view === 'card' && !compact, 'col-12': view === 'card' && compact && !$q.screen.md, 'full-width': view === 'list' }")
        profile-card.q-mb-md(
          :canEnroll="canEnroll"
          :class="{'q-mr-md' : !compact}"
          :compact="compact"
          :key="member.hash"
          :style="{width: '100%'}"
          :view="view"
          v-bind="member"
        )

</template>
