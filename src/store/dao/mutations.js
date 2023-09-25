import { PLAN, PLAN_STATUS } from '~/const'
export const setDho = (state, dho) => {
  if (dho && dho.length === 1) {
    state.dho = {
      ...dho[0].settings[0]
    }
  }
}

const settingsMapper = (settings) => {
  return {
    ...settings,
    name: settings?.settings_daoName_n,
    title: settings?.settings_daoTitle_s,
    description: settings?.settings_daoDescription_s,

    governanceContact: settings?.settings_governanceTokenContract_n,
    pegToken: settings?.settings_pegToken_a?.split(' ')[1],
    pegTokenDecimals: settings?.settings_pegToken_a?.split(' ')[0]?.split('.')[1].length,
    pegContract: settings?.settings_pegTokenContract_n,
    rewardToken: settings?.settings_rewardToken_a?.split(' ')[1],
    rewardTokenDecimals: settings?.settings_rewardToken_a?.split(' ')[0]?.split('.')[1].length,
    rewardContract: settings?.settings_rewardTokenContract_n,
    rewardToPegRatio: parseFloat(settings?.settings_rewardToPegRatio_a),
    treasuryContract: settings?.settings_treasuryContract_n,
    voiceToken: settings?.settings_voiceToken_a?.split(' ')[1],
    voiceTokenDecimals: settings?.settings_voiceToken_a?.split(' ')[0]?.split('.')[1].length,

    documentationURL: settings?.settings_documentationURL_s,
    documentationButtonText: settings?.settings_documentationButtonText_s,

    socialChat: settings?.settings_socialChat_s,
    url: settings?.settings_daoUrl_s,

    membersApplicationEnabled: true, // Boolean(settings?.settings_membersApplicationEnabled_i),
    removableBannersEnabled: Boolean(settings?.settings_removableBannersEnabled_i),
    registrationEnabled: true, // Boolean(settings?.settings_membersApplicationEnabled_i),
    multisigEnabled: Boolean(settings?.settings_multisigEnabled_i),
    cashClaimsEnabled: settings?.settings_claimEnabled_i,

    // VOTING
    proposalsCreationEnabled: Boolean(settings?.settings_proposalsCreationEnabled_i),
    votingDurationSec: settings?.settings_votingDurationSec_i,
    periodDurationSec: settings?.settings_periodDurationSec_i,
    votingAlignmentPercent: settings?.settings_votingAlignmentX100_i,
    votingQuorumPercent: settings?.settings_votingQuorumX100_i,
    voiceTokenDecayPeriod: settings?.settings_voiceTokenDecayPeriod_i,

    communityVotingEnabled: Boolean(settings?.settings_communityVotingEnabled_i),
    communityVotingDurationSec: settings?.settings_communityVotingDurationSec_i,
    communityVotingAlignmentPercent: settings?.settings_communityVotingAlignmentPercent_i,
    communityVotingQuorumPercent: settings?.settings_communityVotingQuorumPercent_i,

    treasuryTokenMultiplier: settings?.settings_treasuryTokenMultiplier_i / 100,
    utilityTokenMultiplier: settings?.settings_utilityTokenMultiplier_i / 100,
    voiceTokenMultiplier: settings?.settings_voiceTokenMultiplier_i / 100,

    communityVotingMethod: settings?.settings_communityVotingMethod_s,
    upvoteStartDateTime: new Date(settings?.settings_upvoteStartDateTime_s).toLocaleString(),
    upvoteStartDate: new Date(settings?.settings_upvoteStartDateTime_s).toLocaleDateString('en-ZA'),
    upvoteStartTime: new Date(settings?.settings_upvoteStartDateTime_s).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    upvoteDuration: settings?.settings_upvoteDuration_i,
    upvoteRounds: settings?.settings_upvoteRounds_s ? JSON.parse(settings?.settings_upvoteRounds_s) : null,
    upvoteCheifDelegateCount: settings?.settings_upvoteCheifDelegateCount_i,
    upvoteCheifDelegateDuration: settings?.settings_upvoteCheifDelegateDuration_i,
    upvoteHeadDelegateRound: settings?.settings_upvoteHeadDelegateRound_i,
    upvoteHeadDelegateDuration: settings?.settings_upvoteHeadDelegateDuration_i,

    usesSeeds: Boolean(settings?.settings_usesSeeds_i),
    isHypha: Boolean(settings?.settings_isHypha_i),

    logo: settings?.settings_logo_s,
    extendedLogo: settings?.settings_extendedLogo_s,
    primaryColor: settings?.settings_primaryColor_s,
    secondaryColor: settings?.settings_secondaryColor_s,
    textColor: settings?.settings_textColor_s,
    pattern: settings?.settings_pattern_s,
    patternColor: settings?.settings_patternColor_s,
    patternOpacity: settings?.settings_patternOpacity_i,
    patternBase64: settings?.settings_patternBase64_s,

    splashBackgroundImage: settings?.settings_splashBackgroundImage_s,

    dashboardBackgroundImage: settings?.settings_dashboardBackgroundImage_s,
    dashboardTitle: settings?.settings_dashboardTitle_s,
    dashboardParagraph: settings?.settings_dashboardParagraph_s,

    proposalsBackgroundImage: settings?.settings_proposalsBackgroundImage_s,
    proposalsTitle: settings?.settings_proposalsTitle_s,
    proposalsParagraph: settings?.settings_proposalsParagraph_s,

    membersBackgroundImage: settings?.settings_membersBackgroundImage_s,
    membersTitle: settings?.settings_membersTitle_s,
    membersParagraph: settings?.settings_membersParagraph_s,

    organisationBackgroundImage: settings?.settings_organisationBackgroundImage_s,
    organisationTitle: settings?.settings_organisationTitle_s,
    organisationParagraph: settings?.settings_organisationParagraph_s,

    exploreBackgroundImage: settings?.settings_exploreBackgroundImage_s,
    exploreTitle: settings?.settings_exploreTitle_s,
    exploreParagraph: settings?.settings_exploreParagraph_s,

    onboarderAccount: settings?.settings_onboarderAccount_n
  }
}

