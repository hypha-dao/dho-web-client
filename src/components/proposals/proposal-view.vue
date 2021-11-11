<script>
/**
 * An expansive widget that contains all the details of a proposal.
 * It is used on the proposal detail page and the creation wizard.
 */
export default {
  name: 'proposal-view',
  components: {
    Chips: () => import('~/components/common/chips.vue'),
    PayoutAmounts: () => import('~/components/common/payout-amounts.vue'),
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue'),
    VoterList: () => import('~/components/proposals/voter-list.vue'),
    Voting: () => import('~/components/proposals/voting.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    creator: String,
    description: String,
    periodCount: Number,
    preview: Boolean,
    start: String,
    subtitle: String,
    tags: Array,
    title: String,
    tokens: Array,
    type: String,
    url: String,
    commit: {
      type: Object,
      default: () => {
        return {
          value: 100
        }
      }
    },
    deferred: {
      type: Object,
      default: () => {
        return {
          value: 100
        }
      }
    },
    voting: Object,
    votes: Array
  },

  methods: {
    openDocumentation () {
      window.open(this.url, '_blank')
    }
  }
}
</script>

<template lang="pug">
.proposal-detail.full-width
  .row
    .col-8.q-pa-sm
      widget.q-my-sm
        .row
          chips(:tags="tags")
        .row.q-my-sm
          .column
            .text-h6 {{ title }}
            .text-italic.text-grey-6 {{ subtitle }}
        .row.q-my-sm(v-if="type === 'Assignment' || type === 'Edit'")
          .col-6
            .bg-grey-4.rounded-border.q-pa-md.q-mr-xs
              .text-bold Date and duration
              .text-grey-7.text-body2 {{ periodCount }} period{{periodCount > 1 ? 's' : ''}}, starting {{ start }}
          .col-6
            .row.bg-grey-4.rounded-border.q-pa-md.q-ml-xs
              .col-6
                .text-bold Committment level
                .text-grey-7.text-body2 {{ commit.value + '%' }}
              .col-6
                .text-bold Deferred amount
                .text-grey-7.text-body2 {{ deferred.value + '%' }}
        .row.q-my-sm.bg-grey-4.rounded-border
          payout-amounts.q-py-md(:tokens="tokens")
        .row
          q-markdown(:src="description")
        .row.items-center.q-mb-md
          q-icon(name="far fa-file" size="xs" color="primary")
          a.on-right(:href="url") {{ url }}
        .row.top-border.q-pt-md.justify-between
          profile-picture(:username="creator" show-name size="40px")
          q-btn(flat color="primary" no-caps rounded :to="{ path: `/preview/@${creator}` }") See profile
    .col-4.q-pa-sm(v-if="!preview")
      voting.q-my-sm(v-bind="voting")
      voter-list.q-my-md(:votes="votes")
</template>

<style lang="stylus" scoped>
.rounded-border
  border-radius 24px

.top-border
  border-top 1px solid $grey-4
</style>
