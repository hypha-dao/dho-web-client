<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import TopRightIcon from '~/components/documents-parts/top-right-icon'
import VoteYesNoAbstain from '~/components/documents-parts/vote-yes-no-abstain'
import { documents } from '~/mixins/documents'
import { format } from '~/mixins/format'

export default {
  name: 'assignment-proposal-card',
  mixins: [documents, format],
  props: { proposal: { type: Object, required: true } },
  components: { TopRightIcon, VoteYesNoAbstain },
  data () {
    return {
      profile: null,
      role: null
    }
  },
  methods: {
    ...mapActions('profiles', ['getPublicProfile']),
    ...mapMutations('assignments', ['removeProposal']),
    ...mapActions('roles', ['loadRole']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    showCardFullContent () {
      this.setShowRightSidebar(true)
      this.setRightSidebarType({
        type: 'assignmentProposalView',
        data: this.proposal
      })
    }
  },
  computed: {
    ...mapGetters('accounts', ['account']),
    title () {
      return this.getValue(this.proposal, 'details', 'title')
    },
    url () {
      return this.getValue(this.proposal, 'details', 'url')
    },
    assignee () {
      return this.getValue(this.proposal, 'details', 'assignee')
    },
    roleId () {
      return this.getValue(this.proposal, 'details', 'role')
    },
    ballotId () {
      return this.getValue(this.proposal, 'system', 'ballot_id')
    },
    annualSalary () {
      return this.role && this.getValue(this.role, 'details', 'annual_usd_salary')
    }
  },
  watch: {
    assignee: {
      immediate: true,
      async handler (val) {
        this.profile = val && await this.getPublicProfile(val)
      }
    },
    roleId: {
      immediate: true,
      async handler (val) {
        this.role = val && await this.loadRole(val)
      }
    }
  }
}
</script>

<template lang="pug">
q-card.proposal.column
  .ribbon
    span.text-white.creating creating
  .url(v-if="url && url !== 'null'")
    q-btn(
      icon="fas fa-bookmark"
      @click="() => openUrl(url)"
      flat
      color="proposal"
      unelevated
      dense
    )
  top-right-icon(type="assignment")
  q-card-section.text-center(@click="showCardFullContent")
    q-img.avatar(
      v-if="profile && profile.publicData && profile.publicData.avatar"
      :src="profile.publicData.avatar"
      @click="$router.push({ path: `/@${assignee}`})"
    )
    q-avatar.avatar(
      v-if="!profile || !profile.publicData || !profile.publicData.avatar"
      size="150px"
      color="accent"
      text-color="white"
      @click="$router.push({ path: `/@${assignee}`})"
    )
      | {{ assignee.slice(0, 2).toUpperCase() }}
    .salary-bucket.bg-proposal(v-if="annualSalary") {{ getSalaryBucket(parseInt(annualSalary)) }}
  q-card-section(@click="showCardFullContent")
    .assignee {{ (profile && profile.publicData && profile.publicData.name) || assignee }}
    .title {{ title }}
  q-card-section.vote-section
    vote-yes-no-abstain(v-if="ballotId" :ballotId="ballotId" :proposer="assignee" :hash="this.proposal.hash" :allow-details="true" @close-proposal="removeProposal")
</template>

<style lang="stylus" scoped>
.proposal
  width 300px
  border-radius 1rem
  margin 10px
  .proposal:hover
    z-index 100
    box-shadow 0 8px 12px rgba(0,0,0,0.2), 0 9px 7px rgba(0,0,0,0.14), 0 7px 7px 7px rgba(0,0,0,0.12)
  .url
    position absolute
    top -4px
    right 60px
    z-index 12
  .avatar
    cursor pointer
    margin-top 20px
    width 100%
    max-width 150px
    height 150px
  .salary-bucket
    position absolute
    bottom 10px
    right 80px
    color white
    font-size 28px
    font-weight 700
    border-radius 50%
    width 45px
  .title
    cursor pointer
    text-align center
    font-size 20px
    color $grey-6
    line-height 22px
  .assignee
    cursor pointer
    text-transform capitalize
    text-align center
    font-weight 800
    font-size 28px
    line-height 1
  .vote-section
    padding 0 28px 10px
</style>
