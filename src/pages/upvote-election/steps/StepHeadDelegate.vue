<script>
export default {
  name: 'step-head-delegate',
  components: {
    Widget: () => import('~/components/common/widget.vue'),
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue')
  },

  props: {
    step: Object,
    selectedUsers: Array,
    votingState: Boolean,
    upvoteElectionData: Object,
    votedUsers: Array
  },
  data () {
    return {
      assignedCount: 365,
      applicansCount: 4,
      totalVotersValue: 75
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<template lang="pug">
.step-head-delegate
  widget.full-width.q-mb-xl.q-px-sm.q-py-md(:style="{ 'border': '1px solid #84878E' }" noPadding)
    .row
      div
        .row
          q-icon.card-icon(name="far fa-address-card" size="16px" color="white")
          .h-h5.text-bold.q-mx-sm Voter Badge
          .title-blue Assigned:
          .h-h3.text-weight-600.q-ml-md {{ upvoteElectionData.votersBadgeCount }}
      q-separator(:style="{ 'margin': '-8px 50px', 'background': '#707070' }" vertical)
      div
        .row
          q-icon.card-icon(name="far fa-address-card" size="16px" color="white")
          .h-h5.text-bold.q-mx-sm Member in this round
          .h-h3.text-weight-600.q-ml-md {{ upvoteElectionData.delegatesBadgeCount }}
  .row.no-wrap.items-center
    .h-h6.text-no-wrap Total voters:
    .percent-number.q-mx-md {{ Math.floor((upvoteElectionData.currentVotedAggregateCount / upvoteElectionData.votersBadgeCount) * 100) }}%
    q-linear-progress(:value="upvoteElectionData.currentVotedAggregateCount / upvoteElectionData.votersBadgeCount" color="secondary" rounded)
  .h-b2.q-my-xl {{ step.description }}
  .h-h6 Eligible for Chief Delegate badge
  .row.q-mt-md
    .template.col-4(v-for="user in upvoteElectionData.candidates" :class="{ 'col-6 q-px-xs': $q.screen.md, 'q-px-xs q-mb-md': $q.screen.gt.md, 'q-mb-md': $q.screen.md || $q.screen.lt.md, 'col-12': $q.screen.lt.md }")
      .user-card.justify-between.row.items-center(@click="$emit('selectUser', user)" :class="{ 'selected': selectedUsers.find(compItem => compItem === user), 'voting': votingState && votedUsers.includes(user.details_member_n) }")
        ProfilePicture(:textWhite="selectedUsers.includes(user) || votedUsers.includes(user.details_member_n) && votingState" :username="user.details_member_n" size="50px" showUsername showName noMargins boldName withoutItalic)
        .indicator(:class="{ 'indicator-selected-state': selectedUsers.includes(user) || votedUsers.includes(user.details_member_n) && votingState}")
        q-icon.check-icon(v-if="votingState && votedUsers.includes(user.details_member_n)" name="fas fa-check")
        .dot(v-else-if="selectedUsers.includes(user)")
</template>

<style lang="stylus" scoped>
.card-icon
  width: 30px
  height: 30px
  display: flex
  border-radius: 50%
  justify-content: center
  align-items: center
  background: #242F5D
.check-icon
  width: 26px
  height: 26px
  position: absolute
  right: 16px
  border-radius: 50%
.title-blue
  font-family: 'Lato', sans-serif
  font-weight: 600
  color: #3F64EE
  font-size: 18px
.percent-number
  font-family: 'Lato', sans-serif
  font-weight: 800
  color: #3F64EE
  font-size: 20px
.user-card
  border-radius: 14px
  border: 1px solid #C4C5C9
  padding: 8px 16px
  position: relative
  .indicator-selected-state
    opacity: 0.13 !important
  .indicator
    width: 26px
    height: 26px
    display: flex
    align-items: center
    justify-content: center
    border-radius: 50%
    background: #F1F1F3
  .dot
    width: 16px
    height: 16px
    border-radius: 50%
    background: #FFFFFF !important
    position: absolute
    right: 21px
.selected
  background: #242F5D
  color: #FFFFFF !important
.voting
  background: #1CB59B
  color: #FFFFFF
</style>
