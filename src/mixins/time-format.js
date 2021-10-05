// const DateDiff = require('date-diff')
import DateDiff from 'date-diff'

export default {
  filters: {
    timeAgo (_date) {
      console.log('date', _date)
      const date = new Date(_date)
      console.log('date', date)
      const diff = new DateDiff(new Date(), date)
      const hours = date.getHours()
      const minutes = date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`
      const seconds = date.getSeconds() >= 10 ? date.getSeconds() : `0${date.getSeconds()}`
      if (diff.minutes() < 60) {
        return `${Math.floor(diff.minutes())} minutes ago`
      } else if (diff.hours() < 24) {
        return `${Math.floor(diff.hours())} hours ago`
      } else if (diff.days() < 7) {
        return `${Math.floor(diff.days())} days ago`
      }
      return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()} ${hours}:${minutes}:${seconds}`
    }
  }
}
