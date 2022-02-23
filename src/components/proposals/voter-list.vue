<script>
import { date } from 'quasar'

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
    },
    size: {
      type: Number,
      default: 0
    }
  },

  computed: {
    pages () {
      return Math.ceil(this.size / 5)
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
    },
    voteDate (vote) {
      const now = new Date()
      const voteDay = new Date(vote.date)

      const days = date.getDateDiff(now, voteDay, 'days')
      if (days > 1) return `${days} days ago`
      if (days === 1) return `${days} day ago`

      const hours = date.getDateDiff(now, voteDay, 'hours')
      if (hours > 1) return `${hours} hours ago`
      if (hours === 1) return `${hours} hour ago`

      const minutes = date.getDateDiff(now, voteDay, 'minutes')
      if (minutes > 1) return `${minutes} minutes ago`
      if (minutes === 1) return `${minutes} minute ago`

      return '1 minute ago'
    },
    load () {
      if (this.votes.length < this.size) {
        this.$emit('onload')
      }
    }
  }
}
</script>

<template lang="pug">
widget(:title="`Votes (${size})`")
  template(v-if="(paginatedVotes.length === 0) && (size !== 0)")
    div(class="row justify-center q-my-md")
          q-spinner-dots(color="primary" size="40px")
  template(v-for="vote of paginatedVotes")
    .row.items-center.justify-between.q-my-md(:key="vote.username")
      profile-picture(:username="vote.username" show-name :detail="voteDate(vote)" size="40px")
      chips(:tags="[tag(vote)]")
      // q-icon(:name="icon(vote)" :color="color(vote)" size="sm")
  .row.justify-center
    q-pagination(v-model="page" :max="pages" direction-links @input="load")
</template>
