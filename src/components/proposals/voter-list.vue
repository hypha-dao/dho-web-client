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

  computed: {
    pages () {
      return Math.floor(this.votes.length / 5) + 1
    },

    paginatedVotes () {
      return this.votes.slice((this.page - 1) * 5, this.page * 5)
    }
  },

  data () {
    return {
      page: 1
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
    },

    tag (vote) {
      if (vote.vote === 'pass') {
        return {
          label: 'Yes',
          color: 'positive'
        }
      }
      if (vote.vote === 'fail') {
        return {
          label: 'No',
          color: 'negative'
        }
      }
      if (vote.vote === 'abstain') {
        return {
          label: 'Abstain',
          color: 'grey-5'
        }
      }
      return null
    }
  }
}
</script>

<template lang="pug">
widget(:title="`Votes (${votes.length})`")
  template(v-for="vote of paginatedVotes")
    .row.items-center.justify-between.q-my-md(:key="vote.username")
      profile-picture(:username="vote.username" show-name :detail="'2 days ago'" size="40px")
      chips(:tags="[tag(vote)]")
      // q-icon(:name="icon(vote)" :color="color(vote)" size="sm")
  .row.justify-center
    q-pagination(v-model="page" :max="pages" direction-links)
</template>
