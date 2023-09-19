<script>
import gql from 'graphql-tag'

const MAX_NUM_OF_RETIRES = 10

const DAO_ACTIVE_QUERY = `

  queryDao @cascade(fields: ["settings"]) {
    docId
    details_daoName_n

    details_daoType_s
    # details_isWaitingEcosystem_i
    createdDate

    upcomingelct {
      docId
    }

    announcements: alert {
      id: docId
      title: details_level_s
      message: details_content_s
      enabled: details_enabled_i
    }

    planmanager {
      bill {
        id: docId
        startDate: details_startDate_t
        endDate: details_endDate_t
        expirationDate: details_expirationDate_t
        periodCount: details_periodCount_i
        name: details_planName_s
        price: details_planPrice_a
        isInfinite: details_isInfinite_i
        discountPercX10000: details_discountPercX10000_i

        pricingplan {
          maxMemberCount: details_maxMemberCount_i
        }
      }
      currentbill {
        id: docId
        startDate: details_startDate_t
        endDate: details_endDate_t
        expirationDate: details_expirationDate_t
        periodCount: details_periodCount_i
        name: details_planName_s
        price: details_planPrice_a
        isInfinite: details_isInfinite_i
        discountPercX10000: details_discountPercX10000_i

        pricingplan {
          maxMemberCount: details_maxMemberCount_i
        }
      }
      lastbill {
        id: docId
        startDate: details_startDate_t
        endDate: details_endDate_t
        expirationDate: details_expirationDate_t
        periodCount: details_periodCount_i
        name: details_planName_s
        price: details_planPrice_a
        isInfinite: details_isInfinite_i
        discountPercX10000: details_discountPercX10000_i

        pricingplan {
          maxMemberCount: details_maxMemberCount_i
        }
      }
    }

    multisigs: openmultisig {
      approvedby {
        docId
        details_member_n
      }

      id: docId

      # ecosystem_name_s
      # ecosystem_logo_s
      # ecosystem_domain_s
      # ecosystem_purpose_s

      # settings_onboarderAccount_n

      # settings_claimEnabled_i
      settings_daoUrl_s
      # settings_daoName_n
      settings_daoTitle_s
      # settings_daoDescription_s
      # settings_governanceTokenContract_n
      # settings_pegToken_a
      # settings_pegTokenContract_n
      # settings_rewardToken_a
      # settings_rewardTokenContract_n
      # settings_rewardToPegRatio_a
      # settings_treasuryContract_n
      # settings_voiceToken_a

      settings_socialChat_s
      settings_documentationButtonText_s

      settings_proposalsCreationEnabled_i
      settings_membersApplicationEnabled_i
      settings_removableBannersEnabled_i
      settings_multisigEnabled_i

      settings_votingDurationSec_i
      # settings_periodDurationSec_i
      settings_votingAlignmentX100_i
      settings_votingQuorumX100_i
      # settings_voiceTokenDecayPeriod_i

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

      # settings_usesSeeds_i
      # settings_isHypha_i

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

    settings(filter: { settings_daoUrl_s: { regexp: $regexp } }) {
      ecosystem_name_s
      ecosystem_logo_s
      ecosystem_domain_s
      ecosystem_purpose_s

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

    levels: salaryband {
      id: docId
      name: details_name_s
      annualAmount: details_annualUsdSalary_a
      minDeferred: details_minDeferredX100_i
    }

    memberAggregate {
      count
    }
  }

`

export default {
  name: 'dho-selector',
  components: {
    CreateLayout: () => import('./CreateLayout.vue'),
    LoginLayout: () => import('./LoginLayout.vue'),
    MultiDhoLayout: () => import('./MultiDhoLayout.vue'),
    ProposalLayout: () => import('./ProposalLayout.vue')
  },

  props: {
    dhoname: String
  },

  apollo: {
    dao: {
      query: gql`query activeDao($regexp: String!) { ${DAO_ACTIVE_QUERY} }`,
      update: data => data.queryDao,
      skip () { return !this.dhoname || !this.daoRegexp },
      variables () { return { regexp: this.daoRegexp } },

      result (res) {
        const data = res.data?.queryDao

        if (!(data.length)) {
          this.daoQueryNumberOfRetires++
          if (this.daoQueryNumberOfRetires > MAX_NUM_OF_RETIRES) {
            this.$router.push({ path: '/not-found' })
          } else {
            this.$apollo.queries.dao.refetch()
          }
        }

        this.$store.commit('dao/switchDao', data)
        this.$store.dispatch('dao/setTheme')
        this.$store.dispatch('ballots/getSupply')
        this.$store.dispatch('accounts/checkMembership')
      },

      fetchPolicy: 'no-cache',
      pollInterval: 1000 // TODO: Swap with subscribe once dgraph is ready
      // subscribeToMore: {
      //   document: gql`subscription activeDao($regexp: String!) { ${DAO_ACTIVE_QUERY} }`,
      //   skip () { return !this.dhoname || !this.daoRegexp },
      //   variables () { return { regexp: this.daoRegexp } },
      //   updateQuery: (previousResult, { subscriptionData }) => {
      //     if (!subscriptionData.data) {
      //       return previousResult
      //     }
      //     if (!previousResult) {
      //       return undefined
      //     }

      //     return subscriptionData.data
      //   }

      // }

    },

    dho: {
      query: require('~/query/main-dho.gql'),
      update: data => data.queryDho,
      result (res) {
        this.$store.commit('dao/setDho', res.data.queryDho)
      },
      fetchPolicy: 'no-cache'
    }

  },

  data () {
    return {
      daoQueryNumberOfRetires: 0
    }
  },

  computed: {
    daoRegexp () { return '/^' + this.dhoname + '$/i' },

    dho () {
      if (this.dao && this.dao.length) {
        return {
          name: this.dao[0]?.details_daoName_n || '',
          title: this.dao[0]?.settings[0]?.settings_daoTitle_s || '',
          icon: this.dao[0]?.settings[0]?.settings_logo_s || '',
          isHypha: this.dao[0]?.settings[0]?.settings_isHypha_i || ''
        }
      }

      return {
        name: '',
        title: '',
        icon: '',
        isHypha: ''
      }
    },

    useCreateLayout () { return this.$q.screen.lt.md && this.$route.meta && this.$route.meta.layout && this.$route.meta.layout.mobile === 'create' },
    useLoginLayout () { return this.$route.name === 'login' },
    useMobileProposalLayout () { return this.$q.screen.lt.md && this.$route.meta && this.$route.meta.layout === 'proposal' },
    useMultiDHOLayout () { return this.$route.name !== 'login' }
  }

}
</script>
<template lang="pug">
.dho-selector
  create-layout(v-if="useCreateLayout")
  login-layout(v-if="useLoginLayout")
  multi-dho-layout(v-if="useMultiDHOLayout" :dho="dho" :daoName="dhoname" :dhoTitle="dho?.title")
  proposal-layout(v-if="useMobileProposalLayout && $q.platform.is.desktop")
</template>

<style scoped lang="stylus">
</style>
