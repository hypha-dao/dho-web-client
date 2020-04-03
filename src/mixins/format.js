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
  }
}
