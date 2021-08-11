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
  }
}
</script>

<template lang="pug">
widget(title="Last votes")
  template(v-for="vote of votes")
    .row.items-center.justify-between
      profile-picture(v-bind="vote.voter" show-name size="32px")
      chips(:tags="[{ color: 'positive', label: vote.vote }]")
</template>
