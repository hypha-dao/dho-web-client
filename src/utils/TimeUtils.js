export const dateToString = (_date) => {
  if (!_date) return _date
  const date = new Date(_date.replace(/T.*/g, ''))
  return (date.getDate() + 1) + ' ' + [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
    'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ][date.getMonth()] + ' ' + date.getFullYear()
}
