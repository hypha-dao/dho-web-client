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
    Widget: () => import('~/components/common/widget.vue'),
    WidgetMoreBtn: () => import('~/components/common/widget-more-btn.vue')

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
        label: item.vote === 'pass' ? 'YES' : (item.vote === 'fail' ? 'NO' : 'ABSTAIN'),
        color: item.vote === 'pass' ? 'positive' : (item.vote === 'fail' ? 'negative' : 'grey-7'),
        text: 'white'
      }]
    },

    onMore (onLoadResult) {
      this.$emit('onMore', onLoadResult)
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
            size="40px"
            tooltip
            link
          )
        q-item-section
          q-item-label.text-subtitle1.text-bold.creator(lines="1" :style="{ width: $q.screen.gt.xs ? '128px' : '' }") {{ item.name || item.creator }}
          q-item-label.lt-md.text-bold(lines="2") {{ item.title }}
          q-item-label.text-italic(caption) {{ dateString(item.timestamp) }}
        q-item-section.gt-sm
          q-item-label.text-bold(lines="2") {{ item.daoName }}
        q-item-section.gt-sm
          q-item-label.text-bold(lines="2") {{ item.title }}
        q-item-section(side)
          chips(:tags="tags(item)")
        q-item-section(v-if="clickable" side)
          q-icon(name="fas fa-chevron-right")
    .q-pt-md.flex.flex-center
      widget-more-btn(@onMore="onMore")
  .text-body2.q-px-md.q-pb-md(v-else) No votes found for user
</template>

<style lang="stylus" scoped>
// Add negative margins to the list so its
// contents line up properly with widget title
.margin-fix
  margin-left -16px
  margin-right -16px

.creator
  color #3E3B46

.title-section
  margin-left 140px
  .title
    font-size 1.25em

.q-item
  padding-bottom: 32px
</style>
