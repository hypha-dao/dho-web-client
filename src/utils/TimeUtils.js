
export function dateToString (_date, showYear = true) {
  const options = { year: showYear ? 'numeric' : undefined, month: 'long', day: 'numeric' }
  return new Date(_date).toLocaleDateString('en-US', options)
}

export function dateToStringShort (_date, showYear = true) {
  const options = { year: showYear ? 'numeric' : undefined, month: 'short', day: 'numeric' }
  return new Date(_date).toLocaleDateString('en-US', options)
}
