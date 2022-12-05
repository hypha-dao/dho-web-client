<script>

import CONFIG from '~/pages/proposals/create/config.json'
import { mapActions } from 'vuex'
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
    isMobile: Boolean
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
    othersText () {
      return `and ${this.asset.assignmentAggregate.count > 3 ? 'others' : 'other'} ${this.asset.assignmentAggregate.count - 3}`
    },
    othersIcon () {
      return `+ ${this.asset.assignmentAggregate.count - 3}`
    },
    isBadge () {
      return this.asset.assignmentAggregate.__typename === 'AssignbadgeAggregateResult'
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
    }

  }
}
</script>

<template lang="pug">
widget.item(:class="{'mobile-item': isMobile, 'desktop-item': !isMobile, 'cursor-pointer': !isBadge }")
  .clickable.flex.column.justify-between.full-height(@click="sendToPage")
    .col.top-section
      .row.justify-between
          q-btn.no-pointer-events(
            round unelevated :icon="iconDetails.name" color="primary" text-color="white" size="14px" :ripple="false"
            v-if="iconDetails && iconDetails.type === 'icon'"
          )
          q-avatar(size="lg" v-else-if="iconDetails && iconDetails.type === 'image'")
              img.icon-img(:src="iconDetails.src")
          ipfs-image-viewer(size="lg", :ipfsCid="iconDetails.cid" v-else-if="iconDetails && iconDetails.type === 'ipfs'")
          q-btn.h-btn2(flat color="primary" no-caps rounded v-if="isBadge" @click="sendToBadgePage") See details
      .row.q-my-xs
        .h-h5.text-weight-bold {{asset.title}}
      .row.q-my-xs
        .h-b2.description {{asset.description}}
    .row.q-mt-sm
      .row.flex.profile-container
        .profile-item(v-for="user, index in asset.assignment")
          div(v-if="index === 2 && (asset.assignmentAggregate.count > 3)")
            profile-picture(:profilesCount="othersIcon" :username="user.username" size="30px" :key="user.username")
          profile-picture(v-else :username="user.username" size="30px" :key="user.username")
          q-tooltip @{{ user.username }}
    q-btn.q-mt-md.text-white(v-if="isBadge" noCaps rounded color="primary" @click="onApply") Apply
</template>

<style lang="stylus" scoped>

.item
  max-width: 302.5px
  min-width: 302.5px
  @media (max-width: $breakpoint-sm)
    max-width: 100%
  @media (max-width: $breakpoint-md)
    max-width: 47.7%

  .description
    height: 95px
    overflow hidden
  .profile-container
    margin-left 15px
  .profile-item
    width 30px
    margin-left -15px
</style>
