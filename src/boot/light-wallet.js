/* eslint-disable no-new-func */
class LightWallet {
  resolveChannelResponse = Function()

  waitChannelResponse () {
    return new Promise(
      function (resolve) {
        this.resolveChannelResponse = response => {
          console.log('channel response: ' + response)
          resolve(response)
        }
      }.bind(this)
    )
  }

  login () {
    const account = this.waitChannelResponse()

    window.LightWalletChannel.postMessage(
      JSON.stringify({
        messageType: 'login',
        callbackName: 'resolveChannelResponse'
      })
    )

    return account
  }

  sendTransaction (action) {
    const transactionId = this.waitChannelResponse()

    window.LightWalletChannel.postMessage(
      JSON.stringify({
        messageType: 'sendTransaction',
        callbackName: 'resolveChannelResponse',
        actions: JSON.stringify(action)
      })
    )

    return transactionId
  }
}

export default async ({ Vue, store }) => {
  const lightWallet = new LightWallet()

  store['$lightWallet'] = lightWallet
  Vue.prototype.$lightWallet = lightWallet
  window.LightWallet = lightWallet
}
