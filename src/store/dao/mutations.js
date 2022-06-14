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
      name: settings?.settings_daoName_n,
      title: settings?.settings_daoTitle_s,
      description: settings?.settings_daoDescription_s,
      governanceContact: settings?.settings_governanceTokenContract_n,
      pegToken: settings?.settings_pegToken_a.split(' ')[1],
      pegTokenDecimals: settings?.settings_pegToken_a.split(' ')[0].split('.')[1].length,
      pegContract: settings?.settings_pegTokenContract_n,
      rewardToken: settings?.settings_rewardToken_a.split(' ')[1],
      rewardTokenDecimals: settings?.settings_rewardToken_a.split(' ')[0].split('.')[1].length,
      rewardContract: settings?.settings_rewardTokenContract_n,
      rewardToPegRatio: parseFloat(settings.settings_rewardToPegRatio_a),
      treasuryContract: settings?.settings_treasuryContract_n,
      voiceToken: settings?.settings_voiceToken_a.split(' ')[1],
      voiceTokenDecimals: settings?.settings_voiceToken_a.split(' ')[0].split('.')[1].length,

      documentationURL: settings?.settings_documentationUrl_s,
      discordURL: settings?.settings_discordUrl_s,

      votingDurationSec: settings?.settings_votingDurationSec_i,
      periodDurationSec: settings?.settings_periodDurationSec_i,
      votingAlignmentPercent: settings?.settings_votingAlignmentX100_i,
      votingQuorumPercent: settings?.settings_votingQuorumX100_i,
      voiceTokenDecayPeriod: settings?.settings_voiceTokenDecayPeriod_i,

      usesSeeds: Boolean(settings.settings_usesSeeds_i),
      isHypha: Boolean(settings.settings_isHypha_i),

      logo: settings?.settings_logo_s,
      extendedLogo: settings?.settings_extendedLogo_s,
      primaryColor: settings?.settings_primaryColor_s,
      secondaryColor: settings?.settings_secondaryColor_s,
      textColor: settings?.settings_textColor_s,
      pattern: settings?.settings_pattern_s,
      patternColor: settings?.settings_patternColor_s,
      patternOpacity: settings?.settings_patternOpacity_i,

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
      url: settings.settings_daoUrl_s,

      registrationEnabled: !settings.settings_isHypha_i, // Currently disabled for hypha, TODO: obtain flag from server
      cashClaimsEnabled: !settings.settings_isHypha_i // TODO: Flag from server?
    }
  }
}
