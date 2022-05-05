export const selectedDao = (state) => ({
  name: state.name,
  title: state.settings ? state.settings.title : undefined,
  docId: state.docId,
  description: state.settings ? state.settings.description : undefined
})
export const daoSettings = ({ settings }) => settings
export const dho = ({ dho }) => dho
export const getDaoTokens = (state) => ({
  pegToken: state.settings.pegToken,
  pegTokenDecimals: state.settings.pegTokenDecimals,
  rewardToken: state.settings.rewardToken,
  rewardTokenDecimals: state.settings.rewardTokenDecimals,
  voiceToken: state.settings.voiceToken,
  voiceTokenDecimals: state.settings.voiceTokenDecimals
})
export const votingPercentages = ({ settings }) => ({
  quorum: settings.votingQuorumPercent,
  unity: settings.votingAlignmentPercent
})
