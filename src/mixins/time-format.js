
export default {
  filters: {
    timeAgo (_date) {
      const oldDate = new Date(_date)
      const diff = Date.now() - oldDate.getTime()

      const _minutes = (diff / (1000 * 60))
      const _hours = (diff / (1000 * 60 * 60))
      const _days = (diff / (1000 * 60 * 60 * 24))

      if (_minutes < 60) {
        return `${Math.floor(_minutes)} minutes ago`
      } else if (_hours < 24) {
        return `${Math.floor(_hours)} hours ago`
      } else if (_days < 7) {
        return `${Math.floor(_days)} days ago`
      } else {
        return `${oldDate.getDate()}-${oldDate.getMonth()}-${oldDate.getFullYear()}`
      }
    }
  }
}
