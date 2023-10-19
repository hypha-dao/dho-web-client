<script>
export default {
  name: 'round-card',

  components: {
    GroupCard: () => import('./GroupCard.vue'),
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue')
  },

  props: {
    participantsCount: Number,
    groups: Array,
    l1DelegateBadges: String,
    users: Array,
    roundNumber: Number,
    electionStatus: String,
    id: String
  },

  data () {
    return {
      showGroups: false,
      showDelegatesBadges: false
    }
  }

}
</script>

<template lang="pug">
.round-card
  q-dialog(:value="showDelegatesBadges" @hide="showDelegatesBadges = false")
    q-card.q-pa-xl.rounded(:style="{ 'width': '640px' }" flat)
      .h-h3 {{ $t('pages.upvote-election.levDelegateBadges', { level: roundNumber }) }}
      .q-my-md {{ $t('pages.upvote-election.loremIpsumDolor') }}
      template(v-for="group in groups")
        template(v-for="user in group.users")
          .row.flex.items-center.q-mb-md.justify-between
            .col
              .row
                .col-1.flex.items-center.q-mr-xs
                  profile-picture(:username="user.account" size="24px")
                .col
                  .row.text-bold.text-black {{ user.fullName }}
                  .row(:style="{ 'font-size': '10px' }") {{ user.telegram }}
            .row
              .row.flex.items-center(v-if="roundNumber === 1")
                .text-secondary.q-mr-sm(:style="{ 'font-size': '12px' }") {{ $t('pages.upvote-election.delegatel1') }}
                img(width="16px" src="~/assets/icons/delegate-l1.svg")
              .row.flex.items-center(v-if="roundNumber === 2")
                .text-secondary.q-mr-sm(:style="{ 'font-size': '12px' }") {{ $t('pages.upvote-election.delegatel2') }}
                img(width="16px" src="~/assets/icons/delegate-l2.svg")
  q-card.q-mr-md.widget.q-pa-xl.relative-position.rounded-card(flat)
    .title
      .row.flex.items-center.justify-between
        .col.flex.items-center
          img(src="~/assets/icons/voting-icon.svg")
          .h-h4.q-ml-md {{ $t('pages.upvote-election.votingRound') }} {{ roundNumber }}
        q-btn(@click="showGroups = !showGroups" flat rounded :icon="showGroups ? 'fas fa-chevron-up' : 'fas fa-chevron-down'")
      .row.q-mt-md {{ $t('pages.upvote-election.areYouReadyToBegin') }}
      .row.q-mt-md.q-gutter-sm
        .col
          q-card.rounded-card.q-pa-lg.applications-metric
            .row.flex.items-center
              .col-2
                q-icon(name="fas fa-users" size="24px")
              .col.q-ml-sm
                .row
                  .h-h4 {{ participantsCount }}
                .row {{ $t('pages.upvote-election.participants') }}
        .col
          q-card.rounded-card.q-pa-lg.applications-metric
            .row.flex.items-center
              .col-2
                img(src="~/assets/icons/voting-groups-icon.svg")
              .col.q-ml-sm
                .row
                  .h-h4 {{ groups.length }}
                .row {{ $t('pages.upvote-election.groups') }}
        //- Temporarily hidden
        //- .col
          q-card.rounded-card.q-pa-lg.applications-metric
            .row.flex.items-center
              .col-2
                img(v-if="roundNumber === 1" src="~/assets/icons/delegate-l1.svg")
                img(v-else-if="roundNumber === 2" src="~/assets/icons/delegate-l2.svg")
              .col.q-ml-sm
                .row.flex.justify-between
                  .h-h4 {{ l1DelegateBadges }}
                  .text-secondary.cursor-pointer(@click="showDelegatesBadges = true" :style="{ 'font-size': '12px' }") {{ $t('pages.upvote-election.seeAll') }}
                .row(v-if="roundNumber === 1") {{ $t('pages.upvote-election.l1DelegateBadges') }}
                .row(v-else-if="roundNumber === 2") {{ $t('pages.upvote-election.l2DelegateBadges') }}
    q-slide-transition
      div.q-my-xl.q-pt-xl(v-show="showGroups" :style="{ 'border-top': '1px solid #CBCDD1'}")
        .row.q-gutter-col-md
          template(v-for="group, index in groups")
            group-card.col-6.q-pa-xxs(:videoLink="group.videoLink" :roundNumber="roundNumber" :winner="group.winner" :groupId="group.id" :roundId="id" :electionStatus="electionStatus" :users="group.members" :groupNumber="index + 1" :votes="group.votes")
</template>

<style lang="stylus" scoped>
.applicant-row:hover
  background: #f1f1f3
  border-radius: 15px
.applications-metric
  box-shadow: 0px 0px 16px -3px rgba(34, 60, 80, 0.2)
.rounded-card
  border-radius: 15px

.rounded
  border-radius: 26px
</style>
