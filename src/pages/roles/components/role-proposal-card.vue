<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { documents } from '~/mixins/documents'
import TopRightIcon from '~/components/documents-parts/top-right-icon'
import VoteYesNoAbstain from '~/components/documents-parts/vote-yes-no-abstain'
import { adorableAvatar } from '~/mixins/adorable-avatar'
import { format } from '~/mixins/format'

export default {
  name: 'role-proposal-card',
  mixins: [documents, format, adorableAvatar],
  props: { proposal: { type: Object, required: true } },
  components: { TopRightIcon, VoteYesNoAbstain },
  data () {
    return {
      profile: null,
      avatarSrc: null,
      avatarColor: null
    }
  },
  methods: {
    ...mapActions('profiles', ['getPublicProfile']),
    ...mapMutations('roles', ['removeProposal']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    openUrl () {
      window.open(this.url)
    },
    showCardFullContent () {
      this.setShowRightSidebar(true)
      this.setRightSidebarType({
        type: 'roleProposalView',
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
    annualSalary () {
      return this.getValue(this.proposal, 'details', 'annual_usd_salary')
    },
    proposer () {
      return this.proposal.creator
    },
    ballotId () {
      return this.getValue(this.proposal, 'system', 'ballot_id')
    }
  },
  watch: {
    proposer: {
      immediate: true,
      async handler (val) {
        this.profile = val && await this.getPublicProfile(val)
      }
    },
    title: {
      immediate: true,
      async handler (val) {
        if (val) {
          this.titleHash = await this.toSHA256(val)
          const { image, color } = await this.getAdorableImage(this.titleHash)
          this.avatarSrc = image
          this.avatarColor = color
        }
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
      @click="openUrl"
      flat
      color="proposal"
      unelevated
      dense
    )
  top-right-icon(type="role")
  q-card-section.text-center.relative-position(@click="showCardFullContent")
    q-img.avatar(
      v-if="avatarSrc"
      :src="avatarSrc"
      :style="`background: ${avatarColor}`"
    )
    .salary-bucket.bg-proposal(v-if="annualSalary") {{ getSalaryBucket(parseInt(annualSalary)) }}
  q-card-section(@click="showCardFullContent")
    .title {{ title }}
    .sponsor Sponsored by {{ (profile && profile.publicData && profile.publicData.name) || proposer }}
  q-card-section.vote-section
    vote-yes-no-abstain(v-if="ballotId" :ballotId="ballotId" :proposer="proposer" :hash="this.proposal.hash" :allow-details="true" @close-proposal="removeProposal")
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
    right 50px
    z-index 12
  .avatar
    cursor pointer
    border-radius 50% !important
    margin-top 20px
    width 100%
    max-width 150px
    height 150px
  .title
    cursor pointer
    text-transform capitalize
    text-align center
    font-weight 800
    font-size 28px
    line-height 1
  .salary-bucket
    position absolute
    bottom 10px
    right 80px
    color white
    font-size 28px
    font-weight 700
    border-radius 50%
    width 45px
  .sponsor
    color $grey-6
    font-size 16px
    text-align center
  .vote-section
    padding 0 28px 10px
</style>