// Called by DhoSelector.vue after the apollo query
export const switchDao = (state, data) => {
  const dao = data?.queryDao[0] || {}
  const plan = data?.activePlan || {}

  state.name = dao.details_daoName_n
  state.hash = dao.hash
  state.docId = dao.docId

  state.announcements = [...dao.announcements].map(_ => ({ ..._, enabled: Boolean(_.enabled) }))

  state.meta = {
    memberCount: dao.memberAggregate.count
  }

  state.plan = {
    ...plan,
    name: (plan?.name || PLAN.FOUNDER).toLowerCase(),
    status: plan?.status || PLAN_STATUS.ACTIVE,
    amountUSD: (plan?.price / 100),
    coreMembersCount: plan?.coreMembersCount || 5,
    communityMembersCount: plan?.communityMembersCount || 0,
    currentCoreMembersCount: dao?.memberAggregate?.count || 0

  }

  const multisigs = dao.multisigs
  state.multisigs = multisigs && multisigs.length > 0 ? multisigs.map(settingsMapper) : []

  const settings = dao.settings[0]

  state.ecosystem = {
    name: settings?.ecosystem_name_s,
    logo: settings?.ecosystem_logo_s,
    domain: settings?.ecosystem_domain_s,
    purpose: settings?.ecosystem_purpose_s
  }

  state.settings = {
    ...settingsMapper(settings),
    levels: [...dao?.levels],
    upvoteElectionId: dao?.upcomingelct?.[0]?.docId
  }
}

export const setAlerts = (state, data) => {
  state.alerts = [...data]
}

export const setConfigs = (state, data) => {
  state.configs = {
    ...state.configs,
    ...data
  }
}
