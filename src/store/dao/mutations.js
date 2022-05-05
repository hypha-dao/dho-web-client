export const setDho = (state, dho) => {
  if (dho && dho.length === 1) {
    state.dho = dho[0]
  }
}

export const switchDao = (state, daos) => {
  // Called by DhoSelector.vue after the apollo query
  if (daos && daos.length === 1) {
    const dao = daos[0]
    const settings = dao.settings[0]

    state.name = dao.details_daoName_n
    state.hash = dao.hash
    state.docId = dao.docId
    state.settings = {
      name: settings.settings_daoName_n,
      title: settings.settings_daoTitle_s,
      description: settings.settings_daoDescription_s,
      governanceContact: settings.settings_governanceTokenContract_n,
      pegToken: settings.settings_pegToken_a.split(' ')[1],
      pegTokenDecimals: settings.settings_pegToken_a.split(' ')[0].split('.')[1].length,
      pegContract: settings.settings_pegTokenContract_n,
      rewardToken: settings.settings_rewardToken_a.split(' ')[1],
      rewardTokenDecimals: settings.settings_rewardToken_a.split(' ')[0].split('.')[1].length,
      rewardContract: settings.settings_rewardTokenContract_n,
      rewardToPegRatio: parseFloat(settings.settings_rewardToPegRatio_a),
      treasuryContract: settings.settings_treasuryContract_n,
      voiceToken: settings.settings_voiceToken_a.split(' ')[1],
      voiceTokenDecimals: settings.settings_voiceToken_a.split(' ')[0].split('.')[1].length,

      votingDurationSec: settings.settings_votingDurationSec_i,
      periodDurationSec: settings.settings_periodDurationSec_i,
      votingAlignmentPercent: settings.settings_votingAlignmentX100_i,
      votingQuorumPercent: settings.settings_votingQuorumX100_i,
      voiceTokenDecayPeriod: settings.settings_voiceTokenDecayPeriod_i,

      usesSeeds: Boolean(settings.settings_usesSeeds_i),
      isHypha: Boolean(settings.settings_isHypha_i),

      logo: settings.settings_logo_s,
      primaryColor: settings.settings_primaryColor_s,
      secondaryColor: settings.settings_secondaryColor_s,
      textColor: settings.settings_textColor_s,

      extendedLogo: settings.settings_extendedLogo_s,
      splashBackgroundImage: settings.settings_splashBackgroundImage_s,
      splashPatternColor: settings.settings_splashPatternColor_s,
      splashPatternOpacity: settings.settings_splashPatternOpacity_s,
      splashOverlayColor: settings.settings_splashOverlayColor_s,
      splashOverlayOpacity: settings.settings_splashOverlayOpacity_s,

      dashboardBackgroundImage: settings.settings_dashboardBackgroundImage_s,
      dashboardPatternColor: settings.settings_dashboardPatternColor_s,
      dashboardPatternOpacity: settings.settings_dashboardOverlayOpacity_s,
      dashboardOverlayColor: settings.settings_dashboardOverlayColor_s,
      dashboardOverlayOpacity: settings.settings_dashboardOverlayOpacity_s,
      dashboardTitle: settings.settings_dashboardTitle_s,
      dashboardParagraph: settings.settings_dashboardTitle_s,

      proposalsBackgroundImage: settings.settings_proposalsBackgroundImage_s,
      proposalsPatternColor: settings.settings_proposalsPatternColor_s,
      proposalsPatternOpacity: settings.settings_proposalsOverlayOpacity_s,
      proposalsOverlayColor: settings.settings_proposalsOverlayColor_s,
      proposalsOverlayOpacity: settings.settings_proposalsOverlayOpacity_s,
      proposalsTitle: settings.settings_proposalsTitle_s,
      proposalsParagraph: settings.settings_proposalsTitle_s,

      membersBackgroundImage: settings.settings_membersBackgroundImage_s,
      membersPatternColor: settings.settings_membersPatternColor_s,
      membersPatternOpacity: settings.settings_membersOverlayOpacity_s,
      membersOverlayColor: settings.settings_membersOverlayColor_s,
      membersOverlayOpacity: settings.settings_membersOverlayOpacity_s,
      membersTitle: settings.settings_membersTitle_s,
      membersParagraph: settings.settings_membersTitle_s,

      organisationBackgroundImage: settings.settings_organisationBackgroundImage_s,
      organisationPatternColor: settings.settings_organisationPatternColor_s,
      organisationPatternOpacity: settings.settings_organisationOverlayOpacity_s,
      organisationOverlayColor: settings.settings_organisationOverlayColor_s,
      organisationOverlayOpacity: settings.settings_organisationOverlayOpacity_s,
      organisationTitle: settings.settings_organisationTitle_s,
      organisationParagraph: settings.settings_organisationTitle_s,

      registrationEnabled: !settings.settings_isHypha_i // Currently disabled for hypha, TODO: obtain flag from server
    }
  }
}
