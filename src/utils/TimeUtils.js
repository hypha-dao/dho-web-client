import { date } from 'quasar'
import I18n from './i18n'

export function dateToString(_date, showYear = true) {
  const options = {
    year: showYear ? 'numeric' : undefined,
    month: 'long',
    day: 'numeric'
  }
  return new Date(_date).toLocaleDateString('en-US', options)
}

export function dateToStringShort(_date, showYear = true) {
  const options = {
    year: showYear ? 'numeric' : undefined,
    month: 'short',
    day: 'numeric'
  }
  return new Date(_date).toLocaleDateString('en-US', options)
}

export function timeago(createdDate) {
  const TODAY = new Date().toUTCString()
  const created = new Date(createdDate).toUTCString()
  const second = date.getDateDiff(TODAY, created, 'seconds')
  const minute = date.getDateDiff(TODAY, created, 'minutes')
  const hour = date.getDateDiff(TODAY, created, 'hours')
  const day = date.getDateDiff(TODAY, created, 'days')
  const month = date.getDateDiff(TODAY, created, 'months')
  const year = date.getDateDiff(TODAY, created, 'years')
  if (year > 0) {
    if (month < 12) {
      return `${month} month${month > 1 ? 's' : ''} ago`
    } else {
      return `${year} year${year > 1 ? 's' : ''} ago`
    }
  }
  if (month > 0) return `${month} month${month > 1 ? 's' : ''} ago`
  if (day > 0) return `${day} day${day > 1 ? 's' : ''} ago`
  if (hour > 0) return `${hour} hour${hour > 1 ? 's' : ''} ago`
  if (minute > 0) return `${minute} minute${minute > 1 ? 's' : ''} ago`
  if (second > 0) return `${second} second${second > 1 ? 's' : ''} ago`
  return ''
}

export function formatDuration(seconds) {
  const units = [
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
  ]

  let remainingSeconds = seconds
  const result = []

  for (const unit of units) {
    if (remainingSeconds >= unit.seconds) {
      const value = Math.floor(remainingSeconds / unit.seconds)
      remainingSeconds %= unit.seconds
      const labelKey = `utils.time.${unit.label}`
      const labelPluralKey = `utils.time.${unit.label}_plural`
      const labelKey2 = `utils.time.${unit.label}_2`
      const label =
        value === 1
          ? I18n.t(labelKey, { count: value })
          : value > 1 && value < 5
            ? I18n.t(labelKey2, { count: value })
            : I18n.t(labelPluralKey, { count: value })
      result.push(label)
    }
  }

  return result.length > 0
    ? result.join(', ')
    : I18n.t('utils.time.second_plural', { count: 0 })
}
