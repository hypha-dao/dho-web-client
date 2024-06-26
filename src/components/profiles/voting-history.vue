<script>
import { dateToStringShort } from '~/utils/TimeUtils'

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
    dateToStringShort,

    tags (item) {
      return [{
        label: item.vote === 'pass' ? this.$t('profiles.voting-history.yes') : (item.vote === 'fail' ? this.$t('profiles.voting-history.no') : this.$t('profiles.voting-history.abstain')),
        color: item.vote === 'pass' ? 'positive' : (item.vote === 'fail' ? 'negative' : 'grey-7'),
        text: 'white'
      }]
    },

    onMore (onLoadResult) {
      this.$emit('onMore', onLoadResult)
    },

    onVoteClick (vote) {
      this.$router.push(`/${vote.daoName}/agreements/${vote.proposalId}`)
    }
  }
}
</script>

<template lang="pug">
widget(:more="more" :title="$t('profiles.voting-history.recentVotes')")
  q-list.q-pt-lg.margin-fix(v-if="votes.length")
    template(v-for="(item, index) in votes")
      q-item.row.q-pr-xxxl.vote-item(:key="item.ballot_name" :clickable="clickable" v-ripple="clickable" :class="{ 'justify-between': $q.screen.md }")
        q-item-section.col-md-4.col-11(avatar)
          profile-picture(show-name :avatar="item.avatar" :name="item.name" :username="item.creator" noWrapName ellipsisName size="40px" link)
            template(v-slot:detail)
              q-item-label.h-b2.text-italic(caption) {{ dateToStringShort(item.timestamp) }}
        template(v-if="!$q.screen.md")
          q-item-section.gt-sm.col-2
            q-item-label.h-h7.text-bold(v-if="item.settingsTitle" lines="2") {{ item.settingsTitle && item.settingsTitle.replace(/^\w/, (c) => c.toUpperCase()) }}
            q-item-label.h-h7.text-bold(v-else lines="2") {{ item.daoName && item.daoName.replace(/^\w/, (c) => c.toUpperCase()) }}
          q-item-section.gt-sm.col-5
            q-item-label.h-b1(lines="2" :style="{cursor: 'pointer'}" @click="onVoteClick(item)") {{ item.title }}
        q-item-section.col-1(side)
          chips(:tags="tags(item)")
        q-item-section(v-if="clickable" side)
          q-icon(name="fas fa-chevron-right")
    .flex.flex-center
      widget-more-btn(@onMore="onMore")
  .text-body2.q-px-md.q-pb-md(v-else) {{ $t('profiles.voting-history.noVotesFound') }}

</template>

<style lang="stylus" scoped>
.vote-item
  padding-bottom 15px !important
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
