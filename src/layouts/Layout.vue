<script>
import { mapGetters } from 'vuex'
import gql from 'graphql-tag'

const ACTIVE_DAO_QUERY = `
  queryDao @cascade(fields: ["settings"]) {
    docId
    details_daoName_n
    details_daoType_s    
    createdDate

    admin(filter: { details_member_n: { eq: $username } }) {
      docId
    }
    enroller(filter: { details_member_n: { eq: $username } }) {
      docId
    }
    applicant(filter: { details_member_n: { eq: $username } }) {
      docId
    }
    member(filter: { details_member_n: { eq: $username } }) {
      docId
    }

    settings(filter: { settings_daoUrl_s: { regexp: $regexp } }) {
      settings_onboarderAccount_n

      settings_claimEnabled_i
      settings_daoUrl_s
      settings_daoName_n
      settings_daoTitle_s
      settings_daoDescription_s
      settings_governanceTokenContract_n

      settings_pegTokenName_s
      settings_pegToken_a
      settings_pegTokenContract_n
      settings_treasuryTokenMultiplier_i
      settings_treasuryContract_n

      settings_rewardTokenName_s
      settings_rewardToken_a
      settings_rewardTokenContract_n
      settings_rewardToPegRatio_a
      settings_rewardTokenMaxSupply_a
      settings_utilityTokenMultiplier_i

      settings_voiceToken_a
      settings_voiceTokenDecayPeriod_i
      settings_voiceTokenDecayPerPeriodX10M_i
      settings_voiceTokenMultiplier_i

      settings_socialChat_s
      settings_documentationButtonText_s

      settings_proposalsCreationEnabled_i
      settings_membersApplicationEnabled_i
      settings_removableBannersEnabled_i
      settings_multisigEnabled_i

      settings_votingDurationSec_i
      settings_periodDurationSec_i
      settings_votingAlignmentX100_i
      settings_votingQuorumX100_i
      settings_voiceTokenDecayPeriod_i

      settings_communityVotingEnabled_i
      settings_communityVotingMethod_s
      
      settings_upvoteStartDateTime_s
      settings_upvoteDuration_i
      settings_upvoteRounds_s
      settings_upvoteCheifDelegateCount_i
      settings_upvoteCheifDelegateDuration_i
      settings_upvoteHeadDelegateRound_i
      settings_upvoteHeadDelegateDuration_i
      settings_communityVotingDurationSec_i
      settings_communityVotingAlignmentPercent_i
      settings_communityVotingQuorumPercent_i

      settings_usesSeeds_i
      settings_isHypha_i

      settings_logo_s
      settings_extendedLogo_s
      settings_primaryColor_s
      settings_secondaryColor_s
      settings_textColor_s
      settings_pattern_s
      settings_patternColor_s
      settings_patternOpacity_i
      settings_patternBase64_s

      settings_splashBackgroundImage_s

      settings_dashboardBackgroundImage_s
      settings_dashboardTitle_s
      settings_dashboardParagraph_s

      settings_proposalsBackgroundImage_s
      settings_proposalsTitle_s
      settings_proposalsParagraph_s

      settings_membersBackgroundImage_s
      settings_membersTitle_s
      settings_membersParagraph_s

      settings_organisationBackgroundImage_s
      settings_organisationTitle_s
      settings_organisationParagraph_s

      settings_exploreBackgroundImage_s
      settings_exploreTitle_s
      settings_exploreParagraph_s

      settings_documentationURL_s
    }

    memberAggregate {
      count
    }
  }

`

const ACTIVE_PLAN_QUERY = `
  activePlan(daoUrl: $daoUrl) {
    subscriptionId
    subscriptionItemId
    subscriptionStatus
    currency
    currentPeriodEnd
    currentPeriodStart
    coreMembersCount
    communityMembersCount
    price
    id: planId
    name: planName
  }
`

const MAX_NUM_OF_RETIRES = 10

const STATE = Object.freeze({
  LOADING: 'LOADING',
  READY: 'READY'
})

export default {
  name: 'layout',
  components: {
    MultiDhoLayout: () => import('./MultiDhoLayout.vue')
  },

  props: {
    dhoname: String
  },

  apollo: {
    dao: {
      query: gql`query activeDao($regexp: String!, $username: String) { ${ACTIVE_DAO_QUERY} }`,
      update: data => {
        const dao = data.queryDao[0]
        return {
          ...dao,
          name: dao?.details_daoName_n || '',
          title: dao?.settings[0]?.settings_daoTitle_s || '',
          icon: dao?.settings[0]?.settings_logo_s || '',
          isHypha: dao?.settings[0]?.settings_isHypha_i || ''
        }
      },
      skip () { return !this.dhoname || ['create-your-dao', 'login'].includes(this.$route.name) ? '' : !this.account },
      variables () { return { regexp: '/^' + this.dhoname + '$/i', username: this.account } },
      async result (res) {
        this.state = STATE.LOADING
        const data = res?.data

        if (!data?.queryDao?.length) {
          this.daoQueryNumberOfRetires++
          if (this.daoQueryNumberOfRetires > MAX_NUM_OF_RETIRES) {
            this.$router.push({ path: '/not-found' })
          } else {
            this.$apollo.queries.dao.refetch()
          }
          return
        }

        this.$store.commit('accounts/setMember', data?.queryDao[0])
        this.$store.commit('dao/setDAO', data?.queryDao[0])
        this.$store.dispatch('dao/setTheme')
        this.$store.dispatch('ballots/getSupply')
        this.state = STATE.READY
      },
      fetchPolicy: 'no-cache'
      // pollInterval: 300 // TODO: Swap with subscribe once dgraph is ready
    },

    plan: {
      query: gql`query activePlan($daoUrl: String!) { ${ACTIVE_PLAN_QUERY} }`,
      skip () { return !this.dhoname },
      variables() { return { daoUrl: this.dhoname } },
      async result (res) {
        this.$store.commit('dao/setPlan', res?.data?.activePlan)
      },
      fetchPolicy: 'no-cache'
    }

  },

  data () {
    return {
      daoQueryNumberOfRetires: 0,

      STATE,
      state: STATE.LOADING
    }
  },

  computed: {
    ...mapGetters('accounts', ['account']),

    layout () { return this.$route?.meta?.layout || 'multi-dho-layout' }
  },

  updated () {
    if (this.$apollo.queries.dao.loading && this.state !== STATE.LOADING) {
      this.state = STATE.LOADING
    }
  }

}
</script>

<template lang="pug">
.layout
  .spinner(v-if="state === STATE.LOADING")
  component(v-else :is="layout" v-bind="{ dao, dhoname }")
</template>

<style scoped lang="stylus">
</style>
