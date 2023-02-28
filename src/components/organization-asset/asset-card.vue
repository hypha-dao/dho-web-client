<script>

import CONFIG from '~/pages/proposals/create/config.json'
import { mapActions, mapGetters } from 'vuex'
import lodash from 'lodash'
/**
 * Renders the individual's avatar, name, account and other details
 */
export default {
  name: 'asset-card',
  components: {
    Widget: () => import('~/components/common/widget.vue'),
    ProfilePicture: () => import('../profiles/profile-picture.vue'),
    IpfsImageViewer: () => import('~/components/ipfs/ipfs-image-viewer.vue')
  },

  props: {
    /**
     * Asset object {icon, docId, assignmentAggregate, assignment, title, description  }
     */
    asset: Object,
    isMobile: Boolean,
    bordered: Boolean,
    ownerStyles: Boolean,
    memberBadges: Array,
    currentElectionIndex: Number
  },
  data () {
    return {
      iconDetails: undefined
    }
  },
  async mounted () {
    if (this.asset && this.asset.icon) {
      this.iconDetails = await this.loadIconDetails()
    }
  },

  apollo: {
    proposal: {
      query: require('~/query/proposals/dao-proposal-detail.gql'),
      update: data => data.getDocument,
      variables () {
        return {
          docId: this.asset.docId,
          first: 0,
          offset: 0
        }
      },
      fetchPolicy: 'cache-and-network',
      subscribeToMore: {
        document: require('~/query/proposals/dao-proposal-detail-subs.gql'),
        variables () {
          return {
            docId: this.asset.docId
          }
        },
        skip () { return !this.asset.docId },
        updateQuery: (previousResult, { subscriptionData }) => {
          if (!subscriptionData.data) {
            return previousResult
          }
          if (!previousResult) {
            return undefined
          }
          // Here, return the new result from the previous with the new data
          return {
            ...previousResult,
            ...subscriptionData
          }
        }
      }
    }
  },

  computed: {
    ...mapGetters('dao', ['selectedDao']),
    ...mapGetters('accounts', ['account']),
    othersText () {
      return `and ${this.asset.assignment.length > 3 ? 'others' : 'other'} ${this.asset.assignment.length - 3}`
    },
    othersIcon () {
      return `+ ${this.asset.assignment.length - 3}`
    },
    isBadge () {
      return this.asset.assignmentAggregate.__typename === 'AssignbadgeAggregateResult'
    },
    badgeHolders () {
      const uniqueHolders = lodash.uniqBy(this.asset.assignment, 'username')
      return uniqueHolders.filter(holder => holder.daoName === this.selectedDao.name)
    },
    stylesForOwner () {
      const existingBadge = this.memberBadges?.find((badge) => badge.title === this.asset.title)
      return this.ownerStyles && existingBadge
    },
    buttonText () {
      return this.stylesForOwner ? 'Applied' : 'Apply'
    }
  },

  methods: {
    ...mapActions('proposals', ['saveDraft']),
    sendToPage () {
      if (!this.isBadge) {
        this.$router.push({ path: `${this.$route.path}/${this.asset.docId}`, params: { docId: this.asset.docId } })
      }
    },
    sendToBadgePage () {
      this.$router.push({ path: `${this.$route.path}/${this.asset.docId}`, params: { docId: this.asset.docId } })
    },
    onApply () {
      this.$store.commit('proposals/setType', CONFIG.options.recurring.options.badge.type)
      this.$store.commit('proposals/setCategory', { key: CONFIG.options.recurring.options.badge.key, title: CONFIG.options.recurring.options.badge.title })
      this.$store.commit('proposals/setBadge', this.proposal)
      this.$store.commit('proposals/setRewardCoefficientLabel', (this.proposal.details_rewardCoefficientX10000_i) / this.coefficientBase)
      this.$store.commit('proposals/setRewardCoefficient', this.proposal.details_rewardCoefficientX10000_i)
      this.$store.commit('proposals/setVoiceCoefficientLabel', (this.proposal.details_voiceCoefficientX10000_i) / this.coefficientBase)
      this.$store.commit('proposals/setVoiceCoefficient', this.proposal.details_voiceCoefficientX10000_i)
      this.$store.commit('proposals/setPegCoefficientLabel', (this.proposal.details_pegCoefficientX10000_i) / this.coefficientBase)
      this.$store.commit('proposals/setPegCoefficient', this.proposal.details_pegCoefficientX10000_i)
      this.$store.commit('proposals/setIcon', this.proposal.details_icon_s)

      this.$store.commit('proposals/setStepIndex', 1)
      this.$store.commit('proposals/setPastSteps', ['step-proposal-type', 'step-description'])
      const draftId = Date.now()
      this.$store.commit('proposals/setDraftId', draftId)
      this.saveDraft()
      this.$router.push({ name: 'proposal-create', params: { draftId } })
    },
    async loadIconDetails () {
      let type = null
      let name = null
      let cid = null
      if (this.asset.icon) {
        const split = this.asset.icon.split(':')
        type = split[0]
        name = split[2] ? `${split[1]}:${split[2]}` : split[1]
        if (type === 'http' || type === 'https') {
          type = 'img'
          name = this.asset.icon
        } else if (type === 'ipfsImage') {
          type = 'ipfs'
          cid = name
        }
      }
      return {
        type,
        name,
        cid
      }
    },
    revokeBadge () {
      const actions = [{
        account: this.$config.contracts.dao,
        name: 'withdraw',
        data: {
          owner: this.account,
          document_id: this.asset.docId
        }
      }]
      return this.$store.$api.signTransaction(actions)
    }
  }
}
</script>

