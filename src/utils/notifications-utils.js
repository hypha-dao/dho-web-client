import I18n from './i18n'

export function parsedNotification (notification) {
  let icon = null
  let title = null
  let description = null
  const createdDate = this.timeago(notification.time)
  const read = notification.read
  switch (notification.event.name) {
    case ('notification.test'):
      icon = require('~/assets/icons/notifications/newcomment.png')
      title = notification.content
      description = notification.content
      break
    case ('proposals.comment'):
      icon = require('~/assets/icons/notifications/newcomment.png')
      title = I18n.t('notifications.newComment')
      description = I18n.t('notifications.hasJustLeftAComment', { accountname: JSON.parse(notification?.content).user, proposalId: JSON.parse(notification.content).proposalId })
      break
    case ('proposals.voting_expiry'):
      icon = require('~/assets/icons/notifications/voting-expire.png')
      title = I18n.t('notifications.proposalVotingExpire')
      description = I18n.t('notifications.proposalIsExpiring', { proposalId: JSON.parse(notification.content).user, days: JSON.parse(notification.content).days })
      break
    case ('proposals.passed'):
      icon = require('~/assets/icons/notifications/proposal-passed.png')
      title = I18n.t('notifications.proposalPassed')
      description = I18n.t('notifications.proposalHasPassed', { proposalId: JSON.parse(notification.content).proposalId })
      break
    case ('proposals.rejected'):
      icon = require('~/assets/icons/notifications/proposal-rejected.png')
      title = I18n.t('notifications.proposalRejected')
      description = I18n.t('notifications.proposalHasntPassed', { proposalId: JSON.parse(notification.content).proposalId })
      break
    case ('system.claimable_period'):
      icon = require('~/assets/icons/notifications/claimable-period.png')
      title = I18n.t('notifications.claimablePeriod')
      description = I18n.t('notifications.youHaveClaimablePeriod', { value: JSON.parse(notification.content).periods })
      break
    case ('assignment.extension_expiry'):
      icon = require('~/assets/icons/notifications/extend-assignment.png')
      title = I18n.t('notifications.extendYourAssignment')
      description = I18n.t('notifications.youStillHave', { days: JSON.parse(notification.content).days })
      break
    case ('assignment.approved'):
      icon = require('~/assets/icons/notifications/assignment-approved.png')
      title = I18n.t('notifications.assignmentApproved')
      description = I18n.t('notifications.yourAssignmentHasBeenApproved')
      break
    case ('assignment.rejected'):
      icon = require('~/assets/icons/notifications/assignment-rejected.png')
      title = I18n.t('notifications.assignmentRejected')
      description = I18n.t('notifications.yourAssignmentHasntBeenApproved')
  }
  return {
    icon: icon,
    title: title,
    description: description,
    createdDate: createdDate,
    read: read
  }
}
