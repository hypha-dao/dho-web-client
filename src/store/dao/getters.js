import { date } from 'quasar'

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
  name: state.name,
  title: state.settings ? state.settings.title : undefined,
  docId: state.docId,
  description: state.settings ? state.settings.description : undefined,
  logo: state.settings ? state.settings.logo : undefined,
  createdDate: state.createdDate,
  foundedBy: state.settings ? state.settings.onboarderAccount : undefined
})

export const selectedDaoPlan = ({ isWaitingEcosystem, plan }) => {
  const daysLeft = date.getDateDiff(new Date(plan.expirationDate), new Date(), 'days')
  const gracePeriodDays = 7
  return {
    ...plan,
    daysLeft: plan.name === 'Founders' ? -1 : (daysLeft - gracePeriodDays) < 0 ? 0 : (daysLeft - gracePeriodDays),
    graceDaysLeft: plan.name === 'Founders' ? -1 : daysLeft < 0 ? 0 : daysLeft,
    hasExpired: plan.isInfinite ? false : daysLeft <= 0 && plan.name !== 'Founders',
    isExpiring: daysLeft <= gracePeriodDays && plan.name !== 'Founders'
  }
}

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
