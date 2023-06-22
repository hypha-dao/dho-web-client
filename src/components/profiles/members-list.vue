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
    canEnroll: Boolean,
    lastResult: Object
  },

  methods: {
    onLoad (index, done) {
      this.$emit('loadMore', index, done)
    }
  },

  async mounted () {
    await this.$nextTick()
  }
}
</script>

<template lang="pug">
.members-list(ref="scrollContainer")
  .row.justify-center.q-my-md(v-if="!lastResult")
    loading-spinner(color="primary" size="72px")
  .row.justify-center.q-my-md(v-if="!members.length && lastResult")
    .h-b4 {{ $t('profiles.members-list.noMembersAt') }}
  q-infinite-scroll(@load="onLoad" :offset="0" :debounce="100" ref="scroll")
    .row(:class="{'q-mr-md' : view === 'list'}")
      .template.flex.justify-center(v-for="member in members" :class="{ 'col-6 q-px-xs': $q.screen.md, 'col-4': view === 'card' && !compact, 'col-12': view === 'card' && compact && !$q.screen.md, 'full-width': view === 'list' }")
        profile-card.q-mb-md(:canEnroll="canEnroll" :compact="compact" :key="member.hash" :view="view" v-bind="member" :style="{width: '100%'}" :class="{'q-mr-md' : !compact}")
    template(v-slot:loading)
      .row.justify-center.q-my-md
        loading-spinner(color="primary" size="40px")

</template>
