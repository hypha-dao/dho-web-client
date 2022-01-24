import ecc from 'eosjs-ecc'

export const generateKeys = async () => {
  const privateKey = await ecc.randomKey()
  const publicKey = await ecc.privateToPublic(privateKey)
  return {
    privateKey,
    publicKey
  }
}

export const copyToClipboard = (str) => {
  const el = document.createElement('textarea')
  el.value = str
  el.setAttribute('readonly', '')
  el.style.position = 'absolute'
  el.style.left = '-9999px'
  document.body.appendChild(el)
  const selected =
    document.getSelection().rangeCount > 0
      ? document.getSelection().getRangeAt(0)
      : false
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
  if (selected) {
    document.getSelection().removeAllRanges()
    document.getSelection().addRange(selected)
  }
}


export const calcVoicePercentage = (hvoice, supply) => {
  if (supply) {
    const percent = (hvoice / supply) * 100
    if (percent < 0.1) {
      return '<0.1'
    }
    return percent.toFixed(1)
  }
  return undefined

export const charToSymbol = (c) => {
  if (typeof c === 'string') c = c.charCodeAt(0)
  if (c >= 'a'.charCodeAt(0) && c <= 'z'.charCodeAt(0)) {
    return c - 'a'.charCodeAt(0) + 6
  }
  if (c >= '1'.charCodeAt(0) && c <= '5'.charCodeAt(0)) {
    return c - '1'.charCodeAt(0) + 1
  }
  return 0
}

export const nameToUint64 = (s) => {
  let n = 0n
  let i = 0
  for (; i < 12 && s[i]; i++) {
    n |= BigInt(charToSymbol(s.charCodeAt(i)) & 0x1f) << BigInt(64 - 5 * (i + 1))
  }

  if (i === 12) {
    n |= BigInt(charToSymbol(s.charCodeAt(i)) & 0x0f)
  }
  return n.toString()
}
