<script>
export default {
  name: 'voter-list',
  components: {
    Chips: () => import('~/components/common/chips.vue'),
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    votes: {
      type: Array,
      default: () => []
    }
  },

  methods: {
    color (vote) {
      if (vote.vote === 'pass') return 'positive'
      if (vote.vote === 'fail') return 'negative'
      return 'grey-5'
    },

    icon (vote) {
      if (vote.vote === 'pass') return 'fas fa-check-circle'
      if (vote.vote === 'fail') return 'fas fa-times-circle'
      if (vote.vote === 'abstain') return 'fas fa-minus-circle'
      return 'fas fa-minus-circle'
    }
  }
}
</script>

<template lang="pug">
widget(title="Votes")
  template(v-for="vote of votes")
    .row.items-center.justify-between
      profile-picture(:username="vote.username" show-name size="32px")
      q-icon(:name="icon(vote)" :color="color(vote)" size="sm")
</template>
