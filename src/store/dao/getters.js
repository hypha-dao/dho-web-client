
export const announcement = ({ announcements }) => announcements.find(_ => _.enabled)

export const canEnroll = ({ plan, meta }) => plan.isActivated ? plan.maxUsers > meta.memberCount : true

export const daoAlerts = ({ alerts }) => alerts
export const daoAnnouncements = ({ announcements }) => announcements
export const daoSettings = ({ settings }) => settings
export const daoSettingsMultisigs = ({ multisigs }) => multisigs

export const configs = ({ configs }) => configs
export const dho = ({ dho }) => dho
export const ecosystem = ({ ecosystem }) => ecosystem

export const selectedDao = (state) => ({
  url: state.url,
  name: state.name,
  title: state.settings ? state.settings.title : undefined,
  docId: state.docId,
  description: state.settings ? state.settings.description : undefined,
  logo: state.settings ? state.settings.logo : undefined,
  createdDate: state.createdDate,
  foundedBy: state.settings ? state.settings.onboarderAccount : undefined,
  hasCustomToken: state.settings.settings_rewardToken_a !== null && state.settings.settings_pegToken_a !== null
})

export const selectedDaoPlan = ({ isWaitingEcosystem, plan }) => plan

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

export const isFreePlan = ({ plan }) => plan.name === 'Founders'
export const isHypha = ({ settings }) => settings.isHypha
