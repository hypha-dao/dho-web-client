<script>
/**
 * Renders a widget containing a list of recent votes
 * Votes can be clickable or [TODO] link to a different route
 */
export default {
  name: 'voting-history',
  components: {
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    clickable: Boolean,
    more: Boolean,
    name: String,
    votes: {
      type: Array,
      default: () => []
    }
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
widget(:more="more" title="Voting history")
  q-list.margin-fix(v-if="votes.length")
    template(v-for="(item, index) in votes")
      q-item(:key="item.ballot_name" :clickable="clickable" v-ripple="clickable")
        q-item-section
          q-item-label(lines="2").text-body1.text-bold {{ name }} voted "{{ item.vote }}" on {{ item.ballot ? item.ballot.title : item.ballot_name }}
          q-item-label.caption {{ dateString(item.timestamp) }}
        q-item-section(v-if="clickable" side)
          q-icon(name="fas fa-chevron-right")
      q-separator(v-if="index < votes.length - 1" spaced inset :key="'sep' + index")
  .text-body2.q-px-md.q-pb-md(v-else) No votes found for user
</template>

<style lang="stylus" scoped>
// Add negative margins to the list so its
// contents line up properly with widget title
.margin-fix
  margin-left -16px
  margin-right -16px
</style>