<template lang="pug">
widget.item.full-width(:class="{'mobile-item': isMobile, 'desktop-item': !isMobile, 'cursor-pointer': !isBadge, 'bordered': bordered, 'owner-border': stylesForOwner }")
  .clickable.flex.column.justify-between.full-height(@click="sendToPage")
    .col.top-section
      .row.justify-between
          q-btn.no-pointer-events(
            round unelevated :icon="iconDetails.name" color="primary" text-color="white" size="14px" :ripple="false"
            v-if="iconDetails && iconDetails.type === 'icon'"
          )
          q-avatar(size="30px" v-else-if="iconDetails && iconDetails.type === 'img'")
              img.icon-img(:src="iconDetails.name")
          ipfs-image-viewer(size="30px", :ipfsCid="iconDetails.cid" v-else-if="iconDetails && iconDetails.type === 'ipfs'")
          .h-b2.text-underline(v-if="isBadge && stylesForOwner" @click="revokeBadge" :class="{ 'disable-revoke-button': currentElectionIndex !== 0 && (this.asset.title === 'Voter' || this.asset.title === 'Delegate') }") Revoke
      .row.q-my-xs
        .h-h5.text-weight-bold {{asset.title}}
      .row.q-my-xs
        .h-b2.description {{asset.description}}
    .row.q-mt-sm.justify-between
      .row.items-center
        .h-b2.text-underline(v-if="isBadge" @click="sendToBadgePage") See details
      .row.flex.profile-container
        .profile-item-wrapper(v-for="user, index in badgeHolders" v-if="index <= 2")
          .profile-item
            profile-picture(:username="user.username" size="26px" :key="user.username")
            q-tooltip @{{ user.username }}
        .profile-counter.bg-internal-bg(v-if="badgeHolders.length > 3") +{{ badgeHolders.length - 3 }}
        .profile-counter.bg-internal-bg(v-else-if="!badgeHolders.length") n/a
    q-btn.q-mt-md.text-white(v-if="isBadge" :disable="currentElectionIndex !== 0 && (this.asset.title === 'Voter' || this.asset.title === 'Delegate')" noCaps unelevated rounded color="primary" @click="onApply" :class="{ 'owner-button': stylesForOwner }") {{ buttonText }}
</template>

<style lang="stylus" scoped>

.item
  .description
    height: 95px
    overflow hidden
  .profile-container
    margin-left 15px
  .profile-item-wrapper
    display: flex
    align-items: center
    justify-content: center
    background: #FFFFFF
    width: 30px
    height: 30px
    border-radius: 50%
    z-index: 100
    margin-left: -10px
    .profile-item
      width 26px
  .profile-counter
    display: flex
    align-items: center
    justify-content: center
    border-radius: 50%
    height: 30px
    width: 30px
    position: relative
    font-size: 10px
    font-weight: 600
    font-family: 'Source Sans Pro', sans-serif
    color: #242F5D
    margin-left: -10px
    z-index: 100
.bordered
  border: 1px solid #84878E
.owner-border
  border: 1px solid #1CB59B
.owner-button
  background: #1CB59B !important
  pointer-events: none
.disable-revoke-button
  opacity: 0.6
  pointer-events: none
</style>
