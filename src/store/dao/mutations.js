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
      votingAlignmentPercent: settings.settings_votingAlignmentX100_i,
      votingQuorumPercent: settings.settings_votingQuorumX100_i,
      usesSeeds: Boolean(settings.settings_usesSeeds_i),
      isHypha: Boolean(settings.settings_isHypha_i),
      periodDurationSec: settings.settings_periodDurationSec_i,

      logo: settings.settings_logo_s,
      primaryColor: settings.settings_primaryColor_s,
      secondaryColor: settings.settings_secondaryColor_s,
      headerPattern: settings.settings_headerPattern_s,
      patternColor: settings.settings_patternColor_s,

      homepageHeader: settings.settings_homepageHeader_s,
      homepageSubtitle: settings.settings_homepageSubtitle_s,
      proposalsHeader: settings.settings_proposalsHeader_s,
      proposalsSubtitle: settings.settings_proposalsSubtitle_s,
      membersHeader: settings.settings_membersHeader_s,
      membersSubtitle: settings.settings_membersSubtitle_s,
      organizationHeader: settings.settings_organizationHeader_s,
      organizationSubtitle: settings.settings_organizationSubtitle_s

    }
  }
}
