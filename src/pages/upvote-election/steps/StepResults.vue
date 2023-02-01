<script>
export default {
  name: 'step-results',
  components: {
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue')
  },

  props: {
    step: Object
  },
  data () {
    return {
      totalVoters: 365,
      totalDelegatesApplicants: 120,
      round1Voters: 75,
      chiefDVoters: 66,
      headDVoters: 100,
      headDelegate: [
        {
          headDelegate: true,
          name: 'User',
          id: 1
        }
      ],
      chiefDelegates: [
        {
          name: 'User',
          id: 1
        },
        {
          name: 'User',
          id: 2
        },
        {
          name: 'User',
          id: 3
        }
      ]
    }
  },
  computed: {
  }
}
</script>

<template lang="pug">
.step-results
  .row.q-mb-md
    .h-h7.text-weight-800 Total voters:
    .blue-number.q-ml-xs {{ totalVoters }}
    .h-h7.text-weight-800.q-ml-md Total delegates applicants:
    .blue-number.q-ml-xs {{ totalDelegatesApplicants }}
  .col.q-mb-xl
    .row.no-wrap.items-center.q-mb-xs
      .h-h7.text-weight-800.text-no-wrap Round 1 Voters:
      .blue-number.q-mx-sm {{ round1Voters }}%
      q-linear-progress(:value="round1Voters / 100" color="secondary" rounded)
    .row.no-wrap.items-center.q-mb-xs
      .h-h7.text-weight-800.text-no-wrap Chief D. Voters:
      .blue-number.q-mx-sm {{ chiefDVoters }}%
      q-linear-progress(:value="chiefDVoters / 100" color="secondary" rounded)
    .row.no-wrap.items-center.q-mb-xs
      .h-h7.text-weight-800.text-no-wrap Head D. Voters:
      .blue-number.q-mx-sm {{ headDVoters }}%
      q-linear-progress(:value="headDVoters / 100" color="secondary" rounded)
  .h-h6.q-mb-md Head Delegate
  .row
    .template.col-4(v-for="user in headDelegate" :class="{ 'q-px-xs col-6': $q.screen.md, 'q-px-xs q-mb-md': $q.screen.gt.md, 'q-mb-md': $q.screen.md || $q.screen.lt.md, 'col-12': $q.screen.lt.md }")
      .user-card.justify-between.row.items-center
        .tag(v-if="user.headDelegate") HEAD DELEGATE
        ProfilePicture(:username="user.name" size="50px" showUsername showName noMargins boldName withoutItalic)
        q-icon.card-icon(name="far fa-address-card" size="16px" color="white")
  .h-h6.q-my-md Chief Delegates
  .row
    .template.col-4(v-for="user in chiefDelegates" :class="{ 'q-px-xs col-6': $q.screen.md, 'q-px-xs q-mb-md': $q.screen.gt.md, 'q-mb-md': $q.screen.md || $q.screen.lt.md, 'col-12': $q.screen.lt.md }")
      .user-card.justify-between.row.items-center
        ProfilePicture(:username="user.name" size="50px" showUsername showName noMargins boldName withoutItalic)
        q-icon.card-icon(name="far fa-address-card" size="16px" color="white")
</template>

<style lang="stylus" scoped>
.q-linear-progress
  height: 6px
.blue-number
  font-family: 'Lato', sans-serif
  font-size: 14px
  color: #3F64EE
  font-weight: 800
.user-card
  border-radius: 14px
  border: 1px solid #C4C5C9
  padding: 8px 16px
  position: relative
  .card-icon
    width: 30px
    height: 30px
    display: flex
    border-radius: 50%
    justify-content: center
    align-items: center
    background: #242F5D
  .tag
    display: flex
    height: 16px
    width: fit-content
    border-radius: 8px
    background: #3F64EE
    padding: 1.5px 8px
    color: #FFFFFF
    font-family: 'Lato', sans-serif
    font-weight: 600
    font-size: 9px
    position: absolute
    top: 0
    right: 0
</style>
