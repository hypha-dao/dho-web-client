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
.proposal-detail.full-width.q-px-xl
  .row
    .col-9.q-pa-sm
      widget.q-my-sm
        .row
          chips(:tags="tags")
        .row.q-my-sm
          .text-h6 {{ title }}
          .text-h6.text-italic.text-grey-5 {{ subtitle }}
        .row.justify-between(v-if="type === 'Assignment' || type === 'Edit'" title="Duration")
          .row.items-center
            q-icon.on-left(name="far fa-calendar-alt")
            .text-body2 Starts {{ start }}
          .text-bold {{ periodCount }} periods
        .row
          payout-amounts.q-my-sm(:tokens="tokens")
        .row
          q-markdown(:src="description")
        q-btn.full-width.q-my-lg.q-mt-xl(
          v-if="url"
          outline padding="md"
          rounded
          label="See Documentation"
          @click="openDocumentation()"
        )
        .row
          profile-picture(:username="creator" show-name show-username size="48px")
    .col-3.q-pa-sm(v-if="!preview")
      voting.q-my-sm(v-bind="voting")
      voter-list.q-my-sm(:votes="votes")
</template>
