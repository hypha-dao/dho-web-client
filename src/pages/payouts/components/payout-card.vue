<script>
import TopRightIcon from '~/components/documents-parts/top-right-icon'
import VoteYesNoAbstain from '~/components/documents-parts/vote-yes-no-abstain'
import { documents } from '~/mixins/documents'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'payout-payout-card',
  mixins: [documents],
  props: { payout: { type: Object, required: true } },
  components: { TopRightIcon, VoteYesNoAbstain },
  data () {
    return {
      profile: null
    }
  },
  methods: {
    ...mapActions('profiles', ['getPublicProfile']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    showCardFullContent () {
      this.setShowRightSidebar(true)
      this.setRightSidebarType({
        type: 'payoutView',
        data: this.payout
      })
    }
  },
  computed: {
    ...mapGetters('accounts', ['account']),
    title () {
      return this.getValue(this.payout, 'details', 'title')
    },
    url () {
      return this.getValue(this.payout, 'details', 'url')
    },
    recipient () {
      return this.getValue(this.payout, 'details', 'recipient')
    },
    ballotId () {
      return this.getValue(this.payout, 'system', 'ballot_id')
    }
  },
  watch: {
    recipient: {
      immediate: true,
      async handler (val) {
        this.profile = val && await this.getPublicProfile(val)
      }
    }
  }
}
</script>

<template lang="pug">
q-card.payout.column
  .url(v-if="url && url !== 'null'")
    q-btn(
      icon="fas fa-bookmark"
      @click="() => openUrl(url)"
      flat
      color="payout"
      unelevated
      dense
    )
  top-right-icon(type="payout")
  q-card-section.text-center(@click="showCardFullContent")
    q-img.avatar(
      v-if="profile && profile.publicData && profile.publicData.avatar"
      :src="profile.publicData.avatar"
      @click="$router.push({ path: `/@${recipient}`})"
    )
    q-avatar.avatar(
      v-if="!profile || !profile.publicData || !profile.publicData.avatar"
      size="150px"
      color="accent"
      text-color="white"
      @click="$router.push({ path: `/@${recipient}`})"
    )
      | {{ recipient.slice(0, 2).toUpperCase() }}
  q-card-section(@click="showCardFullContent").middle-section
    .recipient {{ (profile && profile.publicData && profile.publicData.name) || recipient }}
    .title {{ title }}
  q-card-section.vote-section
    vote-yes-no-abstain(:init-proposal="proposal" :proposer="recipient" :hash="this.payout.hash" :allow-details="true")
</template>

<style lang="stylus" scoped>
.payout
  width 300px
  border-radius 1rem
  margin 10px
  .payout:hover
    z-index 100
    box-shadow 0 8px 12px rgba(0,0,0,0.2), 0 9px 7px rgba(0,0,0,0.14), 0 7px 7px 7px rgba(0,0,0,0.12)
  .avatar
    cursor pointer
    margin-top 20px
    width 100%
    max-width 150px
    height 150px
  .url
    position absolute
    top -4px
    right 60px
    z-index 12
  .title
    cursor pointer
    text-align center
    font-size 20px
    color $grey-6
    line-height 22px
  .recipient
    cursor pointer
    text-transform capitalize
    text-align center
    font-weight 800
    font-size 28px
    line-height 1
  .vote-section
    padding 0 28px 10px
  .middle-section
    height 90px
</style>
