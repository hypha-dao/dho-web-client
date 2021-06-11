<script>
/**
 * Renders a widget containing a list of recent votes
 * Votes can be clickable or [TODO] link to a different route
 */
export default {
  name: 'voting-history',
  components: {
    ProfilePicture: () => import('./profile-picture.vue'),
    Chips: () => import('~/components/common/chips.vue'),
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
    },

    tags (item) {
      return [{
        label: item.vote,
        color: item.vote === 'pass' ? 'positive' : (item.vote === 'fail' ? 'negative' : 'warning'),
        text: 'white'
      }]
    }
  }
}
</script>

<template lang="pug">
widget(:more="more" title="Recent votes")
  q-list.margin-fix(v-if="votes.length")
    template(v-for="(item, index) in votes")
      q-item(:key="item.ballot_name" :clickable="clickable" v-ripple="clickable")
        q-item-section(avatar)
          profile-picture(
            :avatar="item.avatar"
            :name="item.name"
            :username="item.creator"
            size="32px"
            tooltip
            link
          )
        q-item-section(:side="$q.screen.gt.xs")
          q-item-label.creator(lines="1" :style="{ width: $q.screen.gt.xs ? '128px' : '' }") {{ item.name || item.creator }}
          q-item-label.lt-sm.text-bold(lines="2") {{ item.title }}
          q-item-label(caption) {{ dateString(item.timestamp) }}
        q-item-section.gt-xs.q-mx-md
          q-item-label.text-bold(lines="2") {{ item.title }}
        q-item-section(side)
          chips(:tags="tags(item)")
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

.creator
  color #757575

.title
  font-size 1.25em
</style>
