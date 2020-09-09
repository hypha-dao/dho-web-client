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
    toAsset (amount) {
      return new Intl.NumberFormat(navigator.language, { style: 'currency', currency: 'USD', currencyDisplay: 'code' }).format(amount).replace(/[a-z]{3}/i, '').trim()
    },
    async toSHA256 (message) {
      const msgBuffer = new TextEncoder('utf-8').encode(message)
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('')
    }
  }
}
