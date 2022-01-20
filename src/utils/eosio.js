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
}
