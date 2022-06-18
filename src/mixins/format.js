export const format = {
  filters: {
    truncate: function (text, length, clamp) {
      text = text || ''
      clamp = clamp || '...'
      length = length || 250

      if (text.length <= length) return text

      let tcText = text.slice(0, length - clamp.length)
      let last = tcText.length - 1

      // Fix for case when text dont have any `space`
      last = last || length - clamp.length

      tcText = tcText.slice(0, last)

      return tcText + clamp
    },
    tokenName: function (val) {
      return val.replace(/[^a-zA-Z]/g, '')
    },
    tokenValue: function (val) {
      return parseInt(val)
    }
  },
  methods: {
    getObjValue (object, type, key) {
      if (object[type]) {
        const tmp = object[type].find(o => o.key === key)
        return (tmp && tmp.value && tmp.value.toLowerCase()) || ''
      }
      return ''
    },

    getFormatedTokenAmount (amount = 0, maxFigures = 4, maxDecimals = 2) {
      if (amount === 0) return '0'
      if (amount === undefined) return ''
      if (amount === null) return ''
      const figureCount = amount.toString().split('.')[0].length
      if (figureCount > maxFigures) {
        return (new Intl.NumberFormat('en-US', { style: 'decimal', notation: 'compact', compactDisplay: 'short', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount))
      } else {
        return new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: maxDecimals }).format(amount)
      }
    },
    async toSHA256 (message) {
      const msgBuffer = new TextEncoder('utf-8').encode(message)
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('')
    },
    getSalaryBucket (amount) {
      if (amount <= 80000) {
        return 'B1'
      } else if (amount > 80000 && amount <= 100000) {
        return 'B2'
      } else if (amount > 100000 && amount <= 120000) {
        return 'B3'
      } else if (amount > 120000 && amount <= 140000) {
        return 'B4'
      } else if (amount > 140000 && amount <= 160000) {
        return 'B5'
      } else if (amount > 160000 && amount <= 180000) {
        return 'B6'
      } else if (amount > 180000) {
        return 'B7'
      }
      return null
    }
  }
}
