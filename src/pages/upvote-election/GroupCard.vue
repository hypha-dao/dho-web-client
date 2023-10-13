<script>
import { mapGetters } from 'vuex'
export default {
  name: 'group-card',

  components: {
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue')
  },

  props: {
    groupNumber: Number,
    users: Array,
    votes: Array,
    electionStatus: String,
    roundId: String,
    groupId: String
  },

  data () {
    return {
      showUsers: false
    }
  },

  apollo: {
    member: {
      query: require('~/query/profile/profile-basic-info.gql'),
      update: data => {
        return data.getMember
      },
      variables () {
        return {
          username: this.account
        }
      },
      skip () {
        return !this.account
      }
    }
  },

  computed: {
    ...mapGetters('accounts', ['account'])
  },

  methods: {
    async voteTransact (votedId) {
      const actions = [{
        account: this.$config.contracts.dao,
        name: 'castupvote',
        data: {
          round_id: this.roundId,
          group_id: this.groupId,
          voter: this.account,
          voted_id: votedId
        }
      }]
      return await this.$store.$api.signTransaction(actions)
    }
  }
}
</script>

<template lang="pug">
.group-card
  q-card.rounded-card.q-pa-lg.applications-metric
    .dot(v-if="users.find(user => user.details_member_n === account && electionStatus !== 'finished')" :style="{ 'position': 'absolute', 'top': '0', 'right': '0', 'width': '10px', 'height': '10px', 'border-radius': '50%', 'background': '#1542EA'}")
    .row.flex.justify-between
      .row
        .col.q-mr-xs
          .h-h5.q-mr-md.flex.items-center(:style="{ 'font-weight': '600' }") {{ $t('pages.upvote-election.group') }} {{ groupNumber }}
          div(v-if="!users.find(user => user.details_member_n === account && electionStatus !== 'finished')") {{ $t('pages.upvote-election.groupcard.noRecordingsYet') }}
          .text-secondary.cursor-pointer.text-underline(v-else) {{ $t('pages.upvote-election.groupcard.uploadRecording') }}
        template(v-for="user in users")
          profile-picture.q-mr-xxs(:username="user.details_member_n" size="24px" :key="applicant")
      q-btn(@click="showUsers = !showUsers" flat rounded :icon="showUsers ? 'fas fa-chevron-up' : 'fas fa-chevron-down'")
    q-slide-transition
      div.q-mt-xl.q-pt-xl(v-show="showUsers" :style="{ 'border-top': '1px solid #CBCDD1'}")
        template(v-for="user in users")
          .row.flex.items-center.q-mb-md
            .col-1.q-mr-xs.flex.items-center
              profile-picture(:username="user.details_member_n" size="24px" :key="applicant")
            .col
              .row.text-bold.text-black {{ user.details_member_n }}
              .row(:style="{ 'font-size': '10px' }") {{ user.telegram }}
            .row.flex.items-center
              template(v-for="vote in votes")
                div.q-ml-xxs.consensus(:class="{ 'vote': vote.details_votedId_i == user.docId }" :style="{ 'width': '15px', 'height': '4px', 'border-radius': '20px'}")
              template(v-for="vote in 6 - votes.length")
                div.q-ml-xxs.slot(:style="{ 'width': '15px', 'height': '4px', 'border-radius': '20px'}")
              q-btn.q-ml-sm(:disable="electionStatus === 'finished'" @click="voteTransact(user.docId)" color="primary" flat :label="$t('pages.upvote-election.groupcard.vote')" no-caps bordered rounded v-if="users.find(user => user.details_member_n === account)" :style="{'border': '1px solid #252f5d'}")
        .row.q-pt-lg(:style="{ 'border-top': '1px solid #CBCDD1'}")
          .col
            .row
              .slot(:style="{ 'width': '15px', 'height': '4px', 'border-radius': '20px'}")
            .row(:style="{ 'font-size': '10px' }") {{ $t('pages.upvote-election.groupcard.slots') }}
          .col
            .row
              .consensus(:style="{ 'width': '15px', 'height': '4px', 'border-radius': '20px'}")
            .row(:style="{ 'font-size': '10px' }") {{ $t('pages.upvote-election.groupcard.consensus') }}
          .col
            .row
              .vote(:style="{ 'width': '15px', 'height': '4px', 'border-radius': '20px'}")
            .row(:style="{ 'font-size': '10px' }") {{ $t('pages.upvote-election.groupcard.votes') }}
</template>

<style lang="stylus" scoped>
.applications-metric
  box-shadow: 0px 0px 16px -3px rgba(34, 60, 80, 0.2)
.rounded-card
  border-radius: 15px
.vote
  background: #16B59B !important
.consensus
  background: #CAC8D0
.slot
  background: #F2F1F3
</style>
