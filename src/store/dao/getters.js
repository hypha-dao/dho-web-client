import { date } from 'quasar'

export const announcement = ({ announcements }) => announcements.find(_ => _.enabled)
export const daoAlerts = ({ alerts }) => alerts
export const daoAnnouncements = ({ announcements }) => announcements
export const daoSettings = ({ settings }) => settings

export const dho = ({ dho }) => dho
export const selectedDao = (state) => ({
  name: state.name,
  title: state.settings ? state.settings.title : undefined,
  docId: state.docId,
  description: state.settings ? state.settings.description : undefined,
  logo: state.settings ? state.settings.logo : undefined
})
export const selectedDaoPlan = ({ plan }) => ({
  ...plan,
  daysLeft: plan.name === 'Founders plan' ? -1 : date.getDateDiff(new Date(plan.expirationDate), new Date(), 'days')
})

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

export const isFreePlan = ({ plan }) => plan.current === 'Founders plan'
export const isHypha = ({ settings }) => settings.isHypha
