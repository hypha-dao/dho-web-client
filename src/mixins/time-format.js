
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
        const hours = oldDate.getHours()
        const minutes = oldDate.getMinutes() >= 10 ? oldDate.getMinutes() : `0${oldDate.getMinutes()}`
        const seconds = oldDate.getSeconds() >= 10 ? oldDate.getSeconds() : `0${oldDate.getSeconds()}`
        return `${oldDate.getDate()}-${oldDate.getMonth()}-${oldDate.getFullYear()} ${hours}:${minutes}:${seconds}`
      }
    }
  }
}
