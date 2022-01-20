<script>
export default {
  name: 'members-list',
  components: {
    ProfileCard: () => import('./profile-card.vue')
  },

  props: {
    members: {
      type: Array,
      default: () => []
    },
    view: String
  },
  methods: {
    onLoad (index, done) {
      this.$emit('loadMore', index, done)
    }
  }
}
</script>

<template lang="pug">
.members-list.row.q-gutter-md
  q-infinite-scroll(@load="onLoad" :offset="250")
    .row.q-gutter-sm
      template(v-for="member in members")
        profile-card(:username="member.username" :joinedDate="member.joinedDate" :view="view" :key="member.hash")
    template(v-slot:loading)
      .row.justify-center.q-my-md
        q-spinner-dots(color="primary" size="40px")

</template>
