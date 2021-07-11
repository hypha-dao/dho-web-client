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
  }
}
</script>

<template lang="pug">
.members-list.row.q-gutter-md
  template(v-for="member in members")
    profile-card(:profile="member" :view="view")
</template>
