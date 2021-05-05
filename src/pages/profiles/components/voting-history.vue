<script>
export default {
  name: 'voting-history',
  components: {
    Widget: () => import('~/components/widget.vue')
  },

  props: {
    name: String,
    votes: Array
  },

  methods: {
    dateString (timestamp) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' }
      return new Date(timestamp).toLocaleDateString(undefined, options)
    }
  }
}
</script>

<template lang="pug">
Widget(title="Voting history")
  q-list(v-if="votes.length")
    template(v-for="(item, index) in votes")
      q-item(:key="item.ballot_name")
        q-item-section
          q-item-label(lines="2").text-body2 {{ name }} voted "{{ item.vote }}" on {{ item.ballot ? item.ballot.title : item.ballot_name }}
          q-item-label.text-overline {{ dateString(item.timestamp) }}
        // q-item-section(side)
          q-icon(name="fas fa-chevron-right")
      q-separator(v-if="index < votes.length - 1" spaced inset :key="'sep' + index")
  .text-body2.q-px-md.q-pb-md(v-else) No votes found for user
</template>
